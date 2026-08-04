import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from './db.js';
import { JWT_SECRET, authMiddleware } from './middleware.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib diisi' });
    if (password.length < 6) return res.status(400).json({ error: 'Password minimal 6 karakter' });

    const db = await getDB();
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return res.status(400).json({ error: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, firstName || '', lastName || '']
    );

    const token = jwt.sign({ userId: result.lastID }, JWT_SECRET, { expiresIn: '30d' });

    await db.run('INSERT INTO projects (user_id, name, description, color) VALUES (?, ?, ?, ?)',
      [result.lastID, 'Pribadi', 'Tugas pribadi', '#3b82f6']
    );

    res.json({
      token,
      user: {
        id: result.lastID,
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        bio: '',
        theme: 'system',
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Gagal mendaftar' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib diisi' });

    const db = await getDB();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) return res.status(401).json({ error: 'Email atau password salah' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email atau password salah' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        theme: user.theme,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Gagal login' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const db = await getDB();
  const user = await db.get('SELECT id, email, first_name, last_name, bio, avatar_url, theme FROM users WHERE id = ?', [req.userId]);
  if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

  res.json({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    bio: user.bio,
    avatarUrl: user.avatar_url,
    theme: user.theme,
  });
});

router.put('/me', authMiddleware, async (req, res) => {
  const { firstName, lastName, bio, theme } = req.body;
  const db = await getDB();

  await db.run(
    'UPDATE users SET first_name = ?, last_name = ?, bio = ?, theme = ? WHERE id = ?',
    [firstName || '', lastName || '', bio || '', theme || 'system', req.userId]
  );

  res.json({ success: true });
});

export default router;
