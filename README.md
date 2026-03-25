# AlgoQuest

AlgoQuest is a gamified DSA learning app with:

- `frontend/`: Next.js app running on `http://localhost:3000`
- `backend/`: Express API running on `http://localhost:5000`
- `database/`: PostgreSQL schema reference

Docker is not used anywhere in this project.

## Local Requirements

- Node.js 18 or newer
- PostgreSQL 14 or newer

## First-Time Setup

### 1. Install PostgreSQL

Install PostgreSQL locally and make sure the server is running.

### 2. Create the database

Open `psql` or pgAdmin and create the database:

```sql
CREATE DATABASE algoquest;
```

### 3. Backend environment

The backend already includes a local `.env` file:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/algoquest
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
```

Update the `DATABASE_URL` only if your local PostgreSQL username, password, or port is different.

### 4. Frontend environment

The frontend already includes a local `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Run the Project

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Start the backend

```bash
npm run dev
```

What happens on startup:

- Connects to local PostgreSQL using `DATABASE_URL`
- Creates the `users`, `problems`, and `progress` tables if they do not exist
- Seeds the built-in AlgoQuest problems automatically

### 3. Install frontend dependencies

Open a second terminal:

```bash
cd frontend
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Database Tables

The backend auto-creates these tables:

- `users`
  - `id`
  - `email`
  - `password`
  - `xp`
  - `current_world`
- `problems`
  - `id`
  - `title`
  - `world`
  - `type`
- `progress`
  - `id`
  - `user_id`
  - `problem_id`
  - `completed`

## Useful Endpoints

- `GET /health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/problems`
- `GET /api/progress`
- `POST /api/progress/complete`
- `GET /api/progress/leaderboard`

## Project Structure

```text
algoquest/
|-- backend/
|   |-- .env
|   |-- .env.example
|   |-- package.json
|   |-- server.js
|   `-- src/
|       |-- db/
|       |   |-- init.js
|       |   `-- pool.js
|       |-- middleware/
|       |   `-- auth.js
|       `-- routes/
|           |-- auth.js
|           |-- problems.js
|           `-- progress.js
|-- database/
|   `-- schema.sql
`-- frontend/
    |-- .env.local
    |-- .env.local.example
    |-- package.json
    |-- next.config.js
    `-- src/
        |-- app/
        |-- components/
        `-- lib/
```
