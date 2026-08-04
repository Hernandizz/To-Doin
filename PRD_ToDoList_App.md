# Product Requirements Document (PRD)
## Aplikasi To-Do List Harian

| | |
|---|---|
| **Nama Produk** | TaskFlow (working title) |
| **Versi Dokumen** | 1.0 |
| **Status** | Draft untuk Review |
| **Disusun oleh** | Product Manager |
| **Tanggal** | 4 Agustus 2026 |

---

## 1. Executive Summary

TaskFlow adalah aplikasi to-do list yang dirancang untuk membantu pengguna mengelola tugas harian secara sederhana namun terstruktur. Berbeda dari aplikasi task manager yang kompleks dan penuh fitur (seperti project management tool), TaskFlow berfokus pada tiga nilai inti: **kejelasan visual (clean UI)**, **kemudahan prioritisasi**, dan **fleksibilitas mencatat detail** melalui area catatan pada setiap tugas.

Diferensiator utama produk ini adalah kemampuan **ekspor ke PDF dengan tata letak siap-cetak**, yang memungkinkan pengguna mencetak daftar tugas mereka dan mengisinya secara manual (checkbox, kolom waktu, catatan) — menjembatani preferensi pengguna yang masih nyaman dengan pencatatan fisik/hybrid dengan kenyamanan aplikasi digital.

**Visi:** Menjadi teman produktivitas harian yang membuat pengguna merasa terorganisir tanpa merasa kewalahan oleh fitur yang berlebihan.

**Tujuan Utama:**
- Menyediakan cara tercepat untuk mencatat, memprioritaskan, dan menyelesaikan tugas.
- Mengurangi friksi antara pencatatan digital dan kebiasaan mencatat manual melalui fitur ekspor PDF.
- Membantu membangun kebiasaan rutin melalui recurring task dan reminder.

---

## 2. Problem Statement & Target Audience

### Masalah yang Diselesaikan
1. Banyak aplikasi to-do list yang tersedia di pasar terlalu rumit (terlalu banyak fitur project management) atau terlalu sederhana (tidak mendukung prioritas maupun catatan tambahan).
2. Pengguna sering kehilangan konteks tugas karena tidak ada ruang untuk menambahkan detail atau sub-tugas.
3. Pengguna yang lebih suka mencatat secara manual (pen & paper) kesulitan memindahkan rencana digital ke media cetak dengan format yang rapi.
4. Tugas berulang (seperti kebiasaan harian) sering harus diinput ulang setiap hari, menyebabkan pengguna berhenti menggunakan aplikasi.

### Target Audience
- **Pekerja profesional/knowledge worker** yang mengelola tugas kantor dan pribadi sekaligus.
- **Mahasiswa** yang mengatur tugas kuliah, deadline, dan jadwal belajar.
- **Individu dengan gaya hidup terstruktur** yang menyukai kombinasi digital planning dan pencatatan manual (bullet journal enthusiast).
- **Freelancer/wirausaha kecil** yang membutuhkan pengingat tenggat waktu tanpa tool manajemen proyek yang berat.

---

## 3. User Personas

**Persona 1 — "Dinda, 27 tahun, Marketing Executive"**
Bekerja di kantor dengan banyak deadline campaign. Butuh cara cepat mencatat tugas mendesak, memisahkan urusan kantor dan pribadi, serta pengingat agar tidak lupa deadline penting. Sering mencetak daftar tugas mingguannya untuk ditempel di meja kerja.

**Persona 2 — "Bagas, 21 tahun, Mahasiswa Tingkat Akhir"**
Mengatur tugas kuliah, jadwal bimbingan skripsi, dan kegiatan organisasi. Membutuhkan kategorisasi yang jelas dan reminder agar tidak telat mengumpulkan tugas. Menggunakan mode gelap karena sering membuka aplikasi di malam hari.

**Persona 3 — "Pak Herman, 40 tahun, Pemilik Usaha Kecil"**
Mengelola tugas operasional tokonya (stok, pembayaran supplier, follow-up pelanggan). Tidak terlalu melek teknologi, sehingga membutuhkan antarmuka yang sangat sederhana dan opsi cetak PDF untuk dibagikan ke stafnya.

---

## 4. Functional Requirements

### 4.1 Core Requirements (Wajib)

#### 4.1.1 Task Checkboxes
- Setiap item tugas memiliki checkbox kosong berbentuk kotak (bukan lingkaran) di sisi kiri baris.
- Saat diklik/tap, checkbox terisi dengan tanda centang dan teks tugas mendapatkan animasi **strikethrough** (garis coret) yang muncul secara progresif (durasi ±200–300ms) untuk memberikan umpan balik visual yang memuaskan.
- Tugas yang sudah selesai otomatis dipindahkan ke bagian bawah daftar atau ke tab "Selesai" (dapat dikonfigurasi oleh pengguna di pengaturan).
- Mendukung **undo** dengan menekan kembali checkbox (uncheck) yang akan menghilangkan animasi strikethrough.
- Interaksi harus mendukung gesture tap sekali (bukan long-press) untuk kecepatan penggunaan sehari-hari.

**Acceptance Criteria:**
- Checkbox merespons dalam <100ms setelah interaksi.
- Status tugas (checked/unchecked) tersimpan secara real-time ke database.

#### 4.1.2 Priority Sections
- Tiga kategori prioritas dengan kode warna berbeda:
  - **Urgent (Mendesak)** — warna merah, ditampilkan paling atas.
  - **Important (Penting)** — warna kuning/oranye.
  - **Normal (Biasa)** — warna biru/netral.
- Tugas dikelompokkan dalam section yang dapat di-collapse/expand.
- Pengguna dapat memindahkan tugas antar-prioritas melalui drag-and-drop atau menu opsi (ubah prioritas).
- Badge/label prioritas juga muncul saat tugas ditampilkan dalam tampilan gabungan (misal: tampilan "Semua Tugas").

**Acceptance Criteria:**
- Setiap tugas wajib memiliki satu prioritas (default: Normal jika tidak dipilih).
- Perubahan prioritas tersinkronisasi langsung di semua tampilan (list, kalender, PDF).

#### 4.1.3 Date and Time Blocks
- Setiap tugas memiliki field tenggat waktu (deadline) yang terdiri dari:
  - **Tanggal** (date picker: hari ini, besok, pilih tanggal, atau "tanpa tanggal").
  - **Waktu spesifik** (opsional, format jam:menit, dengan pilihan AM/PM atau 24 jam sesuai preferensi lokal).
  - **Rentang mingguan** (opsional) — untuk tugas yang berlaku selama satu minggu tanpa hari spesifik.
- Tampilan kalender mingguan/bulanan untuk melihat sebaran tugas berdasarkan tanggal.
- Indikator visual untuk tugas yang **overdue** (terlambat) — misalnya teks tanggal berubah warna merah.

**Acceptance Criteria:**
- Format tanggal/waktu mengikuti pengaturan regional perangkat pengguna.
- Tugas tanpa deadline tetap dapat dibuat dan disimpan di kategori "Someday" atau tanpa blok waktu.

#### 4.1.4 Notes Area
- Setiap tugas memiliki ruang catatan tambahan (expandable text area) yang dapat diakses dengan mengetuk ikon catatan atau meng-expand baris tugas.
- Mendukung teks bebas untuk komentar, detail, atau daftar sub-tugas sederhana (checklist bertingkat/nested checklist, opsional pada versi lanjutan).
- Preview singkat catatan (1 baris) dapat ditampilkan di bawah judul tugas agar pengguna tahu ada catatan tanpa harus membuka detail.
- Batas karakter disarankan: hingga 2.000 karakter per catatan untuk menjaga performa dan kerapian tampilan cetak.

**Acceptance Criteria:**
- Catatan tersimpan otomatis (auto-save) setiap kali pengguna berhenti mengetik selama >1 detik.
- Catatan ikut ditampilkan saat tugas diekspor ke PDF.

### 4.2 Value-Add Features (Fitur Tambahan)

#### 4.2.1 Categorization & Tags
- Pengguna dapat membuat folder/list kustom (misal: Pekerjaan, Pribadi, Belanja) dengan nama dan warna/ikon pilihan sendiri.
- Setiap tugas dapat memiliki satu folder utama dan beberapa tag tambahan (multi-tag) untuk pencarian silang.
- Filter dan pencarian tugas berdasarkan folder, tag, prioritas, atau tanggal.

#### 4.2.2 Reminders & Push Notifications
- Pengguna dapat mengatur pengingat relatif terhadap deadline (misal: 15 menit, 1 jam, 1 hari sebelumnya) atau waktu spesifik kustom.
- Mendukung multiple reminder per tugas (misal: 1 hari sebelum + 15 menit sebelum).
- Notifikasi push harus actionable — pengguna bisa menandai selesai atau menunda (snooze) langsung dari notifikasi.
- Pengaturan izin notifikasi harus mengikuti standar platform (iOS/Android) dan dapat dinonaktifkan per tugas atau global.

#### 4.2.3 Recurring Tasks
- Opsi pengulangan: Harian, Mingguan (dengan pilihan hari tertentu), Bulanan, atau kustom (misal: setiap 3 hari).
- Saat tugas berulang ditandai selesai, instance berikutnya otomatis dibuat sesuai jadwal.
- Pengguna dapat mengedit satu instance saja atau seluruh seri (mirip pengaturan calendar app).
- Riwayat penyelesaian tugas berulang dapat dilihat untuk mendukung tracking kebiasaan (habit tracking).

#### 4.2.4 Export to PDF
- Tombol ekspor tersedia di level daftar (semua tugas, per folder, atau per rentang tanggal).
- Layout PDF mempertahankan elemen visual utama:
  - Checkbox kosong (persegi) yang dapat dicentang manual dengan pena.
  - Kolom prioritas dengan indikator warna atau simbol (karena warna mungkin tidak tercetak di printer hitam-putih, sediakan juga simbol seperti "!", "!!" atau ikon).
  - Blok tanggal/waktu yang jelas di sisi kanan setiap baris.
  - Ruang kosong bergaris di bawah/samping setiap tugas untuk catatan tulisan tangan.
- Pilihan orientasi kertas (Portrait/Landscape) dan ukuran (A4/Letter).
- Opsi template: "Daftar Harian", "Daftar Mingguan", atau "Semua Tugas".
- File PDF dapat diunduh langsung atau dikirim melalui share sheet (email, WhatsApp, dll).

**Acceptance Criteria:**
- Proses generate PDF selesai dalam <5 detik untuk daftar hingga 100 tugas.
- Tata letak PDF tetap rapi dan tidak terpotong pada berbagai ukuran kertas standar.

#### 4.2.5 Dark Mode & Cross-Device Sync
- Tema gelap dan terang dapat dipilih manual atau mengikuti pengaturan sistem otomatis.
- Sinkronisasi cloud real-time antar perangkat (mobile, tablet, web) menggunakan akun pengguna (email/SSO).
- Indikator status sinkronisasi (misal: ikon "tersinkron" atau "sedang menyinkronkan").
- Dukungan mode offline — perubahan tetap tersimpan lokal dan otomatis sinkron saat koneksi kembali tersedia.

---

## 5. Non-Functional Requirements

| Kategori | Ketentuan |
|---|---|
| **Kinerja (Performance)** | Aplikasi harus terbuka dalam <2 detik pada perangkat kelas menengah. Interaksi UI (checkbox, filter, scroll) harus responsif dengan latensi <100ms. |
| **Keandalan (Reliability)** | Uptime layanan sinkronisasi cloud minimal 99.5%. Data lokal tetap dapat diakses saat offline tanpa kehilangan data. |
| **Keamanan (Security)** | Data pengguna dienkripsi saat transit (TLS 1.2+) dan saat disimpan (encryption at rest). Autentikasi mendukung email/password serta opsi login sosial (Google/Apple). |
| **Skalabilitas** | Arsitektur backend harus mampu menangani pertumbuhan pengguna tanpa penurunan performa signifikan (horizontal scaling). |
| **Aksesibilitas** | Kontras warna minimal memenuhi standar WCAG AA, mendukung dynamic font size, dan kompatibel dengan screen reader dasar. |
| **Kompatibilitas Platform** | Tersedia untuk iOS, Android, dan Web responsif; tampilan konsisten di seluruh platform. |
| **Privasi Data** | Kepatuhan terhadap regulasi perlindungan data yang berlaku (misal UU PDP di Indonesia), termasuk opsi ekspor/hapus data pengguna. |

---

## 6. User Flow

**Alur Utama: Dari Membuka Aplikasi hingga Mengekspor Tugas**

1. **Onboarding/Login** — Pengguna baru membuat akun atau login (email/Google/Apple). Ditampilkan tutorial singkat 3 layar mengenai fitur utama.
2. **Halaman Utama (Home)** — Menampilkan daftar tugas hari ini, dikelompokkan berdasarkan prioritas (Urgent/Important/Normal).
3. **Tambah Tugas Baru** — Pengguna menekan tombol "+", mengisi:
   - Judul tugas
   - Prioritas (default: Normal)
   - Tanggal & waktu (opsional)
   - Folder/tag (opsional)
   - Catatan tambahan (opsional)
   - Pengaturan pengulangan & pengingat (opsional)
4. **Simpan Tugas** — Tugas muncul otomatis di section prioritas yang sesuai dan di tampilan kalender jika memiliki deadline.
5. **Interaksi Harian** — Pengguna mencentang checkbox saat tugas selesai (muncul animasi strikethrough); tugas pindah ke bagian "Selesai".
6. **Menerima Pengingat** — Notifikasi push muncul sesuai waktu yang diatur; pengguna dapat menandai selesai atau menunda langsung dari notifikasi.
7. **Review & Filter** — Pengguna menyaring tugas berdasarkan folder, tag, atau rentang tanggal sesuai kebutuhan.
8. **Ekspor ke PDF** — Pengguna memilih daftar tugas (harian/mingguan/semua) → menekan "Export to PDF" → memilih template & orientasi kertas → PDF ter-generate → pengguna mengunduh atau membagikan file.

---

## 7. Success Metrics (KPIs)

| Metrik | Deskripsi | Target Indikatif |
|---|---|---|
| **Daily Active Users (DAU)** | Jumlah pengguna aktif harian | Pertumbuhan konsisten bulan-ke-bulan |
| **Task Completion Rate** | Persentase tugas yang ditandai selesai dari total tugas dibuat | >60% |
| **Retention Rate (D7/D30)** | Persentase pengguna yang kembali menggunakan aplikasi setelah 7/30 hari | D7 >40%, D30 >20% |
| **Fitur Ekspor PDF — Adoption Rate** | Persentase pengguna aktif yang menggunakan fitur ekspor PDF minimal 1x/bulan | >15% |
| **Recurring Task Usage** | Persentase pengguna yang membuat minimal 1 tugas berulang | >25% |
| **Reminder Engagement** | Persentase notifikasi pengingat yang direspons (selesai/snooze) dibanding diabaikan | >50% |
| **Rata-rata Tugas per Pengguna/Minggu** | Indikator keterlibatan pengguna dengan aplikasi | Meningkat seiring waktu |
| **App Store Rating** | Skor rata-rata ulasan di App Store/Play Store | ≥4.5 |
| **Crash-Free Session Rate** | Persentase sesi tanpa crash aplikasi | >99% |

---

## 8. Catatan untuk Tim Development

- **Tim UI/UX**: Prioritaskan kesederhanaan visual — hindari terlalu banyak warna/badge dalam satu layar. Uji animasi strikethrough agar terasa natural, bukan mengganggu.
- **Tim Engineering**: Rancang skema data agar mendukung sinkronisasi offline-first sejak awal (hindari refactor besar di kemudian hari). Modul ekspor PDF sebaiknya dibangun sebagai layanan terpisah (microservice/lib) agar mudah diperluas ke format lain (misal Excel) di masa depan.
- **Rekomendasi Rilis Bertahap (Fase MVP)**:
  1. Fase 1: Checkboxes, Priority Sections, Date/Time Blocks, Notes Area (Core Requirements).
  2. Fase 2: Categorization & Tags, Reminders.
  3. Fase 3: Recurring Tasks, Export to PDF.
  4. Fase 4: Dark Mode & Cross-Device Sync.

---

*Dokumen ini merupakan draft awal dan terbuka untuk revisi berdasarkan masukan dari tim Engineering, Design, dan hasil riset pengguna lebih lanjut.*
