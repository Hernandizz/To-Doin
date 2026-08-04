import { Router } from 'express';
import { getDB } from './db.js';
import { authMiddleware } from './middleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const db = await getDB();
  const projects = await db.all('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at ASC', [req.userId]);

  const counts = await db.all(`
    SELECT project_id,
      COUNT(*) as total,
      SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
    FROM tasks WHERE user_id = ? AND project_id IS NOT NULL
    GROUP BY project_id
  `, [req.userId]);

  const countMap = {};
  counts.forEach(c => { countMap[c.project_id] = { total: c.total, completed: c.completed }; });

  res.json(projects.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    color: p.color,
    icon: p.icon,
    totalTasks: countMap[p.id]?.total || 0,
    completedTasks: countMap[p.id]?.completed || 0,
    createdAt: p.created_at,
  })));
});

router.post('/', async (req, res) => {
  const { name, description, color, icon } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Nama proyek wajib diisi' });

  const db = await getDB();
  const result = await db.run('INSERT INTO projects (user_id, name, description, color, icon) VALUES (?, ?, ?, ?, ?)',
    [req.userId, name.trim(), description || '', color || '#3b82f6', icon || 'folder']
  );

  res.json({
    id: result.lastID,
    name: name.trim(),
    description: description || '',
    color: color || '#3b82f6',
    icon: icon || 'folder',
    totalTasks: 0,
    completedTasks: 0,
  });
});

router.put('/:id', async (req, res) => {
  const { name, description, color, icon } = req.body;
  const db = await getDB();

  const existing = await db.get('SELECT * FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  if (!existing) return res.status(404).json({ error: 'Proyek tidak ditemukan' });

  await db.run('UPDATE projects SET name = ?, description = ?, color = ?, icon = ? WHERE id = ?',
    [name || existing.name, description ?? existing.description, color || existing.color, icon || existing.icon, req.params.id]
  );

  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const db = await getDB();
  const result = await db.run('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  if (result.changes === 0) return res.status(404).json({ error: 'Proyek tidak ditemukan' });
  res.json({ success: true });
});

export default router;
