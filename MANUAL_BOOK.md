# Buku Panduan Pengguna (Manual Book) — To-Doin App

Selamat datang di panduan resmi aplikasi **To-Doin**! To-Doin adalah aplikasi manajemen tugas (*to-do list*) yang dirancang khusus untuk meningkatkan produktivitas harian dengan antarmuka yang modern, elegan, dan minim disrupsi (*Professional Modernist*).

---

## Daftar Isi
1. [Persiapan dan Instalasi](#1-persiapan-dan-instalasi)
2. [Menjalankan Aplikasi](#2-menjalankan-aplikasi)
3. [Panduan Penggunaan Fitur](#3-panduan-penggunaan-fitur)
   - [Pendaftaran dan Masuk (Autentikasi)](#pendaftaran-dan-masuk-autentikasi)
   - [Navigasi Utama (Inbox)](#navigasi-utama-inbox)
   - [Manajemen Tugas](#manajemen-tugas)
   - [Kalender Visual](#kalender-visual)
   - [Manajemen Proyek](#manajemen-proyek)
   - [Ekspor PDF (Siap Cetak)](#ekspor-pdf-siap-cetak)
   - [Pengaturan Akun & Tema](#pengaturan-akun--tema)
4. [Tanya Jawab (FAQ) & Solusi Masalah](#4-tanya-jawab-faq--solusi-masalah)

---

## 1. Persiapan dan Instalasi

Aplikasi ini menggunakan ekosistem Node.js (frontend Vite + backend Express) dengan database SQLite yang sangat ringan (tidak perlu server database terpisah).

**Prasyarat:**
- Telah terinstal **Node.js** (rekomendasi versi 18, 20, atau terbaru).
- Terminal/Command Prompt/PowerShell.

**Langkah Instalasi:**
1. Buka terminal dan arahkan ke folder proyek `To-Do`.
2. Jalankan perintah instalasi dependensi:
   ```bash
   npm install
   ```
   *(Sistem akan otomatis menginstal paket frontend dan backend).*

---

## 2. Menjalankan Aplikasi

Aplikasi ini memiliki skrip otomasi yang akan menjalankan server backend dan frontend secara bersamaan.

1. Buka terminal di direktori proyek.
2. Jalankan perintah:
   ```bash
   npm run dev
   ```
3. Tunggu hingga muncul tulisan bahwa server berhasil berjalan.
4. Buka browser web (Chrome, Edge, Safari, Firefox) dan akses: **http://localhost:5173/**

---

## 3. Panduan Penggunaan Fitur

### Pendaftaran dan Masuk (Autentikasi)
Saat pertama kali membuka aplikasi, Anda akan melihat *Landing Page*.
1. Klik tombol **"Mulai Sekarang"**.
2. Isi formulir **Nama Depan**, **Nama Belakang**, **Email**, dan **Password** (minimal 6 karakter).
3. Klik **"Daftar"**. Akun Anda akan tersimpan secara lokal dan Anda akan langsung diarahkan ke dalam aplikasi (*Inbox*).
4. Untuk kunjungan berikutnya, cukup klik tombol **"Login"** dan masukkan Email serta Password Anda.

### Navigasi Utama (Inbox)
Di panel sebelah kiri (Sidebar), Anda akan menemukan menu navigasi utama:
- **Inbox:** Menampilkan semua tugas Anda yang belum selesai.
- **Hari Ini:** Menampilkan khusus tugas dengan tenggat waktu (*due date*) hari ini.
- **Mendatang:** Menampilkan tugas-tugas yang tenggat waktunya besok dan seterusnya.
- **Kalender:** Melihat sebaran tugas dalam tampilan kalender bulanan.

### Manajemen Tugas
- **Menambah Tugas Cepat (Quick Add):** Di halaman Inbox, gulir ke paling bawah, ketik judul tugas di kolom "Tambahkan tugas baru..." lalu tekan `Enter`.
- **Menambah Tugas Detail:** Klik tombol biru besar **"+ Tambah Tugas"** di sidebar atas. Anda bisa mengatur:
  - Judul tugas
  - Prioritas (Normal, Penting, Mendesak)
  - Tanggal & Waktu tenggat
  - Proyek terkait
  - Catatan panjang (deskripsi)
- **Menyelesaikan Tugas:** Klik ikon *checkbox* (kotak) di samping judul tugas. Teks akan secara otomatis mendapatkan coretan (*strikethrough*) dan warnanya meredup.
- **Mengedit/Menghapus:** Arahkan kursor (*hover*) ke baris tugas yang diinginkan. Di sebelah kanan judul akan muncul ikon **Pensil (Edit)** dan **Tempat Sampah (Hapus)**.

### Kalender Visual
- Buka menu **Kalender** dari sidebar.
- Anda akan melihat grid bulanan. Setiap tanggal yang memiliki tugas akan ditandai dengan **titik warna-warni**.
- **Klik pada tanggal mana saja** di kalender untuk langsung membuka formulir penambahan tugas yang otomatis terisi dengan tanggal tersebut.

### Manajemen Proyek
- Setiap tugas bisa dikelompokkan ke dalam "Proyek".
- Di sidebar bagian bawah, terdapat daftar Proyek Anda (secara bawaan ada proyek bernama "Pribadi").
- Klik **ikon tambah (+)** di samping tulisan "Proyek" pada sidebar untuk membuat proyek baru. Anda dapat memilih warna dan nama proyek.
- Jika Anda mengklik nama proyek di sidebar, halaman di sebelah kanan akan difilter *hanya* untuk menampilkan tugas dari proyek tersebut.

### Ekspor PDF (Siap Cetak)
Aplikasi ini dioptimalkan bagi Anda yang lebih suka mencatat manual di atas kertas.
1. Masuk ke halaman **Inbox**.
2. Klik ikon **Printer** di sudut kanan atas layar (sebelah kanan judul halaman).
3. Akan muncul jendela pengaturan cetak:
   - Pilih *scope* (Hari Ini, Minggu Ini, Semua, atau Kustom tanggal).
   - Pilih Filter Proyek (jika ingin mencetak tugas proyek tertentu saja).
   - Pilih ukuran kertas (A4 atau Letter) dan Orientasinya.
4. Klik **Unduh PDF**.
5. File PDF akan terunduh. Desain PDF sengaja dibuat minimalis dengan *kotak centang kosong* dan *garis-garis bergaris* agar Anda bisa mencentang dan menulis catatan tambahan menggunakan pena.

### Pengaturan Akun & Tema
1. Klik ikon inisial nama Anda di pojok kanan atas layar (navigasi atas).
2. Anda akan masuk ke halaman **Pengaturan**.
3. **Profil:** Anda bisa mengubah Nama dan menulis Bio.
4. **Tema Tampilan:** Anda dapat memilih tema aplikasi secara manual antara **Terang (Light)**, **Gelap (Dark)**, atau mengikuti **Sistem** komputer Anda.
5. Klik **Simpan Perubahan** untuk menyimpan.
6. Untuk keluar dari akun, klik **Keluar Akun (Logout)** di panel sebelah kiri pengaturan.

---

## 4. Tanya Jawab (FAQ) & Solusi Masalah

**T: Di mana data saya disimpan?**
J: Data Anda disimpan secara aman di dalam folder aplikasi pada file `data/todoin.db` (database SQLite lokal). Selama file ini tidak dihapus, data Anda akan tetap ada.

**T: Saya lupa password, bagaimana cara resetnya?**
J: Karena ini adalah aplikasi MVP lokal, fitur reset password via email belum diaktifkan. Anda dapat membuat akun baru jika lupa sandi.

**T: Apakah saya perlu menginstal server khusus seperti MySQL/XAMPP?**
J: Tidak perlu. SQLite adalah database tanpa server. Aplikasi Node.js akan mengaturnya secara otomatis.

**T: Kenapa port 5173 (atau 3001) bentrok/tidak bisa dipakai?**
J: Pastikan tidak ada aplikasi lain yang menggunakan port tersebut. Anda bisa mengubah port default backend di `server/index.js` atau port frontend di `vite.config.js`.

---
*Dibuat oleh Tim Pengembang To-Doin*
