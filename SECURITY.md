# Security — fintrack

Catatan model keamanan untuk app pencatat keuangan & aset ini. Tujuannya aman di-host publik (Vercel) dengan data tiap user terisolasi penuh.

## Model autentikasi & isolasi data
- **Auth**: Supabase Auth (email + password). Sesi disimpan di browser oleh SDK Supabase.
- **Row Level Security (RLS)**: aktif di semua tabel. Setiap policy memakai `auth.uid() = user_id`, jadi tiap query (SELECT/INSERT/UPDATE/DELETE) otomatis terbatas pada data milik user yang login. Lihat `supabase/migrations/001_init_fintrack.sql`.
  - Policy `FOR ALL USING (auth.uid() = user_id)` juga berlaku sebagai `WITH CHECK` saat INSERT/UPDATE (fallback Postgres), sehingga user tidak bisa menulis baris atas nama `user_id` orang lain.

## Celah yang sudah ditutup
- **View mem-bypass RLS (kritis)** — `v_net_worth` & `v_monthly_summary` semula dibuat tanpa `security_invoker`, sehingga berjalan dengan hak pemilik view dan mengabaikan RLS tabel sumber. Akibatnya user yang login bisa membaca agregat milik user lain. Diperbaiki di `004_security_invoker_views.sql` (`security_invoker = on`).
- **Kategori dobel** — seeding diberi guard + `unique index`, lihat `002_dedupe_categories.sql`.

## Kunci & environment
- `VITE_SUPABASE_ANON_KEY` adalah **anon public key** — memang dirancang untuk dipakai di klien dan aman dipublikasikan SELAMA RLS aktif (keamanan ada di RLS, bukan kerahasiaan key).
- `.env.local` di-`.gitignore` dan tidak pernah di-commit (hanya `.env.example`).
- **JANGAN** pernah menaruh `service_role` key di kode frontend — key itu mem-bypass RLS.

## Header keamanan (HTTP)
Diset di `vercel.json` untuk semua route:
- **Content-Security-Policy** — `default-src 'self'`; script hanya dari self; connect hanya ke self + `*.supabase.co`; font dari Google Fonts; `frame-ancestors 'none'` (anti-clickjacking); `object-src 'none'`.
- **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**, **Referrer-Policy: strict-origin-when-cross-origin**, **Permissions-Policy** (kamera/mik/lokasi dimatikan), **Strict-Transport-Security** (HSTS).

> Catatan CSP: `style-src` memakai `'unsafe-inline'` karena UI memakai inline styles (atribut `style`). Ini hanya membuka inline *style*, bukan inline *script*, jadi permukaan XSS tetap kecil. React juga meng-escape semua teks user secara default; tidak ada `dangerouslySetInnerHTML` di codebase.

## Validasi input
- Jumlah uang divalidasi di DB lewat `CHECK (amount > 0)` dan di form (numeric, min 0).
- Password minimal 8 karakter saat daftar (klien). **Wajib** dikonfigurasi juga di Supabase Dashboard.

## Yang perlu dikonfigurasi di Supabase Dashboard
1. **Authentication → Policies**: pastikan minimum password length ≥ 8.
2. **Authentication → Providers → Email**: aktifkan **Confirm email** agar email diverifikasi.
3. **Authentication → Attack Protection**: aktifkan **Leaked password protection** & rate limiting.
4. Pastikan **RLS enabled** untuk semua tabel (default sudah, via migrasi).

## Dependensi
- Jalankan `npm audit` secara berkala. Hindari menamb/upgrade ke paket dengan kerentanan high/critical pada dependency produksi.

## Pelaporan
Ini proyek personal satu developer. Jika menemukan masalah keamanan, catat di issue privat repo.
