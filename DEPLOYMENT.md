# POS System - Deployment Guide

Complete guide for deploying the Futuristic POS System to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [Printing Setup](#printing-setup)
8. [Email Configuration](#email-configuration)
9. [PWA Configuration](#pwa-configuration)
10. [Desktop App Build](#desktop-app-build)

---

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (or Docker)
- **Docker & Docker Compose** (for containerized deployment)
- **Email Account** (for receipt sending - Gmail recommended)

---

## Local Development Setup

### 1. Clone and Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Database Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/pos_db"

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed data
# You can create a seed script in prisma/seed.ts
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend (port 3000)
cd backend
npm run start:dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Build Individual Images

```bash
# Backend
cd backend
docker build -t pos-backend:latest .

# Frontend
cd frontend
docker build -t pos-frontend:latest .
```

### Docker Compose Configuration

The `docker-compose.yml` includes:
- **PostgreSQL** database
- **Backend** NestJS API
- **Frontend** React app (nginx)

Update environment variables in `docker-compose.yml` or use `.env` file.

---

## Production Deployment

### Option 1: Traditional Server (Ubuntu/Debian)

#### 1. Install Dependencies

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install nginx
sudo apt-get install nginx
```

#### 2. Setup PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE pos_db;
CREATE USER pos_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE pos_db TO pos_user;
\q
```

#### 3. Deploy Backend

```bash
cd backend

# Install dependencies
npm ci --production

# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Create systemd service
sudo nano /etc/systemd/system/pos-backend.service
```

**Service file content:**
```ini
[Unit]
Description=POS Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/pos/backend
ExecStart=/usr/bin/node dist/main.js
Restart=always
Environment=NODE_ENV=production
EnvironmentFile=/var/www/pos/backend/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable pos-backend
sudo systemctl start pos-backend
```

#### 4. Deploy Frontend

```bash
cd frontend

# Build
npm run build

# Copy to nginx
sudo cp -r dist/* /var/www/pos-frontend/

# Configure nginx
sudo nano /etc/nginx/sites-available/pos
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/pos-frontend;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/pos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 2: Cloud Platforms

#### Vercel (Frontend)

```bash
cd frontend
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `VITE_API_URL=https://your-api-domain.com`

#### Railway / Render (Backend)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pos_db"

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=24h

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourcompany.com
```

### Frontend (.env)

```env
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=POS System
```

---

## Database Setup

### Initial Migration

```bash
cd backend
npx prisma migrate dev --name init
```

### Production Migration

```bash
npx prisma migrate deploy
```

### Create Admin User

You'll need to create an admin user. You can use Prisma Studio or create a seed script:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.create({
    data: {
      email: 'admin@pos.com',
      passwordHash: hashedPassword,
      role: 'MANAGER',
      name: 'Admin User',
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with: `npx ts-node prisma/seed.ts`

---

## Printing Setup

### Thermal Printer (ESC/POS)

1. **Install QZ Tray** (for browser printing)
   - Download from: https://qz.io/download/
   - Install and configure certificates

2. **Configure Printer in Database**

```sql
INSERT INTO printers (id, name, type, config, is_active)
VALUES (
  gen_random_uuid(),
  'Thermal Printer 1',
  'thermal',
  '{"port": "COM3", "driver": "generic"}',
  true
);
```

3. **WebUSB Setup** (Alternative)
   - Enable WebUSB in browser
   - Connect printer via USB
   - Select printer in Settings page

### PDF Printing

PDF receipts are automatically generated and can be:
- Emailed to customers
- Downloaded from the UI
- Printed via system print dialog

---

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → 2-Step Verification
   - App Passwords → Generate
3. Use app password in `EMAIL_PASS`

### Other SMTP Providers

Update these variables:
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

---

## PWA Configuration

The frontend is configured as a PWA with:
- Service Worker for offline support
- App manifest for mobile installation
- Caching strategies for assets

### Testing PWA

1. Build the frontend: `npm run build`
2. Serve the build: `npm run preview`
3. Open in Chrome DevTools → Application → Manifest
4. Test "Add to Home Screen"

### Icons

Place app icons in `frontend/public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

---

## Desktop App Build

### Tauri (Recommended - Smaller Bundle)

```bash
cd frontend

# Install Tauri CLI
npm install -D @tauri-apps/cli

# Initialize Tauri
npm run tauri init

# Build
npm run tauri build
```

Output: `frontend/src-tauri/target/release/`

### Electron (Alternative)

```bash
cd frontend

# Install Electron
npm install -D electron electron-builder

# Build
npm run electron:build
```

---

## CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm run build
      # Add deployment steps

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      # Add deployment steps
```

---

## Monitoring & Logging

### Backend Logging

Use Winston or similar:

```typescript
// backend/src/logger.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  // Custom logging
}
```

### Health Checks

Add health check endpoint:

```typescript
// backend/src/health/health.controller.ts
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date() };
  }
}
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure cookie options
- [ ] Enable rate limiting
- [ ] Regular dependency updates
- [ ] Database backups
- [ ] Firewall configuration

---

## Troubleshooting

### Backend won't start
- Check database connection
- Verify environment variables
- Check logs: `journalctl -u pos-backend -f`

### Frontend can't connect to API
- Check CORS configuration
- Verify `VITE_API_URL` in frontend
- Check nginx proxy configuration

### Printer not working
- Verify QZ Tray is running
- Check printer connection
- Review browser console for errors

### Email not sending
- Verify SMTP credentials
- Check email service logs
- Test SMTP connection

---

## Support

For issues or questions:
1. Check the logs
2. Review this documentation
3. Open an issue on GitHub

---

**Happy Deploying! 🚀**

