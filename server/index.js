import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import authRoutes from './auth.js';
import taskRoutes from './tasks.js';
import projectRoutes from './projects.js';
import pdfRoutes from './pdf.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize database
initDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✓ To-Doin API server running on http://localhost:${PORT}`);
});
