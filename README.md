# Novellia Pets

## Tech Stack

- Frontend: `React` + `TypeScript` + `Vite` + `Tailwind CSS`
- Backend: `Node.js` + `Express` + `TypeScript`
- Database: `PostgreSQL` (Docker or your own instance)
- ORM & Migrations: `Prisma 7`
- Shared package: `@novellia/shared` for shared Zod schemas/types across client and server
- Testing: `Jest` + `React Testing Library` (client), `Jest` (server)

## Quick Start

**Prerequisites:** Node.js ≥ 20, npm ≥ 10. Docker is optional if you already have PostgreSQL.

### 1) Root `.env` (required first step)

Create a **`.env` file at the repo root** by copying `.env.example` and adjusting values:

```bash
cp .env.example .env
```

Edit `.env` at minimum:

- **`DATABASE_URL`** — must point at a running Postgres instance the app can reach.
- **`JWT_SECRET`** — secret used to sign session JWTs (use a long random string in production).
- **`BACKEND_PORT`** (optional) — API listen port; defaults to `3001` if unset.

See `.env.example` for the expected shape.

### 2) Database (optional: Docker Postgres from this repo)

**Option A — Postgres in Docker (recommended for local review)**

Start the bundled database (waits until Postgres is healthy):

```bash
make db_up
```

This uses `docker-compose.yml` (default: host port **5435**, database **`novellia_pets`**, user **`postgres`**, trust auth). If you change port, database name, or user in `docker-compose.yml`, update **`DATABASE_URL`** in your root `.env`** so it stays in sync.

**Option B — Your own Postgres**

Skip `make db_up`. Set **`DATABASE_URL`** in root `.env`** to your instance (host, port, database, credentials).

### 3) Install, migrate, and seed

After Postgres is up and **`DATABASE_URL`** in root `.env` is correct:

```bash
make install
```

This installs workspace dependencies, builds `@novellia/shared`, copies root `.env` to `server/.env`, runs Prisma migrations, and seeds demo data.

### 4) Run the app

```bash
make dev
```

- Frontend: **http://localhost:5173**
- Backend API: default **http://localhost:3001**, or the host/port you set with **`BACKEND_PORT`** in root `.env`

---

## Seeded Accounts

Password for all seeded users: **`password`**

- `admin@novellia.test` (Admin)
- `owner@novellia.test` (Owner)
- `owner2@novellia.test` to `owner5@novellia.test` (Owners)
