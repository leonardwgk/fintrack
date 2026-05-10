# fintrack

Personal financial tracker — built with React, Vite, Tailwind CSS, and Supabase.

## Features
- Multi-account manager (bank, e-wallet, crypto, dll)
- Income & expense tracker with categories
- Budget setup (fixed & percentage)
- Wealth & net worth tracker
- Financial goals with progress tracking
- Bills & subscriptions manager
- Investment portfolio tracker
- Finance charts & monthly summaries

## Tech stack
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS v4
- **Database + Auth**: Supabase (PostgreSQL)
- **State**: Zustand
- **Charts**: Recharts
- **Routing**: React Router v6
- **Hosting**: Vercel

## Getting started

### 1. Clone & install
```bash
git clone https://github.com/your-username/fintrack.git
cd fintrack
npm install
```

### 2. Setup environment
```bash
cp .env.example .env.local
```
Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari dashboard Supabase kamu.

### 3. Run database migration
Buka Supabase SQL Editor, paste isi file `supabase/migrations/001_init_fintrack.sql`, dan run.

### 4. Start dev server
```bash
npm run dev
```

## Git convention

### Branch
| Branch | Fungsi |
|--------|--------|
| `main` | Production — stable only |
| `dev` | Development — semua fitur merge ke sini |
| `feat/*` | Fitur baru |
| `fix/*` | Bug fix |

### Commit message
```
feat(auth): add login and register page
fix(transactions): correct negative balance calculation
chore(deps): add recharts and zustand
refactor(accounts): simplify account type handling
docs(readme): update setup instructions
```

### Workflow
```bash
git checkout dev
git checkout -b feat/nama-fitur
# ... kerjakan fitur ...
git add .
git commit -m "feat(scope): description"
git push origin feat/nama-fitur
# buat PR ke dev di GitHub
```

## Project structure
```
src/
├── components/
│   ├── auth/        # ProtectedRoute, dll
│   ├── ui/          # Button, Input, Card, dll
│   └── layout/      # Sidebar, Header, dll
├── hooks/           # useAuth, useTransactions, dll
├── lib/             # supabase.js client
├── pages/           # LoginPage, DashboardPage, dll
├── store/           # Zustand stores
└── styles/          # index.css
supabase/
└── migrations/      # SQL migration files
```
