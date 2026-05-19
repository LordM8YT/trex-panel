const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { isDatabaseConfigured, query, testDatabaseConnection } = require('./src/server/db');

const app = express();
const port = Number(process.env.PORT || 3000);
const sessionCookieName = 'trex_session';
const sessionTtlSeconds = Number(process.env.SESSION_TTL_SECONDS || 60 * 60 * 8);

app.set('trust proxy', process.env.TRUST_PROXY === 'true');
app.use(cors());
app.use(express.json());

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const getCookies = (req) =>
  Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const [key, ...value] = cookie.split('=');
        return [key, decodeURIComponent(value.join('='))];
      })
  );

const hashPassword = (password, salt) =>
  crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');

const verifyPassword = (password, salt, expectedHash) => {
  const actualHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(actualHash, 'hex'), Buffer.from(expectedHash, 'hex'));
};

const asyncRoute = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

const getSession = async (req) => {
  const token = getCookies(req)[sessionCookieName];
  if (!token || !isDatabaseConfigured()) {
    return null;
  }

  const rows = await query(
    `SELECT users.id, users.email, users.name, users.role
     FROM sessions
     INNER JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = ? AND sessions.expires_at > NOW() AND users.active = 1
     LIMIT 1`,
    [hashToken(token)]
  );

  return rows[0] || null;
};

const requireAuth = asyncRoute(async (req, res, next) => {
  const user = await getSession(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;
  next();
});

app.get(
  '/api/health',
  asyncRoute(async (_req, res) => {
    const database = {
      configured: isDatabaseConfigured(),
      reachable: false,
    };

    if (database.configured) {
      database.reachable = await testDatabaseConnection();
    }

    res.json({ status: 'ok', database });
  })
);

app.post(
  '/api/login',
  asyncRoute(async (req, res) => {
    if (!isDatabaseConfigured()) {
      return res.status(503).json({ error: 'Database is not configured' });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await query(
      `SELECT id, email, name, role, password_hash, password_salt
       FROM users
       WHERE email = ? AND active = 1
       LIMIT 1`,
      [email]
    );
    const user = users[0];

    if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + sessionTtlSeconds * 1000);
    await query(
      'INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, NOW())',
      [hashToken(token), user.id, expiresAt]
    );

    res.cookie(sessionCookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.TREX_SECURE_COOKIES === 'true',
      maxAge: sessionTtlSeconds * 1000,
    });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  })
);

app.post(
  '/api/logout',
  asyncRoute(async (req, res) => {
    const token = getCookies(req)[sessionCookieName];
    if (token && isDatabaseConfigured()) {
      await query('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
    }

    res.clearCookie(sessionCookieName);
    res.status(204).send();
  })
);

app.get(
  '/api/session',
  asyncRoute(async (req, res) => {
    const user = await getSession(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({ user });
  })
);

app.get(
  '/api/servers',
  requireAuth,
  asyncRoute(async (_req, res) => {
    const servers = await query(
      `SELECT id, name, status, players, ram_usage, cpu_usage
       FROM servers
       ORDER BY id ASC`
    );
    res.json(servers);
  })
);

app.post(
  '/api/servers',
  requireAuth,
  asyncRoute(async (req, res) => {
    const { name, status, players = 0, ram_usage = 0, cpu_usage = 0 } = req.body;

    if (!name || !status) {
      return res.status(400).json({ error: 'Name and status are required' });
    }

    const result = await query(
      `INSERT INTO servers (name, status, players, ram_usage, cpu_usage, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, status, players, ram_usage, cpu_usage]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      status,
      players,
      ram_usage,
      cpu_usage,
    });
  })
);

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Trex Panel running on http://localhost:${port}`);
});
