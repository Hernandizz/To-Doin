import { renderSidebar, attachSidebarEvents } from '../components/sidebar.js';
import { renderTaskCard, attachTaskCardEvents } from '../components/task-card.js';
import { renderTaskModal, attachTaskModalEvents } from '../components/task-modal.js';
import { renderPdfExportDialog, attachPdfExportEvents } from '../components/pdf-export.js';
import { getState, setState, getTasksByPriority, getInboxTasks, getTodayTasks, getUpcomingTasks, showToast, getProjectById } from '../store.js';
import { tasks as tasksApi } from '../api.js';
import { attachNavbarEvents } from '../components/navbar.js';

export function renderInbox(appEl, appLayout, options = {}) {
  const { view = 'inbox', projectId = null } = options;
  
  setTimeout(() => {
    attachNavbarEvents();
    attachInboxEvents(view, projectId);
  }, 0);

  const { tasks } = getState();
  let displayTasks = [];
  let title = 'Inbox';
  let subtitle = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (view === 'inbox') {
    displayTasks = getInboxTasks(tasks);
  } else if (view === 'today') {
    displayTasks = getTodayTasks(tasks);
    title = 'Hari Ini';
  } else if (view === 'upcoming') {
    displayTasks = getUpcomingTasks(tasks);
    title = 'Mendatang';
  } else if (view === 'project') {
    const project = getProjectById(projectId);
    title = project ? project.name : 'Proyek';
    subtitle = project ? project.description : '';
    displayTasks = tasks.filter(t => t.projectId === projectId);
  }

  const grouped = getTasksByPriority(displayTasks);
  
  function renderSection(name, priority, tasksList) {
    if (tasksList.length === 0) return '';
    return `
      <div class="priority-section" id="section-${priority}">
        <div class="priority-section-header">
          <span class="material-symbols-outlined">expand_more</span>
          <h3 class="font-title" style="font-size:16px;color:var(--primary)">${name}</h3>
          <span class="font-label" style="color:var(--on-surface-variant);background:var(--surface-low);padding:2px 8px;border-radius:100px">${tasksList.length}</span>
        </div>
        <div class="priority-section-tasks">
          ${tasksList.map(t => renderTaskCard(t)).join('')}
        </div>
      </div>
    `;
  }

  const content = `
    ${renderSidebar()}
    <main class="app-main">
      <div class="container" style="max-width:800px;margin:0 auto">
        <header style="margin-bottom:32px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid var(--outline-variant);padding-bottom:16px">
          <div>
            <h1 class="font-display" style="font-size:40px;color:var(--primary)">${title}</h1>
            <p class="font-body" style="color:var(--on-surface-variant);margin-top:8px">${subtitle}</p>
          </div>
          <div class="flex items-center gap-sm">
            <button class="btn-icon" id="btn-export-pdf" title="Ekspor PDF">
              <span class="material-symbols-outlined">print</span>
            </button>
            <button class="btn-icon" title="Urutkan">
              <span class="material-symbols-outlined">sort</span>
            </button>
          </div>
        </header>

        <div class="task-list-container">
          ${renderSection('Mendesak', 'urgent', grouped.urgent)}
          ${renderSection('Penting', 'important', grouped.important)}
          ${renderSection('Normal', 'normal', grouped.normal)}
          
          ${displayTasks.length === 0 ? `
            <div class="text-center" style="padding:64px 0;color:var(--on-surface-variant)">
              <span class="material-symbols-outlined" style="font-size:48px;opacity:0.5;margin-bottom:16px">task</span>
              <p class="font-body">Tidak ada tugas di sini. Coba tambahkan tugas baru!</p>
            </div>
          ` : ''}
        </div>

        <div style="margin-top:32px;border-top:1px solid var(--outline-variant);padding-top:16px">
          <form id="quick-add-form" class="flex items-center gap-sm" style="padding:8px;opacity:0.6;transition:opacity 0.2s">
            <span class="material-symbols-outlined" style="color:var(--outline)">add</span>
            <input type="text" name="title" class="input" style="border:none;background:transparent;box-shadow:none;padding:0" placeholder="Tambahkan tugas baru..." required autocomplete="off" />
          </form>
        </div>
      </div>
    </main>
  `;

  appEl.innerHTML = appLayout(content);
}

function attachInboxEvents(view, projectId) {
  const refreshTasks = async () => {
    const list = await tasksApi.list();
    setState({ tasks: list });
    // Re-render handled by state subscription? No, we just re-call renderInbox for MVP simplicity.
    const appEl = document.getElementById('app');
    // Lazy reload
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  attachSidebarEvents({
    onAddTask: () => showTaskModal(),
  });

  attachTaskCardEvents(document.body, {
    onToggle: async (id) => {
      try {
        await tasksApi.toggle(id);
        await refreshTasks();
      } catch (err) {
        showToast('Gagal mengubah status tugas', 'error');
      }
    },
    onEdit: async (id) => {
      const task = getState().tasks.find(t => t.id === parseInt(id));
      if (task) showTaskModal(task);
    },
    onDelete: async (id) => {
      if (confirm('Hapus tugas ini?')) {
        try {
          await tasksApi.delete(id);
          showToast('Tugas dihapus', 'success');
          await refreshTasks();
        } catch (err) {
          showToast('Gagal menghapus tugas', 'error');
        }
      }
    }
  });

  // Collapsible sections
  document.querySelectorAll('.priority-section-header').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('collapsed');
    });
  });

  // Quick Add Form
  const quickAddForm = document.getElementById('quick-add-form');
  if (quickAddForm) {
    quickAddForm.addEventListener('focusin', () => quickAddForm.style.opacity = '1');
    quickAddForm.addEventListener('focusout', () => quickAddForm.style.opacity = '0.6');
    quickAddForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = quickAddForm.querySelector('input');
      const title = input.value;
      input.disabled = true;
      try {
        const payload = { title, priority: 'normal' };
        if (view === 'today') {
          payload.dueDate = new Date().toISOString().split('T')[0];
        }
        if (view === 'project' && projectId) {
          payload.projectId = projectId;
        }
        await tasksApi.create(payload);
        input.value = '';
        await refreshTasks();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        input.disabled = false;
        input.focus();
      }
    });
  }

  // Export PDF
  document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
    document.body.insertAdjacentHTML('beforeend', renderPdfExportDialog());
    attachPdfExportEvents();
  });

  // Task Modal flow
  function showTaskModal(task = null) {
    document.body.insertAdjacentHTML('beforeend', renderTaskModal(task));
    attachTaskModalEvents({
      onSubmit: async (data) => {
        try {
          if (data.id) {
            await tasksApi.update(data.id, data);
            showToast('Tugas diperbarui', 'success');
          } else {
            await tasksApi.create(data);
            showToast('Tugas berhasil dibuat', 'success');
          }
          await refreshTasks();
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
      onNotesAutoSave: async (val) => {
        // Auto-save implemented only for existing tasks
        if (task && task.id) {
          try {
            await tasksApi.update(task.id, { notes: val });
          } catch(e) {
            console.error('Auto-save failed', e);
          }
        }
      }
    });
  }
}
