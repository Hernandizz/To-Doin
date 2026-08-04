export function renderLanding() {
  setTimeout(() => {
    const blob = document.getElementById('cursor-blob');
    if (blob) {
      document.addEventListener('mousemove', (e) => {
        // Center the blob on the cursor
        blob.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
      });
    }
  }, 0);

  return `
    <main class="flex-grow flex-col relative" style="overflow: hidden;">
      <!-- Glowing Cursor Blob -->
      <div id="cursor-blob" style="position: fixed; top: 0; left: 0; width: 300px; height: 300px; background-color: var(--primary); border-radius: 50%; filter: blur(100px); opacity: 0.15; pointer-events: none; z-index: 0; transition: transform 0.1s ease-out; will-change: transform;"></div>

      <!-- Hero Section -->
      <section class="hero-section" style="position:relative; z-index:10;">
        <div class="hero-blur"></div>
        <div class="container text-center relative z-10 flex-col items-center gap-lg">
          <div class="inline-flex items-center gap-sm px-3 py-1 border border-outline-variant rounded" style="background:var(--surface-lowest);border-radius:100px;margin-bottom:16px">
            <span class="tag-dot" style="background:var(--secondary)"></span>
            <span class="font-label">Versi 2.0 Telah Rilis</span>
          </div>
          
          <h1 class="font-display" style="color:var(--primary);max-width:800px;margin:0 auto;line-height:1.2;">
            Kelola Tugas Harianmu dengan Lebih Mudah & Terstruktur.
          </h1>
          
          <p class="font-body-lg" style="color:var(--on-surface-variant);max-width:600px;margin:24px auto;">
            To-Doin membantu kamu menyusun jadwal, melacak progres, dan tetap produktif setiap hari tanpa ribet. Tampilan yang cantik membuatmu semakin semangat menyelesaikan tugas.
          </p>
          
          <div class="flex gap-md justify-center" style="margin-top:32px">
            <button class="btn btn-primary btn-lg" onclick="location.hash='#/register'">Mulai Sekarang Gratis</button>
            <button class="btn btn-secondary btn-lg" style="background:var(--surface-lowest)">
              <span class="material-symbols-outlined icon-sm">play_circle</span>
              Tonton Demo
            </button>
          </div>
        </div>
      </section>

      <!-- Layanan / How It Works -->
      <section id="layanan" style="padding:96px 0;position:relative;z-index:10;">
        <div class="container text-center">
          <h2 class="font-headline" style="color:var(--primary);margin-bottom:16px">Layanan Kami</h2>
          <p class="font-body" style="color:var(--on-surface-variant);margin-bottom:48px;max-width:600px;margin-left:auto;margin-right:auto;">
            Dirancang khusus untuk menyesuaikan gaya hidup dan kebutuhan produktivitasmu.
          </p>
          
          <div class="grid grid-cols-3 gap-gutter text-left">
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <span class="material-symbols-outlined icon-lg" style="color:var(--primary);margin-bottom:16px">person</span>
              <h3 class="font-title" style="margin-bottom:8px">Untuk Pribadi</h3>
              <p class="font-body" style="color:var(--on-surface-variant)">Atur jadwal harian, daftar belanjaan, hingga melacak kebiasaan baru dengan mudah dan menyenangkan.</p>
            </div>
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <span class="material-symbols-outlined icon-lg" style="color:var(--primary);margin-bottom:16px">work</span>
              <h3 class="font-title" style="margin-bottom:8px">Untuk Profesional</h3>
              <p class="font-body" style="color:var(--on-surface-variant)">Lacak tugas pekerjaan dan proyek dengan rapi agar fokus tetap terjaga di tengah kesibukan.</p>
            </div>
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <span class="material-symbols-outlined icon-lg" style="color:var(--primary);margin-bottom:16px">print</span>
              <h3 class="font-title" style="margin-bottom:8px">Siap Cetak</h3>
              <p class="font-body" style="color:var(--on-surface-variant)">Butuh salinan fisik? Ekspor daftar tugas harianmu ke format PDF dalam hitungan detik.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Fitur -->
      <section id="fitur" style="padding:96px 0;background:var(--surface-lowest);position:relative;z-index:10;">
        <div class="container">
          <div style="margin-bottom:64px;max-width:500px">
            <h2 class="font-headline" style="color:var(--primary);margin-bottom:16px">Fokus Pada Apa yang Penting</h2>
            <p class="font-body" style="color:var(--on-surface-variant)">Fitur-fitur kami dirancang agar kamu bisa fokus menyelesaikan tugas tanpa terdistraksi.</p>
          </div>
          
          <div class="bento-grid">
            <div class="card col-span-8 flex-col justify-between" style="padding:32px;min-height:300px;overflow:hidden;position:relative">
              <div style="position:relative;z-index:2">
                <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">edit_square</span>
                <h3 class="font-title" style="margin-bottom:8px">Manajemen Tugas Sederhana</h3>
                <p class="font-body" style="color:var(--on-surface-variant);max-width:400px">Buat, edit, dan atur prioritas tugasmu dengan cepat tanpa langkah yang rumit. Tampilan yang bersih membantu mengurangi beban kognitif.</p>
              </div>
            </div>
            
            <div class="card col-span-4 flex-col" style="padding:32px;min-height:300px">
              <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">folder_special</span>
              <h3 class="font-title" style="margin-bottom:8px">Kategori & Proyek</h3>
              <p class="font-body" style="color:var(--on-surface-variant);margin-top:auto">Kelompokkan tugasmu ke dalam berbagai proyek agar lebih terorganisir.</p>
            </div>
            
            <div class="card col-span-4 flex-col" style="padding:32px;min-height:300px">
              <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">notifications_active</span>
              <h3 class="font-title" style="margin-bottom:8px">Pengingat Cerdas</h3>
              <p class="font-body" style="color:var(--on-surface-variant);margin-top:auto">Jangan pernah lewatkan tenggat waktu penting dengan sistem pengingat bawaan kami.</p>
            </div>
            
            <div class="card col-span-8 flex items-center justify-between" style="padding:32px;min-height:300px">
              <div class="flex-col" style="max-width:400px">
                <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">sync</span>
                <h3 class="font-title" style="margin-bottom:8px">Sinkronisasi Real-Time</h3>
                <p class="font-body" style="color:var(--on-surface-variant)">Akses daftar to-do kamu dari perangkat mana saja. Perubahan akan tersimpan secara otomatis dan instan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimoni -->
      <section id="testimoni" style="padding:96px 0;position:relative;z-index:10;">
        <div class="container">
          <div class="text-center" style="margin-bottom:48px;">
            <h2 class="font-headline" style="color:var(--primary);margin-bottom:16px">Apa Kata Mereka?</h2>
            <p class="font-body" style="color:var(--on-surface-variant)">Pengalaman dari mereka yang sudah mencoba To-Doin.</p>
          </div>
          <div class="grid grid-cols-2 gap-gutter">
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <p class="font-body" style="color:var(--on-surface-variant);margin-bottom:24px;font-style:italic;">
                "Sangat membantu saya mengatur jadwal kuliah dan tugas akhir. Tampilannya cantik banget dan nggak bikin pusing!"
              </p>
              <div class="flex items-center gap-sm">
                <div class="avatar" style="background:var(--primary);color:var(--on-primary)">B</div>
                <div>
                  <h4 class="font-title" style="font-size:14px">Budi Santoso</h4>
                  <p class="font-label" style="color:var(--on-surface-variant)">Mahasiswa</p>
                </div>
              </div>
            </div>
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <p class="font-body" style="color:var(--on-surface-variant);margin-bottom:24px;font-style:italic;">
                "Aplikasi to-do list terbaik yang pernah saya gunakan. Ringan, cepat, dan fitur tracking proyeknya sangat rapi."
              </p>
              <div class="flex items-center gap-sm">
                <div class="avatar" style="background:var(--secondary);color:var(--on-primary)">S</div>
                <div>
                  <h4 class="font-title" style="font-size:14px">Siti Aminah</h4>
                  <p class="font-label" style="color:var(--on-surface-variant)">Pekerja Lepas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tentang Kami -->
      <section id="tentang" style="padding:96px 0;background:var(--primary);color:var(--on-primary);position:relative;z-index:10;">
        <div class="container text-center">
          <h2 class="font-headline" style="margin-bottom:16px">Misi Kami</h2>
          <p class="font-body-lg" style="max-width:800px;margin:0 auto;line-height:1.6;opacity:0.9;">
            Kami percaya bahwa produktivitas tidak seharusnya membosankan atau membebani. 
            To-Doin dibangun untuk memberikan pengalaman mengelola tugas yang indah, responsif, dan menyenangkan. 
            Fokuslah pada pencapaianmu, biarkan kami yang mengurus daftarnya.
          </p>
        </div>
      </section>

      <!-- Footer -->
      <footer style="background:var(--surface-high);border-top:1px solid var(--outline-variant);padding:48px 0;position:relative;z-index:10;">
        <div class="container flex justify-between items-center" style="flex-wrap:wrap;gap:24px">
          <div class="flex-col gap-sm">
            <span class="font-title" style="color:var(--primary)">To-Doin</span>
            <span class="font-label" style="color:var(--on-surface-variant)">© 2026 To-Doin. Semua hak dilindungi.</span>
          </div>
          <div class="flex gap-gutter" style="flex-wrap:wrap">
            <a href="#" class="font-label" style="color:var(--on-surface-variant);text-decoration:none">Kebijakan Privasi</a>
            <a href="#" class="font-label" style="color:var(--on-surface-variant);text-decoration:none">Syarat Layanan</a>
            <a href="#" class="font-label" style="color:var(--on-surface-variant);text-decoration:none">Hubungi Kami</a>
          </div>
        </div>
      </footer>
    </main>
  `;
}
