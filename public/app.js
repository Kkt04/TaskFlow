/* ─── State ───────────────────────────────────────────────────────────────── */
const API = '/api';
let token       = localStorage.getItem('tf_token');
let currentUser = localStorage.getItem('tf_user');
let activeFilter = 'all';
let pollTimer;

/* ─── Utilities ───────────────────────────────────────────────────────────── */
const root = () => document.getElementById('root');
const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
});

function toast(msg, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const now = new Date();
    const diff = d - now;
    const days = Math.ceil(diff / 86400000);
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (days < 0)  return { label: `${formatted} — Overdue`, cls: 'overdue' };
    if (days === 0) return { label: 'Due today', cls: 'soon' };
    if (days <= 3)  return { label: `${formatted} — ${days}d left`, cls: 'soon' };
    return { label: formatted, cls: '' };
}

/* ─── Auth API ────────────────────────────────────────────────────────────── */
async function login(username, password) {
    const res  = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    token = data.token; currentUser = data.username;
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_user', currentUser);
    return data;
}

async function register(username, password) {
    const res  = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    token = data.token; currentUser = data.username;
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_user', currentUser);
    return data;
}

function logout() {
    token = null; currentUser = null;
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    clearInterval(pollTimer);
    renderAuth();
}

/* ─── Task API ────────────────────────────────────────────────────────────── */
async function fetchTasks() {
    const res = await fetch(`${API}/tasks`, { headers: authHeaders() });
    if (!res.ok) { logout(); return []; }
    return res.json();
}

async function createTask(payload) {
    const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return res.json();
}

async function updateTask(id, payload) {
    const res = await fetch(`${API}/tasks/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return res.json();
}

async function deleteTask(id) {
    await fetch(`${API}/tasks/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
}

/* ─── Polling ─────────────────────────────────────────────────────────────── */
function startPolling() {
    clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
        const tasks = await fetchTasks();
        renderTasks(tasks);
    }, 10000);
}

/* ─── Auth Screen ─────────────────────────────────────────────────────────── */
function renderAuth(activeTab = 'login') {
    root().innerHTML = `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">⚡</div>
          <h1>TaskFlow</h1>
        </div>
        <p class="auth-subtitle">Your intelligent task manager. Stay focused, ship faster.</p>

        <div class="auth-tabs">
          <button class="auth-tab ${activeTab === 'login' ? 'active' : ''}" id="tab-login">Sign In</button>
          <button class="auth-tab ${activeTab === 'register' ? 'active' : ''}" id="tab-register">Sign Up</button>
        </div>

        <form id="auth-form" novalidate>
          <div class="field">
            <label for="auth-username">Username</label>
            <input id="auth-username" type="text" placeholder="Enter your username" autocomplete="username" />
          </div>
          <div class="field">
            <label for="auth-password">Password</label>
            <input id="auth-password" type="password" placeholder="Enter your password" autocomplete="current-password" />
          </div>
          <button type="submit" class="btn btn-primary" id="auth-submit" style="margin-top:8px;">
            ${activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
          <div id="auth-error"></div>
        </form>
      </div>
    </div>`;

    let mode = activeTab;

    document.getElementById('tab-login').onclick = () => {
        mode = 'login';
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('auth-submit').textContent = 'Sign In';
        document.getElementById('auth-error').innerHTML = '';
    };
    document.getElementById('tab-register').onclick = () => {
        mode = 'register';
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-register').classList.add('active');
        document.getElementById('auth-submit').textContent = 'Create Account';
        document.getElementById('auth-error').innerHTML = '';
    };

    document.getElementById('auth-form').onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('auth-username').value.trim();
        const password = document.getElementById('auth-password').value;
        const errEl    = document.getElementById('auth-error');
        const btn      = document.getElementById('auth-submit');

        if (!username || !password) {
            errEl.innerHTML = '<div class="auth-error">Both fields are required.</div>';
            return;
        }

        btn.innerHTML = '<span class="spinner"></span>';
        btn.disabled = true;
        try {
            if (mode === 'login') await login(username, password);
            else                  await register(username, password);
            toast(`Welcome, ${currentUser}! 🎉`);
            const tasks = await fetchTasks();
            renderApp(tasks);
            startPolling();
        } catch (err) {
            errEl.innerHTML = `<div class="auth-error">${err.message}</div>`;
            btn.textContent = mode === 'login' ? 'Sign In' : 'Create Account';
            btn.disabled = false;
        }
    };
}

/* ─── Main App ────────────────────────────────────────────────────────────── */
function renderApp(tasks) {
    const initials = (currentUser || '?').slice(0, 2).toUpperCase();

    root().innerHTML = `
    <div class="app-layout">
      <nav class="navbar">
        <div class="navbar-brand">
          <div class="logo-icon">⚡</div>
          <h1>TaskFlow</h1>
        </div>
        <div class="navbar-right">
          <div class="user-pill">
            <div class="user-avatar">${initials}</div>
            <span>${currentUser}</span>
          </div>
          <button class="btn btn-ghost btn-sm" id="btn-logout">Sign out</button>
        </div>
      </nav>

      <main class="main-content">
        <!-- Stats -->
        <div class="stats-bar" id="stats-bar"></div>

        <!-- Add Task Panel -->
        <div class="add-task-panel">
          <h2>✦ Add New Task</h2>
          <form id="task-form" novalidate>
            <div class="field">
              <label for="task-title">Task Title *</label>
              <input id="task-title" type="text" placeholder="What needs to be done?" />
            </div>
            <div class="field">
              <label for="task-desc">Description</label>
              <textarea id="task-desc" rows="2" placeholder="Add more details (optional)"></textarea>
            </div>
            <div class="form-row">
              <div class="field">
                <label for="task-tag">Category</label>
                <select id="task-tag">
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="urgent">Urgent</option>
                  <option value="learning">Learning</option>
                  <option value="health">Health</option>
                </select>
              </div>
              <div class="field">
                <label for="task-due">Due Date</label>
                <input id="task-due" type="date" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" style="width:auto;padding:12px 28px" id="btn-add-task">Add Task</button>
            </div>
          </form>
        </div>

        <!-- Task List -->
        <div class="section-header">
          <h2 class="section-title">My Tasks <span id="task-count"></span></h2>
          <div class="filter-bar" id="filter-bar">
            <button class="filter-chip active" data-filter="all">All</button>
            <button class="filter-chip" data-filter="todo">To Do</button>
            <button class="filter-chip" data-filter="done">Done</button>
            <button class="filter-chip" data-filter="urgent">Urgent</button>
            <button class="filter-chip" data-filter="work">Work</button>
          </div>
        </div>

        <div class="task-grid" id="task-grid"></div>
      </main>
    </div>`;

    // Wire buttons
    document.getElementById('btn-logout').onclick = () => { logout(); };

    // Filters
    document.getElementById('filter-bar').querySelectorAll('.filter-chip').forEach(chip => {
        chip.onclick = () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.dataset.filter;
            renderTasks(tasks);
        };
    });

    // Add task form
    document.getElementById('task-form').onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value.trim();
        if (!title) { toast('Task title is required.', 'error'); return; }

        const btn = document.getElementById('btn-add-task');
        btn.innerHTML = '<span class="spinner"></span>';
        btn.disabled = true;

        try {
            const newTask = await createTask({
                title,
                description: document.getElementById('task-desc').value.trim(),
                tag:         document.getElementById('task-tag').value,
                dueDate:     document.getElementById('task-due').value || null,
            });
            tasks.unshift(newTask);
            // Reset form
            document.getElementById('task-title').value = '';
            document.getElementById('task-desc').value  = '';
            document.getElementById('task-due').value   = '';
            toast('Task created! 🚀');
            renderTasks(tasks);
        } catch {
            toast('Could not create task.', 'error');
        } finally {
            btn.textContent = 'Add Task';
            btn.disabled = false;
        }
    };

    renderTasks(tasks);
}

/* ─── Task List Render ────────────────────────────────────────────────────── */
function renderTasks(tasks) {
    const grid     = document.getElementById('task-grid');
    const countEl  = document.getElementById('task-count');
    const statsBar = document.getElementById('stats-bar');
    if (!grid) return;

    // Stats
    const total    = tasks.length;
    const done     = tasks.filter(t => t.done).length;
    const overdue  = tasks.filter(t => t.dueDate && !t.done && new Date(t.dueDate) < new Date()).length;
    const today    = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()).length;

    if (statsBar) {
        statsBar.innerHTML = `
        <div class="stat-card" style="animation-delay:0s">
          <div class="stat-icon purple">📋</div>
          <div class="stat-info">
            <div class="stat-num">${total}</div>
            <div class="stat-label">Total Tasks</div>
          </div>
        </div>
        <div class="stat-card" style="animation-delay:0.07s">
          <div class="stat-icon cyan">🔄</div>
          <div class="stat-info">
            <div class="stat-num">${total - done}</div>
            <div class="stat-label">In Progress</div>
          </div>
        </div>
        <div class="stat-card" style="animation-delay:0.14s">
          <div class="stat-icon green">✅</div>
          <div class="stat-info">
            <div class="stat-num">${done}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
        <div class="stat-card" style="animation-delay:0.21s">
          <div class="stat-icon amber">⚠️</div>
          <div class="stat-info">
            <div class="stat-num">${overdue}</div>
            <div class="stat-label">Overdue</div>
          </div>
        </div>`;
    }

    // Filter
    let visible = tasks;
    if (activeFilter === 'todo')   visible = tasks.filter(t => !t.done);
    if (activeFilter === 'done')   visible = tasks.filter(t => t.done);
    if (activeFilter === 'urgent') visible = tasks.filter(t => t.tag === 'urgent');
    if (activeFilter === 'work')   visible = tasks.filter(t => t.tag === 'work');

    if (countEl) countEl.textContent = `(${visible.length})`;

    if (!visible.length) {
        grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🗂️</div>
          <h3>${activeFilter === 'all' ? 'No tasks yet' : `No ${activeFilter} tasks`}</h3>
          <p>Add your first task using the form above.</p>
        </div>`;
        return;
    }

    grid.innerHTML = visible.map((task, i) => {
        const due    = task.dueDate ? formatDate(task.dueDate) : null;
        const tagCls = `tag-${task.tag || 'personal'}`;
        return `
        <div class="task-card ${task.done ? 'done' : ''}" style="animation-delay:${i * 0.05}s" id="card-${task._id}">
          <div class="task-card-header">
            <div class="task-check ${task.done ? 'checked' : ''}" data-id="${task._id}" data-done="${task.done}"></div>
            <div class="task-title">${escHtml(task.title)}</div>
          </div>
          ${task.description ? `<div class="task-desc">${escHtml(task.description)}</div>` : ''}
          <div class="task-meta">
            <span class="tag-badge ${tagCls}">${task.tag || 'personal'}</span>
            ${due ? `<span class="due-badge ${due.cls}">📅 ${due.label}</span>` : ''}
          </div>
          <div class="task-actions">
            <button class="btn btn-danger btn-sm" data-delete="${task._id}">🗑 Delete</button>
          </div>
        </div>`;
    }).join('');

    // Toggle done
    grid.querySelectorAll('.task-check').forEach(el => {
        el.onclick = async () => {
            const id   = el.dataset.id;
            const done = el.dataset.done === 'true';
            const updated = await updateTask(id, { done: !done });
            const idx = tasks.findIndex(t => t._id === id);
            if (idx !== -1) tasks[idx] = updated;
            renderTasks(tasks);
            toast(done ? 'Marked as to-do.' : 'Task completed! ✅');
        };
    });

    // Delete
    grid.querySelectorAll('[data-delete]').forEach(el => {
        el.onclick = async () => {
            const id = el.dataset.delete;
            el.innerHTML = '<span class="spinner"></span>';
            el.disabled = true;
            await deleteTask(id);
            const idx = tasks.findIndex(t => t._id === id);
            if (idx !== -1) tasks.splice(idx, 1);
            renderTasks(tasks);
            toast('Task deleted.');
        };
    });
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function escHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── Init ────────────────────────────────────────────────────────────────── */
(async function init() {
    if (token) {
        root().innerHTML = `
        <div class="loading-screen">
          <div class="spinner big-spinner"></div>
          <span>Loading your tasks…</span>
        </div>`;
        try {
            const tasks = await fetchTasks();
            renderApp(tasks);
            startPolling();
        } catch {
            logout();
        }
    } else {
        renderAuth();
    }
})();