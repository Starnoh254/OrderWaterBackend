# Deployment Guide

This guide explains how to deploy the OrderWater backend to a production environment.

---

## Overview

- Runtime: Node.js (Express)
- ORM: Prisma
- Default DB: MySQL (can switch to PostgreSQL/SQLite via `schema.prisma`)
- Start script: `npm start` (runs `node server.js`)
- Production migration script: `npm run migrate:prod`

---

## Prerequisites

- Node.js v22.14.0 and npm available on the server
- A reachable SQL database (MySQL by default) and network access to it
- A dedicated database and user with appropriate privileges
- .env variables configured for your environment

Recommended server OS: a Linux VM (e.g., Ubuntu) or Windows Server. For process management and auto‑restart, PM2 is suggested (optional section below).

---

## 1) Prepare Environment Variables

Create a `.env` file at the project root with at least the following entries:

```env
# Required
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="replace-with-a-strong-secret"

# Optional
PORT=5000
NODE_ENV=production
```

Notes:

- For PostgreSQL, update `DATABASE_URL` accordingly and set `provider = "postgresql"` in `prisma/schema.prisma`.
- Ensure the DB exists and credentials are valid.

---

## 2) Install Production Dependencies

From the project root:

```powershell
npm ci --omit=dev
```

If `npm ci` isn’t available for your setup, you can use:

```powershell
npm install --omit=dev
```

---

## 3) Apply Migrations and Generate Prisma Client

Run the production migration script (applies all existing migrations and generates Prisma Client):

```powershell
npm run migrate:prod
```

This is equivalent to:

```powershell
npx prisma migrate deploy
npx prisma generate
```

Do not use `migrate dev` in production.

---

## 4) Start the Server

Start the API in the foreground:

```powershell
npm start
```

By default, the server binds to `PORT` from `.env` (or 5000). Verify the service is reachable from your load balancer or reverse proxy.

Basic smoke test (replace host/port as needed):

```powershell
# Windows PowerShell example
Invoke-WebRequest http://localhost:5000/ -UseBasicParsing | Select-Object StatusCode
```

Logs are written to the `logs/` directory (`combined.log`, `error.log`). Make sure the process has write permissions.

---

## (Optional) Run with PM2 for Process Management

PM2 keeps your app running, auto‑restarts on failure, and can set up a startup script.

```powershell
npm i -g pm2
pm2 start server.js --name orderwater-backend
pm2 status
pm2 logs orderwater-backend

# Persist across reboots
pm2 save
pm2 startup
```

Useful commands:

- `pm2 restart orderwater-backend`
- `pm2 reload orderwater-backend` (zero‑downtime where applicable)
- `pm2 logs orderwater-backend`

---

## (Optional) Nginx reverse proxy (api.starnohdev.com → :5000)

Use Nginx to expose the API over your domain and forward traffic to the Node app on port 5000.

1. Install and enable Nginx (on Ubuntu/Debian):

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

2. Create a site config at `/etc/nginx/sites-available/api.starnohdev.com`:

```nginx
server {
    listen 80;
    server_name api.starnohdev.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # API endpoints
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

3. Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/api.starnohdev.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

4. Obtain a free TLS certificate with Let’s Encrypt (optional but recommended):

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.starnohdev.com
```

Notes:

- Ensure DNS A/AAAA records for `api.starnohdev.com` point to your server’s IP.
- If you rely on secure cookies or need correct client IPs in Express, set `app.set('trust proxy', 1)`.

---

## (Optional) Containerized Deployment

If you prefer Docker, you can create a `Dockerfile` and run migrations at container start. Example outline:

```dockerfile
# Example Dockerfile (adjust as needed)
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
# Prisma engines are required at runtime
RUN npx prisma generate
EXPOSE 5000
CMD ["sh", "-c", "npm run migrate:prod && npm start"]
```

For compose, ensure your DB service is healthy before starting the app or use retry logic.

---

## Database Notes

- Use `migrate deploy` in production to apply committed migrations safely.
- Back up your database before major releases. Prisma doesn’t auto‑rollback data changes.
- If you need seeds, add a Prisma seed script and run `npx prisma db seed` as part of your release process.

---

## Troubleshooting

- Error: `@prisma/client did not initialize yet` → Run `npx prisma generate` (covered by `npm run migrate:prod`).
- Connection refused / timeout → Verify `DATABASE_URL`, firewall rules, and DB availability.
- Port already in use → Change `PORT` in `.env` or stop the conflicting service.
- Permission denied writing logs → Ensure the process user can write to `logs/`.

---

## Quick Reference

```powershell
# 1) Configure .env
# 2) Install prod deps
npm ci --omit=dev

# 3) Apply migrations + generate client
npm run migrate:prod

# 4) Start the server
npm start

# (Optional) Use PM2
pm2 start server.js --name orderwater-backend
pm2 save; pm2 startup
```

That’s it—your OrderWater backend should now be up and running in production.
