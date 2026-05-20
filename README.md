# ShopQA

E-commerce web app built with Next.js, Prisma, and PostgreSQL. Includes full CI/CD pipeline with unit tests and end-to-end tests.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT via `jose` + bcrypt
- **Unit tests**: Jest + Testing Library
- **E2E tests**: Playwright
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 20+
- Yarn
- Docker (for local PostgreSQL)

## Getting Started

**1. Install dependencies**

```bash
yarn install
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET`.

**3. Start the database**

```bash
docker compose up postgres -d
```

**4. Push schema to database**

```bash
yarn db:push
```

**5. (Optional) Seed demo data**

```bash
yarn db:seed
```

**6. Start the dev server**

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens (min 32 chars) |
| `BASE_URL` | App base URL (used for E2E tests) |

## Scripts

| Script | Description |
|---|---|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn test:unit` | Run Jest unit tests |
| `yarn test:unit:coverage` | Run unit tests with coverage report |
| `yarn test:e2e` | Run Playwright E2E tests |
| `yarn test:e2e:ui` | Open Playwright interactive UI |
| `yarn db:push` | Push Prisma schema to database |
| `yarn db:migrate` | Create a new migration |
| `yarn db:seed` | Seed the database with demo data |
| `yarn db:studio` | Open Prisma Studio |

## Running Tests

### Unit tests

```bash
yarn test:unit
```

### E2E tests

Make sure Postgres is running first:

```bash
docker compose up postgres -d
yarn test:e2e
```

Playwright will automatically start the dev server if one isn't already running.

## CI/CD

GitHub Actions runs on every push and pull request to `main`:

1. **unit-and-component-tests** — ESLint + Jest
2. **e2e-tests** — builds the app, spins up a Postgres service container, and runs Playwright tests
