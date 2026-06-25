-- ============================================================
-- fintrack - migration 002
-- Bersihkan kategori duplikat (akibat double-seed) & cegah terulang.
-- Jalankan sekali di Supabase SQL Editor.
-- ============================================================

-- 1) Tentukan kategori "kanonik" (paling awal) per (user_id, type, nama).
--    `ranked` memetakan setiap kategori ke kanoniknya.
with ranked as (
  select
    id,
    first_value(id) over (
      partition by user_id, type, lower(trim(name))
      order by created_at, id
    ) as canonical_id
  from public.categories
)

-- 2) Arahkan ulang transaksi dari kategori duplikat ke kanoniknya.
update public.transactions t
set category_id = r.canonical_id
from ranked r
where t.category_id = r.id
  and r.id <> r.canonical_id;

-- 3) Hapus budget yang menempel pada kategori duplikat
--    (budget per-bulan, mudah dibuat ulang; menghindari bentrok unique).
with ranked as (
  select
    id,
    first_value(id) over (
      partition by user_id, type, lower(trim(name))
      order by created_at, id
    ) as canonical_id
  from public.categories
)
delete from public.budgets b
using ranked r
where b.category_id = r.id
  and r.id <> r.canonical_id;

-- 4) Hapus baris kategori duplikat (sisakan yang kanonik).
with ranked as (
  select
    id,
    first_value(id) over (
      partition by user_id, type, lower(trim(name))
      order by created_at, id
    ) as canonical_id
  from public.categories
)
delete from public.categories c
using ranked r
where c.id = r.id
  and r.id <> r.canonical_id;

-- 5) Cegah duplikat di masa depan: satu nama per (user, tipe).
create unique index if not exists uq_categories_user_type_name
  on public.categories (user_id, type, lower(trim(name)));
