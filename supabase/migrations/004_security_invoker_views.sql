-- ============================================================
-- fintrack - migration 004 (SECURITY)
-- Tutup celah: view bawaan Postgres berjalan dengan hak pemilik view
-- (postgres), sehingga RLS pada tabel sumber TIDAK diterapkan saat
-- view di-query. Tanpa perbaikan ini, user yang login bisa membaca
-- agregat net worth / ringkasan bulanan milik SEMUA user.
--
-- security_invoker = on  -> view dieksekusi dengan hak si pemanggil,
-- sehingga RLS (auth.uid() = user_id) pada accounts & transactions
-- ikut diberlakukan dan view hanya mengembalikan baris milik user.
--
-- Butuh PostgreSQL 15+ (Supabase sudah memenuhi). Jalankan sekali.
-- ============================================================

alter view public.v_net_worth      set (security_invoker = on);
alter view public.v_monthly_summary set (security_invoker = on);

-- Verifikasi (opsional): login sebagai 2 user berbeda lalu
--   select * from public.v_net_worth;
-- harus hanya mengembalikan baris milik masing-masing user.
