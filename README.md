# BNCC Mid Project

Library management system built with Laravel, Inertia.js, and React. Manage books, categories, members, and borrowings with a simple dashboard.

## Demo

**Live preview:** [https://mid-project-bncc.radityaa.dev](https://mid-project-bncc.radityaa.dev)

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+ and npm
- PostgreSQL (or MySQL) — or use Docker for PostgreSQL

## How to run

### 1. Clone and install dependencies

```bash
git clone <your-repo-url> mid-project-bncc
cd mid-project-bncc

composer install
npm install
```

### 2. Environment and database

Copy the example env and set your app key and database:

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your database (PostgreSQL example):

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mid_project_bncc
DB_USERNAME=mid_project_bncc
DB_PASSWORD=secret
```

**Optional — run PostgreSQL with Docker:**

```bash
docker compose up -d
```

Then run migrations and seed:

```bash
php artisan migrate
php artisan db:seed
```

### 3. Build frontend and run the app

**Development (with hot reload):**

```bash
# Terminal 1: Vite dev server
npm run dev

# Terminal 2: Laravel
php artisan serve
```

Open [http://localhost:8000](http://localhost:8000).

**Production-style (build then serve):**

```bash
npm run build
php artisan serve
```

## Optional: large dataset

To seed a large dataset (categories, members, books, borrowings):

```bash
php artisan db:seed --class=Database\\Seeders\\LargeDatasetSeeder
```

## Tech stack

- **Backend:** Laravel 12, Inertia.js, Fortify (auth)
- **Frontend:** React, TypeScript, Tailwind CSS, Radix UI
- **Database:** PostgreSQL (or MySQL)
