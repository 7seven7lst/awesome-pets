.PHONY: up install dev

# Start Postgres and wait for the healthcheck to pass before returning.
up:
	docker compose up -d --wait

# Full first-time setup (runs `make up` first):
install: up
	test -f .env || cp .env.example .env
	cp .env server/.env
	npm install
	npm run build -w shared
	npm run db:migrate
	npm run db:seed

# Run API (port 3001) + Vite dev server (port 5173) concurrently.
dev:
	npm run dev
