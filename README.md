# Bazaar — Production E-Commerce Platform

## Stack
- **Frontend**: Next.js 14 (App Router) + Redux Toolkit + redux-persist → Vercel
- **Backend**: NestJS + Prisma ORM → Railway
- **Database**: PostgreSQL → Supabase
- **Auth**: JWT + Google OAuth
- **Payments**: Razorpay

---

## Project Structure
```
bazaar/
├── frontend/          # Next.js 14
│   └── src/
│       ├── app/       # Pages (home, products, cart, checkout, orders, admin, auth)
│       ├── components/ # Navbar, ProductCard, UI primitives, Providers
│       ├── store/     # Redux slices (cart, auth) + persist config
│       ├── lib/       # API client, constants
│       ├── hooks/     # Typed redux hooks
│       └── types/     # Shared TypeScript types
├── backend/           # NestJS
│   ├── src/
│   │   ├── auth/      # JWT + Google OAuth
│   │   ├── products/  # CRUD + filters
│   │   ├── orders/    # Create, track, admin
│   │   ├── payments/  # Razorpay create-order, verify, webhook
│   │   ├── prisma/    # PrismaService (global)
│   │   └── common/    # JwtAuthGuard, RolesGuard, decorators
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
└── .github/workflows/ # CI/CD
```

---

## Quick Start

### 1. Database (Supabase)
1. Create project at https://supabase.com
2. Copy the **Connection Pooling** URI from Settings → Database

### 2. Backend
```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, GOOGLE_*, RAZORPAY_* in .env

npm install
npx prisma migrate dev --name init
npm run seed          # seeds 12 products + admin user
npm run start:dev
```

Admin credentials after seed:
- Email: `admin@bazaar.com`
- Password: `admin123`

### 3. Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_API_URL and NEXT_PUBLIC_RZP_KEY

npm install
npm run dev
```

Open http://localhost:3000

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login → JWT |
| GET | /api/auth/google | — | Google OAuth |
| GET | /api/auth/me | JWT | Current user |
| GET | /api/products | — | List + filter |
| GET | /api/products/:id | — | Single product |
| POST | /api/products | ADMIN | Create product |
| PATCH | /api/products/:id | ADMIN | Update product |
| DELETE | /api/products/:id | ADMIN | Soft delete |
| POST | /api/orders | JWT | Place order |
| GET | /api/orders/me | JWT | My orders |
| GET | /api/orders/admin | ADMIN | All orders |
| PATCH | /api/orders/:id/status | ADMIN | Update status |
| GET | /api/orders/analytics | ADMIN | Dashboard stats |
| POST | /api/payments/create-order | JWT | Razorpay order |
| POST | /api/payments/verify | JWT | Verify signature |
| POST | /api/payments/webhook | — | Razorpay webhook |
| GET | /api/health | — | Health check |

---

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
# Set env vars in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-backend.railway.app/api
# NEXT_PUBLIC_RZP_KEY = rzp_live_xxx
```

### Backend → Railway
1. Connect GitHub repo at https://railway.app
2. Set root directory to `backend/`
3. Add env vars (DATABASE_URL, JWT_SECRET, GOOGLE_*, RAZORPAY_*)
4. Railway auto-deploys on push to main

### Database → Supabase
```bash
# Run migrations against production DB
DATABASE_URL="your-supabase-url" npx prisma migrate deploy
DATABASE_URL="your-supabase-url" npm run seed
```

---

## Google OAuth Setup
1. Go to https://console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URI: `https://your-backend.railway.app/api/auth/google/callback`
4. Copy Client ID + Secret to backend `.env`

## Razorpay Setup
1. Sign up at https://razorpay.com
2. Dashboard → Settings → API Keys → Generate Test Key
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to backend `.env`
4. For webhooks: Dashboard → Webhooks → Add URL: `https://your-backend.railway.app/api/payments/webhook`
