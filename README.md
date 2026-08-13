# Reporting Hub

Full-stack reporting portal with a React frontend, Spring Boot backend, and H2 database.

## Features

- Reports landing page with search
- Users, Departments, and Projects reports
- Table search, sorting, pagination, and status filtering
- Loading, empty, and error states
- Responsive layout
- H2 schema and seed data
- Docker Compose startup

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, TanStack Query, TanStack Table, Tailwind CSS, Axios
- Backend: Java 21, Spring Boot, Spring Web, Spring Data JPA, Spring Validation, H2 Database
- Infrastructure: Docker, Docker Compose, Nginx

## Run With Docker

Prerequisite: Docker Desktop or Docker Engine with Docker Compose

From the project root:
```bash
docker compose up --build
```

Open the application:
```text
http://localhost:3000
```

Stop the application:
```bash
docker compose down
```

## Run Backend Locally

Prerequisites: Java 21 and Maven 3.9+

Start the backend:
```bash
cd backend
mvn spring-boot:run
```

Backend URL:
```text
http://localhost:8080
```

H2 console:
```text
http://localhost:8080/h2-console
```

Default H2 settings:
```text
JDBC URL: jdbc:h2:mem:reporting
Username: sa
Password:
```

The backend loads `schema.sql` and `data.sql` automatically on startup.

## Run Frontend Locally

Prerequisites: Node.js 22+ and npm

Install dependencies:
```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

Frontend URL:
```text
http://localhost:5173
```

The Vite dev server proxies `/api` requests to:
```text
http://localhost:8080
```

Run the backend before using the frontend locally.

## API Endpoints

```text
GET /api/health
GET /api/reports
GET /api/reports/users
GET /api/reports/departments
GET /api/reports/projects
```

Report endpoints support query parameters:
```text
page
size
search
status
sort
```

Example:
```text
GET /api/reports/users?page=0&size=10&search=sarah&sort=name,asc
```

## Database

The default profile uses an in-memory H2 database.

Seed data:

- 6 departments
- 35 users
- 20 projects

Schema and seed files:
```text
backend/src/main/resources/schema.sql
backend/src/main/resources/data.sql
```

## Tests

Backend:
```bash
cd backend
mvn test
```

Frontend:
```bash
cd frontend
npm test
```

Frontend production build:
```bash
cd frontend
npm run build
```
