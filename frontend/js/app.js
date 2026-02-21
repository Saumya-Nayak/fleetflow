// ═══════════════════════════════════════════════════════════
//  FleetFlow — Role-Based Application (Enhanced)
// ═══════════════════════════════════════════════════════════

let currentPage = "";

// ── Add user management API endpoint ─────────────────────
Object.assign(api, {
  users: {
    list: () => api.get("/users"),
    update: (id, b) => api.put(`/users/${id}`, b),
    remove: (id) => api.delete(`/users/${id}`),
  },
});
// Override analytics to support period param
api.analytics = {
  get: (period = "all") => api.get(`/analytics?period=${period}`),
};

// ── Role Configurations ───────────────────────────────────
const ROLE_CONFIG = {
  manager: {
    label: "👨‍💼 Fleet Manager",
    color: "accent",
    home: "mgr-dashboard",
    pages: [
      {
        id: "mgr-dashboard",
        label: "Command Center",
        icon: "🏠",
        section: "Overview",
      },
      {
        id: "mgr-vehicles",
        label: "Vehicle Registry",
        icon: "🚛",
        section: "Fleet",
      },
      {
        id: "mgr-maintenance",
        label: "Maintenance Logs",
        icon: "🔧",
        section: "Fleet",
      },
      {
        id: "mgr-drivers",
        label: "All Drivers",
        icon: "👤",
        section: "People",
      },
      {
        id: "mgr-trips",
        label: "All Trips",
        icon: "🗺️",
        section: "Operations",
      },
      {
        id: "mgr-expenses",
        label: "All Expenses",
        icon: "💰",
        section: "Finance",
      },
      {
        id: "mgr-users",
        label: "User Management",
        icon: "👥",
        section: "Admin",
      },
      {
        id: "mgr-analytics",
        label: "Fleet Analytics",
        icon: "📊",
        section: "Insights",
      },
    ],
  },
  dispatcher: {
    label: "📦 Dispatcher",
    color: "teal",
    home: "dsp-dashboard",
    pages: [
      {
        id: "dsp-dashboard",
        label: "Dispatch Center",
        icon: "🏠",
        section: "Overview",
      },
      {
        id: "dsp-trips",
        label: "Trip Dispatcher",
        icon: "🗺️",
        section: "Operations",
      },
      {
        id: "dsp-vehicles",
        label: "Available Vehicles",
        icon: "🚛",
        section: "Operations",
      },
      {
        id: "dsp-drivers",
        label: "Available Drivers",
        icon: "👤",
        section: "Operations",
      },
    ],
  },
  safety_officer: {
    label: "🛡️ Safety Officer",
    color: "warning",
    home: "saf-dashboard",
    pages: [
      {
        id: "saf-dashboard",
        label: "Safety Center",
        icon: "🏠",
        section: "Overview",
      },
      {
        id: "saf-drivers",
        label: "Driver Profiles",
        icon: "👤",
        section: "Compliance",
      },
      {
        id: "saf-maintenance",
        label: "Vehicle Compliance",
        icon: "🔧",
        section: "Compliance",
      },
      {
        id: "saf-compliance",
        label: "License Tracker",
        icon: "📋",
        section: "Compliance",
      },
    ],
  },
  analyst: {
    label: "💰 Financial Analyst",
    color: "success",
    home: "fin-dashboard",
    pages: [
      {
        id: "fin-dashboard",
        label: "Finance Center",
        icon: "🏠",
        section: "Overview",
      },
      {
        id: "fin-expenses",
        label: "Expense Logger",
        icon: "💰",
        section: "Finance",
      },
      {
        id: "fin-reports",
        label: "Reports & Charts",
        icon: "📈",
        section: "Finance",
      },
    ],
  },
};

// ── Build Sidebar per Role ────────────────────────────────
function setupRoleUI(role) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.manager;
  document.getElementById("role-label").textContent = cfg.label;

  const badge = document.getElementById("role-badge");
  badge.innerHTML = `<span class="pill pill-${cfg.color}" style="font-size:12px">${cfg.label}</span>`;

  let html = "";
  let lastSection = "";
  cfg.pages.forEach((p) => {
    if (p.section !== lastSection) {
      html += `<div class="nav-section-label">${p.section}</div>`;
      lastSection = p.section;
    }
    html += `<a class="nav-link" data-page="${p.id}" onclick="navigate('${p.id}')">${p.icon} ${p.label}</a>`;
  });
  document.getElementById("sidebar-nav").innerHTML = html;
  navigate(cfg.home);
}

// ── Router ────────────────────────────────────────────────
function navigate(page) {
  currentPage = page;
  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.toggle("active", l.dataset.page === page));

  const titles = {
    "mgr-dashboard": { t: "Command Center", s: "Fleet overview for managers" },
    "mgr-vehicles": { t: "Vehicle Registry", s: "Full fleet asset management" },
    "mgr-maintenance": {
      t: "Maintenance Logs",
      s: "Service & repair tracking",
    },
    "mgr-drivers": { t: "All Drivers", s: "Complete driver roster" },
    "mgr-trips": { t: "All Trips", s: "Full trip history & status" },
    "mgr-expenses": { t: "All Expenses", s: "Fuel & operational costs" },
    "mgr-users": { t: "User Management", s: "Add, remove & assign roles" },
    "mgr-analytics": {
      t: "Fleet Analytics",
      s: "Performance & ROI insights with charts",
    },
    "dsp-dashboard": { t: "Dispatch Center", s: "Active trips & cargo queue" },
    "dsp-trips": { t: "Trip Dispatcher", s: "Create & manage deliveries" },
    "dsp-vehicles": {
      t: "Available Vehicles",
      s: "Vehicles ready for dispatch",
    },
    "dsp-drivers": { t: "Available Drivers", s: "On-duty driver roster" },
    "saf-dashboard": { t: "Safety Center", s: "Driver compliance overview" },
    "saf-drivers": { t: "Driver Profiles", s: "Performance & safety records" },
    "saf-maintenance": {
      t: "Vehicle Compliance",
      s: "Maintenance & compliance tracking",
    },
    "saf-compliance": { t: "License Tracker", s: "Expiry monitoring & alerts" },
    "fin-dashboard": { t: "Finance Center", s: "Costs, revenue & profit" },
    "fin-expenses": { t: "Expense Logger", s: "Fuel & trip cost logging" },
    "fin-reports": {
      t: "Reports & Charts",
      s: "Monthly financial analysis with charts",
    },
  };

  const info = titles[page] || { t: page, s: "" };
  document.getElementById("topbar-title").textContent = info.t;
  document.getElementById("topbar-subtitle").textContent = info.s;
  document.querySelector(".page-content").innerHTML =
    '<div class="loading-overlay"><div class="spinner"></div> Loading...</div>';

  const handlers = {
    "mgr-dashboard": renderManagerDashboard,
    "mgr-vehicles": renderManagerVehicles,
    "mgr-maintenance": renderManagerMaintenance,
    "mgr-drivers": renderManagerDrivers,
    "mgr-trips": renderManagerTrips,
    "mgr-expenses": renderManagerExpenses,
    "mgr-users": renderManagerUsers,
    "mgr-analytics": renderManagerAnalytics,
    "dsp-dashboard": renderDispatcherDashboard,
    "dsp-trips": renderDispatcherTrips,
    "dsp-vehicles": renderDispatcherVehicles,
    "dsp-drivers": renderDispatcherDrivers,
    "saf-dashboard": renderSafetyDashboard,
    "saf-drivers": renderSafetyDrivers,
    "saf-maintenance": renderSafetyMaintenance,
    "saf-compliance": renderSafetyCompliance,
    "fin-dashboard": renderFinanceDashboard,
    "fin-expenses": renderFinanceExpenses,
    "fin-reports": renderFinanceReports,
  };
  if (handlers[page]) handlers[page]();
}

// ═══════════════════════════════════════════════════════════
//  SHARED HELPERS
// ═══════════════════════════════════════════════════════════
function setContent(html) {
  document.querySelector(
    ".page-content"
  ).innerHTML = `<div class="page-enter">${html}</div>`;
}

function kpiCard(label, value, color, emoji, sub = "") {
  return `
    <div class="kpi-card ${color}">
      <div style="font-size:28px;margin-bottom:10px">${emoji}</div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-label">${label}</div>
      ${
        sub
          ? `<div class="fs-12 text-muted" style="margin-top:4px">${sub}</div>`
          : ""
      }
    </div>`;
}

function pageHeader(title, subtitle, btn = "") {
  return `
    <div class="page-header">
      <div class="page-title-group"><h1>${title}</h1><p>${subtitle}</p></div>
      <div class="page-actions">${btn}</div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════
//  CHART HELPERS (Canvas-based, no external library)
// ═══════════════════════════════════════════════════════════
function drawBarChart(canvasId, labels, datasets, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = (canvas.width = canvas.offsetWidth || 500);
  const H = (canvas.height = options.height || 280);
  ctx.clearRect(0, 0, W, H);

  const padL = 60,
    padR = 20,
    padT = 20,
    padB = 60;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // Find max value
  const allVals = datasets.flatMap((d) =>
    d.data.map((v) => parseFloat(v) || 0)
  );
  const maxVal = Math.max(...allVals, 1);

  const n = labels.length;
  const groupW = chartW / n;
  const barW = (groupW / datasets.length) * 0.7;
  const gap = (groupW - barW * datasets.length) / 2;

  // Theme colors
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  // Grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + chartH - (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + chartW, y);
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "right";
    const val = (maxVal / 4) * i;
    ctx.fillText(
      val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val.toFixed(0),
      padL - 6,
      y + 4
    );
  }

  // Bars
  datasets.forEach((ds, di) => {
    ds.data.forEach((val, i) => {
      const x = padL + i * groupW + gap + di * barW;
      const barH = (parseFloat(val) / maxVal) * chartH;
      const y = padT + chartH - barH;

      ctx.fillStyle = ds.color;
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(x, y, barW - 2, barH, [3, 3, 0, 0])
        : ctx.rect(x, y, barW - 2, barH);
      ctx.fill();
    });
  });

  // X labels
  ctx.fillStyle = textColor;
  ctx.font = "11px Inter, sans-serif";
  ctx.textAlign = "center";
  labels.forEach((label, i) => {
    const x = padL + i * groupW + groupW / 2;
    const shortLabel = label.length > 8 ? label.substring(0, 7) + "…" : label;
    ctx.fillText(shortLabel, x, H - 10);
  });

  // Legend
  if (datasets.length > 1) {
    let lx = padL;
    datasets.forEach((ds) => {
      ctx.fillStyle = ds.color;
      ctx.fillRect(lx, 4, 12, 8);
      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.font = "10px Inter, sans-serif";
      ctx.fillText(ds.label, lx + 15, 12);
      lx += ctx.measureText(ds.label).width + 35;
    });
  }
}

function drawPieChart(canvasId, labels, values, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = (canvas.width = canvas.offsetWidth || 300);
  const H = (canvas.height = 260);
  ctx.clearRect(0, 0, W, H);

  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    ctx.fillStyle = isDark ? "#94a3b8" : "#64748b";
    ctx.font = "14px Inter";
    ctx.textAlign = "center";
    ctx.fillText("No data available", W / 2, H / 2);
    return;
  }

  const cx = W / 2 - 30,
    cy = H / 2 - 10,
    r = Math.min(cx, cy, 90);
  let startAngle = -Math.PI / 2;

  values.forEach((val, i) => {
    const slice = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "#1a2236"
        : "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    startAngle += slice;
  });

  // Legend
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  ctx.font = "11px Inter, sans-serif";
  const legendX = W - 105;
  labels.forEach((label, i) => {
    const y = 30 + i * 22;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(legendX, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isDark ? "#94a3b8" : "#64748b";
    ctx.textAlign = "left";
    const pct = total > 0 ? ((values[i] / total) * 100).toFixed(0) : 0;
    ctx.fillText(`${label} (${pct}%)`, legendX + 12, y + 4);
  });
}

const CHART_COLORS = {
  accent: "#6366f1",
  teal: "#14b8a6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#a855f7",
  blue: "#3b82f6",
  orange: "#f97316",
};

// ═══════════════════════════════════════════════════════════
//  👨‍💼 MANAGER PAGES
// ═══════════════════════════════════════════════════════════
async function renderManagerDashboard() {
  const { ok, data } = await api.dashboard.get();
  if (!ok) {
    toast(data.message, "error");
    return;
  }
  const d = data.data;

  setContent(`
    <div class="role-header manager-header">
      <div>
        <h2>👨‍💼 Fleet Manager Dashboard</h2>
        <p>Full operational overview — vehicles, maintenance, drivers & fleet performance</p>
      </div>
    </div>

    <div class="kpi-grid">
      ${kpiCard("Active Fleet", d.active_fleet, "accent", "🚛", "On Trip now")}
      ${kpiCard(
        "In Shop",
        d.maintenance_alerts,
        "warning",
        "🔧",
        "Under service"
      )}
      ${kpiCard(
        "Utilization Rate",
        d.utilization_rate + "%",
        "teal",
        "📈",
        "Fleet in use"
      )}
      ${kpiCard(
        "Pending Cargo",
        d.pending_cargo,
        "danger",
        "📦",
        "Awaiting dispatch"
      )}
      ${
        d.expired_licenses > 0
          ? kpiCard(
              "Expired Licenses",
              d.expired_licenses,
              "danger",
              "⚠️",
              "Needs attention"
            )
          : kpiCard("Licenses OK", "✅", "success", "🛡️", "All valid")
      }
    </div>

    ${
      d.expired_licenses > 0
        ? `
    <div class="alert alert-danger">
      ⚠️ <strong>${d.expired_licenses} driver(s)</strong> have expired licenses. Contact Safety Officer immediately.
    </div>`
        : ""
    }

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:4px">
      <div class="card">
        <div class="card-header"><span class="card-title">⚡ Quick Actions</span></div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn btn-primary"   onclick="navigate('mgr-vehicles')"    style="justify-content:flex-start">🚛 &nbsp; Manage Vehicles</button>
          <button class="btn btn-secondary" onclick="navigate('mgr-maintenance')" style="justify-content:flex-start">🔧 &nbsp; Log Maintenance</button>
          <button class="btn btn-secondary" onclick="navigate('mgr-drivers')"     style="justify-content:flex-start">👤 &nbsp; View All Drivers</button>
          <button class="btn btn-secondary" onclick="navigate('mgr-trips')"       style="justify-content:flex-start">🗺️ &nbsp; View All Trips</button>
          <button class="btn btn-secondary" onclick="navigate('mgr-users')"       style="justify-content:flex-start">👥 &nbsp; Manage Users</button>
          <button class="btn btn-secondary" onclick="navigate('mgr-analytics')"   style="justify-content:flex-start">📊 &nbsp; View Analytics</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">🕐 Recent Trips</span></div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Vehicle</th><th>Route</th><th>Status</th></tr></thead>
            <tbody>
              ${
                d.recent_trips
                  .slice(0, 6)
                  .map(
                    (t) => `
              <tr>
                <td class="mono fw-600">${t.license_plate}</td>
                <td class="fs-12">${t.origin} → ${t.destination}</td>
                <td>${statusPill(t.status)}</td>
              </tr>`
                  )
                  .join("") ||
                '<tr><td colspan="3" class="table-empty">No trips</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);
}

async function renderManagerVehicles(filter = "") {
  const { ok, data } = await api.vehicles.list(filter);
  if (!ok) {
    toast(data.message, "error");
    return;
  }
  const vehicles = data.data;

  setContent(`
    ${pageHeader(
      "🚛 Vehicle Registry",
      `${vehicles.length} total vehicles`,
      `<button class="btn btn-primary" onclick="showAddVehicleModal()">+ New Vehicle</button>`
    )}

    <div class="toolbar">
      <div class="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
        <input class="search-input" placeholder="Search plate, name..." id="v-search" oninput="debounce(()=>applyVehicleFilter(),400)">
      </div>
      <select class="filter-select" id="v-type" onchange="applyVehicleFilter()">
        <option value="">All Types</option>
        <option>Truck</option><option>Van</option><option>Bike</option>
      </select>
      <select class="filter-select" id="v-status" onchange="applyVehicleFilter()">
        <option value="">All Status</option>
        <option>Available</option><option>On Trip</option><option>In Shop</option><option>Retired</option>
      </select>
    </div>

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>Plate</th><th>Vehicle</th><th>Type</th><th>Max Load</th>
            <th>Odometer</th><th>Region</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${
              vehicles.length
                ? vehicles
                    .map(
                      (v) => `
              <tr>
                <td class="mono fw-600">${v.license_plate}</td>
                <td><div class="fw-600">${
                  v.name
                }</div><div class="fs-12 text-muted">${v.model}</div></td>
                <td>${v.type}</td>
                <td class="mono">${Number(
                  v.max_capacity_kg
                ).toLocaleString()} kg</td>
                <td class="mono">${Number(
                  v.odometer_km
                ).toLocaleString()} km</td>
                <td>${v.region || "—"}</td>
                <td>${statusPill(v.status)}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-sm btn-secondary" onclick="showEditVehicleModal(${JSON.stringify(
                      v
                    ).replace(/"/g, "&quot;")})">✏️</button>
                    <button class="btn btn-sm ${
                      v.status === "In Shop" ? "btn-success" : "btn-warning"
                    }"
                      onclick="toggleVehicleService(${v.id},'${v.status}')">
                      ${v.status === "In Shop" ? "✅" : "🔧"}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="retireVehicle(${
                      v.id
                    })">🗑</button>
                  </div>
                </td>
              </tr>`
                    )
                    .join("")
                : '<tr><td colspan="8"><div class="table-empty">No vehicles found</div></td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>
  `);
}

async function renderManagerMaintenance() {
  const [mRes, vRes] = await Promise.all([
    api.maintenance.list(),
    api.vehicles.list(),
  ]);
  const logs = mRes.data?.data || [];
  const vehicles = vRes.data?.data || [];
  const activeLogs = logs.filter((l) => l.status !== "Completed");

  setContent(`
    ${pageHeader(
      "🔧 Maintenance & Service Logs",
      `${activeLogs.length} active service(s) — vehicles auto-set to In Shop`,
      `<button class="btn btn-primary" onclick="showAddMaintenanceModal(${JSON.stringify(
        vehicles
      ).replace(/"/g, "&quot;")})">+ Log Service</button>`
    )}

    <div class="alert alert-warning" style="margin-bottom:20px">
      🔁 <strong>Auto-Rule:</strong> Adding a service log automatically sets vehicle to <strong>In Shop</strong> and hides it from Dispatchers.
    </div>

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>Log #</th><th>Vehicle</th><th>Issue / Service</th>
            <th>Cost</th><th>Date</th><th>Status</th><th>Action</th>
          </tr></thead>
          <tbody>
            ${
              logs.length
                ? logs
                    .map(
                      (l) => `
              <tr>
                <td class="mono">#${l.id}</td>
                <td><div class="fw-600">${l.vehicle_name}</div>
                    <div class="fs-12 text-muted">${l.license_plate}</div></td>
                <td>${l.issue_service}<br><span class="fs-12 text-muted">${
                        l.description || ""
                      }</span></td>
                <td class="mono">${fmtRs(l.cost)}</td>
                <td class="fs-12">${fmtDate(l.date)}</td>
                <td>${statusPill(l.status)}</td>
                <td>${
                  l.status !== "Completed"
                    ? `<button class="btn btn-sm btn-success" onclick="resolveMaintenance(${l.id})">✅ Mark Done</button>`
                    : '<span class="text-muted fs-12">Resolved</span>'
                }</td>
              </tr>`
                    )
                    .join("")
                : '<tr><td colspan="7"><div class="table-empty">No maintenance logs</div></td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>
  `);
}

// ── Manager: All Drivers ──────────────────────────────────
async function renderManagerDrivers() {
  const { data } = await api.drivers.list();
  const drivers = data?.data || [];
  const today = new Date().toISOString().split("T")[0];

  setContent(`
    ${pageHeader(
      "👤 All Drivers",
      `${drivers.length} registered drivers`,
      `<button class="btn btn-primary" onclick="showAddDriverModal()">+ Add Driver</button>`
    )}

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>Driver</th><th>License #</th><th>Category</th><th>Expiry</th>
            <th>Safety Score</th><th>Completion</th><th>Complaints</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${drivers
              .map((d) => {
                const expired = d.license_expiry < today;
                const scoreColor =
                  d.safety_score > 80
                    ? "text-success"
                    : d.safety_score > 60
                    ? "text-warning"
                    : "text-danger";
                return `<tr class="${expired ? "row-danger" : ""}">
                <td class="fw-600">${
                  d.name
                }<br><span class="fs-12 text-muted">${d.phone || ""}</span></td>
                <td class="mono fs-12">${d.license_number}</td>
                <td>${d.license_category}</td>
                <td class="${expired ? "text-danger fw-600" : ""}">
                  ${fmtDate(d.license_expiry)}<br>
                  ${
                    expired
                      ? '<span class="pill pill-danger" style="font-size:10px">EXPIRED</span>'
                      : daysUntilExpiry(d.license_expiry) <= 30
                      ? `<span class="pill pill-warning" style="font-size:10px">${daysUntilExpiry(
                          d.license_expiry
                        )}d left</span>`
                      : ""
                  }
                </td>
                <td><span class="${scoreColor} fw-600">${
                  d.safety_score
                }</span></td>
                <td>${d.completion_rate}%</td>
                <td class="${d.complaints > 5 ? "text-danger fw-600" : ""}">${
                  d.complaints
                }</td>
                <td id="driver-status-${d.id}">${statusPill(d.duty_status)}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-sm btn-secondary" onclick="showEditDriverModal(${JSON.stringify(
                      d
                    ).replace(/"/g, "&quot;")})">✏️</button>
                    <button class="btn btn-sm ${
                      d.duty_status === "Suspended"
                        ? "btn-success"
                        : "btn-danger"
                    }"
                      onclick="toggleSuspendDriver(${d.id},'${
                  d.duty_status
                }','${d.name}')">
                      ${
                        d.duty_status === "Suspended"
                          ? "✅ Unsuspend"
                          : "🚫 Suspend"
                      }
                    </button>
                  </div>
                </td>
              </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

// ── Manager: All Trips ────────────────────────────────────
async function renderManagerTrips(filter = "") {
  const { data } = await api.trips.list(filter);
  const trips = data?.data || [];

  setContent(`
    ${pageHeader("🗺️ All Trips", `${trips.length} total trips`)}

    <div class="toolbar">
      <select class="filter-select" onchange="renderManagerTrips(this.value?'?status='+this.value:'')">
        <option value="">All Status</option>
        <option value="Draft">Draft</option><option value="Dispatched">Dispatched</option>
        <option value="On Trip">On Trip</option><option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>#</th><th>Vehicle</th><th>Driver</th><th>Route</th>
            <th>Cargo</th><th>Revenue</th><th>Status</th><th>Completed</th>
          </tr></thead>
          <tbody>
            ${
              trips
                .map(
                  (t) => `
              <tr>
                <td class="mono">#${t.id}</td>
                <td><div class="fw-600">${
                  t.license_plate
                }</div><div class="fs-12 text-muted">${t.fleet_type}</div></td>
                <td>${t.driver_name}</td>
                <td class="fs-12"><span class="text-muted">${
                  t.origin
                }</span><br><strong>${t.destination}</strong></td>
                <td class="mono">${Number(
                  t.cargo_weight_kg
                ).toLocaleString()} kg</td>
                <td class="mono">${fmtRs(t.revenue)}</td>
                <td>${statusPill(t.status)}</td>
                <td class="fs-12 text-muted">${
                  t.completed_at ? fmtDate(t.completed_at) : "—"
                }</td>
              </tr>`
                )
                .join("") ||
              '<tr><td colspan="8"><div class="table-empty">No trips found</div></td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>
  `);
}

// ── Manager: All Expenses ─────────────────────────────────
async function renderManagerExpenses() {
  const [eRes, tRes, dRes] = await Promise.all([
    api.expenses.list(),
    api.trips.list(),
    api.drivers.list(),
  ]);
  const expenses = eRes.data?.data || [];
  const trips = tRes.data?.data || [];
  const drivers = dRes.data?.data || [];
  const totalFuel = expenses.reduce(
    (s, e) => s + parseFloat(e.fuel_cost || 0),
    0
  );
  const totalMisc = expenses.reduce(
    (s, e) => s + parseFloat(e.misc_expense || 0),
    0
  );

  setContent(`
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);max-width:600px">
      <div class="kpi-card teal"><div class="kpi-value">${fmtRs(
        totalFuel
      )}</div><div class="kpi-label">Total Fuel</div></div>
      <div class="kpi-card warning"><div class="kpi-value">${fmtRs(
        totalMisc
      )}</div><div class="kpi-label">Misc Expenses</div></div>
      <div class="kpi-card accent"><div class="kpi-value">${fmtRs(
        totalFuel + totalMisc
      )}</div><div class="kpi-label">Total Operational</div></div>
    </div>

    ${pageHeader(
      "💰 All Expenses",
      `${expenses.length} entries`,
      `<button class="btn btn-primary" onclick="showAddExpenseModal(
        ${JSON.stringify(trips).replace(/"/g, "&quot;")},
        ${JSON.stringify(drivers).replace(/"/g, "&quot;")}
      )">+ Log Expense</button>`
    )}

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>Trip #</th><th>Driver</th><th>Route</th><th>Distance</th>
            <th>Fuel Cost</th><th>Misc</th><th>Total</th><th>Date</th>
          </tr></thead>
          <tbody>
            ${
              expenses
                .map(
                  (e) => `
              <tr>
                <td class="mono">#${e.trip_id}</td>
                <td>${e.driver_name}</td>
                <td class="fs-12">${e.origin}→${e.destination}</td>
                <td class="mono">${e.distance_km} km</td>
                <td class="mono text-warning">${fmtRs(e.fuel_cost)}</td>
                <td class="mono">${fmtRs(e.misc_expense)}</td>
                <td class="mono fw-600">${fmtRs(e.total_cost)}</td>
                <td class="fs-12 text-muted">${fmtDate(e.date)}</td>
              </tr>`
                )
                .join("") ||
              '<tr><td colspan="8"><div class="table-empty">No expenses logged</div></td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>
  `);
}

// ── Manager: User Management ──────────────────────────────
async function renderManagerUsers() {
  const { data } = await api.users.list();
  const users = data?.data || [];

  setContent(`
    ${pageHeader(
      "👥 User Management",
      `${users.length} registered users`,
      `<button class="btn btn-primary" onclick="showAddUserModal()">+ Add User</button>`
    )}

    <div class="alert alert-info">
      Managers can add/remove users and assign roles. Changes take effect on next login.
    </div>

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${
              users
                .map(
                  (u) => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:36px;height:36px;border-radius:50%;background:var(--accent-glow);
                      display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--accent);font-size:14px">
                      ${u.name[0].toUpperCase()}
                    </div>
                    <span class="fw-600">${u.name}</span>
                  </div>
                </td>
                <td class="fs-12 text-muted">${u.email}</td>
                <td>
                  <span class="pill ${
                    u.role === "manager"
                      ? "pill-accent"
                      : u.role === "safety_officer"
                      ? "pill-warning"
                      : u.role === "analyst"
                      ? "pill-success"
                      : "pill-teal"
                  }">
                    ${u.role.replace(/_/g, " ")}
                  </span>
                </td>
                <td class="fs-12 text-muted">${fmtDate(u.created_at)}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-sm btn-secondary" onclick="showEditUserModal(${JSON.stringify(
                      u
                    ).replace(/"/g, "&quot;")})">✏️ Edit Role</button>
                    <button class="btn btn-sm btn-danger" onclick="removeUser(${
                      u.id
                    },'${u.name}')">🗑 Remove</button>
                  </div>
                </td>
              </tr>`
                )
                .join("") ||
              '<tr><td colspan="5"><div class="table-empty">No users found</div></td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>
  `);
}

// ── Manager: Analytics with Charts ───────────────────────
async function renderManagerAnalytics(period = "all") {
  const { ok, data } = await api.analytics.get(period);
  if (!ok) {
    toast(data.message, "error");
    return;
  }
  const a = data.data;

  setContent(`
    ${pageHeader(
      "📊 Fleet Analytics & Charts",
      "ROI, fuel, trips — filter by period"
    )}

    <div class="toolbar" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:8px">
        <span class="fs-13 text-muted fw-600">Filter Period:</span>
        ${["all", "week", "month", "year"]
          .map(
            (p) => `
          <button class="btn btn-sm ${
            period === p ? "btn-primary" : "btn-secondary"
          }"
            onclick="renderManagerAnalytics('${p}')">
            ${p === "all" ? "All Time" : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>`
          )
          .join("")}
      </div>
      <button class="btn btn-sm btn-secondary" onclick="exportCSV()">⬇️ Export CSV</button>
    </div>

    <div class="kpi-grid">
      ${kpiCard("Total Revenue", fmtRs(a.total_revenue), "teal", "💰")}
      ${kpiCard("Fuel Cost", fmtRs(a.total_fuel_cost), "warning", "⛽")}
      ${kpiCard("Maintenance Cost", fmtRs(a.total_maintenance), "danger", "🔧")}
      ${kpiCard("Fleet ROI", a.fleet_roi + "%", "accent", "📈")}
      ${kpiCard("Utilization", a.utilization_rate + "%", "success", "🚛")}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">📊 Monthly Revenue vs Costs</span></div>
        <canvas id="monthly-bar-chart" style="width:100%;"></canvas>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">🥧 Trip Status Distribution</span></div>
        <canvas id="trip-pie-chart" style="width:100%;"></canvas>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">🚛 Vehicle Type Mix</span></div>
        <canvas id="vehicle-pie-chart" style="width:100%;"></canvas>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">🔥 Top Cost Vehicles</span></div>
        <canvas id="vehicle-cost-chart" style="width:100%;"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">📅 Monthly Financial Summary</span>
        <button class="btn btn-sm btn-secondary" onclick="exportCSV()">⬇️ Export CSV</button>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>Month</th><th>Revenue</th><th>Fuel</th><th>Maintenance</th><th>Net Profit</th></tr></thead>
          <tbody>
            ${
              a.monthly_summary.length
                ? a.monthly_summary
                    .map(
                      (m) => `
              <tr>
                <td class="mono">${m.month}</td>
                <td class="text-success mono">${fmtRs(m.revenue)}</td>
                <td class="text-warning mono">${fmtRs(m.fuel_cost)}</td>
                <td class="text-danger mono">${fmtRs(m.maintenance_cost)}</td>
                <td class="${
                  parseFloat(m.net_profit) >= 0 ? "text-success" : "text-danger"
                } mono fw-600">${fmtRs(m.net_profit)}</td>
              </tr>`
                    )
                    .join("")
                : '<tr><td colspan="5" class="table-empty">Complete trips to see data</td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>
  `);

  // Draw charts after DOM is ready
  setTimeout(() => {
    // Monthly Revenue vs Cost Bar Chart
    if (a.monthly_summary.length > 0) {
      drawBarChart(
        "monthly-bar-chart",
        a.monthly_summary.map((m) => m.month),
        [
          {
            label: "Revenue",
            color: CHART_COLORS.teal,
            data: a.monthly_summary.map((m) => m.revenue),
          },
          {
            label: "Fuel",
            color: CHART_COLORS.warning,
            data: a.monthly_summary.map((m) => m.fuel_cost),
          },
          {
            label: "Maint.",
            color: CHART_COLORS.danger,
            data: a.monthly_summary.map((m) => m.maintenance_cost),
          },
        ]
      );
    }

    // Trip Status Pie Chart
    const tripDist = a.trip_status_dist || [];
    drawPieChart(
      "trip-pie-chart",
      tripDist.map((t) => t.status),
      tripDist.map((t) => t.cnt),
      [
        CHART_COLORS.success,
        CHART_COLORS.accent,
        CHART_COLORS.warning,
        CHART_COLORS.danger,
        CHART_COLORS.purple,
      ]
    );

    // Vehicle Type Pie Chart
    const vTypeDist = a.vehicle_type_dist || [];
    drawPieChart(
      "vehicle-pie-chart",
      vTypeDist.map((v) => v.type),
      vTypeDist.map((v) => v.cnt),
      [CHART_COLORS.accent, CHART_COLORS.teal, CHART_COLORS.orange]
    );

    // Vehicle Cost Bar Chart
    const topVehicles = (a.vehicle_efficiency || []).slice(0, 6);
    if (topVehicles.length > 0) {
      drawBarChart(
        "vehicle-cost-chart",
        topVehicles.map((v) => v.license_plate),
        [
          {
            label: "Total Cost",
            color: CHART_COLORS.warning,
            data: topVehicles.map((v) => v.total_cost),
          },
        ],
        { height: 250 }
      );
    }
  }, 100);
}

// ═══════════════════════════════════════════════════════════
//  📦 DISPATCHER PAGES
// ═══════════════════════════════════════════════════════════
async function renderDispatcherDashboard() {
  const [dashRes, tripsRes] = await Promise.all([
    api.dashboard.get(),
    api.trips.list(),
  ]);
  const d = dashRes.data?.data || {};
  const trips = tripsRes.data?.data || [];
  const ongoingTrips = trips.filter(
    (t) => t.status === "On Trip" || t.status === "Dispatched"
  );
  const pendingTrips = trips.filter((t) => t.status === "Draft");

  setContent(`
    <div class="role-header dispatcher-header">
      <div>
        <h2>📦 Dispatcher Dashboard</h2>
        <p>Assign vehicles, verify drivers, dispatch cargo</p>
      </div>
    </div>

    <div class="kpi-grid">
      ${kpiCard("Available Vehicles", "...", "teal", "🚛", "Ready to dispatch")}
      ${kpiCard("Available Drivers", "...", "accent", "👤", "On duty")}
      ${kpiCard(
        "Ongoing Trips",
        ongoingTrips.length,
        "warning",
        "🗺️",
        "In progress"
      )}
      ${kpiCard(
        "Pending Cargo",
        pendingTrips.length,
        "danger",
        "📦",
        "Needs assignment"
      )}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">⚡ Quick Actions</span></div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn btn-primary" onclick="navigate('dsp-trips')" style="justify-content:flex-start;font-size:15px">
            🗺️ &nbsp; Create New Trip
          </button>
          <button class="btn btn-secondary" onclick="navigate('dsp-vehicles')" style="justify-content:flex-start">
            🚛 &nbsp; View Available Vehicles
          </button>
          <button class="btn btn-secondary" onclick="navigate('dsp-drivers')" style="justify-content:flex-start">
            👤 &nbsp; View Available Drivers
          </button>
        </div>

        <div style="margin-top:20px;padding:14px;background:var(--bg-elevated);border-radius:var(--radius-sm)">
          <div class="fs-12 text-muted fw-600" style="margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Smart Rules</div>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:13px">
            <div>❌ Cargo > Capacity → <span class="text-danger">Blocked</span></div>
            <div>❌ License Expired → <span class="text-danger">Blocked</span></div>
            <div>❌ Vehicle In Shop → <span class="text-danger">Hidden</span></div>
            <div>✅ All checks pass → <span class="text-success">Dispatched!</span></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">🗺️ Active Trips</span>
          <button class="btn btn-sm btn-secondary" onclick="navigate('dsp-trips')">View All</button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Vehicle</th><th>Route</th><th>Driver</th><th>Status</th></tr></thead>
            <tbody>
              ${
                ongoingTrips
                  .slice(0, 6)
                  .map(
                    (t) => `
                <tr>
                  <td class="mono">${t.license_plate}</td>
                  <td class="fs-12">${t.origin}→${t.destination}</td>
                  <td>${t.driver_name}</td>
                  <td>${statusPill(t.status)}</td>
                </tr>`
                  )
                  .join("") ||
                '<tr><td colspan="4" class="table-empty">No active trips</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);

  // Load available counts dynamically
  const [vRes, dRes] = await Promise.all([
    api.vehicles.list("?status=Available"),
    api.drivers.list("?status=On+Duty"),
  ]);
  const kpis = document.querySelectorAll(".kpi-value");
  if (kpis[0]) kpis[0].textContent = vRes.data?.data?.length || 0;
  if (kpis[1]) kpis[1].textContent = dRes.data?.data?.length || 0;
}

async function renderDispatcherTrips(filter = "") {
  const [tripsRes, vRes, dRes] = await Promise.all([
    api.trips.list(filter),
    api.vehicles.list("?status=Available"),
    api.drivers.list("?status=On+Duty"),
  ]);
  const trips = tripsRes.data?.data || [];
  state.vehicles = vRes.data?.data || [];
  state.drivers = dRes.data?.data || [];

  setContent(`
    ${pageHeader(
      "🗺️ Trip Dispatcher",
      `${trips.length} total trips — only available vehicles & on-duty drivers shown`,
      `<button class="btn btn-primary" onclick="showCreateTripModal()">🚀 New Trip</button>`
    )}

    <div class="toolbar">
      <select class="filter-select" onchange="renderDispatcherTrips(this.value?'?status='+this.value:'')">
        <option value="">All Status</option>
        <option value="Draft">Draft</option><option value="Dispatched">Dispatched</option>
        <option value="On Trip">On Trip</option><option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>#</th><th>Vehicle</th><th>Driver</th><th>Route</th>
            <th>Cargo</th><th>Revenue</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${
              trips
                .map(
                  (t) => `
              <tr>
                <td class="mono">#${t.id}</td>
                <td><div class="fw-600">${t.license_plate}</div>
                    <div class="fs-12 text-muted">${t.fleet_type}</div></td>
                <td>${t.driver_name}</td>
                <td class="fs-12"><span class="text-muted">${
                  t.origin
                }</span><br><strong>${t.destination}</strong></td>
                <td class="mono">${Number(
                  t.cargo_weight_kg
                ).toLocaleString()}/${Number(
                    t.max_capacity_kg
                  ).toLocaleString()} kg</td>
                <td class="mono">${fmtRs(t.revenue)}</td>
                <td>${statusPill(t.status)}</td>
                <td>
                  <div class="flex gap-2">
                    ${
                      t.status === "Dispatched" || t.status === "On Trip"
                        ? `
                      <button class="btn btn-sm btn-success" onclick="showCompleteTrip(${t.id})">✅</button>
                      <button class="btn btn-sm btn-danger"  onclick="cancelTrip(${t.id})">✕</button>
                    `
                        : ""
                    }
                  </div>
                </td>
              </tr>`
                )
                .join("") ||
              '<tr><td colspan="8"><div class="table-empty">No trips found</div></td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>
  `);
}

async function renderDispatcherVehicles() {
  const { data } = await api.vehicles.list("?status=Available");
  const vehicles = data?.data || [];
  setContent(`
    ${pageHeader(
      "🚛 Available Vehicles",
      `${vehicles.length} vehicles ready for dispatch`
    )}
    <div class="alert alert-info">Vehicles marked <strong>In Shop</strong> or <strong>On Trip</strong> are not shown here.</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      ${
        vehicles
          .map(
            (v) => `
        <div class="card" style="border-top:3px solid var(--teal)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
            <div>
              <div class="fw-600" style="font-size:18px">${v.name}</div>
              <div class="text-muted fs-12">${v.model}</div>
            </div>
            <div style="font-size:28px">${
              v.type === "Truck" ? "🚛" : v.type === "Van" ? "🚐" : "🏍️"
            }</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
            <div><span class="text-muted">Plate:</span><br><strong class="mono">${
              v.license_plate
            }</strong></div>
            <div><span class="text-muted">Type:</span><br><strong>${
              v.type
            }</strong></div>
            <div><span class="text-muted">Max Load:</span><br><strong class="mono">${Number(
              v.max_capacity_kg
            ).toLocaleString()} kg</strong></div>
            <div><span class="text-muted">Odometer:</span><br><strong class="mono">${Number(
              v.odometer_km
            ).toLocaleString()} km</strong></div>
          </div>
          <div style="margin-top:12px">${statusPill(v.status)}</div>
        </div>`
          )
          .join("") || '<div class="table-empty">No available vehicles</div>'
      }
    </div>
  `);
}

async function renderDispatcherDrivers() {
  const { data } = await api.drivers.list("?status=On+Duty");
  const drivers = data?.data || [];
  const today = new Date().toISOString().split("T")[0];
  setContent(`
    ${pageHeader("👤 Available Drivers", `${drivers.length} drivers on duty`)}
    <div class="alert alert-info">Only <strong>On Duty</strong> drivers with <strong>valid licenses</strong> are shown and assignable.</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      ${
        drivers
          .map((d) => {
            const expired = d.license_expiry < today;
            return `
        <div class="card" style="border-top:3px solid ${
          expired ? "var(--danger)" : "var(--accent)"
        }">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--accent-glow);
              display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:var(--accent)">
              ${d.name[0]}
            </div>
            <div>
              <div class="fw-600">${d.name}</div>
              <div class="fs-12 text-muted">${d.license_category} License</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;margin-bottom:12px">
            <div><span class="text-muted">License #:</span><br><strong class="mono fs-12">${
              d.license_number
            }</strong></div>
            <div><span class="text-muted">Expiry:</span><br>
              <strong class="${expired ? "text-danger" : ""}">${fmtDate(
              d.license_expiry
            )} ${expired ? "⚠️" : ""}</strong>
            </div>
            <div><span class="text-muted">Safety Score:</span><br>
              <strong class="${
                d.safety_score > 80
                  ? "text-success"
                  : d.safety_score > 60
                  ? "text-warning"
                  : "text-danger"
              }">${d.safety_score}</strong>
            </div>
            <div><span class="text-muted">Completion:</span><br><strong>${
              d.completion_rate
            }%</strong></div>
          </div>
          ${
            expired
              ? '<div class="alert alert-danger" style="margin:0;padding:8px;font-size:12px">❌ Cannot assign — license expired</div>'
              : statusPill(d.duty_status)
          }
        </div>`;
          })
          .join("") || '<div class="table-empty">No on-duty drivers</div>'
      }
    </div>
  `);
}

// ═══════════════════════════════════════════════════════════
//  🛡️ SAFETY OFFICER PAGES
// ═══════════════════════════════════════════════════════════
async function renderSafetyDashboard() {
  const [driversRes, vRes, mRes] = await Promise.all([
    api.drivers.list(),
    api.vehicles.list(),
    api.maintenance.list(),
  ]);
  const drivers = driversRes.data?.data || [];
  const vehicles = vRes.data?.data || [];
  const maintenance = mRes.data?.data || [];
  const today = new Date().toISOString().split("T")[0];

  const expired = drivers.filter((d) => d.license_expiry < today);
  const expiringSoon = drivers.filter((d) => {
    const days = Math.ceil(
      (new Date(d.license_expiry) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 && days <= 30;
  });
  const lowSafety = drivers.filter((d) => d.safety_score < 70);
  const suspended = drivers.filter((d) => d.duty_status === "Suspended");
  const inShop = vehicles.filter((v) => v.status === "In Shop");
  const activeMaintenance = maintenance.filter((m) => m.status !== "Completed");

  setContent(`
    <div class="role-header safety-header">
      <div>
        <h2>🛡️ Safety Officer Dashboard</h2>
        <p>Driver compliance, license monitoring, vehicle safety & enforcement</p>
      </div>
    </div>

    <div class="kpi-grid">
      ${kpiCard("Total Drivers", drivers.length, "accent", "👥", "Registered")}
      ${kpiCard(
        "Expired Licenses",
        expired.length,
        expired.length > 0 ? "danger" : "success",
        "⚠️",
        expired.length > 0 ? "Action needed" : "All clear"
      )}
      ${kpiCard(
        "Expiring Soon",
        expiringSoon.length,
        expiringSoon.length > 0 ? "warning" : "success",
        "📅",
        "Within 30 days"
      )}
      ${kpiCard(
        "Low Safety Score",
        lowSafety.length,
        lowSafety.length > 0 ? "danger" : "success",
        "📉",
        "Score < 70"
      )}
      ${kpiCard(
        "Suspended",
        suspended.length,
        suspended.length > 0 ? "warning" : "success",
        "🚫",
        "Cannot be assigned"
      )}
      ${kpiCard(
        "Vehicles In Shop",
        inShop.length,
        inShop.length > 0 ? "warning" : "success",
        "🔧",
        "Under service"
      )}
    </div>

    ${
      expired.length > 0
        ? `
    <div class="alert alert-danger">
      🚨 <strong>URGENT:</strong> ${expired.length} driver(s) have expired licenses and are blocked from all trips.
    </div>`
        : ""
    }

    ${
      expiringSoon.length > 0
        ? `
    <div class="alert alert-warning">
      ⚠️ <strong>Action Needed:</strong> ${expiringSoon.length} driver(s) licenses expire within 30 days.
    </div>`
        : ""
    }

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title">⚡ Quick Actions</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn btn-primary"   onclick="navigate('saf-drivers')"     style="justify-content:flex-start">👤 &nbsp; Manage Driver Profiles</button>
          <button class="btn btn-secondary" onclick="navigate('saf-maintenance')" style="justify-content:flex-start">🔧 &nbsp; Vehicle Compliance</button>
          <button class="btn btn-secondary" onclick="navigate('saf-compliance')"  style="justify-content:flex-start">📋 &nbsp; License Tracker</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">🚨 Active Maintenance (${
          activeMaintenance.length
        })</span></div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Vehicle</th><th>Issue</th><th>Status</th></tr></thead>
            <tbody>
              ${
                activeMaintenance
                  .slice(0, 5)
                  .map(
                    (m) => `
                <tr>
                  <td class="fw-600">${m.vehicle_name}</td>
                  <td class="fs-12">${m.issue_service}</td>
                  <td>${statusPill(m.status)}</td>
                </tr>`
                  )
                  .join("") ||
                '<tr><td colspan="3" class="text-success p-2">✅ No active maintenance!</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">🚨 Expired Licenses</span></div>
        ${
          expired.length
            ? `
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Driver</th><th>Expired On</th><th>Action</th></tr></thead>
              <tbody>
                ${expired
                  .map(
                    (d) => `
                  <tr>
                    <td class="fw-600">${d.name}</td>
                    <td class="text-danger fs-12">${fmtDate(
                      d.license_expiry
                    )}</td>
                    <td>
                      <button class="btn btn-sm ${
                        d.duty_status === "Suspended"
                          ? "btn-success"
                          : "btn-danger"
                      }"
                        onclick="toggleSuspendDriver(${d.id},'${
                      d.duty_status
                    }','${d.name}')">
                        ${
                          d.duty_status === "Suspended"
                            ? "✅ Unsuspend"
                            : "🚫 Suspend"
                        }
                      </button>
                    </td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>`
            : '<div class="text-success p-2">✅ No expired licenses!</div>'
        }
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">📉 Low Safety Scores</span></div>
        ${
          lowSafety.length
            ? `
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Driver</th><th>Score</th><th>Complaints</th><th>Status</th></tr></thead>
              <tbody>
                ${lowSafety
                  .map(
                    (d) => `
                  <tr>
                    <td class="fw-600">${d.name}</td>
                    <td class="text-danger fw-600">${d.safety_score}</td>
                    <td>${d.complaints}</td>
                    <td>${statusPill(d.duty_status)}</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>`
            : '<div class="text-success p-2">✅ All drivers have good scores!</div>'
        }
      </div>
    </div>
  `);
}

async function renderSafetyDrivers() {
  const { data } = await api.drivers.list();
  const drivers = data?.data || [];
  const today = new Date().toISOString().split("T")[0];

  setContent(`
    ${pageHeader(
      "👤 Driver Profiles",
      `${drivers.length} registered drivers`,
      `<button class="btn btn-primary" onclick="showAddDriverModal()">+ Add Driver</button>`
    )}

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>Driver</th><th>License #</th><th>Category</th><th>Expiry</th>
            <th>Safety Score</th><th>Completion</th><th>Complaints</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${drivers
              .map((d) => {
                const expired = d.license_expiry < today;
                const scoreColor =
                  d.safety_score > 80
                    ? "text-success"
                    : d.safety_score > 60
                    ? "text-warning"
                    : "text-danger";
                return `<tr class="${expired ? "row-danger" : ""}">
                <td class="fw-600">${
                  d.name
                }<br><span class="fs-12 text-muted">${d.phone || ""}</span></td>
                <td class="mono fs-12">${d.license_number}</td>
                <td>${d.license_category}</td>
                <td class="${expired ? "text-danger fw-600" : ""}">
                  ${fmtDate(d.license_expiry)}<br>
                  ${
                    expired
                      ? '<span class="pill pill-danger" style="font-size:10px">EXPIRED</span>'
                      : daysUntilExpiry(d.license_expiry) <= 30
                      ? `<span class="pill pill-warning" style="font-size:10px">${daysUntilExpiry(
                          d.license_expiry
                        )}d left</span>`
                      : ""
                  }
                </td>
                <td>
                  <div class="flex gap-2" style="align-items:center">
                    <div style="width:50px;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden">
                      <div style="width:${
                        d.safety_score
                      }%;height:100%;background:${
                  d.safety_score > 80
                    ? "var(--success)"
                    : d.safety_score > 60
                    ? "var(--warning)"
                    : "var(--danger)"
                }"></div>
                    </div>
                    <span class="${scoreColor} fw-600">${d.safety_score}</span>
                  </div>
                </td>
                <td>${d.completion_rate}%</td>
                <td class="${d.complaints > 5 ? "text-danger fw-600" : ""}">${
                  d.complaints
                }</td>
                <td id="driver-status-${d.id}">${statusPill(d.duty_status)}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-sm btn-secondary" onclick="showEditDriverModal(${JSON.stringify(
                      d
                    ).replace(/"/g, "&quot;")})">✏️</button>
                    <button class="btn btn-sm ${
                      d.duty_status === "Suspended"
                        ? "btn-success"
                        : "btn-danger"
                    }"
                      id="suspend-btn-${d.id}"
                      onclick="toggleSuspendDriver(${d.id},'${
                  d.duty_status
                }','${d.name}')">
                      ${
                        d.duty_status === "Suspended"
                          ? "✅ Unsuspend"
                          : "🚫 Suspend"
                      }
                    </button>
                  </div>
                </td>
              </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

// ── Safety: Vehicle Compliance & Maintenance ─────────────
async function renderSafetyMaintenance() {
  const [mRes, vRes] = await Promise.all([
    api.maintenance.list(),
    api.vehicles.list(),
  ]);
  const logs = mRes.data?.data || [];
  const vehicles = vRes.data?.data || [];
  const inShop = vehicles.filter((v) => v.status === "In Shop");

  setContent(`
    ${pageHeader(
      "🔧 Vehicle Compliance & Maintenance",
      `${inShop.length} vehicles in shop — ${
        logs.filter((l) => l.status !== "Completed").length
      } active issues`,
      `<button class="btn btn-primary" onclick="showAddMaintenanceModal(${JSON.stringify(
        vehicles
      ).replace(/"/g, "&quot;")})">+ Log Issue</button>`
    )}

    <div class="alert alert-info" style="margin-bottom:16px">
      🔁 Logging a maintenance issue automatically moves the vehicle to <strong>In Shop</strong> status.
      Marking it done returns the vehicle to <strong>Available</strong>.
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">🔧 Vehicles Currently In Shop (${
          inShop.length
        })</span></div>
        ${
          inShop.length
            ? `
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Vehicle</th><th>Plate</th><th>Type</th><th>Action</th></tr></thead>
              <tbody>
                ${inShop
                  .map(
                    (v) => `
                  <tr>
                    <td class="fw-600">${v.name}</td>
                    <td class="mono">${v.license_plate}</td>
                    <td>${v.type}</td>
                    <td>
                      <button class="btn btn-sm btn-success" onclick="toggleVehicleService(${v.id},'${v.status}')">
                        ✅ Mark Available
                      </button>
                    </td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>`
            : '<div class="text-success p-2">✅ No vehicles currently in shop!</div>'
        }
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">📊 Maintenance Summary</span></div>
        <div style="display:flex;flex-direction:column;gap:12px;padding:8px 0">
          ${["New", "In Progress", "Completed"]
            .map((status) => {
              const count = logs.filter((l) => l.status === status).length;
              const color =
                status === "Completed"
                  ? "success"
                  : status === "In Progress"
                  ? "warning"
                  : "accent";
              return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--bg-elevated);border-radius:var(--radius-sm)">
              <span class="fw-600">${statusPill(status)}</span>
              <span class="pill pill-${color}">${count} logs</span>
            </div>`;
            })
            .join("")}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">📋 All Maintenance Logs</span></div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>Log #</th><th>Vehicle</th><th>Issue / Service</th>
            <th>Cost</th><th>Date</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${
              logs.length
                ? logs
                    .map(
                      (l) => `
              <tr>
                <td class="mono">#${l.id}</td>
                <td><div class="fw-600">${l.vehicle_name}</div>
                    <div class="fs-12 text-muted">${l.license_plate}</div></td>
                <td>${l.issue_service}<br><span class="fs-12 text-muted">${
                        l.description || ""
                      }</span></td>
                <td class="mono">${fmtRs(l.cost)}</td>
                <td class="fs-12">${fmtDate(l.date)}</td>
                <td>${statusPill(l.status)}</td>
                <td>
                  <div class="flex gap-2">
                    ${
                      l.status === "New"
                        ? `<button class="btn btn-sm btn-warning" onclick="updateMaintenanceStatus(${
                            l.id
                          },'In Progress','${l.issue_service}','${
                            l.description || ""
                          }',${l.cost})">▶ Start</button>`
                        : ""
                    }
                    ${
                      l.status !== "Completed"
                        ? `<button class="btn btn-sm btn-success" onclick="resolveMaintenance(${l.id})">✅ Done</button>`
                        : '<span class="text-muted fs-12">✓ Resolved</span>'
                    }
                  </div>
                </td>
              </tr>`
                    )
                    .join("")
                : '<tr><td colspan="7"><div class="table-empty">No maintenance logs</div></td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>
  `);
}

async function renderSafetyCompliance() {
  const { data } = await api.drivers.list();
  const drivers = data?.data || [];
  const today = new Date();

  const grouped = {
    expired: drivers.filter((d) => new Date(d.license_expiry) < today),
    soon: drivers.filter((d) => {
      const days = daysUntilExpiry(d.license_expiry);
      return days > 0 && days <= 30;
    }),
    ok: drivers.filter((d) => daysUntilExpiry(d.license_expiry) > 30),
  };

  setContent(`
    ${pageHeader(
      "📋 License Compliance Tracker",
      "Monitor all driver licenses and expiry dates"
    )}

    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);max-width:540px">
      ${kpiCard(
        "Expired",
        grouped.expired.length,
        grouped.expired.length > 0 ? "danger" : "success",
        "🔴"
      )}
      ${kpiCard(
        "Expiring Soon",
        grouped.soon.length,
        grouped.soon.length > 0 ? "warning" : "success",
        "🟡"
      )}
      ${kpiCard("Valid", grouped.ok.length, "success", "🟢")}
    </div>

    ${["expired", "soon", "ok"]
      .map(
        (group) => `
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <span class="card-title">
            ${
              group === "expired"
                ? "🔴 Expired Licenses"
                : group === "soon"
                ? "🟡 Expiring Within 30 Days"
                : "🟢 Valid Licenses"
            }
          </span>
          <span class="pill ${
            group === "expired"
              ? "pill-danger"
              : group === "soon"
              ? "pill-warning"
              : "pill-success"
          }">
            ${grouped[group].length}
          </span>
        </div>
        ${
          grouped[group].length
            ? `
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Driver</th><th>License #</th><th>Category</th><th>Expiry</th><th>Days</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${grouped[group]
                .map((d) => {
                  const days = daysUntilExpiry(d.license_expiry);
                  return `<tr>
                  <td class="fw-600">${d.name}</td>
                  <td class="mono fs-12">${d.license_number}</td>
                  <td>${d.license_category}</td>
                  <td class="${
                    group === "expired"
                      ? "text-danger"
                      : group === "soon"
                      ? "text-warning"
                      : ""
                  } fw-600">${fmtDate(d.license_expiry)}</td>
                  <td class="${
                    group === "expired"
                      ? "text-danger"
                      : group === "soon"
                      ? "text-warning"
                      : "text-success"
                  } mono fw-600">
                    ${
                      group === "expired"
                        ? `${Math.abs(days)}d ago`
                        : group === "soon"
                        ? `${days}d`
                        : "Valid"
                    }
                  </td>
                  <td id="driver-status-comp-${d.id}">${statusPill(
                    d.duty_status
                  )}</td>
                  <td>
                    ${
                      group === "expired"
                        ? `<button class="btn btn-sm ${
                            d.duty_status === "Suspended"
                              ? "btn-success"
                              : "btn-danger"
                          }"
                          id="suspend-comp-btn-${d.id}"
                          onclick="toggleSuspendDriver(${d.id},'${
                            d.duty_status
                          }','${d.name}',true)">
                          ${
                            d.duty_status === "Suspended"
                              ? "✅ Unsuspend"
                              : "🚫 Suspend"
                          }
                        </button>`
                        : group === "soon"
                        ? `<button class="btn btn-sm btn-warning" onclick="alertDriver(${d.id},'${d.name}')">📧 Alert</button>`
                        : '<span class="text-success fs-12">✅</span>'
                    }
                  </td>
                </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>`
            : `<div class="text-muted p-2">None in this category</div>`
        }
      </div>`
      )
      .join("")}
  `);
}

// ═══════════════════════════════════════════════════════════
//  💰 FINANCIAL ANALYST PAGES
// ═══════════════════════════════════════════════════════════
async function renderFinanceDashboard() {
  const { ok, data } = await api.analytics.get();
  if (!ok) {
    toast(data.message, "error");
    return;
  }
  const a = data.data;
  const netProfit = a.total_revenue - a.total_fuel_cost - a.total_maintenance;

  setContent(`
    <div class="role-header finance-header">
      <div>
        <h2>💰 Financial Analyst Dashboard</h2>
        <p>Costs, revenue, ROI, and fleet financial performance</p>
      </div>
    </div>

    <div class="kpi-grid">
      ${kpiCard(
        "Total Revenue",
        fmtRs(a.total_revenue),
        "success",
        "💰",
        "All completed trips"
      )}
      ${kpiCard(
        "Total Fuel Cost",
        fmtRs(a.total_fuel_cost),
        "warning",
        "⛽",
        "Across all vehicles"
      )}
      ${kpiCard(
        "Maintenance Cost",
        fmtRs(a.total_maintenance),
        "danger",
        "🔧",
        "Completed services"
      )}
      ${kpiCard(
        "Net Profit",
        fmtRs(netProfit),
        netProfit >= 0 ? "teal" : "danger",
        "📈",
        "Revenue - All costs"
      )}
      ${kpiCard(
        "Fleet ROI",
        a.fleet_roi + "%",
        "accent",
        "🏦",
        "Return on investment"
      )}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">⚡ Quick Actions</span></div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn btn-primary"   onclick="navigate('fin-expenses')" style="justify-content:flex-start">💰 &nbsp; Log Fuel & Expense</button>
          <button class="btn btn-secondary" onclick="navigate('fin-reports')"  style="justify-content:flex-start">📊 &nbsp; Monthly Reports & Charts</button>
          <button class="btn btn-secondary" onclick="exportCSV()"              style="justify-content:flex-start">⬇️ &nbsp; Export CSV Report</button>
        </div>

        <div style="margin-top:20px">
          <div class="fs-12 text-muted fw-600 mb-2" style="text-transform:uppercase;letter-spacing:1px">ROI Formula</div>
          <div style="background:var(--bg-elevated);padding:12px;border-radius:var(--radius-sm);font-size:13px;font-family:'Space Mono',monospace">
            (Revenue - Fuel - Maintenance)<br>÷ Acquisition Cost × 100<br>
            <span style="color:var(--accent);font-size:16px;margin-top:8px;display:block">= ${
              a.fleet_roi
            }%</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">🚛 Cost Per Vehicle</span></div>
        ${
          a.vehicle_efficiency
            .slice(0, 6)
            .map(
              (v) => `
          <div class="bar-item">
            <div class="bar-label">${v.license_plate}</div>
            <div class="bar-track">
              <div class="bar-fill warning" style="width:${Math.min(
                (parseFloat(v.total_cost) /
                  Math.max(
                    ...a.vehicle_efficiency.map((x) => x.total_cost),
                    1
                  )) *
                  100,
                100
              ).toFixed(1)}%"></div>
            </div>
            <div class="bar-value">${fmtRs(v.total_cost)}</div>
          </div>`
            )
            .join("") ||
          '<div class="text-muted fs-13">Log expenses to see data</div>'
        }
      </div>
    </div>
  `);
}

async function renderFinanceExpenses() {
  const [eRes, tRes, dRes] = await Promise.all([
    api.expenses.list(),
    api.trips.list("?status=On+Trip"),
    api.drivers.list(),
  ]);
  const expenses = eRes.data?.data || [];
  const trips = tRes.data?.data || [];
  const drivers = dRes.data?.data || [];
  const totalFuel = expenses.reduce(
    (s, e) => s + parseFloat(e.fuel_cost || 0),
    0
  );
  const totalMisc = expenses.reduce(
    (s, e) => s + parseFloat(e.misc_expense || 0),
    0
  );

  setContent(`
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);max-width:600px">
      <div class="kpi-card teal"><div class="kpi-value">${fmtRs(
        totalFuel
      )}</div><div class="kpi-label">Total Fuel</div></div>
      <div class="kpi-card warning"><div class="kpi-value">${fmtRs(
        totalMisc
      )}</div><div class="kpi-label">Misc Expenses</div></div>
      <div class="kpi-card accent"><div class="kpi-value">${fmtRs(
        totalFuel + totalMisc
      )}</div><div class="kpi-label">Total Operational</div></div>
    </div>

    ${pageHeader(
      "💰 Expense & Fuel Logger",
      `${expenses.length} entries logged`,
      `<button class="btn btn-primary" onclick="showAddExpenseModal(
        ${JSON.stringify(trips).replace(/"/g, "&quot;")},
        ${JSON.stringify(drivers).replace(/"/g, "&quot;")}
      )">+ Log Expense</button>`
    )}

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>Trip #</th><th>Driver</th><th>Route</th><th>Distance</th>
            <th>Fuel Cost</th><th>Misc</th><th>Total</th><th>Date</th>
          </tr></thead>
          <tbody>
            ${
              expenses
                .map(
                  (e) => `
              <tr>
                <td class="mono">#${e.trip_id}</td>
                <td>${e.driver_name}</td>
                <td class="fs-12">${e.origin}→${e.destination}</td>
                <td class="mono">${e.distance_km} km</td>
                <td class="mono text-warning">${fmtRs(e.fuel_cost)}</td>
                <td class="mono">${fmtRs(e.misc_expense)}</td>
                <td class="mono fw-600">${fmtRs(e.total_cost)}</td>
                <td class="fs-12 text-muted">${fmtDate(e.date)}</td>
              </tr>`
                )
                .join("") ||
              '<tr><td colspan="8"><div class="table-empty">No expenses logged yet</div></td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>
  `);
}

async function renderFinanceReports(period = "all") {
  const { ok, data } = await api.analytics.get(period);
  if (!ok) {
    toast(data.message, "error");
    return;
  }
  const a = data.data;

  setContent(`
    ${pageHeader(
      "📈 Reports, Charts & Analytics",
      "Vehicle ROI, monthly P&L, fuel efficiency — with visual charts",
      `<button class="btn btn-primary" onclick="exportCSV()">⬇️ Export CSV</button>`
    )}

    <div class="toolbar" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:8px">
        <span class="fs-13 text-muted fw-600">Filter Period:</span>
        ${["all", "week", "month", "year"]
          .map(
            (p) => `
          <button class="btn btn-sm ${
            period === p ? "btn-primary" : "btn-secondary"
          }"
            onclick="renderFinanceReports('${p}')">
            ${p === "all" ? "All Time" : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>`
          )
          .join("")}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">📊 Monthly Revenue vs Costs</span></div>
        <canvas id="fin-monthly-chart" style="width:100%;"></canvas>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">🥧 Trip Status Distribution</span></div>
        <canvas id="fin-trip-pie" style="width:100%;"></canvas>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><span class="card-title">📅 Monthly P&L Statement</span></div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>Month</th><th>Revenue</th><th>Fuel Cost</th><th>Maintenance</th><th>Net Profit</th><th>Margin</th></tr></thead>
          <tbody>
            ${
              a.monthly_summary.length
                ? a.monthly_summary
                    .map((m) => {
                      const profit = parseFloat(m.net_profit);
                      const revenue = parseFloat(m.revenue);
                      const margin =
                        revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;
                      return `<tr>
                <td class="mono fw-600">${m.month}</td>
                <td class="text-success mono">${fmtRs(m.revenue)}</td>
                <td class="text-warning mono">${fmtRs(m.fuel_cost)}</td>
                <td class="text-danger mono">${fmtRs(m.maintenance_cost)}</td>
                <td class="${
                  profit >= 0 ? "text-success" : "text-danger"
                } mono fw-600">${fmtRs(m.net_profit)}</td>
                <td class="${
                  profit >= 0 ? "text-success" : "text-danger"
                } mono">${margin}%</td>
              </tr>`;
                    })
                    .join("")
                : '<tr><td colspan="6" class="table-empty">Complete trips to generate reports</td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>

    <div class="analytics-grid">
      <div class="card">
        <div class="card-header"><span class="card-title">⛽ Fuel Efficiency</span></div>
        ${
          a.vehicle_efficiency
            .filter((v) => v.efficiency_km_per_liter > 0)
            .map(
              (v) => `
          <div class="bar-item">
            <div class="bar-label">${v.vehicle_name}</div>
            <div class="bar-track"><div class="bar-fill teal"
              style="width:${Math.min(
                parseFloat(v.efficiency_km_per_liter) * 5,
                100
              ).toFixed(1)}%"></div></div>
            <div class="bar-value">${parseFloat(
              v.efficiency_km_per_liter
            ).toFixed(1)} km/L</div>
          </div>`
            )
            .join("") ||
          '<div class="text-muted fs-13">Log fuel data to see efficiency</div>'
        }
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">💤 Idle Vehicles (Dead Stock)</span></div>
        ${
          a.idle_vehicles.length
            ? `
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Plate</th><th>Name</th><th>Last Trip</th></tr></thead>
              <tbody>
                ${a.idle_vehicles
                  .map(
                    (v) => `
                  <tr>
                    <td class="mono">${v.license_plate}</td>
                    <td>${v.name}</td>
                    <td class="text-muted fs-12">${
                      v.last_trip ? fmtDate(v.last_trip) : "Never used"
                    }</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>`
            : '<div class="text-success p-2">✅ No idle vehicles!</div>'
        }
      </div>
    </div>
  `);

  // Draw charts
  setTimeout(() => {
    if (a.monthly_summary.length > 0) {
      drawBarChart(
        "fin-monthly-chart",
        a.monthly_summary.map((m) => m.month),
        [
          {
            label: "Revenue",
            color: CHART_COLORS.teal,
            data: a.monthly_summary.map((m) => m.revenue),
          },
          {
            label: "Fuel",
            color: CHART_COLORS.warning,
            data: a.monthly_summary.map((m) => m.fuel_cost),
          },
          {
            label: "Maint.",
            color: CHART_COLORS.danger,
            data: a.monthly_summary.map((m) => m.maintenance_cost),
          },
        ]
      );
    }

    const tripDist = a.trip_status_dist || [];
    drawPieChart(
      "fin-trip-pie",
      tripDist.map((t) => t.status),
      tripDist.map((t) => t.cnt),
      [
        CHART_COLORS.success,
        CHART_COLORS.accent,
        CHART_COLORS.warning,
        CHART_COLORS.danger,
        CHART_COLORS.purple,
      ]
    );
  }, 100);
}

// ═══════════════════════════════════════════════════════════
//  SHARED MODALS & ACTIONS
// ═══════════════════════════════════════════════════════════
function showAddVehicleModal() {
  openModal(`
    <div class="modal-header">
      <span class="modal-title">🚛 Register New Vehicle</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="add-vehicle-form" novalidate>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Vehicle Name *</label>
          <input class="form-control" name="name" placeholder="e.g. Tata Prima" required></div>
        <div class="form-group"><label class="form-label">Model *</label>
          <input class="form-control" name="model" placeholder="e.g. Prima 4028.S" required></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">License Plate *</label>
          <input class="form-control" name="license_plate" placeholder="GJ-01-AB-1234" required
            pattern="[A-Z]{2}-[0-9]{2}-[A-Z]{1,2}-[0-9]{4}" title="Format: GJ-01-AB-1234"></div>
        <div class="form-group"><label class="form-label">Type *</label>
          <select class="form-control" name="type" required>
            <option value="">Select type</option>
            <option>Truck</option><option>Van</option><option>Bike</option>
          </select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Max Capacity (kg) *</label>
          <input class="form-control" type="number" name="max_capacity_kg" placeholder="5000" required min="1"></div>
        <div class="form-group"><label class="form-label">Odometer (km)</label>
          <input class="form-control" type="number" name="odometer_km" placeholder="0" min="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Acquisition Cost (₹)</label>
          <input class="form-control" type="number" name="acquisition_cost" placeholder="1500000" min="0"></div>
        <div class="form-group"><label class="form-label">Region</label>
          <input class="form-control" name="region" placeholder="Ahmedabad"></div>
      </div>
      <div id="vehicle-form-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Register Vehicle</button>
      </div>
    </form>
  `);
  document.getElementById("add-vehicle-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("vehicle-form-error");
    const form = e.target;
    // Validate
    const name = form.name.value.trim();
    const model = form.model.value.trim();
    const plate = form.license_plate.value.trim();
    const type = form.type.value;
    const cap = parseFloat(form.max_capacity_kg.value);

    if (!name || !model || !plate || !type || !cap) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please fill all required fields.";
      return;
    }
    if (cap <= 0) {
      errDiv.style.display = "block";
      errDiv.textContent = "Max capacity must be > 0.";
      return;
    }
    errDiv.style.display = "none";

    const { ok, data } = await api.vehicles.add(
      Object.fromEntries(new FormData(form).entries())
    );
    if (ok) {
      toast("Vehicle registered!", "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

function showEditVehicleModal(v) {
  if (typeof v === "string") v = JSON.parse(v);
  openModal(`
    <div class="modal-header">
      <span class="modal-title">✏️ Edit Vehicle — ${v.license_plate}</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="edit-vehicle-form" novalidate>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Vehicle Name *</label>
          <input class="form-control" name="name" value="${
            v.name
          }" required></div>
        <div class="form-group"><label class="form-label">Model *</label>
          <input class="form-control" name="model" value="${
            v.model
          }" required></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">License Plate *</label>
          <input class="form-control" name="license_plate" value="${
            v.license_plate
          }" required></div>
        <div class="form-group"><label class="form-label">Type *</label>
          <select class="form-control" name="type" required>
            <option ${v.type === "Truck" ? "selected" : ""}>Truck</option>
            <option ${v.type === "Van" ? "selected" : ""}>Van</option>
            <option ${v.type === "Bike" ? "selected" : ""}>Bike</option>
          </select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Max Capacity (kg) *</label>
          <input class="form-control" type="number" name="max_capacity_kg" value="${
            v.max_capacity_kg
          }" required min="1"></div>
        <div class="form-group"><label class="form-label">Odometer (km)</label>
          <input class="form-control" type="number" name="odometer_km" value="${
            v.odometer_km
          }" min="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Acquisition Cost (₹)</label>
          <input class="form-control" type="number" name="acquisition_cost" value="${
            v.acquisition_cost
          }" min="0"></div>
        <div class="form-group"><label class="form-label">Region</label>
          <input class="form-control" name="region" value="${
            v.region || ""
          }"></div>
      </div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" name="status">
          <option ${
            v.status === "Available" ? "selected" : ""
          }>Available</option>
          <option ${v.status === "In Shop" ? "selected" : ""}>In Shop</option>
          <option ${v.status === "Retired" ? "selected" : ""}>Retired</option>
        </select></div>
      <div id="edit-vehicle-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>
  `);
  document.getElementById("edit-vehicle-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("edit-vehicle-error");
    const body = Object.fromEntries(new FormData(e.target).entries());
    if (
      !body.name ||
      !body.model ||
      !body.license_plate ||
      !body.type ||
      !body.max_capacity_kg
    ) {
      errDiv.style.display = "block";
      errDiv.textContent = "All required fields must be filled.";
      return;
    }
    errDiv.style.display = "none";
    const { ok, data } = await api.vehicles.update(v.id, body);
    if (ok) {
      toast("Vehicle updated!", "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

async function toggleVehicleService(id, currentStatus) {
  const action =
    currentStatus === "In Shop" ? "mark as Available" : "move to In Shop";
  if (
    !confirm(
      `${
        action === "mark as Available"
          ? "Release vehicle from shop?"
          : "Move vehicle to In Shop for service?"
      }`
    )
  )
    return;
  const { ok, data } = await api.vehicles.toggleService(id);
  if (ok) {
    toast(data.message, "success");
    navigate(currentPage);
  } else toast(data.message, "error");
}

async function retireVehicle(id) {
  if (
    !confirm(
      "Retire this vehicle permanently? It will no longer appear in dispatch."
    )
  )
    return;
  const { ok, data } = await api.vehicles.retire(id);
  if (ok) {
    toast("Vehicle retired", "warning");
    navigate(currentPage);
  } else toast(data.message, "error");
}

// ── Suspend Toggle (FIXED: now works as proper toggle) ────
async function toggleSuspendDriver(
  id,
  currentStatus,
  name,
  inCompliance = false
) {
  const isSuspended = currentStatus === "Suspended";
  const action = isSuspended ? "Unsuspend" : "Suspend";
  const newStatus = isSuspended ? "Off Duty" : "Suspended";
  const confirmMsg = isSuspended
    ? `Unsuspend ${name}? They will be set to Off Duty.`
    : `Suspend ${name}? They will be blocked from all trips.`;

  if (!confirm(confirmMsg)) return;

  const { ok, data } = await api.drivers.setStatus(id, newStatus);
  if (ok) {
    toast(
      isSuspended ? `${name} unsuspended` : `${name} suspended`,
      isSuspended ? "success" : "warning"
    );

    // Update the button and status pill in-place without full page reload
    const btn =
      document.getElementById(`suspend-btn-${id}`) ||
      document.getElementById(`suspend-comp-btn-${id}`);
    const statusCell =
      document.getElementById(`driver-status-${id}`) ||
      document.getElementById(`driver-status-comp-${id}`);

    if (btn) {
      btn.className = `btn btn-sm ${
        newStatus === "Suspended" ? "btn-success" : "btn-danger"
      }`;
      btn.textContent =
        newStatus === "Suspended" ? "✅ Unsuspend" : "🚫 Suspend";
      btn.setAttribute(
        "onclick",
        `toggleSuspendDriver(${id},'${newStatus}','${name}',${inCompliance})`
      );
    }
    if (statusCell) {
      statusCell.innerHTML = statusPill(newStatus);
    }

    // Also update btn-id that may not match (compliance page vs drivers page)
    const allBtns = document.querySelectorAll(
      `[onclick*="toggleSuspendDriver(${id},"]`
    );
    allBtns.forEach((b) => {
      b.className = `btn btn-sm ${
        newStatus === "Suspended" ? "btn-success" : "btn-danger"
      }`;
      b.textContent = newStatus === "Suspended" ? "✅ Unsuspend" : "🚫 Suspend";
      b.setAttribute(
        "onclick",
        `toggleSuspendDriver(${id},'${newStatus}','${name}',${inCompliance})`
      );
    });
  } else {
    toast(data.message, "error");
  }
}

async function suspendDriver(id) {
  // Legacy: called from old code — just delegates to toggle
  const { data } = await api.drivers.list();
  const driver = (data?.data || []).find((d) => d.id === id);
  if (driver) toggleSuspendDriver(id, driver.duty_status, driver.name);
}

function alertDriver(id, name) {
  toast(`📧 Alert sent to ${name} — license expiring soon!`, "warning");
}

async function changeDriverStatus(id, status) {
  if (!status) return;
  const { ok, data } = await api.drivers.setStatus(id, status);
  if (ok) {
    toast(data.message, "success");
    navigate(currentPage);
  } else toast(data.message, "error");
}

async function updateMaintenanceStatus(id, status, issue, desc, cost) {
  const { ok, data } = await api.maintenance.update(id, {
    status,
    issue_service: issue,
    description: desc,
    cost,
  });
  if (ok) {
    toast(`Status updated to ${status}`, "success");
    navigate(currentPage);
  } else toast(data.message, "error");
}

async function resolveMaintenance(id) {
  if (
    !confirm(
      "Mark this maintenance as Completed? Vehicle will be set to Available."
    )
  )
    return;
  const { ok, data } = await api.maintenance.update(id, {
    status: "Completed",
    issue_service: "Resolved",
  });
  if (ok) {
    toast("Resolved! Vehicle set to Available.", "success");
    navigate(currentPage);
  } else toast(data.message, "error");
}

// ── Add Maintenance Modal ─────────────────────────────────
function showAddMaintenanceModal(vehicles) {
  if (typeof vehicles === "string") vehicles = JSON.parse(vehicles);
  const vOpts = vehicles
    .filter((v) => v.status !== "Retired")
    .map(
      (v) =>
        `<option value="${v.id}" ${v.status === "In Shop" ? "selected" : ""}>[${
          v.license_plate
        }] ${v.name} — ${v.status}</option>`
    )
    .join("");

  openModal(`
    <div class="modal-header">
      <span class="modal-title">🔧 Log Maintenance Issue</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="add-maint-form" novalidate>
      <div class="form-group"><label class="form-label">Vehicle *</label>
        <select class="form-control" name="vehicle_id" required>
          <option value="">Select vehicle</option>${vOpts}
        </select></div>
      <div class="form-group"><label class="form-label">Issue / Service Title *</label>
        <input class="form-control" name="issue_service" placeholder="e.g. Engine Overheating" required minlength="3"></div>
      <div class="form-group"><label class="form-label">Description</label>
        <textarea class="form-control" name="description" rows="2" placeholder="Detailed description of the issue..."></textarea></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Estimated Cost (₹)</label>
          <input class="form-control" type="number" name="cost" placeholder="0" min="0"></div>
        <div class="form-group"><label class="form-label">Date *</label>
          <input class="form-control" type="date" name="date" value="${
            new Date().toISOString().split("T")[0]
          }" required max="${new Date().toISOString().split("T")[0]}"></div>
      </div>
      <div id="maint-form-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Log Service</button>
      </div>
    </form>
  `);
  document.getElementById("add-maint-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("maint-form-error");
    const body = Object.fromEntries(new FormData(e.target).entries());
    if (!body.vehicle_id) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a vehicle.";
      return;
    }
    if (!body.issue_service || body.issue_service.trim().length < 3) {
      errDiv.style.display = "block";
      errDiv.textContent = "Issue title must be at least 3 characters.";
      return;
    }
    if (!body.date) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a date.";
      return;
    }
    errDiv.style.display = "none";
    const { ok, data } = await api.maintenance.add(body);
    if (ok) {
      toast(data.message, "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

// ── Create Trip Modal ─────────────────────────────────────
function showCreateTripModal() {
  const vOpts = state.vehicles
    .map(
      (v) =>
        `<option value="${v.id}" data-cap="${v.max_capacity_kg}">[${
          v.license_plate
        }] ${v.name} — ${Number(v.max_capacity_kg).toLocaleString()}kg</option>`
    )
    .join("");
  const dOpts = state.drivers
    .map(
      (d) =>
        `<option value="${d.id}">${d.name} (${d.license_category}) — Score: ${d.safety_score}</option>`
    )
    .join("");

  openModal(`
    <div class="modal-header">
      <span class="modal-title">🚀 Create New Trip</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div id="capacity-alert"></div>
    <form id="create-trip-form" novalidate>
      <div class="form-group"><label class="form-label">Select Vehicle *</label>
        <select class="form-control" name="vehicle_id" id="trip-vehicle" required onchange="updateCapacity()">
          <option value="">— Available vehicles only —</option>${
            vOpts || "<option disabled>No available vehicles</option>"
          }
        </select>
        <div class="form-hint" id="cap-hint">Select vehicle to see max capacity</div></div>

      <div class="form-group"><label class="form-label">Cargo Weight (kg) *</label>
        <input class="form-control" type="number" name="cargo_weight_kg" id="trip-cargo"
          placeholder="e.g. 2500" required min="1" oninput="validateCargo()">
        <div class="form-error hidden" id="cargo-err">⚠️ Exceeds vehicle max capacity!</div></div>

      <div class="form-group"><label class="form-label">Select Driver *</label>
        <select class="form-control" name="driver_id" required>
          <option value="">— On-duty drivers only —</option>${
            dOpts || "<option disabled>No on-duty drivers</option>"
          }
        </select></div>

      <div class="form-row">
        <div class="form-group"><label class="form-label">Origin *</label>
          <input class="form-control" name="origin" placeholder="e.g. Ahmedabad" required></div>
        <div class="form-group"><label class="form-label">Destination *</label>
          <input class="form-control" name="destination" placeholder="e.g. Mumbai" required></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Est. Fuel Cost (₹)</label>
          <input class="form-control" type="number" name="estimated_fuel_cost" placeholder="5000" min="0"></div>
        <div class="form-group"><label class="form-label">Revenue (₹)</label>
          <input class="form-control" type="number" name="revenue" placeholder="25000" min="0"></div>
      </div>
      <div id="trip-form-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="dispatch-btn">🚀 Dispatch Trip</button>
      </div>
    </form>
  `);
  document.getElementById("create-trip-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("trip-form-error");
    const body = Object.fromEntries(new FormData(e.target).entries());
    if (!body.vehicle_id) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a vehicle.";
      return;
    }
    if (!body.driver_id) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a driver.";
      return;
    }
    if (!body.cargo_weight_kg || parseFloat(body.cargo_weight_kg) <= 0) {
      errDiv.style.display = "block";
      errDiv.textContent = "Cargo weight must be greater than 0.";
      return;
    }
    if (!body.origin.trim()) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please enter origin city.";
      return;
    }
    if (!body.destination.trim()) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please enter destination city.";
      return;
    }
    if (
      body.origin.trim().toLowerCase() === body.destination.trim().toLowerCase()
    ) {
      errDiv.style.display = "block";
      errDiv.textContent = "Origin and destination cannot be the same.";
      return;
    }
    errDiv.style.display = "none";
    const { ok, data } = await api.trips.create(body);
    if (ok) {
      toast(data.message, "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

function updateCapacity() {
  const sel = document.getElementById("trip-vehicle");
  const cap = sel.options[sel.selectedIndex]?.dataset.cap;
  document.getElementById("cap-hint").textContent = cap
    ? `Max capacity: ${Number(cap).toLocaleString()} kg`
    : "Select vehicle to see max capacity";
  validateCargo();
}

function validateCargo() {
  const sel = document.getElementById("trip-vehicle");
  const cap = parseFloat(sel?.options[sel?.selectedIndex]?.dataset.cap || 0);
  const cargo = parseFloat(document.getElementById("trip-cargo")?.value || 0);
  const err = document.getElementById("cargo-err");
  const btn = document.getElementById("dispatch-btn");
  const over = cap > 0 && cargo > cap;
  err?.classList.toggle("hidden", !over);
  if (btn) btn.disabled = over;
}

function showCompleteTrip(id) {
  openModal(`
    <div class="modal-header">
      <span class="modal-title">✅ Complete Trip #${id}</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="complete-trip-form" novalidate>
      <div class="form-group"><label class="form-label">Final Odometer (km) *</label>
        <input class="form-control" type="number" name="end_odometer" placeholder="e.g. 47500" required min="1"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Actual Fuel Cost (₹)</label>
          <input class="form-control" type="number" name="actual_fuel_cost" placeholder="0" min="0"></div>
        <div class="form-group"><label class="form-label">Final Revenue (₹)</label>
          <input class="form-control" type="number" name="revenue" placeholder="0" min="0"></div>
      </div>
      <div id="complete-trip-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-success">Mark Completed</button>
      </div>
    </form>
  `);
  document.getElementById("complete-trip-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("complete-trip-error");
    const body = Object.fromEntries(new FormData(e.target).entries());
    if (!body.end_odometer || parseFloat(body.end_odometer) <= 0) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please enter a valid final odometer reading.";
      return;
    }
    errDiv.style.display = "none";
    const { ok, data } = await api.trips.complete(id, body);
    if (ok) {
      toast(data.message, "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

async function cancelTrip(id) {
  if (!confirm("Cancel this trip? Vehicle and driver will be released."))
    return;
  const { ok, data } = await api.trips.cancel(id);
  if (ok) {
    toast(data.message, "warning");
    navigate(currentPage);
  } else toast(data.message, "error");
}

// ── Add/Edit Driver Modal ─────────────────────────────────
function showAddDriverModal() {
  openModal(`
    <div class="modal-header">
      <span class="modal-title">👤 Add New Driver</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="add-driver-form" novalidate>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Full Name *</label>
          <input class="form-control" name="name" placeholder="Ramesh Patel" required minlength="2"></div>
        <div class="form-group"><label class="form-label">Phone</label>
          <input class="form-control" name="phone" placeholder="9876543210" pattern="[0-9]{10}" maxlength="10"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">License Number *</label>
          <input class="form-control" name="license_number" placeholder="GJ0120240001" required minlength="5"></div>
        <div class="form-group"><label class="form-label">License Category *</label>
          <select class="form-control" name="license_category" required>
            <option value="">Select</option>
            <option>Truck</option><option>Van</option><option>Bike</option><option>All</option>
          </select></div>
      </div>
      <div class="form-group"><label class="form-label">License Expiry Date *</label>
        <input class="form-control" type="date" name="license_expiry" required min="${
          new Date().toISOString().split("T")[0]
        }"></div>
      <div id="add-driver-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Add Driver</button>
      </div>
    </form>
  `);
  document.getElementById("add-driver-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("add-driver-error");
    const body = Object.fromEntries(new FormData(e.target).entries());
    // Validations
    if (!body.name || body.name.trim().length < 2) {
      errDiv.style.display = "block";
      errDiv.textContent = "Name must be at least 2 characters.";
      return;
    }
    if (!body.license_number || body.license_number.trim().length < 5) {
      errDiv.style.display = "block";
      errDiv.textContent = "License number must be at least 5 characters.";
      return;
    }
    if (!body.license_category) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a license category.";
      return;
    }
    if (!body.license_expiry) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select license expiry date.";
      return;
    }
    if (body.phone && !/^[0-9]{10}$/.test(body.phone)) {
      errDiv.style.display = "block";
      errDiv.textContent = "Phone must be exactly 10 digits.";
      return;
    }
    errDiv.style.display = "none";
    const { ok, data } = await api.drivers.add(body);
    if (ok) {
      toast("Driver added!", "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

function showEditDriverModal(d) {
  if (typeof d === "string") d = JSON.parse(d);
  openModal(`
    <div class="modal-header">
      <span class="modal-title">✏️ Edit Driver — ${d.name}</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="edit-driver-form" novalidate>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Name *</label>
          <input class="form-control" name="name" value="${
            d.name
          }" required minlength="2"></div>
        <div class="form-group"><label class="form-label">Phone</label>
          <input class="form-control" name="phone" value="${
            d.phone || ""
          }" pattern="[0-9]{10}" maxlength="10"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">License Expiry *</label>
          <input class="form-control" type="date" name="license_expiry" value="${
            d.license_expiry
          }" required></div>
        <div class="form-group"><label class="form-label">Safety Score (0-100)</label>
          <input class="form-control" type="number" name="safety_score" value="${
            d.safety_score
          }" min="0" max="100"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Complaints</label>
          <input class="form-control" type="number" name="complaints" value="${
            d.complaints
          }" min="0"></div>
        <div class="form-group"><label class="form-label">Duty Status</label>
          <select class="form-control" name="duty_status">
            <option ${
              d.duty_status === "On Duty" ? "selected" : ""
            }>On Duty</option>
            <option ${
              d.duty_status === "Off Duty" ? "selected" : ""
            }>Off Duty</option>
            <option ${
              d.duty_status === "Suspended" ? "selected" : ""
            }>Suspended</option>
          </select></div>
      </div>
      <input type="hidden" name="license_number"   value="${d.license_number}">
      <input type="hidden" name="license_category" value="${
        d.license_category
      }">
      <input type="hidden" name="completion_rate"  value="${d.completion_rate}">
      <div id="edit-driver-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>
  `);
  document.getElementById("edit-driver-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("edit-driver-error");
    const body = Object.fromEntries(new FormData(e.target).entries());
    if (!body.name || body.name.trim().length < 2) {
      errDiv.style.display = "block";
      errDiv.textContent = "Name must be at least 2 characters.";
      return;
    }
    if (
      body.safety_score !== "" &&
      (parseFloat(body.safety_score) < 0 || parseFloat(body.safety_score) > 100)
    ) {
      errDiv.style.display = "block";
      errDiv.textContent = "Safety score must be between 0 and 100.";
      return;
    }
    if (body.phone && !/^[0-9]{10}$/.test(body.phone)) {
      errDiv.style.display = "block";
      errDiv.textContent = "Phone must be exactly 10 digits.";
      return;
    }
    errDiv.style.display = "none";
    const { ok, data } = await api.drivers.update(d.id, body);
    if (ok) {
      toast("Driver updated!", "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

// ── Add Expense Modal ─────────────────────────────────────
function showAddExpenseModal(trips, drivers) {
  if (typeof trips === "string") trips = JSON.parse(trips);
  if (typeof drivers === "string") drivers = JSON.parse(drivers);
  const tOpts = trips
    .map(
      (t) =>
        `<option value="${t.id}">#${t.id} ${t.origin}→${t.destination}</option>`
    )
    .join("");
  const dOpts = drivers
    .map((d) => `<option value="${d.id}">${d.name}</option>`)
    .join("");

  openModal(`
    <div class="modal-header">
      <span class="modal-title">💰 Log Expense / Fuel</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="add-expense-form" novalidate>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Trip *</label>
          <select class="form-control" name="trip_id" required>
            <option value="">Select trip</option>${
              tOpts || "<option disabled>No active trips</option>"
            }
          </select></div>
        <div class="form-group"><label class="form-label">Driver *</label>
          <select class="form-control" name="driver_id" required>
            <option value="">Select driver</option>${dOpts}
          </select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Fuel Cost (₹)</label>
          <input class="form-control" type="number" name="fuel_cost" placeholder="0" min="0"></div>
        <div class="form-group"><label class="form-label">Fuel (Liters)</label>
          <input class="form-control" type="number" name="fuel_liters" placeholder="0" min="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Misc Expense (₹)</label>
          <input class="form-control" type="number" name="misc_expense" placeholder="0" min="0"></div>
        <div class="form-group"><label class="form-label">Distance (km)</label>
          <input class="form-control" type="number" name="distance_km" placeholder="0" min="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Date *</label>
          <input class="form-control" type="date" name="date"
            value="${new Date().toISOString().split("T")[0]}"
            required max="${new Date().toISOString().split("T")[0]}"></div>
        <div class="form-group"><label class="form-label">Notes</label>
          <input class="form-control" name="notes" placeholder="Optional"></div>
      </div>
      <div id="expense-form-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Expense</button>
      </div>
    </form>
  `);
  document.getElementById("add-expense-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("expense-form-error");
    const body = Object.fromEntries(new FormData(e.target).entries());
    if (!body.trip_id) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a trip.";
      return;
    }
    if (!body.driver_id) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a driver.";
      return;
    }
    if (!body.date) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a date.";
      return;
    }
    const fuel = parseFloat(body.fuel_cost || 0);
    const misc = parseFloat(body.misc_expense || 0);
    if (fuel < 0 || misc < 0) {
      errDiv.style.display = "block";
      errDiv.textContent = "Costs cannot be negative.";
      return;
    }
    errDiv.style.display = "none";
    const { ok, data } = await api.expenses.add(body);
    if (ok) {
      toast("Expense logged!", "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

// ── User Management Modals ────────────────────────────────
function showAddUserModal() {
  openModal(`
    <div class="modal-header">
      <span class="modal-title">👥 Add New User</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="add-user-form" novalidate>
      <div class="form-group"><label class="form-label">Full Name *</label>
        <input class="form-control" name="name" placeholder="John Doe" required minlength="2"></div>
      <div class="form-group"><label class="form-label">Email Address *</label>
        <input class="form-control" type="email" name="email" placeholder="john@example.com" required></div>
      <div class="form-group"><label class="form-label">Password *</label>
        <input class="form-control" type="password" name="password" placeholder="Min 6 characters" required minlength="6"></div>
      <div class="form-group"><label class="form-label">Role *</label>
        <select class="form-control" name="role" required>
          <option value="">Select role</option>
          <option value="dispatcher">Dispatcher</option>
          <option value="manager">Fleet Manager</option>
          <option value="safety_officer">Safety Officer</option>
          <option value="analyst">Financial Analyst</option>
        </select></div>
      <div id="add-user-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Create User</button>
      </div>
    </form>
  `);
  document.getElementById("add-user-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("add-user-error");
    const body = Object.fromEntries(new FormData(e.target).entries());
    if (!body.name || body.name.trim().length < 2) {
      errDiv.style.display = "block";
      errDiv.textContent = "Name must be at least 2 characters.";
      return;
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please enter a valid email address.";
      return;
    }
    if (!body.password || body.password.length < 6) {
      errDiv.style.display = "block";
      errDiv.textContent = "Password must be at least 6 characters.";
      return;
    }
    if (!body.role) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a role.";
      return;
    }
    errDiv.style.display = "none";
    const { ok, data } = await api.auth.register(body);
    if (ok) {
      toast("User created!", "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

function showEditUserModal(u) {
  if (typeof u === "string") u = JSON.parse(u);
  openModal(`
    <div class="modal-header">
      <span class="modal-title">✏️ Edit User — ${u.name}</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="edit-user-form" novalidate>
      <div class="form-group"><label class="form-label">Full Name</label>
        <input class="form-control" name="name" value="${
          u.name
        }" required minlength="2"></div>
      <div class="form-group"><label class="form-label">Email</label>
        <input class="form-control" value="${
          u.email
        }" disabled style="opacity:.6"></div>
      <div class="form-group"><label class="form-label">Role *</label>
        <select class="form-control" name="role" required>
          <option value="dispatcher"    ${
            u.role === "dispatcher" ? "selected" : ""
          }>Dispatcher</option>
          <option value="manager"       ${
            u.role === "manager" ? "selected" : ""
          }>Fleet Manager</option>
          <option value="safety_officer"${
            u.role === "safety_officer" ? "selected" : ""
          }>Safety Officer</option>
          <option value="analyst"       ${
            u.role === "analyst" ? "selected" : ""
          }>Financial Analyst</option>
        </select></div>
      <div id="edit-user-error" class="alert alert-danger" style="display:none"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>
  `);
  document.getElementById("edit-user-form").onsubmit = async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("edit-user-error");
    const body = Object.fromEntries(new FormData(e.target).entries());
    if (!body.role) {
      errDiv.style.display = "block";
      errDiv.textContent = "Please select a role.";
      return;
    }
    if (!body.name || body.name.trim().length < 2) {
      errDiv.style.display = "block";
      errDiv.textContent = "Name must be at least 2 characters.";
      return;
    }
    errDiv.style.display = "none";
    const { ok, data } = await api.users.update(u.id, body);
    if (ok) {
      toast("User updated!", "success");
      closeModal();
      navigate(currentPage);
    } else {
      errDiv.style.display = "block";
      errDiv.textContent = data.message;
    }
  };
}

async function removeUser(id, name) {
  if (!confirm(`Remove user "${name}"? This cannot be undone.`)) return;
  const { ok, data } = await api.users.remove(id);
  if (ok) {
    toast(`${name} removed`, "warning");
    navigate(currentPage);
  } else toast(data.message, "error");
}

// ═══════════════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════════════
function applyVehicleFilter() {
  const s = document.getElementById("v-search")?.value || "";
  const ty = document.getElementById("v-type")?.value || "";
  const st = document.getElementById("v-status")?.value || "";
  let qs = [];
  if (s) qs.push(`search=${encodeURIComponent(s)}`);
  if (ty) qs.push(`type=${ty}`);
  if (st) qs.push(`status=${st}`);
  renderManagerVehicles(qs.length ? "?" + qs.join("&") : "");
}

function daysUntilExpiry(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

let debounceTimer;
function debounce(fn, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, delay);
}

async function exportCSV() {
  const { data } = await api.analytics.get();
  const a = data.data;
  const rows = [["Month", "Revenue", "Fuel Cost", "Maintenance", "Net Profit"]];
  a.monthly_summary.forEach((m) =>
    rows.push([
      m.month,
      m.revenue,
      m.fuel_cost,
      m.maintenance_cost,
      m.net_profit,
    ])
  );
  const csv = rows.map((r) => r.join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  Object.assign(document.createElement("a"), {
    href: url,
    download: "fleetflow_report.csv",
  }).click();
  URL.revokeObjectURL(url);
  toast("CSV exported!", "success");
}
