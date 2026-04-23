.PHONY: db_up install dev dev_server dev_client test test_client test_server

# Start Postgres and wait for the healthcheck to pass before returning.
db_up:
	docker compose up -d --wait

# First-time / deps: ensure root `.env` exists, sync to server, install, build shared, migrate, seed.
install:
	test -f .env || cp .env.example .env
	cp .env server/.env
	npm install
	npm run build -w shared
	npm run db:migrate
	npm run db:seed

# API + Vite together (see root package.json `dev`).
dev:
	npm run dev

# Backend only (Express + tsx watch).
dev_server:
	npm run dev:server

# Frontend only (Vite dev server).
dev_client:
	npm run dev -w client

test_client:
	npm run test -w client

test_server:
	npm run test -w server
