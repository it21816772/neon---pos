# Quick Start Guide

Get the POS System up and running in minutes!

## 🚀 Fast Setup

### 1. Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check if PostgreSQL is running
psql --version
```

### 2. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Frontend
cd ../frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:3000
```

### 3. Database Setup

```bash
cd backend

# Create database (PostgreSQL)
createdb pos_db
# OR use existing database

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 4. Start Development

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 5. Create Admin User

```bash
cd backend
npx prisma studio
# Navigate to Users table and create a user manually
# OR create a seed script
```

**Quick Seed Script** (create `backend/prisma/seed.ts`):

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.create({
    data: {
      email: 'admin@pos.com',
      passwordHash: adminPassword,
      role: 'MANAGER',
      name: 'Admin',
    },
  });
  
  console.log('✅ Admin user created: admin@pos.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run: `npx ts-node prisma/seed.ts`

### 6. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Prisma Studio:** `npx prisma studio` (optional)

### 7. Login

- Email: `admin@pos.com`
- Password: `admin123`

## 📦 Docker Setup (Alternative)

```bash
# Start everything with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🎯 First Steps

1. **Add Categories**
   - Go to Settings (if available) or use API
   - Create product categories

2. **Add Products**
   - Use the Products API or create a manager dashboard
   - Products need categories

3. **Test Order Flow**
   - Add products to cart
   - Enter customer email
   - Complete payment
   - Check receipt generation

## 🔧 Common Issues

### Database Connection Failed
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Check database exists: `psql -l | grep pos_db`

### Port Already in Use
- Change port in `backend/.env` or `frontend/.env`
- Kill process: `lsof -ti:3000 | xargs kill` (Mac/Linux)

### CORS Errors
- Check FRONTEND_URL in backend `.env`
- Ensure frontend URL matches exactly

### Prisma Errors
- Run: `npx prisma generate`
- Check schema: `npx prisma validate`

## 📚 Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

## 💡 Tips

- Use Prisma Studio for database management: `npx prisma studio`
- Check browser console for frontend errors
- Check terminal logs for backend errors
- Enable React Query DevTools in development

---

**Ready to go! 🎉**

