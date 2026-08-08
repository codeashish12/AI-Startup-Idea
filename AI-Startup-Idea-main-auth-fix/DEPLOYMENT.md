# Future Engine - Production Deployment Guide & Docker Setup

This guide provides step-by-step instructions for containerizing and deploying Future Engine to production environments (Cloud Run, AWS ECS, Kubernetes, Docker Compose).

---

## 1. Environment Variables Configuration

Create a `.env` file or pass environment variables into your container environment:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secure_random_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/future_engine
REDIS_URL=redis://localhost:6379
```

---

## 2. Dockerfile Configuration

Below is the production multi-stage `Dockerfile`:

```dockerfile
# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm ci

# Copy application source code
COPY . .

# Run type check, linting, and tests
RUN npm run lint
RUN npx vitest run

# Build frontend and compile backend CommonJS bundle
RUN npm run build

# Stage 2: Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package descriptors and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built dist artifacts from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
```

---

## 3. Docker Compose Local Deployment

Use `docker-compose.yml` to launch Future Engine alongside PostgreSQL and Redis:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=production_secret_key_2026
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/future_engine
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: future_engine
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

### Running with Docker Compose:
```bash
docker-compose up -d --build
```

---

## 4. Local Development Commands

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Dev Server (Host 0.0.0.0, Port 3000):**
   ```bash
   npm run dev
   ```

3. **Run Linting & Type Checks:**
   ```bash
   npm run lint
   ```

4. **Run Vitest Unit Test Suite:**
   ```bash
   npm run test
   ```

5. **Build Production Artifacts:**
   ```bash
   npm run build
   ```

6. **Start Production Server locally:**
   ```bash
   npm run start
   ```

---

## 5. Architecture Overview

```
                      +-----------------------------+
                      |     React + Vite Frontend   |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |  Express / Node.js Backend   |
                      +--------------+--------------+
                                     |
             +-----------------------+-----------------------+
             |                       |                       |
             v                       v                       v
     +---------------+       +---------------+       +---------------+
     | Auth Service  |       | User Service  |       | AI Orchestrator|
     +---------------+       +---------------+       +-------+-------+
                                                             |
                                           +-----------------+-----------------+
                                           |                 |                 |
                                           v                 v                 v
                                    +--------------+  +--------------+  +--------------+
                                    | Risk Engine  |  | Opp Engine   |  |Decision Eng. |
                                    +--------------+  +--------------+  +--------------+
```
