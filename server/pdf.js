import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { getDB } from './db.js';
import { authMiddleware } from './middleware.js';

const router = Router();
router.use(authMiddleware);

const PRIORITY_SYMBOLS = { urgent: '‼', important: '!', normal: '○' };
const PRIORITY_LABELS = { urgent: 'Mendesak', important: 'Penting', normal: 'Normal' };

router.post('/export', async (req, res) => {
  const { scope, dateFrom, dateTo, projectId, orientation, paperSize } = req.body;
  const db = await getDB();

  let query = 'SELECT t.*, p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.user_id = ?';
  const params = [req.userId];

  if (scope === 'today') {
    const today = new Date().toISOString().split('T')[0];
    query += ' AND t.due_date = ?';
    params.push(today);
  } else if (scope === 'week') {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    query += ' AND t.due_date >= ? AND t.due_date <= ?';
    params.push(startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]);
  } else if (dateFrom && dateTo) {
    query += ' AND t.due_date >= ? AND t.due_date <= ?';
    params.push(dateFrom, dateTo);
  }

  if (projectId) {
    query += ' AND t.project_id = ?';
    params.push(projectId);
  }

  query += ' ORDER BY CASE t.priority WHEN \'urgent\' THEN 0 WHEN \'important\' THEN 1 ELSE 2 END, t.due_date ASC NULLS LAST';

  const tasks = await db.all(query, params);
  const user = await db.get('SELECT first_name, last_name, email FROM users WHERE id = ?', [req.userId]);

  const isLandscape = orientation === 'landscape';
  const size = paperSize === 'letter' ? 'LETTER' : 'A4';

  const doc = new PDFDocument({
    size,
    layout: isLandscape ? 'landscape' : 'portrait',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: 'To-Doin — Daftar Tugas',
      Author: `${user.first_name} ${user.last_name}`.trim() || user.email,
    },
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=todoin-tasks.pdf');
  doc.pipe(res);

  const pageWidth = doc.page.width - 100;

  // Header
  doc.font('Helvetica-Bold').fontSize(22).text('To-Doin', { align: 'left' });
  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(10).fillColor('#76777d')
    .text(`Diekspor: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'left' });

  if (scope === 'today') doc.text('Scope: Hari Ini');
  else if (scope === 'week') doc.text('Scope: Minggu Ini');
  else doc.text('Scope: Semua Tugas');

  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(50 + pageWidth, doc.y).stroke('#c6c6cd');
  doc.moveDown(0.5);

  const grouped = { urgent: [], important: [], normal: [] };
  tasks.forEach(t => {
    grouped[t.priority] = grouped[t.priority] || [];
    grouped[t.priority].push(t);
  });

  for (const priority of ['urgent', 'important', 'normal']) {
    const group = grouped[priority];
    if (group.length === 0) continue;

    doc.fillColor('#191c1e').font('Helvetica-Bold').fontSize(14)
      .text(`${PRIORITY_SYMBOLS[priority]}  ${PRIORITY_LABELS[priority]}  (${group.length})`, 50);
    doc.moveDown(0.4);

    for (const task of group) {
      if (doc.y > doc.page.height - 120) doc.addPage();

      const startY = doc.y;
      doc.rect(55, startY + 2, 14, 14).stroke('#191c1e');
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#191c1e')
        .text(task.title, 80, startY, { width: pageWidth - 180 });

      if (task.due_date) {
        const dateStr = new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const timeStr = task.due_time || '';
        doc.font('Helvetica').fontSize(10).fillColor('#76777d')
          .text(`${dateStr} ${timeStr}`.trim(), 50 + pageWidth - 100, startY, { width: 100, align: 'right' });
      }

      if (task.project_name) {
        doc.font('Helvetica').fontSize(9).fillColor('#0058be')
          .text(`● ${task.project_name}`, 80, doc.y + 2);
      }

      doc.moveDown(0.3);
      const notesY = doc.y;
      for (let i = 0; i < 2; i++) {
        const lineY = notesY + i * 20;
        doc.moveTo(80, lineY).lineTo(50 + pageWidth - 10, lineY).stroke('#e0e3e5');
      }
      doc.y = notesY + 40;

      if (task.notes && task.notes.trim()) {
        doc.font('Helvetica').fontSize(9).fillColor('#76777d')
          .text(task.notes.substring(0, 150), 80, notesY + 2, { width: pageWidth - 90 });
      }
      doc.moveDown(0.5);
    }
    doc.moveDown(0.5);
  }

  if (tasks.length === 0) {
    doc.font('Helvetica').fontSize(14).fillColor('#76777d').text('Tidak ada tugas untuk diekspor.', { align: 'center' });
  }

  doc.moveDown(2);
  doc.font('Helvetica').fontSize(8).fillColor('#c6c6cd')
    .text('Dibuat dengan To-Doin — todoin.app', 50, doc.page.height - 40, { align: 'center', width: pageWidth });

  doc.end();
});

export default router;
