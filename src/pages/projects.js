import { getState } from '../store.js';
import { attachNavbarEvents } from '../components/navbar.js';

export function renderProjects(appEl, appLayout) {
  setTimeout(() => {
    attachNavbarEvents();
  }, 0);

  const { projects } = getState();

  const projectCards = projects.map(p => {
    const total = p.totalTasks || 0;
    const completed = p.completedTasks || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return `
      <div class="card" style="padding:24px;display:flex;flex-direction:column;gap:16px;cursor:pointer" onclick="location.hash='#/project/${p.id}'">
        <div class="flex justify-between items-start">
          <div>
            <div class="inline-flex items-center gap-sm font-label" style="background:var(--surface-container);padding:2px 8px;border-radius:4px;color:var(--on-surface-variant);margin-bottom:8px">
              <span class="material-symbols-outlined icon-xs" style="color:${p.color}">${p.icon}</span>
              Proyek
            </div>
            <h3 class="font-title" style="color:var(--primary);font-size:18px">${p.name}</h3>
          </div>
          <button class="btn-icon" style="border:none" aria-label="Opsi">
            <span class="material-symbols-outlined">more_vert</span>
          </button>
        </div>
        
        <p class="font-body-sm" style="color:var(--on-surface-variant);min-height:42px">${p.description || 'Tidak ada deskripsi.'}</p>
        
        <div>
          <div class="flex justify-between font-label" style="margin-bottom:8px;color:var(--primary)">
            <span>Progress</span>
            <span>${percentage}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${percentage}%;background-color:${p.color}"></div>
          </div>
        </div>
        
        <div class="flex justify-between items-center" style="margin-top:auto;padding-top:16px;border-top:1px solid var(--outline-variant)">
          <div class="font-label" style="color:var(--on-surface-variant)">
            <span class="material-symbols-outlined icon-xs" style="vertical-align:bottom">task_alt</span>
            ${completed}/${total} Tugas
          </div>
        </div>
      </div>
    `;
  }).join('');

  const content = `
    <main class="app-main" style="margin:0 auto;max-width:var(--container-max)">
      <header class="flex justify-between items-center" style="margin-bottom:32px">
        <div>
          <h1 class="font-display" style="font-size:32px;color:var(--primary)">Daftar Proyek</h1>
          <p class="font-body" style="color:var(--on-surface-variant)">Overview semua proyek, pelacakan progress, dan tugas.</p>
        </div>
        <div class="flex items-center gap-sm">
          <div class="relative">
            <span class="material-symbols-outlined" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--outline)">search</span>
            <input type="text" class="input" placeholder="Cari proyek..." style="padding-left:40px;width:260px" />
          </div>
          <button class="btn btn-primary">
            <span class="material-symbols-outlined icon-sm">add</span> New Project
          </button>
        </div>
      </header>
      
      <div class="grid grid-cols-3 gap-gutter">
        ${projectCards}
      </div>
    </main>
  `;

  appEl.innerHTML = appLayout(content);
}
