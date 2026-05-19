# Trex Panel

Trex Panel is a React/Vite frontend served by an Express API. The container is production-oriented: authentication, sessions, and server records are read from an external MySQL-compatible database that you provide.

This repository does not ship a database container, demo accounts, seed users, or sample server data.

## Requirements

- Docker Desktop on macOS or Docker Engine on Linux
- Docker Compose v2
- An external MySQL or MariaDB database

## Database

Apply the schema in `database/schema.sql` to your database before starting the panel.

The API expects:

- `users` for login accounts
- `sessions` for active sessions
- `eggs` and `egg_variables` for game templates
- `servers` for server records displayed in the panel

## Game Support

Trex Panel uses an egg model. Games are supported by adding egg definitions to the database or through `POST /api/eggs`.

The repository does not bundle built-in eggs. This keeps the container generic and lets operators maintain their own game templates, Docker images, startup commands, variables, and config metadata.

Servers can reference an egg through `servers.egg_id`.

To create a password hash for a user record:

```bash
npm install
npm run hash-password -- "your-secure-password"
```

Insert the generated `password_hash` and `password_salt` into your own `users` row. No user is created automatically.

## Environment

Set these variables before starting the container:

```text
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
TREX_SECURE_COOKIES=false
```

Use `TREX_SECURE_COOKIES=true` when serving the panel over HTTPS.

## Run With Docker

```bash
docker compose up --build
```

Open:

```text
http://localhost:3000
```

Stop:

```bash
docker compose down
```

## Build Docker Image Manually

```bash
docker build -t trex-panel .
docker run --rm -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=3306 \
  -e DB_USER=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e DB_NAME=your-db-name \
  --name trex-panel \
  trex-panel
```

## Local Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## API

- `GET /api/health`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/session`
- `GET /api/eggs`
- `POST /api/eggs`
- `GET /api/servers`
- `POST /api/servers`
