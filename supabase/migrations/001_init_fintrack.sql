-- ============================================================
-- fintrack - initial schema migration
-- paste this into supabase sql editor and run
-- ============================================================

-- profiles (extends supabase auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  currency    text not null default 'IDR',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- accounts (rekening, dompet, kartu kredit, investasi, dll)
create table public.accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('bank','cash','e-wallet','credit_card','loan','investment','crypto','other')),
  category    text not null check (category in ('asset','liability')),
  balance     numeric(18,2) not null default 0,
  currency    text not null default 'IDR',
  color       text,
  icon        text,
  is_active   boolean not null default true,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- categories (kategori income & expense, bisa custom)
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('income','expense')),
  color       text,
  icon        text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- transactions (pemasukan & pengeluaran)
create table public.transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  account_id   uuid not null references public.accounts(id) on delete restrict,
  category_id  uuid references public.categories(id) on delete set null,
  type         text not null check (type in ('income','expense')),
  amount       numeric(18,2) not null check (amount > 0),
  currency     text not null default 'IDR',
  date         date not null default current_date,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- transfers (pindah saldo antar rekening)
create table public.transfers (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  from_account_id  uuid not null references public.accounts(id) on delete restrict,
  to_account_id    uuid not null references public.accounts(id) on delete restrict,
  amount           numeric(18,2) not null check (amount > 0),
  currency         text not null default 'IDR',
  date             date not null default current_date,
  notes            text,
  created_at       timestamptz not null default now(),
  constraint no_self_transfer check (from_account_id <> to_account_id)
);

-- budgets (anggaran per kategori per bulan)
create table public.budgets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  category_id  uuid not null references public.categories(id) on delete cascade,
  budget_type  text not null default 'fixed' check (budget_type in ('fixed','percentage')),
  amount       numeric(18,2),       -- diisi jika budget_type = 'fixed'
  percentage   numeric(5,2),        -- diisi jika budget_type = 'percentage' (0-100)
  month        integer not null check (month between 1 and 12),
  year         integer not null,
  created_at   timestamptz not null default now(),
  unique (user_id, category_id, month, year)
);

-- goals (target tabungan / keuangan)
create table public.goals (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  description     text,
  target_amount   numeric(18,2) not null check (target_amount > 0),
  current_amount  numeric(18,2) not null default 0,
  currency        text not null default 'IDR',
  target_date     date,
  status          text not null default 'active' check (status in ('active','completed','paused','cancelled')),
  icon            text,
  color           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- goal_contributions (setiap transfer yang dialokasikan ke goal)
create table public.goal_contributions (
  id           uuid primary key default gen_random_uuid(),
  goal_id      uuid not null references public.goals(id) on delete cascade,
  transfer_id  uuid references public.transfers(id) on delete set null,
  amount       numeric(18,2) not null check (amount > 0),
  date         date not null default current_date,
  notes        text,
  created_at   timestamptz not null default now()
);

-- bills (tagihan & langganan rutin)
create table public.bills (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  account_id     uuid references public.accounts(id) on delete set null,
  name           text not null,
  amount         numeric(18,2) not null check (amount > 0),
  currency       text not null default 'IDR',
  frequency      text not null default 'monthly' check (frequency in ('weekly','monthly','quarterly','yearly')),
  due_day        integer check (due_day between 1 and 31),
  category       text not null default 'personal' check (category in ('personal','professional')),
  billing_type   text not null default 'subscription' check (billing_type in ('subscription','bill')),
  is_active      boolean not null default true,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- investments (portofolio investasi)
create table public.investments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  account_id      uuid references public.accounts(id) on delete set null,
  name            text not null,
  type            text not null check (type in ('stock','crypto','mutual_fund','bond','gold','property','other')),
  ticker          text,
  quantity        numeric(18,8) not null default 0,
  avg_buy_price   numeric(18,2) not null default 0,
  current_price   numeric(18,2) not null default 0,
  currency        text not null default 'IDR',
  last_updated    date,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- investment_transactions (log beli/jual)
create table public.investment_transactions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  investment_id  uuid not null references public.investments(id) on delete cascade,
  account_id     uuid references public.accounts(id) on delete set null,
  action         text not null check (action in ('buy','sell','dividend')),
  quantity       numeric(18,8) not null,
  price          numeric(18,2) not null,
  total_amount   numeric(18,2) not null,
  date           date not null default current_date,
  notes          text,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- indexes untuk performa query
-- ============================================================

create index idx_transactions_user_date    on public.transactions(user_id, date desc);
create index idx_transactions_account      on public.transactions(account_id);
create index idx_transactions_category     on public.transactions(category_id);
create index idx_transfers_user            on public.transfers(user_id, date desc);
create index idx_budgets_user_period       on public.budgets(user_id, year, month);
create index idx_goals_user                on public.goals(user_id, status);
create index idx_investments_user          on public.investments(user_id);
create index idx_investment_tx_investment  on public.investment_transactions(investment_id);
create index idx_bills_user                on public.bills(user_id, is_active);

-- ============================================================
-- row level security (rls) - data tiap user terisolasi
-- ============================================================

alter table public.profiles             enable row level security;
alter table public.accounts             enable row level security;
alter table public.categories           enable row level security;
alter table public.transactions         enable row level security;
alter table public.transfers            enable row level security;
alter table public.budgets              enable row level security;
alter table public.goals                enable row level security;
alter table public.goal_contributions   enable row level security;
alter table public.bills                enable row level security;
alter table public.investments          enable row level security;
alter table public.investment_transactions enable row level security;

-- policies: user hanya bisa akses data miliknya sendiri
create policy "user owns profile"             on public.profiles             for all using (auth.uid() = id);
create policy "user owns accounts"            on public.accounts             for all using (auth.uid() = user_id);
create policy "user owns categories"          on public.categories           for all using (auth.uid() = user_id);
create policy "user owns transactions"        on public.transactions         for all using (auth.uid() = user_id);
create policy "user owns transfers"           on public.transfers            for all using (auth.uid() = user_id);
create policy "user owns budgets"             on public.budgets              for all using (auth.uid() = user_id);
create policy "user owns goals"               on public.goals                for all using (auth.uid() = user_id);
create policy "user owns bills"               on public.bills                for all using (auth.uid() = user_id);
create policy "user owns investments"         on public.investments          for all using (auth.uid() = user_id);
create policy "user owns investment_tx"       on public.investment_transactions for all using (auth.uid() = user_id);
create policy "user owns goal_contributions"  on public.goal_contributions   for all
  using (exists (select 1 from public.goals g where g.id = goal_id and g.user_id = auth.uid()));

-- ============================================================
-- trigger: auto-create profile saat user baru register
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- trigger: auto-update updated_at
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_accounts      before update on public.accounts      for each row execute procedure public.set_updated_at();
create trigger set_updated_at_transactions  before update on public.transactions  for each row execute procedure public.set_updated_at();
create trigger set_updated_at_goals         before update on public.goals         for each row execute procedure public.set_updated_at();
create trigger set_updated_at_bills         before update on public.bills         for each row execute procedure public.set_updated_at();
create trigger set_updated_at_investments   before update on public.investments   for each row execute procedure public.set_updated_at();

-- ============================================================
-- seed: default categories (insert setelah user register)
-- gunakan ini sebagai referensi atau buat fungsi seed per user
-- ============================================================

-- contoh default categories bisa diinsert via function atau
-- langsung dari app saat user pertama kali login.

-- ============================================================
-- view: net_worth per user (aset - liabilitas)
-- ============================================================

create or replace view public.v_net_worth as
select
  user_id,
  sum(case when category = 'asset'     then balance else 0 end) as total_assets,
  sum(case when category = 'liability' then balance else 0 end) as total_liabilities,
  sum(case when category = 'asset'     then balance else 0 end)
  - sum(case when category = 'liability' then balance else 0 end) as net_worth
from public.accounts
where is_active = true
group by user_id;

-- ============================================================
-- view: monthly summary per user
-- ============================================================

create or replace view public.v_monthly_summary as
select
  user_id,
  date_trunc('month', date) as month,
  sum(case when type = 'income'  then amount else 0 end) as total_income,
  sum(case when type = 'expense' then amount else 0 end) as total_expense,
  sum(case when type = 'income'  then amount else 0 end)
  - sum(case when type = 'expense' then amount else 0 end) as net_balance
from public.transactions
group by user_id, date_trunc('month', date)
order by month desc;

