import { auth, setToken } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../store.js';
import { renderNavbar, attachNavbarEvents } from '../components/navbar.js';

export function renderAuth(isRegister = false) {
  setTimeout(() => {
    attachNavbarEvents();
    const form = document.getElementById('auth-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const btn = form.querySelector('button[type="submit"]');
        const ogText = btn.textContent;
        btn.textContent = 'Memproses...';
        btn.disabled = true;

        try {
          let res;
          if (isRegister) {
            res = await auth.register(data);
          } else {
            res = await auth.login(data);
          }
          setToken(res.token);
          navigate('/inbox');
        } catch (err) {
          showToast(err.message, 'error');
          btn.textContent = ogText;
          btn.disabled = false;
        }
      });
    }
  }, 0);

  return `
    <div class="flex-col min-h-screen">
      ${renderNavbar()}
      <div class="auth-container">
        <div class="auth-card">
          <div class="text-center" style="margin-bottom:32px">
            <h1 class="font-headline" style="color:var(--primary);margin-bottom:8px">
              ${isRegister ? 'Buat Akun' : 'Selamat Datang Kembali'}
            </h1>
            <p class="font-body" style="color:var(--on-surface-variant)">
              ${isRegister ? 'Mulai kelola tugasmu dengan lebih efisien.' : 'Masuk untuk mengakses tugas-tugasmu.'}
            </p>
          </div>

          <form id="auth-form" class="flex-col gap-md">
            ${isRegister ? `
              <div class="grid grid-cols-12 gap-sm">
                <div class="col-span-6">
                  <label class="input-label" for="firstName">Nama Depan</label>
                  <input type="text" id="firstName" name="firstName" class="input" required />
                </div>
                <div class="col-span-6">
                  <label class="input-label" for="lastName">Nama Belakang</label>
                  <input type="text" id="lastName" name="lastName" class="input" />
                </div>
              </div>
            ` : ''}
            <div>
              <label class="input-label" for="email">Email</label>
              <input type="email" id="email" name="email" class="input" required autofocus />
            </div>
            <div>
              <label class="input-label" for="password">Password</label>
              <input type="password" id="password" name="password" class="input" required minlength="6" />
            </div>
            
            <button type="submit" class="btn btn-primary w-full" style="margin-top:16px;padding:12px">
              ${isRegister ? 'Daftar' : 'Masuk'}
            </button>
          </form>

          <div class="text-center" style="margin-top:32px">
            <p class="font-body-sm" style="color:var(--on-surface-variant)">
              ${isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} 
              <a href="${isRegister ? '#/login' : '#/register'}" style="color:var(--secondary);font-weight:600">
                ${isRegister ? 'Masuk di sini' : 'Daftar sekarang'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
