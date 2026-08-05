import { Router } from 'express';
import { getDB } from './db.js';
import { authMiddleware } from './middleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { project_id, priority, date_from, date_to, completed } = req.query;
  const db = await getDB();

  // Reset or seed Starline AI Product Sprint items
  const countRes = await db.get('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?', [req.userId]);
  if (countRes && countRes.count < 10) {
    await db.run('DELETE FROM tasks WHERE user_id = ?', [req.userId]);
    
    const seedItems = [
      // Backlog
      { task_code: 'XY-473', title: 'Define User Personas', priority: 'urgent', list_category: 'UXR', due_date: '2026-05-15', status: 'backlog', people: ['UP', 'UX', 'UI'] },
      { task_code: 'AB-156', title: 'Evaluate Market Trends', priority: 'important', list_category: 'Research', due_date: '2026-05-16', status: 'backlog', people: ['MT', 'RS', 'MK'] },
      { task_code: 'QR-829', title: 'Gather User Feedback', priority: 'normal', list_category: 'UXR', due_date: '2026-05-17', status: 'backlog', people: ['FB', 'UX', 'CS'] },
      { task_code: 'LM-204', title: 'Optimize Content Strategy', priority: 'not_set', list_category: 'Marketing', due_date: null, status: 'backlog', people: ['CS', 'MK'] },
      { task_code: 'ST-890', title: 'Assess User Engagement', priority: 'not_set', list_category: 'UXR', due_date: null, status: 'backlog', people: ['UE', 'AN'] },
      
      // In progress
      { task_code: 'GH-312', title: 'Map User Journeys', priority: 'urgent', list_category: 'UXR', due_date: '2026-05-18', status: 'on_progress', people: ['UJ', 'UX', 'UI'] },
      { task_code: 'EF-920', title: 'Analyze Traffic Sources', priority: 'important', list_category: 'Marketing', due_date: null, status: 'on_progress', people: ['TS', 'AN'] },
      { task_code: 'YZ-456', title: 'Implement Analytics Tools', priority: 'important', list_category: 'Marketing', due_date: null, status: 'on_progress', people: ['AT', 'DEV'] },
      { task_code: 'CD-587', title: 'Conduct Usability Testing', priority: 'normal', list_category: 'UXR', due_date: '2026-05-19', status: 'on_progress', people: ['UT', 'UX', 'QA'] },
      { task_code: 'WX-123', title: 'Refine User Interface', priority: 'normal', list_category: 'UI Design', due_date: '2026-05-21', status: 'on_progress', people: ['UI', 'DES'] },
      { task_code: 'OP-789', title: 'Launch Beta Testing', priority: 'normal', list_category: 'Beta Testing', due_date: '2026-05-22', status: 'on_progress', people: ['BT', 'QA'] },
      
      // In review
      { task_code: 'JK-341', title: 'Create Wireframes', priority: 'urgent', list_category: 'UI Design', due_date: '2026-05-20', status: 'in_review', people: ['WF', 'DES'] },
      { task_code: 'UV-678', title: 'Run A/B Testing', priority: 'urgent', list_category: 'Beta Testing', due_date: '2026-05-23', status: 'in_review', people: ['AB', 'AN'] },
      { task_code: 'MN-045', title: 'Develop Feature Roadmap', priority: 'normal', list_category: 'Big Picture', due_date: '2026-05-24', status: 'in_review', people: ['FR', 'PM'] }
    ];

    for (const item of seedItems) {
      await db.run(
        'INSERT INTO tasks (user_id, task_code, title, priority, list_category, due_date, status, people, completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.userId, item.task_code, item.title, item.priority, item.list_category, item.due_date, item.status, JSON.stringify(item.people), item.status === 'done' ? 1 : 0]
      );
    }
  }

  let query = 'SELECT t.*, p.name as project_name, p.color as project_color FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.user_id = ?';
  const params = [req.userId];

  if (project_id) {
    query += ' AND t.project_id = ?';
    params.push(project_id);
  }
  if (priority) {
    query += ' AND t.priority = ?';
    params.push(priority);
  }

  query += ' ORDER BY CASE t.status WHEN \'backlog\' THEN 0 WHEN \'on_progress\' THEN 1 WHEN \'in_review\' THEN 2 ELSE 3 END, t.id ASC';

  const tasks = await db.all(query, params);
  res.json(tasks.map(formatTask));
});

router.get('/:id', async (req, res) => {
  const db = await getDB();
  const task = await db.get('SELECT t.*, p.name as project_name, p.color as project_color FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.id = ? AND t.user_id = ?', [req.params.id, req.userId]);

  if (!task) return res.status(404).json({ error: 'Tugas tidak ditemukan' });
  res.json(formatTask(task));
});

router.post('/', async (req, res) => {
  const { title, notes, priority, status, client, people, taskCode, listCategory, dueDate, dueTime, projectId, tags } = req.body;

  if (!title || !title.trim()) return res.status(400).json({ error: 'Judul tugas wajib diisi' });

  const generatedCode = taskCode || `TK-${Math.floor(100 + Math.random() * 900)}`;

  const db = await getDB();
  const result = await db.run(
    'INSERT INTO tasks (user_id, task_code, title, notes, priority, status, client, list_category, people, due_date, due_time, project_id, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      req.userId,
      generatedCode,
      title.trim(),
      notes || '',
      priority || 'normal',
      status || 'backlog',
      client || '',
      listCategory || 'UXR',
      JSON.stringify(people || []),
      dueDate || null,
      dueTime || null,
      projectId || null,
      JSON.stringify(tags || [])
    ]
  );

  const task = await db.get('SELECT t.*, p.name as project_name, p.color as project_color FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.id = ?', [result.lastID]);
  res.json(formatTask(task));
});

router.put('/:id', async (req, res) => {
  const { title, notes, priority, status, client, people, taskCode, listCategory, dueDate, dueTime, projectId, tags, completed } = req.body;
  const db = await getDB();

  const existing = await db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  if (!existing) return res.status(404).json({ error: 'Tugas tidak ditemukan' });

  const completedAt = completed && !existing.completed ? new Date().toISOString() : (completed ? existing.completed_at : null);

  await db.run(`
    UPDATE tasks SET
      title = COALESCE(?, title),
      notes = COALESCE(?, notes),
      priority = COALESCE(?, priority),
      status = COALESCE(?, status),
      client = COALESCE(?, client),
      task_code = COALESCE(?, task_code),
      list_category = COALESCE(?, list_category),
      people = COALESCE(?, people),
      due_date = ?,
      due_time = ?,
      project_id = ?,
      tags = COALESCE(?, tags),
      completed = COALESCE(?, completed),
      completed_at = ?
    WHERE id = ? AND user_id = ?
  `, [
    title, notes, priority, status, client, taskCode, listCategory,
    people !== undefined ? JSON.stringify(people) : null,
    dueDate !== undefined ? dueDate : existing.due_date,
    dueTime !== undefined ? dueTime : existing.due_time,
    projectId !== undefined ? projectId : existing.project_id,
    tags ? JSON.stringify(tags) : null,
    completed !== undefined ? (completed ? 1 : 0) : null,
    completedAt,
    req.params.id, req.userId
  ]);

  const task = await db.get('SELECT t.*, p.name as project_name, p.color as project_color FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.id = ?', [req.params.id]);
  res.json(formatTask(task));
});

router.patch('/:id/toggle', async (req, res) => {
  const db = await getDB();
  const task = await db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  if (!task) return res.status(404).json({ error: 'Tugas tidak ditemukan' });

  const newCompleted = task.completed ? 0 : 1;
  const completedAt = newCompleted ? new Date().toISOString() : null;
  const newStatus = newCompleted ? 'done' : (task.status === 'done' ? 'backlog' : task.status);

  await db.run('UPDATE tasks SET completed = ?, completed_at = ?, status = ? WHERE id = ?', [newCompleted, completedAt, newStatus, req.params.id]);

  const updated = await db.get('SELECT t.*, p.name as project_name, p.color as project_color FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.id = ?', [req.params.id]);
  res.json(formatTask(updated));
});

router.delete('/:id', async (req, res) => {
  const db = await getDB();
  const result = await db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  if (result.changes === 0) return res.status(404).json({ error: 'Tugas tidak ditemukan' });
  res.json({ success: true });
});

function formatTask(t) {
  let parsedPeople = [];
  try { parsedPeople = JSON.parse(t.people || '[]'); } catch(e) {}
  let parsedTags = [];
  try { parsedTags = JSON.parse(t.tags || '[]'); } catch(e) {}

  return {
    id: t.id,
    taskCode: t.task_code || `TK-${t.id}`,
    title: t.title,
    notes: t.notes,
    priority: t.priority || 'not_set',
    status: t.status || (t.completed ? 'done' : 'backlog'),
    client: t.client || '',
    listCategory: t.list_category || 'UXR',
    people: parsedPeople,
    completed: !!t.completed,
    dueDate: t.due_date,
    dueTime: t.due_time,
    projectId: t.project_id,
    projectName: t.project_name || null,
    projectColor: t.project_color || null,
    tags: parsedTags,
    createdAt: t.created_at,
    completedAt: t.completed_at,
  };
}

export default router;
