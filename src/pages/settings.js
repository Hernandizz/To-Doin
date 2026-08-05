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
            <button class="sidebar-link active" data-tab="profile" style="border:none;background:transparent;text-align:left;font-family:inherit;width:100%">
              <span class="material-symbols-outlined icon-sm">person</span>
              Profil Saya
            </button>
            <button class="sidebar-link" data-tab="notifications" style="border:none;background:transparent;text-align:left;font-family:inherit;width:100%">
              <span class="material-symbols-outlined icon-sm">notifications</span>
              Notifikasi
            </button>
            <button class="sidebar-link" data-tab="security" style="border:none;background:transparent;text-align:left;font-family:inherit;width:100%">
              <span class="material-symbols-outlined icon-sm">security</span>
              Keamanan
            </button>
            <button class="sidebar-link" data-tab="appearance" style="border:none;background:transparent;text-align:left;font-family:inherit;width:100%">
              <span class="material-symbols-outlined icon-sm">palette</span>
              Tampilan
            </button>
            
            <button class="sidebar-link" id="btn-logout" style="margin-top:auto;color:var(--error);border:none;background:transparent;text-align:left;width:100%;font-family:inherit">
              <span class="material-symbols-outlined icon-sm">logout</span>
              Keluar Akun
            </button>
          </nav>

          <div class="settings-content flex-col gap-lg">
            
            <!-- SECTION: PROFILE -->
            <div class="settings-section" id="section-profile">
              <div class="card">
                <div class="card-header flex justify-between items-center">
                  <h3 class="font-title">Profil Publik</h3>
                  <span class="font-label" style="background:var(--surface-variant);color:var(--on-surface-variant);padding:4px 8px;border-radius:4px">Aktif</span>
                </div>
                <div class="card-body">
                  <form id="profile-form" class="flex-col gap-md">
                    <div class="flex items-start gap-gutter" style="flex-wrap:wrap">
                      <div class="avatar-lg flex justify-center items-center font-display" style="background:var(--primary);color:var(--on-primary);font-size:32px;flex-shrink:0;">
                        ${(user.firstName?.[0] || user.email[0]).toUpperCase()}
                      </div>
                      <div class="flex-1 grid grid-cols-12 gap-sm" style="min-width:250px;">
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
            </div>

            <!-- SECTION: NOTIFICATIONS -->
            <div class="settings-section" id="section-notifications" style="display:none;">
              <div class="card">
                <div class="card-header">
                  <h3 class="font-title">Preferensi Notifikasi</h3>
                </div>
                <div class="card-body flex-col gap-md">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-label" style="font-size:14px;color:var(--on-surface)">Ringkasan Harian</h4>
                      <p class="font-body-sm" style="color:var(--on-surface-variant)">Kirim email berisi daftar tugas hari ini setiap pagi.</p>
                    </div>
                    <input type="checkbox" style="width:20px;height:20px;accent-color:var(--primary)" checked />
                  </div>
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-label" style="font-size:14px;color:var(--on-surface)">Pengingat Tenggat Waktu</h4>
                      <p class="font-body-sm" style="color:var(--on-surface-variant)">Berikan peringatan saat tugas mendekati batas waktu.</p>
                    </div>
                    <input type="checkbox" style="width:20px;height:20px;accent-color:var(--primary)" checked />
                  </div>
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-label" style="font-size:14px;color:var(--on-surface)">Update Aplikasi</h4>
                      <p class="font-body-sm" style="color:var(--on-surface-variant)">Terima informasi terbaru terkait pembaruan fitur To-Doin.</p>
                    </div>
                    <input type="checkbox" style="width:20px;height:20px;accent-color:var(--primary)" />
                  </div>
                  <div class="flex justify-end" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--outline-variant)">
                    <button class="btn btn-primary" onclick="alert('Preferensi notifikasi disimpan!')">Simpan Preferensi</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION: SECURITY -->
            <div class="settings-section" id="section-security" style="display:none;">
              <div class="card">
                <div class="card-header">
                  <h3 class="font-title">Ubah Kata Sandi</h3>
                </div>
                <div class="card-body">
                  <form id="password-form" class="flex-col gap-sm">
                    <div>
                      <label class="input-label" for="currentPassword">Kata Sandi Saat Ini</label>
                      <input type="password" id="currentPassword" class="input" required />
                    </div>
                    <div>
                      <label class="input-label" for="newPassword">Kata Sandi Baru</label>
                      <input type="password" id="newPassword" class="input" required minlength="6" />
                    </div>
                    <div>
                      <label class="input-label" for="confirmPassword">Konfirmasi Kata Sandi Baru</label>
                      <input type="password" id="confirmPassword" class="input" required minlength="6" />
                    </div>
                    <div class="flex justify-end" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--outline-variant)">
                      <button type="submit" class="btn btn-primary">Perbarui Kata Sandi</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- SECTION: APPEARANCE -->
            <div class="settings-section" id="section-appearance" style="display:none;">
              <div class="card">
                <div class="card-header">
                  <h3 class="font-title">Tema Aplikasi</h3>
                </div>
                <div class="card-body flex gap-md" style="flex-wrap:wrap">
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
      </div>
    </main>
  `;

  appEl.innerHTML = appLayout(content);
}

function attachSettingsEvents() {
  // --- Tab Switching Logic ---
  const tabBtns = document.querySelectorAll('.settings-nav .sidebar-link[data-tab]');
  const sections = document.querySelectorAll('.settings-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all tabs
      tabBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked tab
      btn.classList.add('active');
      
      // Hide all sections
      sections.forEach(sec => sec.style.display = 'none');
      // Show corresponding section
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(`section-${tabId}`).style.display = 'block';
    });
  });

  // --- Profile Form Logic ---
  const profileForm = document.getElementById('profile-form');
  const btnSaveProfile = document.getElementById('btn-save-profile');
  
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      btnSaveProfile.textContent = 'Menyimpan...';
      btnSaveProfile.disabled = true;

      const formData = new FormData(profileForm);
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
        btnSaveProfile.textContent = 'Simpan Perubahan';
        btnSaveProfile.disabled = false;
      }
    });
  }

  // --- Password Form Logic ---
  const passwordForm = document.getElementById('password-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPwd = document.getElementById('newPassword').value;
      const confirmPwd = document.getElementById('confirmPassword').value;
      if (newPwd !== confirmPwd) {
        showToast('Kata sandi baru tidak cocok', 'error');
        return;
      }
      showToast('Kata sandi berhasil diperbarui!', 'success');
      passwordForm.reset();
    });
  }

  // --- Theme Logic ---
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

  // --- Logout Logic ---
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    setToken(null);
    setState({ user: null, tasks: [], projects: [] });
    navigate('/login');
  });
}
