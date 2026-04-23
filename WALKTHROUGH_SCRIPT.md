# Novellia Pets - 10 Minute Walkthrough Script

Use this as a read-along script while recording.  
Target duration: **8-10 minutes**.

---

## 0:00-0:45 Setup and Run

Before I start the walkthrough, here is how to run this project locally.

Prerequisites:
- Docker
- Node.js 20+
- npm 10+

At the repo root, run:

```bash
make install
make dev
```

What those do:
- `make install`: starts Postgres in Docker, installs dependencies for root/client/server/shared, builds shared package, runs Prisma migration, and seeds demo data.
- `make dev`: starts backend on `http://localhost:3001` and frontend on `http://localhost:5173`.

For this demo, I will use seeded users like `admin@novellia.test` / `owner@novellia.test` with password `password`.

---

## 0:45-1:20 Intro

Hi, I am **[Your Name]**.  
This is my take-home submission for Novellia Pets.

The app is an MVP for pet and medical record management with:
- Pet CRUD
- Medical record CRUD for vaccines and allergies
- Dashboard stats and upcoming vaccines
- Search and filter
- One extra feature: CSV export of a pet's medical history

I will do a quick product demo first, then walk through architecture and key decisions.

---

## 1:20-4:00 Demo of App Functionality

### 1) Sign in and role behavior
- I start at the sign-in page.
- I can log in with seeded users, for example:
  - `admin@novellia.test`
  - `owner@novellia.test`
- Password for seeded users is `password`.
- Admin can see org-wide data, owner is scoped to only their pets.

### 2) Dashboard
- On Dashboard, I show:
  - Total pets
  - Pets by type
  - Upcoming vaccines charts and list
- This verifies admin/owner scoping and dashboard aggregation.

### 3) Pet list with search/filter
- Go to Pets page.
- Search by pet name.
- Filter by animal type.
- Pagination updates correctly.

### 4) Pet detail and medical records
- Open a pet detail page.
- Show profile info, medical records list, and record-type filter.
- Add a new record:
  - Vaccine with administered date and optional next due date
  - Or allergy with reactions and severity
- Edit and delete records with confirmation dialogs.

### 5) Pet CRUD and extra feature
- Create a new pet, then edit and delete.
- Show confirmation dialog for delete.
- Show CSV export button from pet detail as the additional feature.

---

## 4:00-7:00 Tech Stack and Why

### Frontend
- **React 19 + TypeScript + Vite**
  - Fast iteration and type safety.
- **React Router**
  - Clear route structure, guarded private area.
- **React Hook Form + Zod**
  - Lightweight form state, shared validation schema.
- **Tailwind CSS**
  - Rapid, consistent UI styling.
- **Chart.js + react-chartjs-2**
  - Simple chart rendering for dashboard.

### Backend
- **Node.js + Express + TypeScript**
  - Familiar, practical stack for API delivery speed.
- **Prisma 7 + PostgreSQL**
  - Type-safe DB access, migrations, and reliable persistence.
- **JWT auth with dual transport**
  - Primary: httpOnly cookie for web security.
  - Also supports `Authorization: Bearer` for mobile clients and Postman/local API testing.

### Monorepo / shared
- Root npm workspaces: `client`, `server`, `shared`.
- Shared package centralizes Zod schemas and shared enums/types so client and server stay aligned.

### Testing
- **Client**: Jest + React Testing Library
- **Server**: Jest
- Focus is pragmatic coverage for core units and service behavior.

---

## 7:00-9:00 Architecture Walkthrough and Decisions

### 1) Monorepo structure
- `client/` for UI, `server/` for API, `shared/` for schemas/types, `prisma/` for DB schema/migrations/seed.
- This keeps contracts in one place and reduces drift between frontend and backend.

### 2) Backend architecture by layer

I used a layered API structure so each layer has one clear responsibility:

- **Route layer**
  - Defines endpoint shape and middleware composition.
  - Example flow: route -> auth middleware -> schema middleware -> controller.
  - This keeps route files declarative and easy to scan.

- **Controller layer**
  - Handles HTTP concerns: read request, call service, map response.
  - Returns consistent success/error payloads and status codes.
  - Controllers stay thin, and avoid embedding database logic.

- **Service layer**
  - Contains business logic and Prisma calls.
  - This is where ownership rules, CRUD behavior, and transactional record creation live.
  - Services throw typed expected errors, so controllers can map them uniformly.

- **Middleware layer**
  - `authenticateToken` verifies identity and sets `req.user`.
  - `checkSchema` validates request body/params/query with Zod and stores parsed values.
  - This removes repetitive guard code from controllers.

- **Shared schema layer**
  - `@novellia/shared` holds Zod schemas used by both frontend and backend.
  - This enforces one source of truth for request/response contracts.

### 3) Authentication strategy (JWT + cookie + bearer)

I implemented auth in a way that works for browser apps, mobile clients, and local API tools:

- On sign-in/sign-up, server issues a JWT.
- For web, token is set in an **httpOnly cookie**.
- The auth middleware reads token from:
  1. cookie first, then
  2. `Authorization: Bearer` header.
- This means:
  - browser flow works without manually handling tokens in JS, and
  - mobile/Postman can still call APIs directly using bearer tokens.

This dual-mode transport gives flexibility without duplicating auth logic.

### 4) Authorization decision
- I separated existence vs authorization checks:
  - Missing record returns **404**
  - Existing but unauthorized returns **403**
- I also refactored service queries to use `findUnique` where possible for id-based access checks, then apply ownership checks.

### 5) Data model extensibility
- `MedicalRecord` acts as a base discriminator (`recordType`) with one-to-one detail tables:
  - `VaccineRecord`
  - `AllergyRecord`
- This makes adding a third type later (for example lab results) straightforward without breaking existing records.

### 6) Frontend architecture

- **Routing and page composition**
  - Route constants are centralized, and app routes are lazy-loaded with `React.lazy` + `Suspense`.
  - Public auth pages and private app pages are separated with `PrivateRoute`.

- **State boundaries**
  - `AuthContext` owns user session state and exposes sign-in/sign-up/sign-out/refresh.
  - Feature hooks own async query state close to where it is used, instead of one global store.
  - This keeps each page modular and easier to test.

- **API layer**
  - API calls are grouped by domain (`pets`, `dashboard`, `users`, `auth`) on top of shared base helpers.
  - This creates a stable boundary between UI and server endpoints.

- **Validation and forms**
  - React Hook Form handles field state efficiently.
  - Zod schemas from shared package are reused client-side for form validation and server-side for request validation.

- **UI consistency and maintainability**
  - Shared primitives for repeated concerns:
    - standardized query/loading/error rendering
    - centralized route builders
    - normalized API error mapping
  - This reduced repeated boilerplate and made behavior consistent across pages.

---

## 9:00-9:40 AI Usage Disclosure

I used AI tools to speed up implementation and documentation, while validating all code myself.

Tools used:
- **[Replace with your tools, e.g., Cursor, ChatGPT, Claude]**

How I used them:
- Clarifying API/library usage
- Refactor suggestions and cleanup ideas
- Drafting documentation text

I reviewed, tested, and understood every final code path in this submission.

---

## 9:40-10:00 Close

That is the walkthrough of my solution.  
Thank you for reviewing it - happy to dive deeper into any part, especially trade-offs around auth, data model extensibility, or validation strategy.

