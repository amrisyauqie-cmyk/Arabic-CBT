# Arabic CBT SMP

Aplikasi full-stack ujian Bahasa Arab untuk SMP kelas VII, VIII, dan IX. Antarmuka menggunakan Bahasa Indonesia; teks soal mendukung karakter Arab, harakat, dan RTL.

## Teknologi
- Node.js 18+
- Express.js
- SQLite (better-sqlite3)
- HTML, CSS, JavaScript
- Excel import/export template menggunakan SheetJS

## Menjalankan aplikasi
1. Instal Node.js versi 18 atau lebih baru.
2. Ekstrak folder proyek.
3. Buka terminal pada folder `arabic-cbt-smp`.
4. Jalankan:
   ```bash
   npm install
   npm start
   ```
5. Buka `http://localhost:3000`.

## Akun awal
- Nama pengguna: `admin`
- Kata sandi: `Admin123!`

Segera ubah kata sandi dan `SESSION_SECRET` sebelum aplikasi dipublikasikan. Akun siswa dibuat oleh admin melalui menu **Data Siswa**.

## Fitur yang tersedia
- Login admin dan siswa dengan sesi.
- Dashboard berbeda sesuai peran.
- Data siswa dan penempatan kelas VII, VIII, IX.
- Data materi per kelas dan semester.
- Bank soal dinamis: pilihan ganda, isian singkat, benar/salah.
- Import soal dari Excel/CSV dengan validasi dasar.
- Unduh template Excel.
- Paket ujian dan pemilihan soal dari bank soal.
- Jadwal/status ujian, timer server, autosave jawaban, lanjutkan sesi.
- Penilaian otomatis untuk pilihan ganda dan benar/salah serta isian dengan variasi jawaban.
- Hasil ujian dan ekspor CSV.
- Arsip soal dan perlindungan riwayat ujian.

## Format import Excel
Kolom yang dikenali:
`kelas`, `semester`, `materi`, `jenis_soal`, `pertanyaan_arab`, `terjemahan`, `pilihan_A`, `pilihan_B`, `pilihan_C`, `pilihan_D`, `kunci_jawaban`, `variasi_jawaban`, `pembahasan`.

Nilai `jenis_soal`: `pilihan ganda`, `isian singkat`, atau `benar/salah`. Untuk variasi jawaban isian, pisahkan alternatif dengan tanda `|`. Kelas menggunakan angka 7, 8, atau 9. Unduh template dari menu **Bank Soal**.

## Catatan sebelum digunakan di sekolah
Ini adalah versi awal yang dapat dijalankan dan dikembangkan. Sebelum dipakai untuk ujian resmi atau dipublikasikan ke internet, lakukan pengujian dan hardening tambahan:
- Ganti kata sandi admin dan `SESSION_SECRET` melalui environment variable.
- Gunakan HTTPS dan reverse proxy saat deployment.
- Ganti penyimpanan sesi bawaan Express dengan penyimpanan sesi persisten.
- Tambahkan perlindungan CSRF, rate limiting, audit log yang lebih lengkap, serta kebijakan backup.
- Uji skenario banyak siswa bersamaan.
- Lengkapi penilaian manual untuk jawaban isian yang membutuhkan interpretasi guru.
- Periksa pengaturan tanggal/jam ujian pada zona waktu sekolah.
- Tambahkan fitur perubahan kata sandi admin dan pengelolaan akun guru bila diperlukan.

## Environment
- `PORT` (default 3000)
- `SESSION_SECRET` (wajib diganti untuk production)
- `NODE_ENV=production` saat deployment dengan HTTPS.

Database otomatis dibuat di `data/arabic-cbt.sqlite` pada saat pertama dijalankan.
