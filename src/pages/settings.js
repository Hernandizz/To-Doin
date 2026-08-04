import { getState, setState, setTheme, showToast } from '../store.js';
import { attachNavbarEvents } from '../components/navbar.js';
import { auth, setToken } from '../api.js';
import { navigate } from '../router.js';

export function renderSettings(appEl, appLayout) {
  setTimeout(() => {
    attachNavbarEvents();
    attachSettingsEvents();
  }, 0);

  const { user } = getState();

  const content = `
    <main class="app-main flex justify-center">
      <div class="container" style="max-width:1000px;width:100%;padding:40px 0">
        <header style="margin-bottom:40px;border-bottom:1px solid var(--outline-variant);padding-bottom:24px">
          <h1 class="font-display" style="font-size:36px;color:var(--primary)">Pengaturan</h1>
          <p class="font-body" style="color:var(--on-surface-variant);margin-top:8px">Kelola preferensi akun dan aplikasi Anda.</p>
        </header>

        <div class="settings-layout">
          <nav class="settings-nav flex-col gap-sm">
            <a href="#/settings" class="sidebar-link active">
              <span class="material-symbols-outlined icon-sm">person</span>
              Profil Saya
            </a>
            <a href="#/settings" class="sidebar-link">
              <span class="material-symbols-outlined icon-sm">notifications</span>
              Notifikasi
            </a>
            <a href="#/settings" class="sidebar-link">
              <span class="material-symbols-outlined icon-sm">security</span>
              Keamanan
            </a>
            <a href="#/settings" class="sidebar-link">
              <span class="material-symbols-outlined icon-sm">palette</span>
              Tampilan
            </a>
            
            <button class="sidebar-link" id="btn-logout" style="margin-top:auto;color:var(--error);border:none;background:transparent;text-align:left;width:100%;font-family:inherit">
              <span class="material-symbols-outlined icon-sm">logout</span>
              Keluar Akun
            </button>
          </nav>

          <div class="settings-content flex-col gap-lg">
            <div class="card">
              <div class="card-header flex justify-between items-center">
                <h3 class="font-title">Profil Publik</h3>
                <span class="font-label" style="background:var(--surface-variant);color:var(--on-surface-variant);padding:4px 8px;border-radius:4px">Aktif</span>
              </div>
              <div class="card-body">
                <form id="profile-form" class="flex-col gap-md">
                  <div class="flex items-start gap-gutter">
                    <div class="avatar-lg flex justify-center items-center font-display" style="background:var(--primary);color:var(--on-primary);font-size:32px">
                      ${(user.firstName?.[0] || user.email[0]).toUpperCase()}
                    </div>
                    <div class="flex-1 grid grid-cols-12 gap-sm">
                      <div class="col-span-6">
                        <label class="input-label" for="firstName">Nama Depan</label>
                        <input type="text" id="firstName" name="firstName" class="input" value="${user.firstName || ''}" />
                      </div>
                      <div class="col-span-6">
                        <label class="input-label" for="lastName">Nama Belakang</label>
                        <input type="text" id="lastName" name="lastName" class="input" value="${user.lastName || ''}" />
                      </div>
                      <div class="col-span-12">
                        <label class="input-label" for="email">Alamat Email</label>
                        <input type="email" id="email" class="input" value="${user.email}" disabled style="background:var(--surface-low);color:var(--on-surface-variant)" />
                      </div>
                      <div class="col-span-12">
                        <label class="input-label" for="bio">Bio</label>
                        <textarea id="bio" name="bio" class="input" rows="3" placeholder="Tulis sedikit tentang diri Anda...">${user.bio || ''}</textarea>
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-end" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--outline-variant)">
                    <button type="submit" class="btn btn-primary" id="btn-save-profile">Simpan Perubahan</button>
                  </div>
                </form>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3 class="font-title">Tema Aplikasi</h3>
              </div>
              <div class="card-body flex gap-md">
                <button class="btn ${user.theme === 'light' ? 'btn-primary' : 'btn-secondary'}" data-theme-select="light">
                  <span class="material-symbols-outlined icon-sm">light_mode</span> Terang
                </button>
                <button class="btn ${user.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}" data-theme-select="dark">
                  <span class="material-symbols-outlined icon-sm">dark_mode</span> Gelap
                </button>
                <button class="btn ${user.theme === 'system' ? 'btn-primary' : 'btn-secondary'}" data-theme-select="system">
                  <span class="material-symbols-outlined icon-sm">settings_brightness</span> Sistem
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  `;

  appEl.innerHTML = appLayout(content);
}

function attachSettingsEvents() {
  const form = document.getElementById('profile-form');
  const btnSave = document.getElementById('btn-save-profile');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btnSave.textContent = 'Menyimpan...';
      btnSave.disabled = true;

      const formData = new FormData(form);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        bio: formData.get('bio'),
        theme: getState().user.theme
      };

      try {
        await auth.updateProfile(data);
        const user = await auth.me();
        setState({ user });
        showToast('Profil berhasil diperbarui', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        btnSave.textContent = 'Simpan Perubahan';
        btnSave.disabled = false;
      }
    });
  }

  document.querySelectorAll('[data-theme-select]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const selected = btn.dataset.themeSelect;
      setTheme(selected);
      try {
        await auth.updateProfile({ ...getState().user, theme: selected });
        const user = await auth.me();
        setState({ user });
        
        // Update button styles
        document.querySelectorAll('[data-theme-select]').forEach(b => {
          b.className = `btn ${b.dataset.themeSelect === selected ? 'btn-primary' : 'btn-secondary'}`;
        });
      } catch (err) {
        console.error(err);
      }
    });
  });

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    setToken(null);
    setState({ user: null, tasks: [], projects: [] });
    navigate('/login');
  });
}
