// To-Doin — Task Card Component

export function renderTaskCard(task) {
  const isOverdue = task.dueDate && task.dueDate < new Date().toISOString().split('T')[0] && !task.completed;
  const completedClass = task.completed ? 'completed' : '';
  const titleClass = task.completed ? 'completed' : '';

  let dateLabel = '';
  if (task.dueDate) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (task.dueDate === today) dateLabel = 'Hari Ini';
    else if (task.dueDate === tomorrow) dateLabel = 'Besok';
    else if (task.dueDate === yesterday) dateLabel = 'Kemarin';
    else {
      dateLabel = new Date(task.dueDate + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }

    if (task.dueTime) {
      dateLabel += ` ${task.dueTime}`;
    }
  }

  const dateColorClass = isOverdue ? 'color:var(--error)' : (task.dueDate === new Date().toISOString().split('T')[0] ? 'color:var(--secondary)' : 'color:var(--outline)');

  return `
    <div class="task-row ${completedClass}" data-task-id="${task.id}">
      <div style="margin-top:2px">
        <button class="task-checkbox ${task.completed ? 'checked' : ''}" data-priority="${task.priority}" data-task-toggle="${task.id}" title="Tandai selesai">
          ${task.completed ? '<span class="material-symbols-outlined check-icon" style="font-size:16px">check</span>' : ''}
        </button>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-sm">
          <h3 class="font-body task-title ${titleClass}" style="font-weight:500;color:var(--primary)">
            ${task.title}
            <span class="strike-line"></span>
          </h3>
          <div class="task-actions">
            <button class="btn-ghost" data-task-edit="${task.id}" title="Edit" style="padding:4px">
              <span class="material-symbols-outlined icon-sm">edit</span>
            </button>
            <button class="btn-ghost" data-task-delete="${task.id}" title="Hapus" style="padding:4px;color:var(--error)">
              <span class="material-symbols-outlined icon-sm">delete</span>
            </button>
          </div>
        </div>
        ${task.notes ? `<p class="font-body-sm truncate" style="color:var(--on-surface-variant);margin-top:4px">${task.notes.substring(0, 120)}</p>` : ''}
        <div class="flex items-center gap-sm" style="margin-top:8px;flex-wrap:wrap">
          ${dateLabel ? `
            <span class="font-label-normal flex items-center gap-sm" style="${dateColorClass};${isOverdue ? 'background:var(--priority-urgent-bg);padding:2px 8px;border-radius:4px' : ''}">
              <span class="material-symbols-outlined icon-xs">calendar_today</span>
              ${dateLabel}
            </span>
          ` : ''}
          ${task.projectName ? `
            <span class="font-label-normal flex items-center gap-sm" style="color:var(--on-surface-variant)">
              <span class="tag-dot" style="background:${task.projectColor || 'var(--secondary)'}"></span>
              ${task.projectName}
            </span>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

export function attachTaskCardEvents(container, callbacks = {}) {
  // Toggle completion
  container.querySelectorAll('[data-task-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.taskToggle;
      if (callbacks.onToggle) callbacks.onToggle(id);
    });
  });

  // Edit
  container.querySelectorAll('[data-task-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.taskEdit;
      if (callbacks.onEdit) callbacks.onEdit(id);
    });
  });

  // Delete
  container.querySelectorAll('[data-task-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.taskDelete;
      if (callbacks.onDelete) callbacks.onDelete(id);
    });
  });
}
