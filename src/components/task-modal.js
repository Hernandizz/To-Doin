// To-Doin — Task Modal Component
import { getState } from '../store.js';

export function renderTaskModal(task = null) {
  const { projects } = getState();
  const isEdit = !!task;

  const priorityOptions = [
    { value: 'urgent', label: 'High' },
    { value: 'important', label: 'Medium' },
    { value: 'normal', label: 'Low' },
    { value: 'not_set', label: 'Not set' }
  ].map(opt => `
    <option value="${opt.value}" ${(task?.priority || 'not_set') === opt.value ? 'selected' : ''}>
      ${opt.label}
    </option>
  `).join('');

  const categoryOptions = [
    'UXR', 'Research', 'Marketing', 'UI Design', 'Beta Testing', 'Big Picture'
  ].map(cat => `
    <option value="${cat}" ${(task?.listCategory || 'UXR') === cat ? 'selected' : ''}>
      ${cat}
    </option>
  `).join('');

  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'on_progress', label: 'In progress' },
    { value: 'in_review', label: 'In review' },
    { value: 'done', label: 'Done' }
  ].map(opt => `
    <option value="${opt.value}" ${(task?.status || 'backlog') === opt.value ? 'selected' : ''}>
      ${opt.label}
    </option>
  `).join('');

  const peopleStr = Array.isArray(task?.people) ? task.people.join(', ') : (task?.people || '');

  return `
    <div class="modal-overlay" id="task-modal-overlay">
      <div class="modal-content" id="task-modal-content">
        <form id="task-form">
          <div class="modal-header">
            <h2 class="font-title">${isEdit ? 'Edit Task' : 'New Task'}</h2>
            <button type="button" class="btn-icon" id="btn-close-modal" aria-label="Close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body flex-col gap-md">
            <div class="grid grid-cols-12 gap-sm">
              <div class="col-span-4">
                <label class="input-label" for="task-code">Task Code</label>
                <input type="text" id="task-code" name="taskCode" class="input" value="${task?.taskCode || ''}" placeholder="e.g. XY-473" />
              </div>
              <div class="col-span-8">
                <label class="input-label" for="task-title">Task Name *</label>
                <input type="text" id="task-title" name="title" class="input" value="${task?.title || ''}" required autofocus placeholder="Define User Personas" />
              </div>
            </div>

            <div class="grid grid-cols-12 gap-sm">
              <div class="col-span-6">
                <label class="input-label" for="task-status">Status</label>
                <select id="task-status" name="status" class="input">
                  ${statusOptions}
                </select>
              </div>
              <div class="col-span-6">
                <label class="input-label" for="task-category">List (Category)</label>
                <select id="task-category" name="listCategory" class="input">
                  ${categoryOptions}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-sm">
              <div class="col-span-4">
                <label class="input-label" for="task-priority">Priority</label>
                <select id="task-priority" name="priority" class="input">
                  ${priorityOptions}
                </select>
              </div>
              <div class="col-span-4">
                <label class="input-label" for="task-date">Due Date</label>
                <input type="date" id="task-date" name="dueDate" class="input" value="${task?.dueDate || ''}" />
              </div>
              <div class="col-span-4">
                <label class="input-label" for="task-people">Assignees</label>
                <input type="text" id="task-people" name="people" class="input" value="${peopleStr}" placeholder="Initials: UP, UX, UI" />
              </div>
            </div>

            <div>
              <label class="input-label" for="task-notes">Description</label>
              <textarea id="task-notes" name="notes" class="input" placeholder="Task details and scope..." maxlength="2000">${task?.notes || ''}</textarea>
            </div>
            
            ${isEdit ? `<input type="hidden" name="id" value="${task.id}" />` : ''}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Task</button>
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
    const peopleVal = formData.get('people') || '';
    const peopleArr = peopleVal ? peopleVal.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    const data = {
      title: formData.get('title'),
      taskCode: formData.get('taskCode') || '',
      listCategory: formData.get('listCategory') || 'UXR',
      status: formData.get('status') || 'backlog',
      priority: formData.get('priority') || 'not_set',
      people: peopleArr,
      dueDate: formData.get('dueDate') || null,
      notes: formData.get('notes'),
      id: formData.get('id') ? parseInt(formData.get('id')) : undefined
    };
    
    if (callbacks.onSubmit) {
      callbacks.onSubmit(data);
    }
    close();
  });
}
