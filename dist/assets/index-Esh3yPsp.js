(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();function Z(){return setTimeout(()=>{const e=document.getElementById("cursor-blob");e&&document.addEventListener("mousemove",a=>{e.style.transform=`translate(${a.clientX-150}px, ${a.clientY-150}px)`})},0),`
    <main class="flex-grow flex-col relative" style="overflow: hidden;">
      <!-- Glowing Cursor Blob -->
      <div id="cursor-blob" style="position: fixed; top: 0; left: 0; width: 300px; height: 300px; background-color: var(--primary); border-radius: 50%; filter: blur(100px); opacity: 0.15; pointer-events: none; z-index: 0; transition: transform 0.1s ease-out; will-change: transform;"></div>

      <!-- Hero Section -->
      <section class="hero-section" style="position:relative; z-index:10;">
        <div class="hero-blur"></div>
        <div class="container text-center relative z-10 flex-col items-center gap-lg">
          <div class="inline-flex items-center gap-sm px-3 py-1 border border-outline-variant rounded" style="background:var(--surface-lowest);border-radius:100px;margin-bottom:16px">
            <span class="tag-dot" style="background:var(--secondary)"></span>
            <span class="font-label">Versi 2.0 Telah Rilis</span>
          </div>
          
          <h1 class="font-display" style="color:var(--primary);max-width:800px;margin:0 auto;line-height:1.2;">
            Kelola Tugas Harianmu dengan Lebih Mudah & Terstruktur.
          </h1>
          
          <p class="font-body-lg" style="color:var(--on-surface-variant);max-width:600px;margin:24px auto;">
            To-Doin membantu kamu menyusun jadwal, melacak progres, dan tetap produktif setiap hari tanpa ribet. Tampilan yang cantik membuatmu semakin semangat menyelesaikan tugas.
          </p>
          
          <div class="flex gap-md justify-center" style="margin-top:32px">
            <button class="btn btn-primary btn-lg" onclick="location.hash='#/register'">Mulai Sekarang Gratis</button>
            <button class="btn btn-secondary btn-lg" style="background:var(--surface-lowest)">
              <span class="material-symbols-outlined icon-sm">play_circle</span>
              Tonton Demo
            </button>
          </div>
        </div>
      </section>

      <!-- Layanan / How It Works -->
      <section id="layanan" style="padding:96px 0;position:relative;z-index:10;">
        <div class="container text-center">
          <h2 class="font-headline" style="color:var(--primary);margin-bottom:16px">Layanan Kami</h2>
          <p class="font-body" style="color:var(--on-surface-variant);margin-bottom:48px;max-width:600px;margin-left:auto;margin-right:auto;">
            Dirancang khusus untuk menyesuaikan gaya hidup dan kebutuhan produktivitasmu.
          </p>
          
          <div class="grid grid-cols-3 gap-gutter text-left">
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <span class="material-symbols-outlined icon-lg" style="color:var(--primary);margin-bottom:16px">person</span>
              <h3 class="font-title" style="margin-bottom:8px">Untuk Pribadi</h3>
              <p class="font-body" style="color:var(--on-surface-variant)">Atur jadwal harian, daftar belanjaan, hingga melacak kebiasaan baru dengan mudah dan menyenangkan.</p>
            </div>
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <span class="material-symbols-outlined icon-lg" style="color:var(--primary);margin-bottom:16px">work</span>
              <h3 class="font-title" style="margin-bottom:8px">Untuk Profesional</h3>
              <p class="font-body" style="color:var(--on-surface-variant)">Lacak tugas pekerjaan dan proyek dengan rapi agar fokus tetap terjaga di tengah kesibukan.</p>
            </div>
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <span class="material-symbols-outlined icon-lg" style="color:var(--primary);margin-bottom:16px">print</span>
              <h3 class="font-title" style="margin-bottom:8px">Siap Cetak</h3>
              <p class="font-body" style="color:var(--on-surface-variant)">Butuh salinan fisik? Ekspor daftar tugas harianmu ke format PDF dalam hitungan detik.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Fitur -->
      <section id="fitur" style="padding:96px 0;background:var(--surface-lowest);position:relative;z-index:10;">
        <div class="container">
          <div style="margin-bottom:64px;max-width:500px">
            <h2 class="font-headline" style="color:var(--primary);margin-bottom:16px">Fokus Pada Apa yang Penting</h2>
            <p class="font-body" style="color:var(--on-surface-variant)">Fitur-fitur kami dirancang agar kamu bisa fokus menyelesaikan tugas tanpa terdistraksi.</p>
          </div>
          
          <div class="bento-grid">
            <div class="card col-span-8 flex-col justify-between" style="padding:32px;min-height:300px;overflow:hidden;position:relative">
              <div style="position:relative;z-index:2">
                <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">edit_square</span>
                <h3 class="font-title" style="margin-bottom:8px">Manajemen Tugas Sederhana</h3>
                <p class="font-body" style="color:var(--on-surface-variant);max-width:400px">Buat, edit, dan atur prioritas tugasmu dengan cepat tanpa langkah yang rumit. Tampilan yang bersih membantu mengurangi beban kognitif.</p>
              </div>
            </div>
            
            <div class="card col-span-4 flex-col" style="padding:32px;min-height:300px">
              <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">folder_special</span>
              <h3 class="font-title" style="margin-bottom:8px">Kategori & Proyek</h3>
              <p class="font-body" style="color:var(--on-surface-variant);margin-top:auto">Kelompokkan tugasmu ke dalam berbagai proyek agar lebih terorganisir.</p>
            </div>
            
            <div class="card col-span-4 flex-col" style="padding:32px;min-height:300px">
              <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">notifications_active</span>
              <h3 class="font-title" style="margin-bottom:8px">Pengingat Cerdas</h3>
              <p class="font-body" style="color:var(--on-surface-variant);margin-top:auto">Jangan pernah lewatkan tenggat waktu penting dengan sistem pengingat bawaan kami.</p>
            </div>
            
            <div class="card col-span-8 flex items-center justify-between" style="padding:32px;min-height:300px">
              <div class="flex-col" style="max-width:400px">
                <span class="material-symbols-outlined icon-lg" style="color:var(--secondary);margin-bottom:16px">sync</span>
                <h3 class="font-title" style="margin-bottom:8px">Sinkronisasi Real-Time</h3>
                <p class="font-body" style="color:var(--on-surface-variant)">Akses daftar to-do kamu dari perangkat mana saja. Perubahan akan tersimpan secara otomatis dan instan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimoni -->
      <section id="testimoni" style="padding:96px 0;position:relative;z-index:10;">
        <div class="container">
          <div class="text-center" style="margin-bottom:48px;">
            <h2 class="font-headline" style="color:var(--primary);margin-bottom:16px">Apa Kata Mereka?</h2>
            <p class="font-body" style="color:var(--on-surface-variant)">Pengalaman dari mereka yang sudah mencoba To-Doin.</p>
          </div>
          <div class="grid grid-cols-2 gap-gutter">
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <p class="font-body" style="color:var(--on-surface-variant);margin-bottom:24px;font-style:italic;">
                "Sangat membantu saya mengatur jadwal kuliah dan tugas akhir. Tampilannya cantik banget dan nggak bikin pusing!"
              </p>
              <div class="flex items-center gap-sm">
                <div class="avatar" style="background:var(--primary);color:var(--on-primary)">B</div>
                <div>
                  <h4 class="font-title" style="font-size:14px">Budi Santoso</h4>
                  <p class="font-label" style="color:var(--on-surface-variant)">Mahasiswa</p>
                </div>
              </div>
            </div>
            <div class="card" style="padding:32px;background:var(--surface-low);border:none;">
              <p class="font-body" style="color:var(--on-surface-variant);margin-bottom:24px;font-style:italic;">
                "Aplikasi to-do list terbaik yang pernah saya gunakan. Ringan, cepat, dan fitur tracking proyeknya sangat rapi."
              </p>
              <div class="flex items-center gap-sm">
                <div class="avatar" style="background:var(--secondary);color:var(--on-primary)">S</div>
                <div>
                  <h4 class="font-title" style="font-size:14px">Siti Aminah</h4>
                  <p class="font-label" style="color:var(--on-surface-variant)">Pekerja Lepas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tentang Kami -->
      <section id="tentang" style="padding:96px 0;background:var(--primary);color:var(--on-primary);position:relative;z-index:10;">
        <div class="container text-center">
          <h2 class="font-headline" style="margin-bottom:16px">Misi Kami</h2>
          <p class="font-body-lg" style="max-width:800px;margin:0 auto;line-height:1.6;opacity:0.9;">
            Kami percaya bahwa produktivitas tidak seharusnya membosankan atau membebani. 
            To-Doin dibangun untuk memberikan pengalaman mengelola tugas yang indah, responsif, dan menyenangkan. 
            Fokuslah pada pencapaianmu, biarkan kami yang mengurus daftarnya.
          </p>
        </div>
      </section>

      <!-- Footer -->
      <footer style="background:var(--surface-high);border-top:1px solid var(--outline-variant);padding:48px 0;position:relative;z-index:10;">
        <div class="container flex justify-between items-center" style="flex-wrap:wrap;gap:24px">
          <div class="flex-col gap-sm">
            <span class="font-title" style="color:var(--primary)">To-Doin</span>
            <span class="font-label" style="color:var(--on-surface-variant)">© 2026 To-Doin. Semua hak dilindungi.</span>
          </div>
          <div class="flex gap-gutter" style="flex-wrap:wrap">
            <a href="#" class="font-label" style="color:var(--on-surface-variant);text-decoration:none">Kebijakan Privasi</a>
            <a href="#" class="font-label" style="color:var(--on-surface-variant);text-decoration:none">Syarat Layanan</a>
            <a href="#" class="font-label" style="color:var(--on-surface-variant);text-decoration:none">Hubungi Kami</a>
          </div>
        </div>
      </footer>
    </main>
  `}const ee="/api";let C=localStorage.getItem("todoin_token"),z=null;function O(e){C=e,e?localStorage.setItem("todoin_token",e):localStorage.removeItem("todoin_token")}function x(){return C}function te(e){z=e}async function m(e,a={}){const t={"Content-Type":"application/json",...a.headers};C&&(t.Authorization=`Bearer ${C}`);const s=await fetch(`${ee}${e}`,{...a,headers:t});if(s.status===401)throw O(null),z&&z(),new Error("Unauthorized");if(!s.ok){const i=await s.json().catch(()=>({}));throw new Error(i.error||`Request failed: ${s.status}`)}const n=s.headers.get("content-type");return n&&n.includes("application/pdf")?s.blob():s.json()}const S={register:e=>m("/auth/register",{method:"POST",body:JSON.stringify(e)}),login:e=>m("/auth/login",{method:"POST",body:JSON.stringify(e)}),me:()=>m("/auth/me"),updateProfile:e=>m("/auth/me",{method:"PUT",body:JSON.stringify(e)})},g={list:(e={})=>{const a=new URLSearchParams(e).toString();return m(`/tasks${a?"?"+a:""}`)},get:e=>m(`/tasks/${e}`),create:e=>m("/tasks",{method:"POST",body:JSON.stringify(e)}),update:(e,a)=>m(`/tasks/${e}`,{method:"PUT",body:JSON.stringify(a)}),toggle:e=>m(`/tasks/${e}/toggle`,{method:"PATCH"}),delete:e=>m(`/tasks/${e}`,{method:"DELETE"})},ae={list:()=>m("/projects"),create:e=>m("/projects",{method:"POST",body:JSON.stringify(e)}),update:(e,a)=>m(`/projects/${e}`,{method:"PUT",body:JSON.stringify(a)}),delete:e=>m(`/projects/${e}`,{method:"DELETE"})},se={export:e=>m("/pdf/export",{method:"POST",body:JSON.stringify(e)})},P={};let G="";function w(e,a){P[e]=a}function b(e){window.location.hash=e}function ne(){return G}function ie(){function e(){const a=window.location.hash.slice(1)||"/";G=a;const t=P[a]||P["/404"]||P["/"];t&&t(a)}window.addEventListener("hashchange",e),e()}let L={user:null,tasks:[],projects:[],isLoading:!1};const oe=new Set;function c(){return L}function j(e){L={...L,...e},oe.forEach(a=>a(L))}function le(e){const a={backlog:[],on_progress:[],in_review:[],done:[]};return e.forEach(t=>{let s=t.status||(t.completed?"done":"backlog");a[s]||(a[s]=[]),a[s].push(t)}),a}function re(e){const a={urgent:[],important:[],normal:[]};return e.forEach(t=>{a[t.priority]=a[t.priority]||[],a[t.priority].push(t)}),a}function de(e){const a=new Date().toISOString().split("T")[0];return e.filter(t=>t.dueDate===a)}function ce(e){const a=new Date().toISOString().split("T")[0];return e.filter(t=>t.dueDate&&t.dueDate>a)}function J(e){return e.filter(a=>!a.completed)}function pe(e,a){return e.filter(t=>t.dueDate===a)}function ue(e){return L.projects.find(a=>a.id===parseInt(e))}function me(){const e=localStorage.getItem("todoin_theme")||"system";return e==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e}function be(e){localStorage.setItem("todoin_theme",e),X()}function X(){const e=me();document.documentElement.setAttribute("data-theme",e)}function u(e,a="info"){let t=document.querySelector(".toast-container");t||(t=document.createElement("div"),t.className="toast-container",document.body.appendChild(t));const s=document.createElement("div");s.className="toast";const n={success:"check_circle",error:"error",info:"info"};s.innerHTML=`<span class="material-symbols-outlined icon-sm">${n[a]||"info"}</span> ${e}`,t.appendChild(s),setTimeout(()=>s.remove(),3e3)}function B(e={}){const{isLanding:a=!1}=e;return a?`
      <nav class="nav-top" id="navbar">
        <div class="container flex items-center justify-between" style="height:100%">
          <div class="flex items-center gap-gutter">
            <a href="#/" class="font-headline" style="font-size:24px;font-weight:800;color:var(--primary);text-decoration:none;letter-spacing:-0.02em">
              Starline™ AI
            </a>
          </div>
          <div class="flex items-center gap-sm">
            <button class="btn btn-secondary hide-mobile" onclick="location.hash='#/login'">Login</button>
            <button class="btn btn-primary" onclick="location.hash='#/register'">Mulai Sekarang</button>
          </div>
        </div>
      </nav>
    `:`
    <nav class="nav-top starline-topbar" id="navbar">
      <div class="nav-content flex items-center justify-between">
        <!-- Left: Breadcrumb Navigation -->
        <div class="flex items-center gap-xs">
          <button class="btn-icon show-mobile" id="sidebar-toggle" aria-label="Menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <div class="breadcrumbs flex items-center gap-xs font-size-13">
            <span class="text-muted cursor-pointer" onclick="location.hash='#/projects'">Tasks</span>
            <span class="text-muted">/</span>
            <div class="flex items-center gap-2xs font-weight-600 text-dark">
              <span>📁</span>
              <span>Product Sprints</span>
              <span class="material-symbols-outlined icon-2xs text-muted">more_horiz</span>
            </div>
          </div>
        </div>

        <!-- Right: Actions Header -->
        <div class="flex items-center gap-xs">
          <div class="avatar-stack-gradient">
            <span class="gradient-avatar avatar-1"></span>
            <span class="gradient-avatar avatar-2"></span>
            <span class="gradient-avatar avatar-3"></span>
            <span class="gradient-avatar avatar-4"></span>
          </div>

          <button class="btn-topbar-icon" title="Grid Layout">
            <span class="material-symbols-outlined icon-xs">space_dashboard</span>
          </button>
          <button class="btn-topbar-icon" title="View Options">
            <span class="material-symbols-outlined icon-xs">tune</span>
          </button>

          <div class="topbar-search-btn flex items-center gap-2xs cursor-pointer">
            <span class="material-symbols-outlined icon-xs text-muted">search</span>
            <span class="font-size-13 text-muted">Search</span>
          </div>

          <button class="btn btn-black-pill flex items-center gap-2xs" id="btn-add-top">
            <span class="material-symbols-outlined icon-xs">add</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </nav>
  `}function I(){const e=document.getElementById("btn-add-top");e&&e.addEventListener("click",()=>{const t=new CustomEvent("open-new-task-modal");window.dispatchEvent(t)});const a=document.getElementById("sidebar-toggle");a&&a.addEventListener("click",()=>{var t,s;(t=document.querySelector(".sidebar"))==null||t.classList.toggle("open"),(s=document.querySelector(".sidebar-overlay"))==null||s.classList.toggle("open")})}function W(e=!1){return setTimeout(()=>{I();const a=document.getElementById("auth-form");a&&a.addEventListener("submit",async t=>{t.preventDefault();const s=new FormData(a),n=Object.fromEntries(s.entries()),i=a.querySelector('button[type="submit"]'),o=i.textContent;i.textContent="Memproses...",i.disabled=!0;try{let l;e?l=await S.register(n):l=await S.login(n),O(l.token),b("/inbox")}catch(l){u(l.message,"error"),i.textContent=o,i.disabled=!1}})},0),`
    <div class="flex-col min-h-screen">
      ${B()}
      <div class="auth-container">
        <div class="auth-card">
          <div class="text-center" style="margin-bottom:32px">
            <h1 class="font-headline" style="color:var(--primary);margin-bottom:8px">
              ${e?"Buat Akun":"Selamat Datang Kembali"}
            </h1>
            <p class="font-body" style="color:var(--on-surface-variant)">
              ${e?"Mulai kelola tugasmu dengan lebih efisien.":"Masuk untuk mengakses tugas-tugasmu."}
            </p>
          </div>

          <form id="auth-form" class="flex-col gap-md">
            ${e?`
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
            `:""}
            <div>
              <label class="input-label" for="email">Email</label>
              <input type="email" id="email" name="email" class="input" required autofocus />
            </div>
            <div>
              <label class="input-label" for="password">Password</label>
              <input type="password" id="password" name="password" class="input" required minlength="6" />
            </div>
            
            <button type="submit" class="btn btn-primary w-full" style="margin-top:16px;padding:12px">
              ${e?"Daftar":"Masuk"}
            </button>
          </form>

          <div class="text-center" style="margin-top:32px">
            <p class="font-body-sm" style="color:var(--on-surface-variant)">
              ${e?"Sudah punya akun?":"Belum punya akun?"} 
              <a href="${e?"#/login":"#/register"}" style="color:var(--secondary);font-weight:600">
                ${e?"Masuk di sini":"Daftar sekarang"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `}function q(){const{tasks:e}=c(),a=ne();return J(e).length,`
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    
    <!-- Far-Left Icon Navigation Rail -->
    <div class="icon-rail flex flex-col justify-between items-center">
      <div class="flex flex-col items-center gap-sm pt-xs">
        <div class="rail-logo-box" title="Stacks">
          <span class="material-symbols-outlined">layers</span>
        </div>
        <button class="rail-icon-btn active" title="Home"><span class="material-symbols-outlined">home</span></button>
        <button class="rail-icon-btn" title="Search"><span class="material-symbols-outlined">search</span></button>
        <button class="rail-icon-btn" title="Inbox"><span class="material-symbols-outlined">inbox</span></button>
        <button class="rail-icon-btn" title="Documents"><span class="material-symbols-outlined">folder</span></button>
        <button class="rail-icon-btn" title="Team"><span class="material-symbols-outlined">group</span></button>
      </div>

      <div class="flex flex-col items-center gap-sm pb-xs">
        <button class="rail-icon-btn" id="theme-toggle-rail" title="Theme"><span class="material-symbols-outlined">contrast</span></button>
        <button class="rail-icon-btn" title="Settings"><span class="material-symbols-outlined">settings</span></button>
        <div class="rail-user-avatar" title="Account">S</div>
      </div>
    </div>

    <!-- Main Sidebar Workspace Drawer -->
    <aside class="sidebar starline-sidebar" id="sidebar">
      <!-- Workspace Brand Header -->
      <div class="sidebar-brand flex items-center justify-between">
        <div class="flex items-center gap-xs">
          <div class="starline-logo flex items-center justify-center">✨</div>
          <span class="font-weight-700 font-size-14 text-dark">Starline™ AI</span>
          <span class="material-symbols-outlined icon-xs text-muted">unfold_more</span>
        </div>
        <button class="btn-icon btn-xs" id="btn-toggle-sidebar" title="Collapse sidebar">
          <span class="material-symbols-outlined icon-xs">left_panel_close</span>
        </button>
      </div>

      <!-- Quick Command Bar -->
      <div class="sidebar-command-bar flex items-center justify-between">
        <div class="flex items-center gap-xs text-muted text-xs">
          <span class="material-symbols-outlined icon-xs">search</span>
          <span>Command</span>
        </div>
        <span class="command-shortcut">/</span>
      </div>

      <!-- Main Navigation Menu -->
      <div class="sidebar-menu flex-col gap-2xs mt-xs">
        <a href="#/projects" class="sidebar-link ${a==="/projects"?"active":""}">
          <span class="material-symbols-outlined icon-xs">home</span>
          <span>Home</span>
        </a>

        <a href="#/inbox" class="sidebar-link ${a==="/inbox"?"active":""}">
          <span class="material-symbols-outlined icon-xs">circle_notifications</span>
          <span>Updates</span>
          <span class="sidebar-badge-gray">44</span>
        </a>

        <a href="#/inbox" class="sidebar-link">
          <span class="material-symbols-outlined icon-xs">inbox</span>
          <span>Inbox</span>
          <span class="sidebar-badge-gray">20</span>
        </a>

        <a href="#/my-tasks" class="sidebar-link flex items-center justify-between">
          <div class="flex items-center gap-xs">
            <span class="material-symbols-outlined icon-xs">check_box</span>
            <span>My tasks</span>
          </div>
          <span class="material-symbols-outlined icon-2xs text-muted">add</span>
        </a>

        <!-- WORKSPACE Section -->
        <div class="sidebar-section-container mt-sm">
          <div class="sidebar-section-title flex items-center justify-between">
            <div class="flex items-center gap-2xs">
              <span class="material-symbols-outlined icon-2xs">expand_more</span>
              <span>WORKSPACE</span>
            </div>
            <span class="material-symbols-outlined icon-2xs text-muted cursor-pointer">add</span>
          </div>

          <div class="sidebar-sub-menu flex-col gap-2xs">
            <a href="#/projects" class="sidebar-link">
              <span class="material-symbols-outlined icon-xs">folder</span>
              <span>Projects</span>
            </a>
            <a href="#/projects" class="sidebar-link active flex items-center justify-between">
              <div class="flex items-center gap-xs">
                <span class="material-symbols-outlined icon-xs">check_box</span>
                <span>Tasks</span>
              </div>
              <span class="material-symbols-outlined icon-2xs text-muted" id="btn-add-task-sidebar">add</span>
            </a>
            <a href="#/views" class="sidebar-link">
              <span class="material-symbols-outlined icon-xs">grid_view</span>
              <span>Views</span>
            </a>
            <a href="#/teams" class="sidebar-link flex items-center justify-between">
              <div class="flex items-center gap-xs">
                <span class="material-symbols-outlined icon-xs">group</span>
                <span>Teams</span>
              </div>
              <span class="sidebar-badge-gray">40</span>
            </a>
            <a href="#/reports" class="sidebar-link">
              <span class="material-symbols-outlined icon-xs">bar_chart</span>
              <span>Reports</span>
            </a>
          </div>
        </div>

        <!-- PROJECTS Section -->
        <div class="sidebar-section-container mt-xs">
          <div class="sidebar-section-title flex items-center justify-between">
            <div class="flex items-center gap-2xs">
              <span class="material-symbols-outlined icon-2xs">expand_more</span>
              <span>PROJECTS</span>
            </div>
            <span class="material-symbols-outlined icon-2xs text-muted cursor-pointer">add</span>
          </div>

          <div class="sidebar-sub-menu flex-col gap-2xs">
            <div class="sidebar-project-item">
              <div class="flex items-center justify-between font-size-13 py-2xs px-xs cursor-pointer">
                <div class="flex items-center gap-xs">
                  <span class="project-square-icon bg-blue"></span>
                  <span>Tuesday™</span>
                </div>
                <span class="material-symbols-outlined icon-2xs">expand_less</span>
              </div>
              <div class="project-months flex-col gap-3xs pl-md">
                <div class="month-link flex justify-between"><span>January</span> <span class="sidebar-badge-xs">12</span></div>
                <div class="month-link flex justify-between"><span>February</span> <span class="sidebar-badge-xs">23</span></div>
                <div class="month-link flex justify-between"><span>March</span> <span class="sidebar-badge-xs">23</span></div>
                <div class="month-link flex justify-between"><span>April</span> <span class="sidebar-badge-xs">99</span></div>
              </div>
            </div>

            <div class="sidebar-project-item flex items-center gap-xs py-2xs px-xs cursor-pointer font-size-13">
              <span class="project-square-icon bg-purple"></span>
              <span>Jammio™</span>
            </div>

            <div class="sidebar-project-item flex items-center gap-xs py-2xs px-xs cursor-pointer font-size-13">
              <span class="project-square-icon bg-green"></span>
              <span>Create™ AI</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Upgrade Card -->
      <div class="sidebar-pro-card mt-auto">
        <div class="pro-card-preview-thumb"></div>
        <button class="btn-pro-upgrade" id="btn-upgrade-pro">Upgrade Plan</button>
      </div>
    </aside>
  `}function U(e={}){const a=document.getElementById("sidebar-overlay");a&&a.addEventListener("click",()=>{var i;(i=document.querySelector(".sidebar"))==null||i.classList.remove("open"),a.classList.remove("open")});const t=document.getElementById("btn-add-task-sidebar");t&&t.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const o=new CustomEvent("open-new-task-modal");window.dispatchEvent(o)});const s=document.getElementById("theme-toggle-rail");s&&s.addEventListener("click",()=>{const o=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";localStorage.setItem("todoin_theme",o),document.documentElement.setAttribute("data-theme",o)});const n=document.getElementById("btn-upgrade-pro");n&&n.addEventListener("click",()=>{alert("⚡ Upgrade Plan: Starline™ AI Unlimited Features Unlocked!")})}function ve(e){const a=e.dueDate&&e.dueDate<new Date().toISOString().split("T")[0]&&!e.completed,t=e.completed?"completed":"",s=e.completed?"completed":"";let n="";if(e.dueDate){const o=new Date().toISOString().split("T")[0],l=new Date(Date.now()+864e5).toISOString().split("T")[0],r=new Date(Date.now()-864e5).toISOString().split("T")[0];e.dueDate===o?n="Hari Ini":e.dueDate===l?n="Besok":e.dueDate===r?n="Kemarin":n=new Date(e.dueDate+"T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"short"}),e.dueTime&&(n+=` ${e.dueTime}`)}const i=a?"color:var(--error)":e.dueDate===new Date().toISOString().split("T")[0]?"color:var(--secondary)":"color:var(--outline)";return`
    <div class="task-row ${t}" data-task-id="${e.id}">
      <div style="margin-top:2px">
        <button class="task-checkbox ${e.completed?"checked":""}" data-priority="${e.priority}" data-task-toggle="${e.id}" title="Tandai selesai">
          ${e.completed?'<span class="material-symbols-outlined check-icon" style="font-size:16px">check</span>':""}
        </button>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-sm">
          <h3 class="font-body task-title ${s}" style="font-weight:500;color:var(--primary)">
            ${e.title}
            <span class="strike-line"></span>
          </h3>
          <div class="task-actions">
            <button class="btn-ghost" data-task-edit="${e.id}" title="Edit" style="padding:4px">
              <span class="material-symbols-outlined icon-sm">edit</span>
            </button>
            <button class="btn-ghost" data-task-delete="${e.id}" title="Hapus" style="padding:4px;color:var(--error)">
              <span class="material-symbols-outlined icon-sm">delete</span>
            </button>
          </div>
        </div>
        ${e.notes?`<p class="font-body-sm truncate" style="color:var(--on-surface-variant);margin-top:4px">${e.notes.substring(0,120)}</p>`:""}
        <div class="flex items-center gap-sm" style="margin-top:8px;flex-wrap:wrap">
          ${n?`
            <span class="font-label-normal flex items-center gap-sm" style="${i};${a?"background:var(--priority-urgent-bg);padding:2px 8px;border-radius:4px":""}">
              <span class="material-symbols-outlined icon-xs">calendar_today</span>
              ${n}
            </span>
          `:""}
          ${e.projectName?`
            <span class="font-label-normal flex items-center gap-sm" style="color:var(--on-surface-variant)">
              <span class="tag-dot" style="background:${e.projectColor||"var(--secondary)"}"></span>
              ${e.projectName}
            </span>
          `:""}
        </div>
      </div>
    </div>
  `}function fe(e,a={}){e.querySelectorAll("[data-task-toggle]").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.taskToggle;a.onToggle&&a.onToggle(s)})}),e.querySelectorAll("[data-task-edit]").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.taskEdit;a.onEdit&&a.onEdit(s)})}),e.querySelectorAll("[data-task-delete]").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.taskDelete;a.onDelete&&a.onDelete(s)})})}function F(e=null){const{projects:a}=c(),t=!!e,s=[{value:"urgent",label:"High"},{value:"important",label:"Medium"},{value:"normal",label:"Low"},{value:"not_set",label:"Not set"}].map(l=>`
    <option value="${l.value}" ${((e==null?void 0:e.priority)||"not_set")===l.value?"selected":""}>
      ${l.label}
    </option>
  `).join(""),n=["UXR","Research","Marketing","UI Design","Beta Testing","Big Picture"].map(l=>`
    <option value="${l}" ${((e==null?void 0:e.listCategory)||"UXR")===l?"selected":""}>
      ${l}
    </option>
  `).join(""),i=[{value:"backlog",label:"Backlog"},{value:"on_progress",label:"In progress"},{value:"in_review",label:"In review"},{value:"done",label:"Done"}].map(l=>`
    <option value="${l.value}" ${((e==null?void 0:e.status)||"backlog")===l.value?"selected":""}>
      ${l.label}
    </option>
  `).join(""),o=Array.isArray(e==null?void 0:e.people)?e.people.join(", "):(e==null?void 0:e.people)||"";return`
    <div class="modal-overlay" id="task-modal-overlay">
      <div class="modal-content" id="task-modal-content">
        <form id="task-form">
          <div class="modal-header">
            <h2 class="font-title">${t?"Edit Task":"New Task"}</h2>
            <button type="button" class="btn-icon" id="btn-close-modal" aria-label="Close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body flex-col gap-md">
            <div class="grid grid-cols-12 gap-sm">
              <div class="col-span-4">
                <label class="input-label" for="task-code">Task Code</label>
                <input type="text" id="task-code" name="taskCode" class="input" value="${(e==null?void 0:e.taskCode)||""}" placeholder="e.g. XY-473" />
              </div>
              <div class="col-span-8">
                <label class="input-label" for="task-title">Task Name *</label>
                <input type="text" id="task-title" name="title" class="input" value="${(e==null?void 0:e.title)||""}" required autofocus placeholder="Define User Personas" />
              </div>
            </div>

            <div class="grid grid-cols-12 gap-sm">
              <div class="col-span-6">
                <label class="input-label" for="task-status">Status</label>
                <select id="task-status" name="status" class="input">
                  ${i}
                </select>
              </div>
              <div class="col-span-6">
                <label class="input-label" for="task-category">List (Category)</label>
                <select id="task-category" name="listCategory" class="input">
                  ${n}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-sm">
              <div class="col-span-4">
                <label class="input-label" for="task-priority">Priority</label>
                <select id="task-priority" name="priority" class="input">
                  ${s}
                </select>
              </div>
              <div class="col-span-4">
                <label class="input-label" for="task-date">Due Date</label>
                <input type="date" id="task-date" name="dueDate" class="input" value="${(e==null?void 0:e.dueDate)||""}" />
              </div>
              <div class="col-span-4">
                <label class="input-label" for="task-people">Assignees</label>
                <input type="text" id="task-people" name="people" class="input" value="${o}" placeholder="Initials: UP, UX, UI" />
              </div>
            </div>

            <div>
              <label class="input-label" for="task-notes">Description</label>
              <textarea id="task-notes" name="notes" class="input" placeholder="Task details and scope..." maxlength="2000">${(e==null?void 0:e.notes)||""}</textarea>
            </div>
            
            ${t?`<input type="hidden" name="id" value="${e.id}" />`:""}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  `}function H(e={}){const a=document.getElementById("task-modal-overlay"),t=document.getElementById("btn-close-modal"),s=document.getElementById("btn-cancel-modal"),n=document.getElementById("task-form");function i(){a.remove()}let o;const l=document.getElementById("task-notes");l&&e.onNotesAutoSave&&l.addEventListener("input",r=>{clearTimeout(o),o=setTimeout(()=>{e.onNotesAutoSave(r.target.value)},1e3)}),t==null||t.addEventListener("click",i),s==null||s.addEventListener("click",i),a==null||a.addEventListener("mousedown",r=>{r.target===a&&i()}),n==null||n.addEventListener("submit",r=>{r.preventDefault();const d=new FormData(n),h=d.get("people")||"",$=h?h.split(",").map(v=>v.trim()).filter(Boolean):[],p={title:d.get("title"),taskCode:d.get("taskCode")||"",listCategory:d.get("listCategory")||"UXR",status:d.get("status")||"backlog",priority:d.get("priority")||"not_set",people:$,dueDate:d.get("dueDate")||null,notes:d.get("notes"),id:d.get("id")?parseInt(d.get("id")):void 0};e.onSubmit&&e.onSubmit(p),i()})}function ge(){const{projects:e}=c();return`
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
                ${`
    <option value="">Semua Proyek</option>
    ${e.map(t=>`
      <option value="${t.id}">${t.name}</option>
    `).join("")}
  `}
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
  `}function ye(){const e=document.getElementById("pdf-modal-overlay"),a=document.getElementById("btn-close-pdf"),t=document.getElementById("btn-cancel-pdf"),s=document.getElementById("pdf-form"),n=document.getElementById("pdf-scope"),i=document.getElementById("pdf-custom-date-group"),o=document.getElementById("btn-submit-pdf");function l(){e.remove()}a==null||a.addEventListener("click",l),t==null||t.addEventListener("click",l),e==null||e.addEventListener("mousedown",r=>{r.target===e&&l()}),n==null||n.addEventListener("change",r=>{r.target.value==="custom"?(i.style.display="grid",document.getElementById("pdf-date-from").required=!0,document.getElementById("pdf-date-to").required=!0):(i.style.display="none",document.getElementById("pdf-date-from").required=!1,document.getElementById("pdf-date-to").required=!1)}),s==null||s.addEventListener("submit",async r=>{r.preventDefault(),o.textContent="Menyiapkan...",o.disabled=!0;const d=new FormData(s),h={scope:d.get("scope"),dateFrom:d.get("dateFrom"),dateTo:d.get("dateTo"),projectId:d.get("projectId")?parseInt(d.get("projectId")):null,orientation:d.get("orientation"),paperSize:d.get("paperSize")};try{const $=await se.export(h),p=window.URL.createObjectURL($),v=document.createElement("a");v.href=p,v.download=`To-Doin_Tasks_${new Date().toISOString().split("T")[0]}.pdf`,document.body.appendChild(v),v.click(),window.URL.revokeObjectURL(p),v.remove(),l()}catch($){alert("Gagal mengekspor PDF: "+$.message),o.textContent="Unduh PDF",o.disabled=!1}})}function K(e,a,t={}){const{view:s="inbox",projectId:n=null}=t;setTimeout(()=>{I(),he(s,n)},0);const{tasks:i}=c();let o=[],l="Inbox",r=new Date().toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric"});if(s==="inbox")o=J(i);else if(s==="today")o=de(i),l="Hari Ini";else if(s==="upcoming")o=ce(i),l="Mendatang";else if(s==="project"){const p=ue(n);l=p?p.name:"Proyek",r=p?p.description:"",o=i.filter(v=>v.projectId===n)}const d=re(o);function h(p,v,D){return D.length===0?"":`
      <div class="priority-section" id="section-${v}">
        <div class="priority-section-header">
          <span class="material-symbols-outlined">expand_more</span>
          <h3 class="font-title" style="font-size:16px;color:var(--primary)">${p}</h3>
          <span class="font-label" style="color:var(--on-surface-variant);background:var(--surface-low);padding:2px 8px;border-radius:100px">${D.length}</span>
        </div>
        <div class="priority-section-tasks">
          ${D.map(N=>ve(N)).join("")}
        </div>
      </div>
    `}const $=`
    ${q()}
    <main class="app-main">
      <div class="container" style="max-width:800px;margin:0 auto">
        <header style="margin-bottom:32px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid var(--outline-variant);padding-bottom:16px">
          <div>
            <h1 class="font-display" style="font-size:40px;color:var(--primary)">${l}</h1>
            <p class="font-body" style="color:var(--on-surface-variant);margin-top:8px">${r}</p>
          </div>
          <div class="flex items-center gap-sm">
            <button class="btn-icon" id="btn-export-pdf" title="Ekspor PDF">
              <span class="material-symbols-outlined">print</span>
            </button>
            <button class="btn-icon" title="Urutkan">
              <span class="material-symbols-outlined">sort</span>
            </button>
          </div>
        </header>

        <div class="task-list-container">
          ${h("Mendesak","urgent",d.urgent)}
          ${h("Penting","important",d.important)}
          ${h("Normal","normal",d.normal)}
          
          ${o.length===0?`
            <div class="text-center" style="padding:64px 0;color:var(--on-surface-variant)">
              <span class="material-symbols-outlined" style="font-size:48px;opacity:0.5;margin-bottom:16px">task</span>
              <p class="font-body">Tidak ada tugas di sini. Coba tambahkan tugas baru!</p>
            </div>
          `:""}
        </div>

        <div style="margin-top:32px;border-top:1px solid var(--outline-variant);padding-top:16px">
          <form id="quick-add-form" class="flex items-center gap-sm" style="padding:8px;opacity:0.6;transition:opacity 0.2s">
            <span class="material-symbols-outlined" style="color:var(--outline)">add</span>
            <input type="text" name="title" class="input" style="border:none;background:transparent;box-shadow:none;padding:0" placeholder="Tambahkan tugas baru..." required autocomplete="off" />
          </form>
        </div>
      </div>
    </main>
  `;e.innerHTML=a($)}function he(e,a){var i;const t=async()=>{const o=await g.list();j({tasks:o}),document.getElementById("app"),window.dispatchEvent(new HashChangeEvent("hashchange"))};U({}),fe(document.body,{onToggle:async o=>{try{await g.toggle(o),await t()}catch{u("Gagal mengubah status tugas","error")}},onEdit:async o=>{const l=c().tasks.find(r=>r.id===parseInt(o));l&&n(l)},onDelete:async o=>{if(confirm("Hapus tugas ini?"))try{await g.delete(o),u("Tugas dihapus","success"),await t()}catch{u("Gagal menghapus tugas","error")}}}),document.querySelectorAll(".priority-section-header").forEach(o=>{o.addEventListener("click",()=>{o.parentElement.classList.toggle("collapsed")})});const s=document.getElementById("quick-add-form");s&&(s.addEventListener("focusin",()=>s.style.opacity="1"),s.addEventListener("focusout",()=>s.style.opacity="0.6"),s.addEventListener("submit",async o=>{o.preventDefault();const l=s.querySelector("input"),r=l.value;l.disabled=!0;try{const d={title:r,priority:"normal"};e==="today"&&(d.dueDate=new Date().toISOString().split("T")[0]),e==="project"&&a&&(d.projectId=a),await g.create(d),l.value="",await t()}catch(d){u(d.message,"error")}finally{l.disabled=!1,l.focus()}})),(i=document.getElementById("btn-export-pdf"))==null||i.addEventListener("click",()=>{document.body.insertAdjacentHTML("beforeend",ge()),ye()});function n(o=null){document.body.insertAdjacentHTML("beforeend",F(o)),H({onSubmit:async l=>{try{l.id?(await g.update(l.id,l),u("Tugas diperbarui","success")):(await g.create(l),u("Tugas berhasil dibuat","success")),await t()}catch(r){u(r.message,"error")}},onNotesAutoSave:async l=>{if(o&&o.id)try{await g.update(o.id,{notes:l})}catch(r){console.error("Auto-save failed",r)}}})}}function xe(e,a){setTimeout(()=>{I(),U(),we()},0);const{tasks:t}=c(),s=new Date,n=s.getFullYear(),i=s.getMonth(),o=new Date(n,i,1).getDay(),l=o===0?6:o-1,r=new Date(n,i+1,0).getDate(),d=new Date(n,i,0).getDate(),h=s.toLocaleDateString("id-ID",{month:"long",year:"numeric"}),$=new Date().toISOString().split("T")[0];let p="";for(let f=l-1;f>=0;f--)p+=`<div class="calendar-cell other-month"><span class="calendar-date">${d-f}</span></div>`;for(let f=1;f<=r;f++){const _=`${n}-${String(i+1).padStart(2,"0")}-${String(f).padStart(2,"0")}`,M=pe(t,_),Y=_===$;let V=M.slice(0,3).map(Q=>`<span class="calendar-task-dot" style="background:${Q.projectColor||"var(--secondary)"}"></span>`).join("");M.length>3&&(V+=`<span class="font-label" style="font-size:10px">+${M.length-3}</span>`),p+=`
      <div class="calendar-cell ${Y?"today":""}" data-date="${_}">
        <div class="calendar-date">${f}</div>
        <div class="flex items-center" style="margin-top:4px">${V}</div>
      </div>
    `}const D=42-(l+r);for(let f=1;f<=D;f++)p+=`<div class="calendar-cell other-month"><span class="calendar-date">${f}</span></div>`;const N=`
    ${q()}
    <main class="app-main flex-1 flex-col" style="padding:var(--margin-desktop)">
      <header class="flex justify-between items-center" style="margin-bottom:24px">
        <h1 class="font-display" style="font-size:32px;color:var(--primary)">${h}</h1>
        <div class="flex items-center gap-sm">
          <button class="btn-icon"><span class="material-symbols-outlined">chevron_left</span></button>
          <button class="btn btn-secondary">Hari Ini</button>
          <button class="btn-icon"><span class="material-symbols-outlined">chevron_right</span></button>
        </div>
      </header>
      
      <div class="calendar-grid" style="flex:1;min-height:500px">
        <div class="calendar-header-cell">Sen</div>
        <div class="calendar-header-cell">Sel</div>
        <div class="calendar-header-cell">Rab</div>
        <div class="calendar-header-cell">Kam</div>
        <div class="calendar-header-cell">Jum</div>
        <div class="calendar-header-cell">Sab</div>
        <div class="calendar-header-cell">Min</div>
        ${p}
      </div>
    </main>
  `;e.innerHTML=a(N)}function we(){document.querySelectorAll(".calendar-cell[data-date]").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.date;document.body.insertAdjacentHTML("beforeend",F({dueDate:a,priority:"normal"})),H({onSubmit:async t=>{await g.create(t),window.dispatchEvent(new HashChangeEvent("hashchange"))}})})})}let y="list",A="all";function R(e,a){setTimeout(()=>{I(),De()},0);const{tasks:t}=c();let s=t.filter(o=>A==="all"||o.priority===A);const n=le(s),i=`
    ${q()}
    <main class="app-main starline-main">
      <div class="starline-workspace-container">
        
        <!-- Views Toolbar & Action Controls Header -->
        <div class="starline-toolbar flex items-center justify-between">
          <!-- View Tabs (Left) -->
          <div class="starline-view-tabs flex items-center gap-xs">
            <button class="starline-tab ${y==="list"?"active":""}" data-view="list">
              <span class="material-symbols-outlined icon-xs">format_list_bulleted</span>
              <span>List</span>
            </button>
            <button class="starline-tab ${y==="kanban"?"active":""}" data-view="kanban">
              <span class="material-symbols-outlined icon-xs">view_kanban</span>
              <span>Kanban</span>
            </button>
            <button class="starline-tab ${y==="gantt"?"active":""}" data-view="gantt">
              <span class="material-symbols-outlined icon-xs">reorder</span>
              <span>Gantt</span>
            </button>
            <button class="starline-tab ${y==="calendar"?"active":""}" data-view="calendar">
              <span class="material-symbols-outlined icon-xs">calendar_month</span>
              <span>Calendar</span>
            </button>
            <button class="starline-tab ${y==="dashboard"?"active":""}" data-view="dashboard">
              <span class="material-symbols-outlined icon-xs">space_dashboard</span>
              <span>Dashboard</span>
            </button>
            <button class="starline-tab-add" title="Add View">
              <span class="material-symbols-outlined icon-xs">add</span>
              <span>View</span>
            </button>
          </div>

          <!-- Controls (Right) -->
          <div class="flex items-center gap-xs">
            <div class="starline-ctrl-btn flex items-center gap-2xs cursor-pointer" id="btn-group-by">
              <span class="material-symbols-outlined icon-xs">tag</span>
              <span>Group by Status</span>
            </div>
            <div class="starline-ctrl-btn flex items-center gap-2xs cursor-pointer" id="btn-sort">
              <span class="material-symbols-outlined icon-xs">swap_vert</span>
              <span>Sort</span>
            </div>
            <div class="starline-ctrl-btn flex items-center gap-2xs cursor-pointer">
              <span class="material-symbols-outlined icon-xs">tune</span>
              <span>View</span>
            </div>
            <div class="starline-ctrl-btn flex items-center gap-2xs cursor-pointer" id="btn-filter-toggle">
              <span class="material-symbols-outlined icon-xs">filter_list</span>
              <span>Filter</span>
            </div>
            <div class="starline-ctrl-btn icon-only" title="Search">
              <span class="material-symbols-outlined icon-xs">search</span>
            </div>
          </div>
        </div>

        <!-- Main View Area -->
        <div class="starline-view-content mt-xs">
          ${y==="list"?ke(n):""}
          ${y==="kanban"?Se(n):""}
          ${y==="gantt"?Te(s):""}
          ${y==="calendar"?je(s):""}
          ${y==="dashboard"?Ie(s):""}
        </div>

      </div>
    </main>
  `;e.innerHTML=a(i)}function ke(e){return`
    <div class="starline-list-wrapper flex-col gap-sm">
      ${[{key:"backlog",title:"Backlog",bannerClass:"group-banner-gray",dotClass:"dot-gray",items:e.backlog||[]},{key:"on_progress",title:"In progress",bannerClass:"group-banner-amber",dotClass:"dot-amber",items:e.on_progress||[]},{key:"in_review",title:"In review",bannerClass:"group-banner-mint",dotClass:"dot-mint",items:e.in_review||[]},{key:"done",title:"Done",bannerClass:"group-banner-gray",dotClass:"dot-gray",items:e.done||[]}].filter(t=>t.items.length>0||t.key!=="done").map(t=>`
        <div class="starline-group-section">
          <!-- Tinted Group Status Banner Header -->
          <div class="starline-group-banner ${t.bannerClass} flex items-center justify-between">
            <div class="flex items-center gap-xs">
              <span class="status-dot ${t.dotClass}"></span>
              <span class="group-title">${t.title}</span>
              <span class="group-count-badge">${t.items.length}</span>
            </div>
            <div class="flex items-center gap-2xs">
              <span class="material-symbols-outlined icon-2xs text-muted cursor-pointer">more_horiz</span>
              <span class="material-symbols-outlined icon-2xs text-muted cursor-pointer btn-add-group-item" data-status="${t.key}">add</span>
            </div>
          </div>

          <!-- Table Items -->
          <table class="starline-table">
            <thead>
              <tr>
                <th style="width:50%">Name <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
                <th style="width:12%">Priority <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
                <th style="width:12%">List <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
                <th style="width:14%">Due date <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
                <th style="width:12%">Assignee <span class="material-symbols-outlined icon-3xs">unfold_more</span></th>
              </tr>
            </thead>
            <tbody>
              ${t.items.map(s=>$e(s)).join("")}
            </tbody>
          </table>
        </div>
      `).join("")}
    </div>
  `}function $e(e){let a="badge-priority-notset",t="Not set";e.priority==="urgent"?(a="badge-priority-high",t="High"):e.priority==="important"?(a="badge-priority-medium",t="Medium"):e.priority==="normal"&&(a="badge-priority-low",t="Low");let s="📅 Add date",n=!1;if(e.dueDate)try{s=new Date(e.dueDate).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"}),n=!0}catch{s=e.dueDate}const o=(Array.isArray(e.people)&&e.people.length>0?e.people:["UX","UI"]).map((l,r)=>`
    <span class="gradient-avatar avatar-sm avatar-grad-${r%4}">${l}</span>
  `).join("");return`
    <tr class="starline-row" data-id="${e.id}">
      <td class="cell-name">
        <div class="flex items-center gap-xs">
          <span class="task-code-key">${e.taskCode||`TK-${e.id}`}</span>
          <span class="task-title-text editable-title font-weight-600" data-id="${e.id}">${e.title}</span>
        </div>
      </td>
      <td class="cell-priority">
        <span class="starline-priority-pill ${a}">${t}</span>
      </td>
      <td class="cell-list">
        <div class="flex items-center gap-2xs text-muted font-size-13">
          <span class="material-symbols-outlined icon-2xs">reorder</span>
          <span>${e.listCategory||"UXR"}</span>
        </div>
      </td>
      <td class="cell-date ${n?"text-dark":"text-muted-placeholder"} font-size-13">
        ${s}
      </td>
      <td class="cell-assignee">
        <div class="avatar-stack-overlapping">
          ${o}
        </div>
      </td>
    </tr>
  `}function Se(e){return`
    <div class="kanban-grid grid grid-cols-4 gap-md">
      ${[{key:"backlog",title:"Backlog",color:"#94a3b8",items:e.backlog||[]},{key:"on_progress",title:"In progress",color:"#f59e0b",items:e.on_progress||[]},{key:"in_review",title:"In review",color:"#a855f7",items:e.in_review||[]},{key:"done",title:"Done",color:"#22c55e",items:e.done||[]}].map(t=>`
        <div class="kanban-column" style="border-top: 3px solid ${t.color}">
          <div class="kanban-column-header flex items-center justify-between mb-xs">
            <span class="font-weight-600 font-size-13">${t.title} <span class="count-pill">${t.items.length}</span></span>
            <span class="material-symbols-outlined icon-xs text-muted cursor-pointer btn-add-group-item" data-status="${t.key}">add</span>
          </div>
          <div class="kanban-cards flex-col gap-xs">
            ${t.items.map(s=>Ee(s)).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `}function Ee(e){let a=e.priority==="urgent"?"badge-priority-high":e.priority==="important"?"badge-priority-medium":"badge-priority-low",t=e.priority==="urgent"?"High":e.priority==="important"?"Medium":"Low";return`
    <div class="starline-kanban-card" data-id="${e.id}">
      <div class="flex justify-between items-center mb-2xs">
        <span class="task-code-key">${e.taskCode||`TK-${e.id}`}</span>
        <span class="starline-priority-pill ${a}">${t}</span>
      </div>
      <div class="font-weight-600 font-size-13 text-dark mb-xs">${e.title}</div>
      <div class="flex justify-between items-center text-xs text-muted pt-2xs border-top">
        <span>${e.listCategory||"UXR"}</span>
        <span>${e.dueDate||"No date"}</span>
      </div>
    </div>
  `}function Te(e){return`
    <div class="gantt-wrapper p-md bg-white border-radius-12 border-subtle">
      <div class="flex justify-between items-center mb-md border-bottom pb-xs">
        <div class="font-weight-700 font-size-16">Sprint Timeline — May 2026</div>
        <div class="flex items-center gap-xs font-size-13 text-muted">
          <span>May 15</span> <span>➔</span> <span>May 30, 2026</span>
        </div>
      </div>

      <div class="gantt-rows flex-col gap-sm">
        ${e.slice(0,8).map((a,t)=>`
          <div class="gantt-row flex items-center">
            <div class="gantt-task-name" style="width:200px">
              <span class="task-code-key mr-2xs">${a.taskCode}</span>
              <span class="font-size-13 font-weight-600 text-dark">${a.title}</span>
            </div>
            <div class="gantt-timeline-track flex-1 relative bg-light py-2xs border-radius-6">
              <div class="gantt-bar gantt-color-${t%3}" style="margin-left: ${t*8}%; width: ${30+t%3*15}%">
                <span class="gantt-bar-label">${a.listCategory||"UXR"}</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function je(e){const a=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],t=Array.from({length:35},(s,n)=>{const i=n%31+1,o=`2026-05-${i<10?"0"+i:i}`,l=e.filter(r=>r.dueDate===o);return`
      <div class="calendar-day-cell">
        <div class="calendar-day-number">${i}</div>
        <div class="calendar-day-tasks flex-col gap-2xs mt-2xs">
          ${l.map(r=>`
            <div class="starline-cal-pill truncate" data-id="${r.id}">${r.taskCode}: ${r.title}</div>
          `).join("")}
        </div>
      </div>
    `}).join("");return`
    <div class="calendar-container">
      <div class="calendar-week-header grid grid-cols-7 text-center font-weight-600 py-xs border-bottom">
        ${a.map(s=>`<div>${s}</div>`).join("")}
      </div>
      <div class="calendar-grid grid grid-cols-7 gap-xs mt-xs">
        ${t}
      </div>
    </div>
  `}function Ie(e){const a=e.length,t=e.filter(i=>i.status==="on_progress").length,s=e.filter(i=>i.status==="in_review").length,n=e.filter(i=>i.status==="backlog").length;return`
    <div class="dashboard-grid grid grid-cols-4 gap-md">
      <div class="dash-card">
        <div class="text-muted font-size-12">Total Tasks</div>
        <div class="font-weight-800 font-size-24 text-dark mt-2xs">${a}</div>
        <div class="text-success font-size-12 mt-xs">↑ 14 items in sprint</div>
      </div>
      <div class="dash-card">
        <div class="text-muted font-size-12">In Progress</div>
        <div class="font-weight-800 font-size-24 text-amber mt-2xs">${t}</div>
        <div class="text-muted font-size-12 mt-xs">Active development</div>
      </div>
      <div class="dash-card">
        <div class="text-muted font-size-12">In Review</div>
        <div class="font-weight-800 font-size-24 text-purple mt-2xs">${s}</div>
        <div class="text-muted font-size-12 mt-xs">QA & Usability</div>
      </div>
      <div class="dash-card">
        <div class="text-muted font-size-12">Backlog</div>
        <div class="font-weight-800 font-size-24 text-muted mt-2xs">${n}</div>
        <div class="text-muted font-size-12 mt-xs">Planned tasks</div>
      </div>
    </div>
  `}function De(){var t,s;const e=async()=>{const n=await g.list();j({tasks:n});const i=document.getElementById("app");R(i,o=>`
      <div class="flex flex-col min-h-screen">
        ${B()}
        <div class="app-layout">${o}</div>
      </div>
    `)};U(),window.addEventListener("open-new-task-modal",()=>a()),document.querySelectorAll(".starline-tab").forEach(n=>{n.addEventListener("click",()=>{y=n.dataset.view,e()})}),(t=document.getElementById("btn-group-by"))==null||t.addEventListener("click",()=>{u("Grouped by Status","info")}),(s=document.getElementById("btn-filter-toggle"))==null||s.addEventListener("click",()=>{const n=prompt('Filter by Priority: "urgent", "important", "normal", "not_set", or "all"',A);n!==null&&(A=n.trim()||"all",e())}),document.querySelectorAll(".btn-add-group-item").forEach(n=>{n.addEventListener("click",i=>{i.stopPropagation();const o=n.dataset.status;a({status:o})})}),document.querySelectorAll(".editable-title, .starline-kanban-card, .starline-cal-pill").forEach(n=>{n.addEventListener("click",async i=>{var l;const o=n.dataset.id||((l=n.closest("[data-id]"))==null?void 0:l.dataset.id);if(o){const r=c().tasks.find(d=>d.id===parseInt(o));r&&a(r)}})});function a(n=null){document.body.insertAdjacentHTML("beforeend",F(n)),H({onSubmit:async i=>{try{i.id?(await g.update(i.id,i),u("Task updated","success")):(await g.create(i),u("Task created","success")),await e()}catch(o){u(o.message,"error")}}})}}function Le(e,a){var n;setTimeout(()=>{I(),Pe()},0);const{user:t}=c(),s=`
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
                        ${(((n=t.firstName)==null?void 0:n[0])||t.email[0]).toUpperCase()}
                      </div>
                      <div class="flex-1 grid grid-cols-12 gap-sm" style="min-width:250px;">
                        <div class="col-span-6">
                          <label class="input-label" for="firstName">Nama Depan</label>
                          <input type="text" id="firstName" name="firstName" class="input" value="${t.firstName||""}" />
                        </div>
                        <div class="col-span-6">
                          <label class="input-label" for="lastName">Nama Belakang</label>
                          <input type="text" id="lastName" name="lastName" class="input" value="${t.lastName||""}" />
                        </div>
                        <div class="col-span-12">
                          <label class="input-label" for="email">Alamat Email</label>
                          <input type="email" id="email" class="input" value="${t.email}" disabled style="background:var(--surface-low);color:var(--on-surface-variant)" />
                        </div>
                        <div class="col-span-12">
                          <label class="input-label" for="bio">Bio</label>
                          <textarea id="bio" name="bio" class="input" rows="3" placeholder="Tulis sedikit tentang diri Anda...">${t.bio||""}</textarea>
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
                  <button class="btn ${t.theme==="light"?"btn-primary":"btn-secondary"}" data-theme-select="light">
                    <span class="material-symbols-outlined icon-sm">light_mode</span> Terang
                  </button>
                  <button class="btn ${t.theme==="dark"?"btn-primary":"btn-secondary"}" data-theme-select="dark">
                    <span class="material-symbols-outlined icon-sm">dark_mode</span> Gelap
                  </button>
                  <button class="btn ${t.theme==="system"?"btn-primary":"btn-secondary"}" data-theme-select="system">
                    <span class="material-symbols-outlined icon-sm">settings_brightness</span> Sistem
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  `;e.innerHTML=a(s)}function Pe(){var i;const e=document.querySelectorAll(".settings-nav .sidebar-link[data-tab]"),a=document.querySelectorAll(".settings-section");e.forEach(o=>{o.addEventListener("click",()=>{e.forEach(r=>r.classList.remove("active")),o.classList.add("active"),a.forEach(r=>r.style.display="none");const l=o.getAttribute("data-tab");document.getElementById(`section-${l}`).style.display="block"})});const t=document.getElementById("profile-form"),s=document.getElementById("btn-save-profile");t&&t.addEventListener("submit",async o=>{o.preventDefault(),s.textContent="Menyimpan...",s.disabled=!0;const l=new FormData(t),r={firstName:l.get("firstName"),lastName:l.get("lastName"),bio:l.get("bio"),theme:c().user.theme};try{await S.updateProfile(r);const d=await S.me();j({user:d}),u("Profil berhasil diperbarui","success")}catch(d){u(d.message,"error")}finally{s.textContent="Simpan Perubahan",s.disabled=!1}});const n=document.getElementById("password-form");n&&n.addEventListener("submit",o=>{o.preventDefault();const l=document.getElementById("newPassword").value,r=document.getElementById("confirmPassword").value;if(l!==r){u("Kata sandi baru tidak cocok","error");return}u("Kata sandi berhasil diperbarui!","success"),n.reset()}),document.querySelectorAll("[data-theme-select]").forEach(o=>{o.addEventListener("click",async()=>{const l=o.dataset.themeSelect;be(l);try{await S.updateProfile({...c().user,theme:l});const r=await S.me();j({user:r}),document.querySelectorAll("[data-theme-select]").forEach(d=>{d.className=`btn ${d.dataset.themeSelect===l?"btn-primary":"btn-secondary"}`})}catch(r){console.error(r)}})}),(i=document.getElementById("btn-logout"))==null||i.addEventListener("click",()=>{O(null),j({user:null,tasks:[],projects:[]}),b("/login")})}const k=document.getElementById("app");te(()=>{b("/login")});async function E(){try{const[e,a,t]=await Promise.all([S.me(),g.list(),ae.list()]);return j({user:e,tasks:a,projects:t}),!0}catch(e){return console.error("Failed to init state:",e),!1}}function T(e){return`
    <div class="flex flex-col min-h-screen">
      ${B()}
      <div class="app-layout">
        ${e}
      </div>
    </div>
  `}w("/",e=>{x()?b("/projects"):(k.innerHTML=B({isLanding:!0})+Z(),I())});w("/login",()=>{if(x())return b("/projects");k.innerHTML=W(!1)});w("/register",()=>{if(x())return b("/projects");k.innerHTML=W(!0)});w("/inbox",async()=>{if(!x())return b("/login");c().user||await E(),R(k,T)});w("/today",async()=>{if(!x())return b("/login");c().user||await E(),K(k,T,{view:"today"})});w("/upcoming",async()=>{if(!x())return b("/login");c().user||await E(),K(k,T,{view:"upcoming"})});w("/calendar",async()=>{if(!x())return b("/login");c().user||await E(),xe(k,T)});w("/project/:id",async e=>{if(!x())return b("/login");c().user||await E();const a=parseInt(e.split("/")[2]);K(k,T,{view:"project",projectId:a})});w("/projects",async()=>{if(!x())return b("/login");c().user||await E(),R(k,T)});w("/settings",async()=>{if(!x())return b("/login");c().user||await E(),Le(k,T)});X();ie();
