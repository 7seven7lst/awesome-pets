# Novellia Pets

## Tech Stack

- Frontend: `React` + `TypeScript` + `Vite` + `Tailwind CSS`
- Backend: `Node.js` + `Express` + `TypeScript`
- Database: `PostgreSQL` (Docker)
- ORM & Migrations: `Prisma 7`
- Shared package: `@novellia/shared` for shared Zod schemas/types across client and server
- Testing: `Jest` + `React Testing Library` (client), `Jest` (server)

## Quick Start

Prerequisites: Docker, Node.js >= 20, npm >= 10

```bash
make install # install neccessary dependencies, migrate and seed table
make dev # run both frontend and backend
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## Seeded Accounts

Password for all seeded users: `password`

- `admin@novellia.test` (Admin)
- `owner@novellia.test` (Owner)
- `owner2@novellia.test` to `owner5@novellia.test` (Owners)
