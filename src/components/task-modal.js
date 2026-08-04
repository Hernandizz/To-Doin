// To-Doin — Task Modal Component
import { getState } from '../store.js';

export function renderTaskModal(task = null) {
  const { projects } = getState();
  const isEdit = !!task;

  const priorityOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'important', label: 'Penting' },
    { value: 'urgent', label: 'Mendesak' }
  ].map(opt => `
    <option value="${opt.value}" ${task?.priority === opt.value ? 'selected' : ''}>
      ${opt.label}
    </option>
  `).join('');

  const projectOptions = `
    <option value="">(Tanpa Proyek)</option>
    ${projects.map(p => `
      <option value="${p.id}" ${task?.projectId === p.id ? 'selected' : ''}>
        ${p.name}
      </option>
    `).join('')}
  `;

  return `
    <div class="modal-overlay" id="task-modal-overlay">
      <div class="modal-content" id="task-modal-content">
        <form id="task-form">
          <div class="modal-header">
            <h2 class="font-title">${isEdit ? 'Edit Tugas' : 'Tugas Baru'}</h2>
            <button type="button" class="btn-icon" id="btn-close-modal" aria-label="Tutup">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body flex-col gap-md">
            <div>
              <label class="input-label" for="task-title">Judul Tugas *</label>
              <input type="text" id="task-title" name="title" class="input" value="${task?.title || ''}" required autofocus placeholder="Apa yang ingin dikerjakan?" />
            </div>

            <div class="grid grid-cols-12 gap-sm">
              <div class="col-span-4">
                <label class="input-label" for="task-priority">Prioritas</label>
                <select id="task-priority" name="priority" class="input">
                  ${priorityOptions}
                </select>
              </div>
              <div class="col-span-4">
                <label class="input-label" for="task-date">Tanggal</label>
                <input type="date" id="task-date" name="dueDate" class="input" value="${task?.dueDate || ''}" />
              </div>
              <div class="col-span-4">
                <label class="input-label" for="task-time">Waktu (opsional)</label>
                <input type="time" id="task-time" name="dueTime" class="input" value="${task?.dueTime || ''}" />
              </div>
            </div>

            <div>
              <label class="input-label" for="task-project">Proyek</label>
              <select id="task-project" name="projectId" class="input">
                ${projectOptions}
              </select>
            </div>

            <div>
              <label class="input-label" for="task-notes">Catatan Tambahan</label>
              <textarea id="task-notes" name="notes" class="input" placeholder="Tambahkan deskripsi atau sub-tugas..." maxlength="2000">${task?.notes || ''}</textarea>
            </div>
            
            ${isEdit ? `<input type="hidden" name="id" value="${task.id}" />` : ''}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Tugas</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function attachTaskModalEvents(callbacks = {}) {
  const overlay = document.getElementById('task-modal-overlay');
  const closeBtn = document.getElementById('btn-close-modal');
  const cancelBtn = document.getElementById('btn-cancel-modal');
  const form = document.getElementById('task-form');

  function close() {
    overlay.remove();
  }

  // Auto-save typing for notes
  let timeoutId;
  const notesField = document.getElementById('task-notes');
  if (notesField && callbacks.onNotesAutoSave) {
    notesField.addEventListener('input', (e) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callbacks.onNotesAutoSave(e.target.value);
      }, 1000);
    });
  }

  closeBtn?.addEventListener('click', close);
  cancelBtn?.addEventListener('click', close);
  
  // Close on outside click
  overlay?.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
      title: formData.get('title'),
      priority: formData.get('priority'),
      dueDate: formData.get('dueDate') || null,
      dueTime: formData.get('dueTime') || null,
      projectId: formData.get('projectId') ? parseInt(formData.get('projectId')) : null,
      notes: formData.get('notes'),
      id: formData.get('id') ? parseInt(formData.get('id')) : undefined
    };
    
    if (callbacks.onSubmit) {
      callbacks.onSubmit(data);
    }
    close();
  });
}
