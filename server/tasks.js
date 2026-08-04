import { Router } from 'express';
import { getDB } from './db.js';
import { authMiddleware } from './middleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { project_id, priority, date_from, date_to, completed } = req.query;
  const db = await getDB();

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
  if (date_from) {
    query += ' AND t.due_date >= ?';
    params.push(date_from);
  }
  if (date_to) {
    query += ' AND t.due_date <= ?';
    params.push(date_to);
  }
  if (completed !== undefined) {
    query += ' AND t.completed = ?';
    params.push(completed === 'true' ? 1 : 0);
  }

  query += ' ORDER BY t.completed ASC, CASE t.priority WHEN \'urgent\' THEN 0 WHEN \'important\' THEN 1 ELSE 2 END, t.due_date ASC NULLS LAST, t.created_at DESC';

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
  const { title, notes, priority, dueDate, dueTime, projectId, tags } = req.body;

  if (!title || !title.trim()) return res.status(400).json({ error: 'Judul tugas wajib diisi' });

  const db = await getDB();
  const result = await db.run(
    'INSERT INTO tasks (user_id, title, notes, priority, due_date, due_time, project_id, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.userId, title.trim(), notes || '', priority || 'normal', dueDate || null, dueTime || null, projectId || null, JSON.stringify(tags || [])]
  );

  const task = await db.get('SELECT t.*, p.name as project_name, p.color as project_color FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.id = ?', [result.lastID]);
  res.json(formatTask(task));
});

router.put('/:id', async (req, res) => {
  const { title, notes, priority, dueDate, dueTime, projectId, tags, completed } = req.body;
  const db = await getDB();

  const existing = await db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  if (!existing) return res.status(404).json({ error: 'Tugas tidak ditemukan' });

  const completedAt = completed && !existing.completed ? new Date().toISOString() : (completed ? existing.completed_at : null);

  await db.run(`
    UPDATE tasks SET
      title = COALESCE(?, title),
      notes = COALESCE(?, notes),
      priority = COALESCE(?, priority),
      due_date = ?,
      due_time = ?,
      project_id = ?,
      tags = COALESCE(?, tags),
      completed = COALESCE(?, completed),
      completed_at = ?
    WHERE id = ? AND user_id = ?
  `, [
    title, notes, priority,
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

  await db.run('UPDATE tasks SET completed = ?, completed_at = ? WHERE id = ?', [newCompleted, completedAt, req.params.id]);

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
  return {
    id: t.id,
    title: t.title,
    notes: t.notes,
    priority: t.priority,
    completed: !!t.completed,
    dueDate: t.due_date,
    dueTime: t.due_time,
    projectId: t.project_id,
    projectName: t.project_name || null,
    projectColor: t.project_color || null,
    tags: JSON.parse(t.tags || '[]'),
    createdAt: t.created_at,
    completedAt: t.completed_at,
  };
}

export default router;
