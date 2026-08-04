# TaskFlow — Aplikasi To-Do List Harian (ProModernist)

Membangun aplikasi web to-do list lengkap berdasarkan PRD dan design system "Professional Modernist" yang sudah disiapkan. Aplikasi ini menggunakan **Vite + vanilla JS** (tanpa framework berat) dengan data disimpan di **localStorage** sebagai MVP — cukup ringan, cepat, dan sepenuhnya client-side.

## User Review Required

> [!IMPORTANT]
> **Scope yang dibangun adalah MVP (Fase 1 + sebagian Fase 2 dari PRD):**
> - ✅ Checkboxes dengan animasi strikethrough
> - ✅ Priority Sections (Urgent / Important / Normal)
> - ✅ Date & Time Blocks
> - ✅ Notes Area per tugas
> - ✅ Categorization & Tags (folder/proyek)
> - ✅ Dark Mode (toggle manual + follow system)
> - ✅ Kalender tampilan bulanan
> - ✅ Export to PDF (layout siap cetak)
> - ✅ Landing Page
> - ✅ Settings / Profile page (UI only)
> - ❌ Cloud Sync, Push Notifications, Recurring Tasks — ditangguhkan ke fase berikutnya

> [!WARNING]
> **Teknologi yang dipilih:** Vite sebagai bundler + vanilla HTML/CSS/JS. Tidak menggunakan React/Vue/framework besar agar tetap ringan dan sesuai PRD ("cara tercepat"). Data disimpan di localStorage. Apakah ini sesuai keinginan Anda, atau Anda lebih ingin menggunakan framework tertentu (misalnya React/Next.js)?

## Open Questions

> [!IMPORTANT]
> 1. **Nama produk**: PRD menyebut "TaskFlow" sebagai working title, tapi semua design menggunakan branding "ProModernist". Mana yang akan digunakan? Saya akan menggunakan **TaskFlow** sebagai nama app + **ProModernist** sebagai design system, kecuali Anda menginstruksikan lain.
> 2. **Authentication**: Design menunjukkan Login/Mulai Sekarang buttons dan halaman Settings. Untuk MVP, apakah cukup menyimpan profil lokal saja (tanpa real auth), atau Anda ingin integrasi login sungguhan?
> 3. **PDF Export**: Apakah cukup menggunakan library browser-side (jsPDF + html2canvas) atau Anda menginginkan server-side rendering?

## Proposed Changes

Struktur project menggunakan Vite dengan routing berbasis hash (`#/inbox`, `#/calendar`, `#/projects`, `#/settings`).

---

### Design System & Global Styles

#### [NEW] [index.css](file:///c:/Homechain/To-Do/src/index.css)
- Implementasi penuh design system dari [DESIGN.md](file:///c:/Homechain/To-Do/assets/stitch_responsive_web_requirement_matcher/professional_modernist/DESIGN.md)
- CSS custom properties untuk semua token warna (light + dark mode)
- Typography scale: Manrope (headlines), Inter (body), JetBrains Mono (labels)
- Spacing system berbasis 8px unit
- Elevation levels (Level 0, 1, 2) dengan tonal shadows
- Component base styles: buttons, inputs, cards, chips, checkboxes
- Animasi strikethrough (200-300ms progressive)
- Responsive breakpoints: Desktop (1280px), Tablet (768px), Mobile (480px)

---

### Core Application Structure

#### [NEW] [index.html](file:///c:/Homechain/To-Do/index.html)
- Entry point HTML dengan SEO meta tags
- Google Fonts loading (Manrope, Inter, JetBrains Mono, Material Symbols)
- Root container `#app` untuk SPA rendering

#### [NEW] [src/main.js](file:///c:/Homechain/To-Do/src/main.js)
- Entry point JS — inisialisasi app, router, theme manager
- Hash-based router (`#/`, `#/inbox`, `#/today`, `#/calendar`, `#/projects`, `#/settings`)
- Render pipeline: route change → render page → attach event listeners

#### [NEW] [src/store.js](file:///c:/Homechain/To-Do/src/store.js)
- State management sederhana dengan localStorage persistence
- Data schema untuk tasks, projects, user preferences
- CRUD operations: addTask, updateTask, deleteTask, toggleTask
- Filter/sort utilities
- Auto-save dengan debounce (1 detik, sesuai PRD acceptance criteria)

#### [NEW] [src/router.js](file:///c:/Homechain/To-Do/src/router.js)
- Lightweight hash router
- Route definitions dan page component mapping
- Navigation state tracking

---

### Pages & Views

#### [NEW] [src/pages/landing.js](file:///c:/Homechain/To-Do/src/pages/landing.js)
- Landing page sesuai design mockup landing_page_promodernist
- Hero section dengan headline, CTA buttons
- Features bento grid (4 feature cards)
- Footer dengan links

#### [NEW] [src/pages/inbox.js](file:///c:/Homechain/To-Do/src/pages/inbox.js)
- Dashboard utama — tampilan task list sesuai design main_dashboard_to_do_list
- Task cards dengan checkbox, priority indicator, date badge, project tag, notes preview
- Quick-add input di bagian bawah
- Sort & filter controls
- Sidebar navigation (Inbox, Hari Ini, Mendatang) + daftar proyek

#### [NEW] [src/pages/calendar.js](file:///c:/Homechain/To-Do/src/pages/calendar.js)
- Tampilan kalender bulanan sesuai design kalender_tugas
- Grid 7 kolom (Mon-Sun) dengan navigasi bulan
- Task dots/badges pada tanggal yang memiliki tugas
- Sidebar detail hari yang dipilih dengan daftar tugas + quick add
- Toggle Month/Week view

#### [NEW] [src/pages/projects.js](file:///c:/Homechain/To-Do/src/pages/projects.js)
- Daftar proyek dalam card grid sesuai design daftar_proyek
- Setiap card menampilkan: nama, deskripsi, progress bar, jumlah tugas
- Priority badge per proyek (warna berbeda)
- Search bar + tombol New Project
- Modal untuk membuat/edit proyek

#### [NEW] [src/pages/settings.js](file:///c:/Homechain/To-Do/src/pages/settings.js)
- Halaman pengaturan sesuai design pengaturan_akun
- Tabs: Profile, Notifications, Security, Appearance
- Profile form (nama, email, bio, avatar)
- Appearance: dark mode toggle, theme preference

---

### Shared Components

#### [NEW] [src/components/navbar.js](file:///c:/Homechain/To-Do/src/components/navbar.js)
- Top navigation bar konsisten di semua halaman
- Logo "TaskFlow", nav links (Layanan, Fitur, Testimoni, Tentang Kami)
- Login + Mulai Sekarang buttons
- User avatar (saat sudah "login")
- Mobile hamburger menu

#### [NEW] [src/components/sidebar.js](file:///c:/Homechain/To-Do/src/components/sidebar.js)
- Sidebar kiri untuk halaman dashboard (inbox, calendar)
- Tambah Tugas button
- Navigasi utama: Inbox (badge count), Hari Ini, Mendatang
- Daftar Proyek dengan color dots
- Collapsible pada mobile

#### [NEW] [src/components/task-card.js](file:///c:/Homechain/To-Do/src/components/task-card.js)
- Komponen task individual yang reusable
- Square checkbox (bukan circle) — sesuai PRD §4.1.1
- Priority color coding pada checkbox border (red/yellow/blue)
- Title + notes preview (1 line)
- Date badge dengan overdue detection (merah jika terlambat)
- Project tag dengan color dot
- Hover actions (edit, delete) — muncul on hover, hidden default
- Strikethrough animation saat checked (200-300ms)
- Undo: uncheck menghilangkan strikethrough

#### [NEW] [src/components/task-modal.js](file:///c:/Homechain/To-Do/src/components/task-modal.js)
- Modal untuk tambah/edit tugas
- Fields: Judul, Prioritas (dropdown 3 level), Tanggal (date picker), Waktu (optional), Folder/project (dropdown), Notes area (expandable textarea, max 2000 char)
- Auto-save notes dengan debounce 1 detik
- Level 2 elevation shadow

#### [NEW] [src/components/pdf-export.js](file:///c:/Homechain/To-Do/src/components/pdf-export.js)
- Export dialog: pilih scope (harian/mingguan/semua), template, orientasi, ukuran kertas
- Generate PDF dengan jsPDF:
  - Checkbox kosong (square) yang bisa dicentang manual
  - Priority symbols (!, !!, ⚡) untuk printer hitam-putih
  - Date/time block di sisi kanan
  - Ruang kosong bergaris untuk catatan tulisan tangan
- Download langsung

#### [NEW] [src/components/theme-toggle.js](file:///c:/Homechain/To-Do/src/components/theme-toggle.js)
- Toggle dark/light mode
- Persist preference di localStorage
- Follow system preference sebagai default

---

### Configuration & Build

#### [NEW] [package.json](file:///c:/Homechain/To-Do/package.json)
- Vite sebagai dev server & bundler
- Dependencies: jspdf (PDF export)

#### [NEW] [vite.config.js](file:///c:/Homechain/To-Do/vite.config.js)
- Konfigurasi Vite standar

---

## Verification Plan

### Automated Tests
- Tidak ada unit test framework pada MVP; verifikasi dilakukan secara manual dan melalui build check.
- `npm run build` — memastikan production bundle berhasil tanpa error.

### Manual Verification
1. **Landing Page** — Tampilan hero, features grid, footer, responsive mobile view
2. **Dashboard (Inbox)** — CRUD tugas, checkbox + strikethrough animation, priority filtering, quick-add
3. **Calendar** — Navigasi bulan, tugas muncul pada tanggal yang benar, sidebar detail
4. **Projects** — Card grid, progress bar, create/edit project
5. **Settings** — Profile form, dark mode toggle
6. **PDF Export** — Generate PDF, verifikasi layout checkbox kosong + ruang catatan
7. **Dark Mode** — Toggle berfungsi, semua halaman konsisten
8. **Responsive** — Desktop (1280px), Tablet (768px), Mobile (480px)
9. **Performance** — App load < 2 detik, checkbox response < 100ms
