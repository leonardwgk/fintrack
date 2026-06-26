-- ============================================================
-- fintrack - migration 003
-- Jatah Bulanan (monthly allowance) untuk kebutuhan "needs",
-- lengkap dengan rekonsiliasi sisa vs saldo riil rekening.
-- Jalankan sekali di Supabase SQL Editor.
-- ============================================================

create table public.allowances (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  account_id     uuid references public.accounts(id) on delete set null,  -- rekening tempat jatah disimpan
  month          integer not null check (month between 1 and 12),
  year           integer not null,
  amount         numeric(18,2) not null default 0,   -- jatah bulanan untuk needs
  real_balance   numeric(18,2),                       -- saldo riil terakhir saat rekonsiliasi
  reconciled_at  timestamptz,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (user_id, month, year)
);

create index idx_allowances_user_period on public.allowances (user_id, year, month);

alter table public.allowances enable row level security;

create policy "user owns allowances" on public.allowances
  for all using (auth.uid() = user_id);

create trigger set_updated_at_allowances
  before update on public.allowances
  for each row execute procedure public.set_updated_at();
