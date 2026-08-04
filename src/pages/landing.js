export function renderLanding() {
  return `
    <main class="flex-grow flex-col">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-blur"></div>
        <div class="container text-center relative z-10 flex-col items-center gap-lg">
          <div class="inline-flex items-center gap-sm px-3 py-1 border border-outline-variant rounded" style="background:var(--surface-lowest);border-radius:100px;margin-bottom:16px">
            <span class="tag-dot" style="background:var(--secondary)"></span>
            <span class="font-label">Introducing v2.0 Enterprise</span>
          </div>
          
          <h1 class="font-display" style="color:var(--primary);max-width:800px;margin:0 auto;">
            Elevate Professional Output with Precision Ecosystems.
          </h1>
          
          <p class="font-body-lg" style="color:var(--on-surface-variant);max-width:600px;margin:24px auto;">
            To-Doin unifies fragmented workflows into a singular, highly engineered environment designed for cognitive clarity and peak operational efficiency in enterprise settings.
          </p>
          
          <div class="flex gap-md justify-center" style="margin-top:32px">
            <button class="btn btn-primary btn-lg" onclick="location.hash='#/register'">Mulai Sekarang</button>
            <button class="btn btn-secondary btn-lg" style="background:var(--surface-lowest)">
              <span class="material-symbols-outlined icon-sm">play_circle</span>
              Tonton Demo
            </button>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="fitur" style="padding:96px 0;background:var(--surface-lowest)">
        <div class="container">
          <div style="margin-bottom:64px;max-width:500px">
            <h2 class="font-headline" style="color:var(--primary);margin-bottom:16px">Architected for Focus</h2>
            <p class="font-body" style="color:var(--on-surface-variant)">Minimize friction. Maximize output. Our core modules are engineered to reduce cognitive load.</p>
          </div>
          
          <div class="bento-grid">
            <div class="card col-span-8 flex-col justify-between" style="padding:32px;min-height:300px;overflow:hidden;position:relative">
              <div style="position:relative;z-index:2">
                <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">hub</span>
                <h3 class="font-title" style="margin-bottom:8px">Centralized Operations Hub</h3>
                <p class="font-body" style="color:var(--on-surface-variant);max-width:400px">Consolidate disparate data streams into a single, highly readable surface. Make strategic decisions based on real-time, untangled metrics.</p>
              </div>
            </div>
            
            <div class="card col-span-4 flex-col" style="padding:32px;min-height:300px">
              <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">security</span>
              <h3 class="font-title" style="margin-bottom:8px">Enterprise Grade Security</h3>
              <p class="font-body" style="color:var(--on-surface-variant);margin-top:auto">Bank-level encryption protocols and stringent access controls ensure your data remains secure.</p>
            </div>
            
            <div class="card col-span-4 flex-col" style="padding:32px;min-height:300px">
              <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">bolt</span>
              <h3 class="font-title" style="margin-bottom:8px">Zero-Latency Sync</h3>
              <p class="font-body" style="color:var(--on-surface-variant);margin-top:auto">Offline-first architecture guarantees that state changes are instantaneous across devices.</p>
            </div>
            
            <div class="card col-span-8 flex items-center justify-between" style="padding:32px;min-height:300px">
              <div class="flex-col" style="max-width:400px">
                <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">auto_awesome</span>
                <h3 class="font-title" style="margin-bottom:8px">Algorithmic Triage</h3>
                <p class="font-body" style="color:var(--on-surface-variant)">Prioritize incoming tasks efficiently, ensuring high-value work surfaces immediately while noise is suppressed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer style="background:var(--surface-high);border-top:1px solid var(--outline-variant);padding:48px 0">
        <div class="container flex justify-between items-center" style="flex-wrap:wrap;gap:24px">
          <div class="flex-col gap-sm">
            <span class="font-title" style="color:var(--primary)">To-Doin</span>
            <span class="font-label" style="color:var(--on-surface-variant)">© 2026 To-Doin Enterprise. Semua hak dilindungi.</span>
          </div>
          <div class="flex gap-gutter" style="flex-wrap:wrap">
            <a href="#" class="font-label" style="color:var(--on-surface-variant)">Kebijakan Privasi</a>
            <a href="#" class="font-label" style="color:var(--on-surface-variant)">Syarat Layanan</a>
            <a href="#" class="font-label" style="color:var(--on-surface-variant)">Hubungi Kami</a>
          </div>
        </div>
      </footer>
    </main>
  `;
}
