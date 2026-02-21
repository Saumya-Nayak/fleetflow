// api.js - Central API handler for FleetFlow
const API_BASE = "http://127.0.0.1:5000/api";

const api = {
  async req(method, path, body = null) {
    const opts = {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    if (body) opts.body = JSON.stringify(body);
    try {
      const res = await fetch(`${API_BASE}${path}`, opts);
      const data = await res.json();
      return { ok: res.ok, data };
    } catch (e) {
      return {
        ok: false,
        data: { message: "Network error. Is the server running?" },
      };
    }
  },
  get: (path) => api.req("GET", path),
  post: (path, body) => api.req("POST", path, body),
  put: (path, body) => api.req("PUT", path, body),
  delete: (path) => api.req("DELETE", path),

  // Scoped endpoints
  auth: {
    login: (b) => api.post("/login", b),
    logout: () => api.post("/logout"),
    register: (b) => api.post("/register", b),
    me: () => api.get("/me"),
  },
  dashboard: {
    get: () => api.get("/dashboard"),
  },
  vehicles: {
    list: (params = "") => api.get(`/vehicles${params}`),
    add: (b) => api.post("/vehicles", b),
    update: (id, b) => api.put(`/vehicles/${id}`, b),
    retire: (id) => api.delete(`/vehicles/${id}`),
    toggleService: (id) => api.post(`/vehicles/${id}/toggle-service`),
  },
  drivers: {
    list: (params = "") => api.get(`/drivers${params}`),
    add: (b) => api.post("/drivers", b),
    update: (id, b) => api.put(`/drivers/${id}`, b),
    setStatus: (id, s) => api.post(`/drivers/${id}/status`, { status: s }),
  },
  trips: {
    list: (params = "") => api.get(`/trips${params}`),
    create: (b) => api.post("/trips", b),
    complete: (id, b) => api.post(`/trips/${id}/complete`, b),
    cancel: (id) => api.post(`/trips/${id}/cancel`),
  },
  maintenance: {
    list: () => api.get("/maintenance"),
    add: (b) => api.post("/maintenance", b),
    update: (id, b) => api.put(`/maintenance/${id}`, b),
  },
  expenses: {
    list: () => api.get("/expenses"),
    add: (b) => api.post("/expenses", b),
  },
  analytics: {
    get: () => api.get("/analytics"),
  },
};

// ── Toast Notifications ───────────────────────────────────
function toast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
  t.innerHTML = `<span class="toast-icon">${
    icons[type] || "ℹ️"
  }</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.classList.add("out");
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// ── State Management ──────────────────────────────────────
const state = {
  user: null,
  theme: localStorage.getItem("ff_theme") || "dark",
  vehicles: [],
  drivers: [],
  trips: [],
};

// ── Theme ─────────────────────────────────────────────────
function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem("ff_theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

// ── Pill helper ───────────────────────────────────────────
function statusPill(status) {
  const map = {
    Available: "pill-teal",
    "On Trip": "pill-accent",
    "In Shop": "pill-warning",
    Retired: "pill-muted",
    "On Duty": "pill-success",
    "Off Duty": "pill-muted",
    Suspended: "pill-danger",
    Draft: "pill-muted",
    Dispatched: "pill-accent",
    Completed: "pill-success",
    Cancelled: "pill-danger",
    New: "pill-warning",
    "In Progress": "pill-accent",
  };
  return `<span class="pill ${map[status] || "pill-muted"}">${status}</span>`;
}

// ── Format currency ───────────────────────────────────────
function fmtRs(n) {
  const num = parseFloat(n) || 0;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toFixed(0)}`;
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Modal helper ──────────────────────────────────────────
function openModal(html) {
  closeModal();
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "active-modal";
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.body.appendChild(overlay);
}

function closeModal() {
  document.getElementById("active-modal")?.remove();
}
