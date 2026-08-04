import { renderSidebar, attachSidebarEvents } from '../components/sidebar.js';
import { getState, getTasksForDate } from '../store.js';
import { attachNavbarEvents } from '../components/navbar.js';
import { renderTaskModal, attachTaskModalEvents } from '../components/task-modal.js';
import { tasks as tasksApi } from '../api.js';

export function renderCalendar(appEl, appLayout) {
  setTimeout(() => {
    attachNavbarEvents();
    attachSidebarEvents();
    attachCalendarEvents();
  }, 0);

  const { tasks } = getState();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Calculate calendar grid
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Make Monday 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const monthName = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const todayStr = new Date().toISOString().split('T')[0];

  let cellsHTML = '';
  
  // Previous month days
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    cellsHTML += `<div class="calendar-cell other-month"><span class="calendar-date">${daysInPrevMonth - i}</span></div>`;
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayTasks = getTasksForDate(tasks, dateStr);
    const isToday = dateStr === todayStr;
    
    let taskDots = dayTasks.slice(0, 3).map(t => `<span class="calendar-task-dot" style="background:${t.projectColor || 'var(--secondary)'}"></span>`).join('');
    if (dayTasks.length > 3) taskDots += `<span class="font-label" style="font-size:10px">+${dayTasks.length - 3}</span>`;
    
    cellsHTML += `
      <div class="calendar-cell ${isToday ? 'today' : ''}" data-date="${dateStr}">
        <div class="calendar-date">${i}</div>
        <div class="flex items-center" style="margin-top:4px">${taskDots}</div>
      </div>
    `;
  }

  // Next month days to fill grid (42 cells total)
  const totalCells = adjustedFirstDay + daysInMonth;
  const remainingCells = 42 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    cellsHTML += `<div class="calendar-cell other-month"><span class="calendar-date">${i}</span></div>`;
  }

  const content = `
    ${renderSidebar()}
    <main class="app-main flex-1 flex-col" style="padding:var(--margin-desktop)">
      <header class="flex justify-between items-center" style="margin-bottom:24px">
        <h1 class="font-display" style="font-size:32px;color:var(--primary)">${monthName}</h1>
        <div class="flex items-center gap-sm">
          <button class="btn-icon"><span class="material-symbols-outlined">chevron_left</span></button>
          <button class="btn btn-secondary">Hari Ini</button>
          <button class="btn-icon"><span class="material-symbols-outlined">chevron_right</span></button>
        </div>
      </header>
      
      <div class="calendar-grid" style="flex:1;min-height:500px">
        <div class="calendar-header-cell">Sen</div>
        <div class="calendar-header-cell">Sel</div>
        <div class="calendar-header-cell">Rab</div>
        <div class="calendar-header-cell">Kam</div>
        <div class="calendar-header-cell">Jum</div>
        <div class="calendar-header-cell">Sab</div>
        <div class="calendar-header-cell">Min</div>
        ${cellsHTML}
      </div>
    </main>
  `;

  appEl.innerHTML = appLayout(content);
}

function attachCalendarEvents() {
  document.querySelectorAll('.calendar-cell[data-date]').forEach(cell => {
    cell.addEventListener('click', () => {
      const date = cell.dataset.date;
      document.body.insertAdjacentHTML('beforeend', renderTaskModal({ dueDate: date, priority: 'normal' }));
      attachTaskModalEvents({
        onSubmit: async (data) => {
          await tasksApi.create(data);
          // Reload view
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
      });
    });
  });
}
