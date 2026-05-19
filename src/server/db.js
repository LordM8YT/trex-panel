const mysql = require('mysql2/promise');

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME'];
let pool;

const isDatabaseConfigured = () => requiredEnv.every((key) => Boolean(process.env[key]));

const getPool = () => {
  if (!isDatabaseConfigured()) {
    throw new Error('Database is not configured');
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    });
  }

  return pool;
};

const query = async (sql, params = []) => {
  const [rows] = await getPool().execute(sql, params);
  return rows;
};

const testDatabaseConnection = async () => {
  try {
    await query('SELECT 1');
    return true;
  } catch (_error) {
    return false;
  }
};

module.exports = {
  isDatabaseConfigured,
  query,
  testDatabaseConnection,
};
