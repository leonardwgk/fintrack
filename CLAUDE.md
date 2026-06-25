# fintrack — Claude Code Context

Personal financial tracker web app. Dibangun solo oleh satu developer.
Live di: `finance.leonardwgk.my.id`
Repo: `https://github.com/leonardwgk/fintrack`

---

## Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Framework   | React 18 + Vite               |
| Styling     | Tailwind CSS v4 (via Vite plugin) |
| Database    | Supabase (PostgreSQL)         |
| Auth        | Supabase Auth (email/password)|
| State       | Zustand                       |
| Charts      | Recharts                      |
| Routing     | React Router v6               |
| Hosting     | Vercel (auto-deploy from main)|
| Domain      | Hostinger (leonardwgk.my.id)  |

---

## Project Structure

```
fintrack/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx    # Guards private routes
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx         # Main layout wrapper (sidebar + bottom nav)
│   │   │   ├── Sidebar.jsx           # Desktop dark sidebar, sticky
│   │   │   └── BottomNav.jsx         # Mobile bottom navigation (5 tabs)
│   │   ├── ui/
│   │   │   ├── index.jsx             # Card, StatCard, Badge, Button, Divider
│   │   │   ├── Modal.jsx             # Reusable modal (ESC to close, backdrop click)
│   │   │   └── FormField.jsx         # Field, Input, Select, Textarea, FormActions
│   │   ├── accounts/
│   │   │   └── AccountForm.jsx       # Create/edit account form
│   │   ├── transactions/
│   │   │   └── TransactionForm.jsx   # Create/edit transaction form
│   │   ├── budgets/                  # Budget components
│   │   ├── goals/                    # Goals components
│   │   └── bills/                    # Bills components
│   ├── hooks/
│   │   ├── useAuth.js                # Auth listener, initializes on app load
│   │   ├── useDashboard.js           # Fetches net worth + monthly summary
│   │   ├── useAccounts.js            # CRUD accounts, groups asset/liability
│   │   ├── useTransactions.js        # CRUD transactions, filtered by month/year
│   │   ├── useCategories.js          # CRUD categories, seeds defaults on first use
│   │   ├── useBudgets.js             # CRUD budgets + real-time spending per category
│   │   ├── useGoals.js               # CRUD goals + addFunds helper
│   │   └── useBills.js               # CRUD bills, calculates monthly/yearly totals
│   ├── lib/
│   │   ├── supabase.js               # Supabase client (reads from env vars)
│   │   └── format.js                 # formatCurrency, formatDate, currentMonthLabel
│   ├── pages/
│   │   ├── LoginPage.jsx             # Split layout: branding panel + form
│   │   ├── DashboardPage.jsx         # Net worth hero + monthly summary + recent tx
│   │   ├── AccountsPage.jsx          # List accounts grouped by asset/liability
│   │   ├── TransactionsPage.jsx      # Monthly transactions with filter + month nav
│   │   ├── BudgetsPage.jsx           # Budget progress bars per category
│   │   ├── GoalsPage.jsx             # Goal cards with progress + add funds
│   │   ├── BillsPage.jsx             # Subscriptions + bills with due dates
│   │   └── InvestmentsPage.jsx       # Portfolio tracker (WIP)
│   ├── store/
│   │   └── authStore.js              # Zustand: user, profile, signOut
│   ├── styles/
│   │   └── index.css                 # Tailwind import + CSS vars + animations
│   └── App.jsx                       # Router + AuthRedirect
├── supabase/
│   └── migrations/
│       └── 001_init_fintrack.sql     # Full schema (run once in Supabase SQL Editor)
├── .github/
│   ├── workflows/ci.yml              # CI: lint + build on push/PR to main & dev
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
├── .env.local                        # NEVER commit — gitignored
├── .env.example                      # Template env vars
├── vercel.json                       # SPA rewrite rule for React Router
└── CLAUDE.md                         # This file
```

---

## Design System

Semua CSS variables didefinisikan di `src/styles/index.css`. **Selalu gunakan CSS vars, bukan hardcoded hex.**

### Color tokens
```css
--ink          /* primary text, buttons */
--ink-soft     /* secondary text */
--ink-muted    /* placeholder, labels */
--ink-faint    /* disabled, borders light */
--surface      /* page background */
--surface-2    /* card secondary bg */
--surface-3    /* hover states */
--border       /* default border */
--white        /* card backgrounds */

--green / --green-soft   /* income, positive, asset */
--red / --red-soft       /* expense, negative, liability, danger */
--blue / --blue-soft     /* neutral positive, info */
--amber / --amber-soft   /* warning, budget */
--purple / --purple-soft /* investments, accounts */
```

### Typography
- Font: **DM Sans** (loaded from Google Fonts)
- Mono: **DM Mono** (for numbers/amounts)
- Heading size: 22–28px, `fontWeight: 600`, `letterSpacing: -.03em`
- Body: 13–14px
- Label/caption: 11–12px, `letterSpacing: .06em`, `textTransform: uppercase`

### Spacing & radius
```css
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px
--radius-xl: 24px
```

### Styling convention
Komponen menggunakan **inline styles** (bukan Tailwind classes) untuk konsistensi dengan CSS vars. Tailwind hanya dipakai untuk responsive utilities (`className="stats-grid"`).

---

## Database Schema

10 tabel utama di Supabase. Semua pakai **Row Level Security** — setiap query otomatis di-filter by `auth.uid()`.

```
profiles            — extends auth.users, currency preference
accounts            — rekening (bank, cash, e-wallet, crypto, credit_card, loan)
categories          — income/expense categories (user-defined + defaults)
transactions        — pemasukan & pengeluaran
transfers           — pindah saldo antar rekening (bukan income/expense)
budgets             — anggaran per kategori per bulan
goals               — target tabungan dengan progress
goal_contributions  — log kontribusi ke goals
bills               — tagihan & langganan rutin
investments         — portofolio aset (saham, kripto, reksa dana, emas, properti)
investment_transactions — log beli/jual investasi
```

### Key relationships
- `transactions.account_id` → `accounts.id`
- `transactions.category_id` → `categories.id`
- `budgets.category_id` → `categories.id`
- `accounts.category` = `'asset'` | `'liability'` (dipakai untuk kalkulasi net worth)

### Views
- `v_net_worth` — kalkulasi total_assets, total_liabilities, net_worth per user
- `v_monthly_summary` — income vs expense per bulan per user

---

## Environment Variables

```bash
VITE_SUPABASE_URL=       # dari Supabase: Settings → API → Project URL
VITE_SUPABASE_ANON_KEY=  # dari Supabase: Settings → API → anon public key
```

Di Vercel: Settings → Environment Variables (juga dipakai oleh CI di GitHub Actions secrets).

---

## Hooks Pattern

Semua data hooks mengikuti pola yang sama:

```js
export function useXxx() {
  const { user } = useAuthStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    // ... query supabase
  }, [user])

  useEffect(() => {
    async function load() { await fetch() }  // ← wajib dibungkus async function
    load()
  }, [fetch])

  const create = async (values) => { /* insert + refetch */ }
  const update = async (id, values) => { /* update + refetch */ }
  const remove = async (id) => { /* delete/soft-delete + refetch */ }

  return { data, loading, create, update, remove, refetch: fetch }
}
```

> **Penting:** ESLint rule `react-hooks/set-state-in-effect` mengharuskan `fetchDashboard()` dibungkus dalam `async function load()` di dalam `useEffect`. Jangan panggil langsung.

---

## Git Convention

### Branch strategy
```
main          → production, auto-deploy ke Vercel
dev           → staging (tidak aktif dipakai, merge langsung ke main)
feat/*        → fitur baru
fix/*         → bug fix
chore/*       → dependency, config, tooling
refactor/*    → refactor tanpa perubahan fitur
```

### Commit message format
```
feat(scope): deskripsi singkat
fix(scope): deskripsi singkat
chore(scope): deskripsi singkat
refactor(scope): deskripsi singkat
docs(scope): deskripsi singkat
```

Contoh scope: `auth`, `dashboard`, `accounts`, `transactions`, `budgets`, `goals`, `bills`, `investments`, `ui`, `db`, `routing`, `lint`, `github`

### Workflow
```bash
git checkout main && git pull
git checkout -b feat/nama-fitur
# ... kerjakan
git add .
git commit -m "feat(scope): description"
git push origin feat/nama-fitur
# buat PR ke main di GitHub → merge → Vercel auto-deploy
```

---

## CI/CD

- **GitHub Actions** (`.github/workflows/ci.yml`): jalankan `npm run lint` + `npm run build` di setiap push/PR ke `main`
- **Vercel**: auto-deploy setiap merge ke `main`
- **Secrets** yang harus ada di GitHub: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## ESLint Rules yang Perlu Diperhatikan

1. **`react-hooks/exhaustive-deps`** — semua deps harus ada di array. Kalau intentional diabaikan, tambahkan `// eslint-disable-next-line react-hooks/exhaustive-deps`
2. **`react-hooks/set-state-in-effect`** — jangan panggil fungsi yang mengandung `setState` langsung di body `useEffect`. Selalu bungkus dengan `async function load() { await fn() }`
3. **`no-unused-vars`** — hapus semua import yang tidak dipakai

---

## Feature Status

| Fitur              | Status        | Route           |
|--------------------|---------------|-----------------|
| Auth (login/signup)| ✅ Done        | `/login`        |
| Dashboard          | ✅ Done        | `/dashboard`    |
| Accounts Manager   | ✅ Done        | `/accounts`     |
| Transactions       | ✅ Done        | `/transactions` |
| Budgets            | 🚧 In Progress | `/budgets`      |
| Goals              | 🚧 In Progress | `/goals`        |
| Bills & Subs       | 🚧 In Progress | `/bills`        |
| Investments        | 📋 Planned     | `/investments`  |
| AI Email Parsing   | 📋 Planned v1.1| —               |

---

## Planned: AI Email Parsing (v1.1)

Fitur otomatis baca email notifikasi transaksi bank → parse → insert ke transactions.

Rencana arsitektur:
- Email forwarding → Supabase Edge Function
- Claude API untuk classify kategori + extract amount/merchant
- Insert otomatis ke `transactions` table
- User bisa review + confirm di dashboard

Belum diimplementasi. Jangan kerjakan sampai semua core features selesai.

---

## Useful Commands

```bash
npm run dev      # start dev server (localhost:5173)
npm run build    # production build
npm run lint     # eslint check (harus pass sebelum push)
npm run preview  # preview production build locally
```