// To-Doin — PDF Export Dialog Component
import { getState } from '../store.js';
import { pdf } from '../api.js';

export function renderPdfExportDialog() {
  const { projects } = getState();
  
  const projectOptions = `
    <option value="">Semua Proyek</option>
    ${projects.map(p => `
      <option value="${p.id}">${p.name}</option>
    `).join('')}
  `;

  return `
    <div class="modal-overlay" id="pdf-modal-overlay">
      <div class="modal-content" id="pdf-modal-content" style="max-width: 480px;">
        <form id="pdf-form">
          <div class="modal-header">
            <h2 class="font-title flex items-center gap-sm">
              <span class="material-symbols-outlined">print</span>
              Ekspor ke PDF
            </h2>
            <button type="button" class="btn-icon" id="btn-close-pdf" aria-label="Tutup">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body flex-col gap-md">
            <div>
              <label class="input-label" for="pdf-scope">Rentang Tugas</label>
              <select id="pdf-scope" name="scope" class="input">
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini</option>
                <option value="all">Semua Tugas Mendatang</option>
                <option value="custom">Kustom (Rentang Tanggal)</option>
              </select>
            </div>

            <div id="pdf-custom-date-group" class="grid grid-cols-12 gap-sm" style="display:none;">
              <div class="col-span-6">
                <label class="input-label" for="pdf-date-from">Dari</label>
                <input type="date" id="pdf-date-from" name="dateFrom" class="input" />
              </div>
              <div class="col-span-6">
                <label class="input-label" for="pdf-date-to">Sampai</label>
                <input type="date" id="pdf-date-to" name="dateTo" class="input" />
              </div>
            </div>

            <div>
              <label class="input-label" for="pdf-project">Filter Proyek</label>
              <select id="pdf-project" name="projectId" class="input">
                ${projectOptions}
              </select>
            </div>

            <div class="grid grid-cols-12 gap-sm">
              <div class="col-span-6">
                <label class="input-label" for="pdf-paper">Ukuran Kertas</label>
                <select id="pdf-paper" name="paperSize" class="input">
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                </select>
              </div>
              <div class="col-span-6">
                <label class="input-label" for="pdf-orientation">Orientasi</label>
                <select id="pdf-orientation" name="orientation" class="input">
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>
            
            <p class="font-body-sm" style="color:var(--on-surface-variant);margin-top:8px">
              PDF akan dihasilkan dengan tata letak siap cetak (checkbox manual dan ruang kosong untuk catatan tulisan tangan).
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-pdf">Batal</button>
            <button type="submit" class="btn btn-primary" id="btn-submit-pdf">Unduh PDF</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function attachPdfExportEvents() {
  const overlay = document.getElementById('pdf-modal-overlay');
  const closeBtn = document.getElementById('btn-close-pdf');
  const cancelBtn = document.getElementById('btn-cancel-pdf');
  const form = document.getElementById('pdf-form');
  const scopeSelect = document.getElementById('pdf-scope');
  const customDateGroup = document.getElementById('pdf-custom-date-group');
  const submitBtn = document.getElementById('btn-submit-pdf');

  function close() {
    overlay.remove();
  }

  closeBtn?.addEventListener('click', close);
  cancelBtn?.addEventListener('click', close);
  
  overlay?.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });

  scopeSelect?.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      customDateGroup.style.display = 'grid';
      document.getElementById('pdf-date-from').required = true;
      document.getElementById('pdf-date-to').required = true;
    } else {
      customDateGroup.style.display = 'none';
      document.getElementById('pdf-date-from').required = false;
      document.getElementById('pdf-date-to').required = false;
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Menyiapkan...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = {
      scope: formData.get('scope'),
      dateFrom: formData.get('dateFrom'),
      dateTo: formData.get('dateTo'),
      projectId: formData.get('projectId') ? parseInt(formData.get('projectId')) : null,
      orientation: formData.get('orientation'),
      paperSize: formData.get('paperSize'),
    };

    try {
      const blob = await pdf.export(data);
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `To-Doin_Tasks_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      close();
    } catch (err) {
      alert('Gagal mengekspor PDF: ' + err.message);
      submitBtn.textContent = 'Unduh PDF';
      submitBtn.disabled = false;
    }
  });
}
