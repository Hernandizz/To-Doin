import { getState, setState, getTasksByStatus, showToast } from '../store.js';
import { renderSidebar, attachSidebarEvents } from '../components/sidebar.js';
import { renderNavbar, attachNavbarEvents } from '../components/navbar.js';
import { renderTaskModal, attachTaskModalEvents } from '../components/task-modal.js';
import { tasks as tasksApi } from '../api.js';

let activeView = 'list'; // 'list' | 'kanban' | 'gantt' | 'calendar' | 'dashboard'
let searchQuery = '';
let filterPriority = 'all';

export function renderProjects(appEl, appLayout) {
  setTimeout(() => {
    attachNavbarEvents();
    attachProjectsEvents();
  }, 0);

  const { tasks } = getState();

  // Filter tasks by search query & priority
  let filteredTasks = tasks.filter(t => {
    const matchesSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.taskCode && t.taskCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.listCategory && t.listCategory.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const grouped = getTasksByStatus(filteredTasks);

  const content = `
    ${renderSidebar()}
    <main class="app-main starline-main">
      <div class="starline-workspace-container">
        
        <!-- Views Toolbar & Action Controls Header -->
        <div class="starline-toolbar flex items-center justify-between">
          <!-- View Tabs (Left) -->
          <div class="starline-view-tabs flex items-center gap-xs">
            <button class="starline-tab ${activeView === 'list' ? 'active' : ''}" data-view="list">
              <span class="material-symbols-outlined icon-xs">format_list_bulleted</span>
              <span>List</span>
            </button>
            <button class="starline-tab ${activeView === 'kanban' ? 'active' : ''}" data-view="kanban">
              <span class="material-symbols-outlined icon-xs">view_kanban</span>
              <span>Kanban</span>
            </button>
            <button class="starline-tab ${activeView === 'gantt' ? 'active' : ''}" data-view="gantt">
              <span class="material-symbols-outlined icon-xs">reorder</span>
              <span>Gantt</span>
            </button>
            <button class="starline-tab ${activeView === 'calendar' ? 'active' : ''}" data-view="calendar">
              <span class="material-symbols-outlined icon-xs">calendar_month</span>
              <span>Calendar</span>
            </button>
            <button class="starline-tab ${activeView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
              <span class="material-symbols-outlined icon-xs">space_dashboard</span>
              <span>Dashboard</span>
            </button>
            <button class="starline-tab-add" title="Add View">
              <span class="material-symbols-outlined icon-xs">add</span>
              <span>View</span>
            </button>
          </div>

          <!-- Controls (Right) -->
          <div class="flex items-center gap-xs">
            <div class="starline-ctrl-btn flex items-center gap-2xs cursor-pointer" id="btn-group-by">
              <span class="material-symbols-outlined icon-xs">tag</span>
              <span>Group by Status</span>
            </div>
            <div class="starline-ctrl-btn flex items-center gap-2xs cursor-pointer" id="btn-sort">
              <span class="material-symbols-outlined icon-xs">swap_vert</span>
              <span>Sort</span>
            </div>
            <div class="starline-ctrl-btn flex items-center gap-2xs cursor-pointer">
              <span class="material-symbols-outlined icon-xs">tune</span>
              <span>View</span>
            </div>
            <div class="starline-ctrl-btn flex items-center gap-2xs cursor-pointer" id="btn-filter-toggle">
              <span class="material-symbols-outlined icon-xs">filter_list</span>
              <span>Filter</span>
            </div>
            <div class="starline-ctrl-btn icon-only" title="Search">
              <span class="material-symbols-outlined icon-xs">search</span>
            </div>
          </div>
        </div>

        <!-- Main View Area -->
        <div class="starline-view-content mt-xs">
          ${activeView === 'list' ? renderListView(grouped) : ''}
          ${activeView === 'kanban' ? renderKanbanView(grouped) : ''}
          ${activeView === 'gantt' ? renderGanttView(filteredTasks) : ''}
          ${activeView === 'calendar' ? renderCalendarView(filteredTasks) : ''}
          ${activeView === 'dashboard' ? renderDashboardView(filteredTasks) : ''}
        </div>

      </div>
    </main>
  `;

  appEl.innerHTML = appLayout(content);
}

// ----------------------------------------------------
// 1. LIST VIEW (Exact Grouped Table from Stacks Mockup)
// ----------------------------------------------------
function renderListView(grouped) {
  const sections = [
    { key: 'backlog', title: 'Backlog', bannerClass: 'group-banner-gray', dotClass: 'dot-gray', items: grouped.backlog || [] },
    { key: 'on_progress', title: 'In progress', bannerClass: 'group-banner-amber', dotClass: 'dot-amber', items: grouped.on_progress || [] },
    { key: 'in_review', title: 'In review', bannerClass: 'group-banner-mint', dotClass: 'dot-mint', items: grouped.in_review || [] },
    { key: 'done', title: 'Done', bannerClass: 'group-banner-gray', dotClass: 'dot-gray', items: grouped.done || [] }
  ];

  return `
    <div class="starline-list-wrapper flex-col gap-sm">
      ${sections.filter(s => s.items.length > 0 || s.key !== 'done').map(sec => `
        <div class="starline-group-section">
          <!-- Tinted Group Status Banner Header -->
          <div class="starline-group-banner ${sec.bannerClass} flex items-center justify-between">
            <div class="flex items-center gap-xs">
              <span class="status-dot ${sec.dotClass}"></span>
              <span class="group-title">${sec.title}</span>
              <span class="group-count-badge">${sec.items.length}</span>
            </div>
            <div class="flex items-center gap-2xs">
              <span class="material-symbols-outlined icon-2xs text-muted cursor-pointer">more_horiz</span>
              <span class="material-symbols-outlined icon-2xs text-muted cursor-pointer btn-add-group-item" data-status="${sec.key}">add</span>
            </div>
          </div>

          <!-- Table Items -->
          <table class="starline-table">
            <thead>
              <tr>
                <th style="width:50%">Name <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
                <th style="width:12%">Priority <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
                <th style="width:12%">List <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
                <th style="width:14%">Due date <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
                <th style="width:12%">Assignee <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
              </tr>
            </thead>
            <tbody>
              ${sec.items.map(t => renderTableRow(t)).join('')}
            </tbody>
          </table>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTableRow(task) {
  // Format priority badge
  let priorityClass = 'badge-priority-notset';
  let priorityLabel = 'Not set';
  if (task.priority === 'urgent') { priorityClass = 'badge-priority-high'; priorityLabel = 'High'; }
  else if (task.priority === 'important') { priorityClass = 'badge-priority-medium'; priorityLabel = 'Medium'; }
  else if (task.priority === 'normal') { priorityClass = 'badge-priority-low'; priorityLabel = 'Low'; }

  // Format Due Date (e.g., Mon, 15 May 2026)
  let dateText = '📅 Add date';
  let isHasDate = false;
  if (task.dueDate) {
    try {
      const d = new Date(task.dueDate);
      dateText = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      isHasDate = true;
    } catch(e) { dateText = task.dueDate; }
  }

  // Format Assignee Avatar Stack
  const people = Array.isArray(task.people) && task.people.length > 0 ? task.people : ['UX', 'UI'];
  const avatarStack = people.map((p, idx) => `
    <span class="gradient-avatar avatar-sm avatar-grad-${idx % 4}">${p}</span>
  `).join('');

  return `
    <tr class="starline-row" data-id="${task.id}">
      <td class="cell-name">
        <div class="flex items-center gap-xs">
          <span class="task-code-key">${task.taskCode || `TK-${task.id}`}</span>
          <span class="task-title-text editable-title font-weight-600" data-id="${task.id}">${task.title}</span>
        </div>
      </td>
      <td class="cell-priority">
        <span class="starline-priority-pill ${priorityClass}">${priorityLabel}</span>
      </td>
      <td class="cell-list">
        <div class="flex items-center gap-2xs text-muted font-size-13">
          <span class="material-symbols-outlined icon-2xs">reorder</span>
          <span>${task.listCategory || 'UXR'}</span>
        </div>
      </td>
      <td class="cell-date ${isHasDate ? 'text-dark' : 'text-muted-placeholder'} font-size-13">
        ${dateText}
      </td>
      <td class="cell-assignee">
        <div class="avatar-stack-overlapping">
          ${avatarStack}
        </div>
      </td>
    </tr>
  `;
}

// ----------------------------------------------------
// 2. KANBAN VIEW
// ----------------------------------------------------
function renderKanbanView(grouped) {
  const columns = [
    { key: 'backlog', title: 'Backlog', color: '#94a3b8', items: grouped.backlog || [] },
    { key: 'on_progress', title: 'In progress', color: '#f59e0b', items: grouped.on_progress || [] },
    { key: 'in_review', title: 'In review', color: '#a855f7', items: grouped.in_review || [] },
    { key: 'done', title: 'Done', color: '#22c55e', items: grouped.done || [] }
  ];

  return `
    <div class="kanban-grid grid grid-cols-4 gap-md">
      ${columns.map(col => `
        <div class="kanban-column" style="border-top: 3px solid ${col.color}">
          <div class="kanban-column-header flex items-center justify-between mb-xs">
            <span class="font-weight-600 font-size-13">${col.title} <span class="count-pill">${col.items.length}</span></span>
            <span class="material-symbols-outlined icon-xs text-muted cursor-pointer btn-add-group-item" data-status="${col.key}">add</span>
          </div>
          <div class="kanban-cards flex-col gap-xs">
            ${col.items.map(t => renderKanbanCard(t)).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderKanbanCard(task) {
  let priorityClass = task.priority === 'urgent' ? 'badge-priority-high' : (task.priority === 'important' ? 'badge-priority-medium' : 'badge-priority-low');
  let priorityLabel = task.priority === 'urgent' ? 'High' : (task.priority === 'important' ? 'Medium' : 'Low');

  return `
    <div class="starline-kanban-card" data-id="${task.id}">
      <div class="flex justify-between items-center mb-2xs">
        <span class="task-code-key">${task.taskCode || `TK-${task.id}`}</span>
        <span class="starline-priority-pill ${priorityClass}">${priorityLabel}</span>
      </div>
      <div class="font-weight-600 font-size-13 text-dark mb-xs">${task.title}</div>
      <div class="flex justify-between items-center text-xs text-muted pt-2xs border-top">
        <span>${task.listCategory || 'UXR'}</span>
        <span>${task.dueDate || 'No date'}</span>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 3. GANTT CHART VIEW
// ----------------------------------------------------
function renderGanttView(tasks) {
  return `
    <div class="gantt-wrapper p-md bg-white border-radius-12 border-subtle">
      <div class="flex justify-between items-center mb-md border-bottom pb-xs">
        <div class="font-weight-700 font-size-16">Sprint Timeline — May 2026</div>
        <div class="flex items-center gap-xs font-size-13 text-muted">
          <span>May 15</span> <span>➔</span> <span>May 30, 2026</span>
        </div>
      </div>

      <div class="gantt-rows flex-col gap-sm">
        ${tasks.slice(0, 8).map((t, idx) => `
          <div class="gantt-row flex items-center">
            <div class="gantt-task-name" style="width:200px">
              <span class="task-code-key mr-2xs">${t.taskCode}</span>
              <span class="font-size-13 font-weight-600 text-dark">${t.title}</span>
            </div>
            <div class="gantt-timeline-track flex-1 relative bg-light py-2xs border-radius-6">
              <div class="gantt-bar gantt-color-${idx % 3}" style="margin-left: ${idx * 8}%; width: ${30 + (idx % 3) * 15}%">
                <span class="gantt-bar-label">${t.listCategory || 'UXR'}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 4. CALENDAR VIEW
// ----------------------------------------------------
function renderCalendarView(tasks) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const gridCells = Array.from({ length: 35 }, (_, i) => {
    const dayNum = (i % 31) + 1;
    const dateStr = `2026-05-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);

    return `
      <div class="calendar-day-cell">
        <div class="calendar-day-number">${dayNum}</div>
        <div class="calendar-day-tasks flex-col gap-2xs mt-2xs">
          ${dayTasks.map(t => `
            <div class="starline-cal-pill truncate" data-id="${t.id}">${t.taskCode}: ${t.title}</div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="calendar-container">
      <div class="calendar-week-header grid grid-cols-7 text-center font-weight-600 py-xs border-bottom">
        ${days.map(d => `<div>${d}</div>`).join('')}
      </div>
      <div class="calendar-grid grid grid-cols-7 gap-xs mt-xs">
        ${gridCells}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 5. DASHBOARD VIEW
// ----------------------------------------------------
function renderDashboardView(tasks) {
  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'on_progress').length;
  const inReview = tasks.filter(t => t.status === 'in_review').length;
  const backlog = tasks.filter(t => t.status === 'backlog').length;

  return `
    <div class="dashboard-grid grid grid-cols-4 gap-md">
      <div class="dash-card">
        <div class="text-muted font-size-12">Total Tasks</div>
        <div class="font-weight-800 font-size-24 text-dark mt-2xs">${total}</div>
        <div class="text-success font-size-12 mt-xs">↑ 14 items in sprint</div>
      </div>
      <div class="dash-card">
        <div class="text-muted font-size-12">In Progress</div>
        <div class="font-weight-800 font-size-24 text-amber mt-2xs">${inProgress}</div>
        <div class="text-muted font-size-12 mt-xs">Active development</div>
      </div>
      <div class="dash-card">
        <div class="text-muted font-size-12">In Review</div>
        <div class="font-weight-800 font-size-24 text-purple mt-2xs">${inReview}</div>
        <div class="text-muted font-size-12 mt-xs">QA & Usability</div>
      </div>
      <div class="dash-card">
        <div class="text-muted font-size-12">Backlog</div>
        <div class="font-weight-800 font-size-24 text-muted mt-2xs">${backlog}</div>
        <div class="text-muted font-size-12 mt-xs">Planned tasks</div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// EVENT HANDLERS
// ----------------------------------------------------
function attachProjectsEvents() {
  const refresh = async () => {
    const list = await tasksApi.list();
    setState({ tasks: list });
    const appEl = document.getElementById('app');
    renderProjects(appEl, (c) => `
      <div class="flex flex-col min-h-screen">
        ${renderNavbar()}
        <div class="app-layout">${c}</div>
      </div>
    `);
  };

  attachSidebarEvents();

  // Listen to open-new-task-modal
  window.addEventListener('open-new-task-modal', () => showTaskModal());

  // View tabs toggle
  document.querySelectorAll('.starline-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeView = btn.dataset.view;
      refresh();
    });
  });

  // Group by status toggle
  document.getElementById('btn-group-by')?.addEventListener('click', () => {
    showToast('Grouped by Status', 'info');
  });

  // Filter toggle
  document.getElementById('btn-filter-toggle')?.addEventListener('click', () => {
    const priority = prompt('Filter by Priority: "urgent", "important", "normal", "not_set", or "all"', filterPriority);
    if (priority !== null) {
      filterPriority = priority.trim() || 'all';
      refresh();
    }
  });

  // Add Task to group
  document.querySelectorAll('.btn-add-group-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const status = btn.dataset.status;
      showTaskModal({ status });
    });
  });

  // Task click / Edit
  document.querySelectorAll('.editable-title, .starline-kanban-card, .starline-cal-pill').forEach(el => {
    el.addEventListener('click', async (e) => {
      const id = el.dataset.id || el.closest('[data-id]')?.dataset.id;
      if (id) {
        const task = getState().tasks.find(t => t.id === parseInt(id));
        if (task) showTaskModal(task);
      }
    });
  });

  // Task Modal helper
  function showTaskModal(initialData = null) {
    document.body.insertAdjacentHTML('beforeend', renderTaskModal(initialData));
    attachTaskModalEvents({
      onSubmit: async (data) => {
        try {
          if (data.id) {
            await tasksApi.update(data.id, data);
            showToast('Task updated', 'success');
          } else {
            await tasksApi.create(data);
            showToast('Task created', 'success');
          }
          await refresh();
        } catch(err) {
          showToast(err.message, 'error');
        }
      }
    });
  }
}
