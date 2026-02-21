// app.js - FleetFlow Main Application Router

// ── Router ────────────────────────────────────────────────
const routes = {
  dashboard: renderDashboard,
  vehicles: renderVehicles,
  trips: renderTrips,
  maintenance: renderMaintenance,
  expenses: renderExpenses,
  drivers: renderDrivers,
  analytics: renderAnalytics,
};

let currentPage = "dashboard";

function navigate(page) {
  currentPage = page;
  document.querySelectorAll(".nav-link").forEach((l) => {
    l.classList.toggle("active", l.dataset.page === page);
  });
  const pageTitles = {
    dashboard: { title: "Command Center", sub: "Real-time fleet overview" },
    vehicles: { title: "Vehicle Registry", sub: "Manage your fleet assets" },
    trips: { title: "Trip Dispatcher", sub: "Create & track deliveries" },
    maintenance: {
      title: "Maintenance Logs",
      sub: "Service & repair tracking",
    },
    expenses: {
      title: "Expense & Fuel Log",
      sub: "Financial tracking per trip",
    },
    drivers: { title: "Driver Profiles", sub: "Performance & compliance" },
    analytics: {
      title: "Analytics & Reports",
      sub: "Data-driven fleet insights",
    },
  };
  const info = pageTitles[page] || {};
  document.getElementById("topbar-title").textContent = info.title || page;
  document.getElementById("topbar-subtitle").textContent = info.sub || "";
  document.querySelector(".page-content").innerHTML =
    '<div class="loading-overlay"><div class="spinner"></div> Loading...</div>';
  if (routes[page]) routes[page]();
}

// ── DASHBOARD ─────────────────────────────────────────────
async function renderDashboard() {
  const { ok, data } = await api.dashboard.get();
  if (!ok) {
    toast(data.message, "error");
    return;
  }
  const d = data.data;

  document.querySelector(".page-content").innerHTML = `
      <div class="page-enter">
        <div class="kpi-grid">
          ${kpiCard(
            "Active Fleet",
            d.active_fleet,
            "accent",
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>`,
            "On Trip"
          )}
          ${kpiCard(
            "Maintenance Alerts",
            d.maintenance_alerts,
            "warning",
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"/></svg>`,
            "In Shop"
          )}
          ${kpiCard(
            "Utilization Rate",
            `${d.utilization_rate}%`,
            "teal",
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`,
            "Fleet"
          )}
          ${kpiCard(
            "Pending Cargo",
            d.pending_cargo,
            "danger",
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`,
            "Awaiting"
          )}
          ${
            d.expired_licenses > 0
              ? kpiCard(
                  "Expired Licenses",
                  d.expired_licenses,
                  "danger",
                  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
                  "⚠️ Action needed"
                )
              : ""
          }
        </div>
  
        ${
          d.expired_licenses > 0
            ? `<div class="alert alert-danger mb-3">⚠️ <strong>${d.expired_licenses} driver(s)</strong> have expired licenses and cannot be assigned to trips. <a href="#" onclick="navigate('drivers')" style="color:inherit;font-weight:700">Review Drivers →</a></div>`
            : ""
        }
  
        <div class="card">
          <div class="card-header">
            <span class="card-title">Recent Trips</span>
            <button class="btn btn-sm btn-primary" onclick="navigate('trips')">View All</button>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr>
                <th>#</th><th>Vehicle</th><th>Type</th><th>Route</th><th>Driver</th><th>Status</th><th>Date</th>
              </tr></thead>
              <tbody>
                ${
                  d.recent_trips.length
                    ? d.recent_trips
                        .map(
                          (t) => `
                  <tr>
                    <td class="mono">#${t.id}</td>
                    <td class="fw-600">${t.license_plate}</td>
                    <td>${t.fleet_type}</td>
                    <td><span class="text-muted">${t.origin}</span> → <strong>${
                            t.destination
                          }</strong></td>
                    <td>${t.driver}</td>
                    <td>${statusPill(t.status)}</td>
                    <td class="text-muted fs-12">${fmtDate(t.created_at)}</td>
                  </tr>
                `
                        )
                        .join("")
                    : '<tr><td colspan="7" class="table-empty">No trips yet</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
}

function kpiCard(label, value, color, iconSvg, sub = "") {
  return `
      <div class="kpi-card ${color}">
        <div class="kpi-icon ${color}">${iconSvg}</div>
        <div class="kpi-value">${value}</div>
        <div class="kpi-label">${label}</div>
        ${sub ? `<div class="fs-12 text-muted mt-1">${sub}</div>` : ""}
      </div>
    `;
}

// ── VEHICLES ──────────────────────────────────────────────
async function renderVehicles(filter = "") {
  const { ok, data } = await api.vehicles.list(filter);
  if (!ok) {
    toast(data.message, "error");
    return;
  }
  const vehicles = data.data;

  document.querySelector(".page-content").innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Vehicle Registry</h1>
            <p>Total: <strong>${vehicles.length}</strong> vehicles</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="showAddVehicleModal()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              New Vehicle
            </button>
          </div>
        </div>
        <div class="toolbar">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <input class="search-input" placeholder="Search plate, name, model..." id="v-search" oninput="debounceVehicleSearch(this.value)">
          </div>
          <select class="filter-select" onchange="applyVehicleFilter()">
            <option value="">All Types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Bike">Bike</option>
          </select>
          <select class="filter-select" id="v-status-filter" onchange="applyVehicleFilter()">
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
        <div class="table-card">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr>
                <th>Plate</th><th>Name / Model</th><th>Type</th>
                <th>Capacity (kg)</th><th>Odometer</th><th>Region</th>
                <th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody id="vehicles-tbody">
                ${
                  vehicles.length
                    ? vehicles.map((v) => vehicleRow(v)).join("")
                    : `<tr><td colspan="8"><div class="table-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
                    No vehicles found</div></td></tr>`
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
}

function vehicleRow(v) {
  return `
      <tr>
        <td class="mono fw-600">${v.license_plate}</td>
        <td><div class="fw-600">${v.name}</div><div class="fs-12 text-muted">${
    v.model
  }</div></td>
        <td>${v.type}</td>
        <td class="mono">${Number(v.max_capacity_kg).toLocaleString()}</td>
        <td class="mono">${Number(v.odometer_km).toLocaleString()} km</td>
        <td>${v.region || "—"}</td>
        <td>${statusPill(v.status)}</td>
        <td>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-secondary" onclick="showEditVehicleModal(${
              v.id
            })" title="Edit">✏️</button>
            <button class="btn btn-sm ${
              v.status === "In Shop" ? "btn-success" : "btn-warning"
            }"
              onclick="toggleVehicleService(${v.id}, '${
    v.status
  }')" title="Toggle Shop">
              ${v.status === "In Shop" ? "✅ Done" : "🔧 Shop"}
            </button>
            <button class="btn btn-sm btn-danger" onclick="retireVehicle(${
              v.id
            })" title="Retire">🗑</button>
          </div>
        </td>
      </tr>
    `;
}

let vehicleSearchTimer;
function debounceVehicleSearch(val) {
  clearTimeout(vehicleSearchTimer);
  vehicleSearchTimer = setTimeout(() => applyVehicleFilter(), 400);
}

function applyVehicleFilter() {
  const search = document.getElementById("v-search")?.value || "";
  const type = document.querySelectorAll(".filter-select")[0]?.value || "";
  const status = document.getElementById("v-status-filter")?.value || "";
  let qs = [];
  if (search) qs.push(`search=${encodeURIComponent(search)}`);
  if (type) qs.push(`type=${type}`);
  if (status) qs.push(`status=${status}`);
  renderVehicles(qs.length ? "?" + qs.join("&") : "");
}

function showAddVehicleModal() {
  openModal(`
      <div class="modal-header">
        <span class="modal-title">🚛 Register New Vehicle</span>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <form id="add-vehicle-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Vehicle Name *</label>
            <input class="form-control" name="name" placeholder="e.g. Tata Prima" required>
          </div>
          <div class="form-group">
            <label class="form-label">Model *</label>
            <input class="form-control" name="model" placeholder="e.g. Prima 4028.S" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">License Plate *</label>
            <input class="form-control" name="license_plate" placeholder="GJ-01-AB-1234" required>
          </div>
          <div class="form-group">
            <label class="form-label">Type *</label>
            <select class="form-control" name="type" required>
              <option value="">Select type</option>
              <option>Truck</option><option>Van</option><option>Bike</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Max Capacity (kg) *</label>
            <input class="form-control" type="number" name="max_capacity_kg" placeholder="5000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Odometer (km)</label>
            <input class="form-control" type="number" name="odometer_km" placeholder="0">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Acquisition Cost (₹)</label>
            <input class="form-control" type="number" name="acquisition_cost" placeholder="1500000">
          </div>
          <div class="form-group">
            <label class="form-label">Region</label>
            <input class="form-control" name="region" placeholder="Ahmedabad">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Register Vehicle</button>
        </div>
      </form>
    `);
  document.getElementById("add-vehicle-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    const { ok, data } = await api.vehicles.add(body);
    if (ok) {
      toast("Vehicle registered!", "success");
      closeModal();
      renderVehicles();
    } else toast(data.message, "error");
  };
}

async function toggleVehicleService(id, status) {
  const { ok, data } = await api.vehicles.toggleService(id);
  if (ok) {
    toast(`Vehicle now: ${data.data.new_status}`, "success");
    renderVehicles();
  } else toast(data.message, "error");
}

async function retireVehicle(id) {
  if (!confirm("Retire this vehicle? It will be marked as Out of Service."))
    return;
  const { ok, data } = await api.vehicles.retire(id);
  if (ok) {
    toast("Vehicle retired", "success");
    renderVehicles();
  } else toast(data.message, "error");
}

// ── TRIPS ─────────────────────────────────────────────────
async function renderTrips(filter = "") {
  const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
    api.trips.list(filter),
    api.vehicles.list("?status=Available"),
    api.drivers.list("?status=On+Duty"),
  ]);
  const trips = tripsRes.data?.data || [];
  const avVehicles = vehiclesRes.data?.data || [];
  const avDrivers = driversRes.data?.data || [];
  state.vehicles = avVehicles;
  state.drivers = avDrivers;

  document.querySelector(".page-content").innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Trip Dispatcher</h1>
            <p>${trips.length} total trips</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="showCreateTripModal()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              New Trip
            </button>
          </div>
        </div>
        <div class="toolbar">
          <select class="filter-select" onchange="renderTrips(this.value?'?status='+this.value:'')">
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Dispatched">Dispatched</option>
            <option value="On Trip">On Trip</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div class="table-card">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr>
                <th>#</th><th>Vehicle</th><th>Driver</th><th>Route</th>
                <th>Cargo (kg)</th><th>Revenue</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr></thead>
              <tbody>
                ${
                  trips.length
                    ? trips
                        .map(
                          (t) => `
                  <tr>
                    <td class="mono">#${t.id}</td>
                    <td><div class="fw-600">${
                      t.license_plate
                    }</div><div class="fs-12 text-muted">${
                            t.fleet_type
                          }</div></td>
                    <td>${t.driver_name}</td>
                    <td><span class="text-muted">${
                      t.origin
                    }</span><br><strong>${t.destination}</strong></td>
                    <td class="mono">${Number(
                      t.cargo_weight_kg
                    ).toLocaleString()} / ${Number(
                            t.max_capacity_kg
                          ).toLocaleString()}</td>
                    <td class="mono">${fmtRs(t.revenue)}</td>
                    <td>${statusPill(t.status)}</td>
                    <td class="fs-12 text-muted">${fmtDate(t.created_at)}</td>
                    <td>
                      <div class="flex gap-2">
                        ${
                          t.status === "Dispatched" || t.status === "On Trip"
                            ? `
                          <button class="btn btn-sm btn-success" onclick="showCompleteTrip(${t.id})">✅ Complete</button>
                          <button class="btn btn-sm btn-danger" onclick="cancelTrip(${t.id})">✕ Cancel</button>
                        `
                            : ""
                        }
                      </div>
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : '<tr><td colspan="9"><div class="table-empty">No trips found</div></td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
}

function showCreateTripModal() {
  const vOptions = state.vehicles
    .map(
      (v) =>
        `<option value="${v.id}" data-cap="${v.max_capacity_kg}">[${v.license_plate}] ${v.name} — ${v.max_capacity_kg}kg</option>`
    )
    .join("");
  const dOptions = state.drivers
    .map(
      (d) =>
        `<option value="${d.id}">${d.name} (${d.license_category})</option>`
    )
    .join("");

  openModal(`
      <div class="modal-header">
        <span class="modal-title">🗺️ Create New Trip</span>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div id="capacity-alert"></div>
      <form id="create-trip-form">
        <div class="form-group">
          <label class="form-label">Select Vehicle *</label>
          <select class="form-control" name="vehicle_id" required id="trip-vehicle" onchange="updateCapacity()">
            <option value="">— Choose available vehicle —</option>
            ${vOptions || "<option disabled>No available vehicles</option>"}
          </select>
          <div class="form-hint" id="capacity-hint">Select a vehicle to see its capacity</div>
        </div>
        <div class="form-group">
          <label class="form-label">Cargo Weight (kg) *</label>
          <input class="form-control" type="number" name="cargo_weight_kg" id="trip-cargo" placeholder="e.g. 2500" required oninput="validateCargo()">
          <div class="form-error hidden" id="cargo-error">⚠️ Exceeds vehicle capacity!</div>
        </div>
        <div class="form-group">
          <label class="form-label">Select Driver *</label>
          <select class="form-control" name="driver_id" required>
            <option value="">— Choose on-duty driver —</option>
            ${dOptions || "<option disabled>No on-duty drivers</option>"}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Origin *</label>
            <input class="form-control" name="origin" placeholder="e.g. Ahmedabad" required>
          </div>
          <div class="form-group">
            <label class="form-label">Destination *</label>
            <input class="form-control" name="destination" placeholder="e.g. Mumbai" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Est. Fuel Cost (₹)</label>
            <input class="form-control" type="number" name="estimated_fuel_cost" placeholder="5000">
          </div>
          <div class="form-group">
            <label class="form-label">Revenue (₹)</label>
            <input class="form-control" type="number" name="revenue" placeholder="25000">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="dispatch-btn">🚀 Dispatch Trip</button>
        </div>
      </form>
    `);

  document.getElementById("create-trip-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    const { ok, data } = await api.trips.create(body);
    if (ok) {
      toast("Trip dispatched!", "success");
      closeModal();
      renderTrips();
    } else toast(data.message, "error");
  };
}

function updateCapacity() {
  const sel = document.getElementById("trip-vehicle");
  const opt = sel.options[sel.selectedIndex];
  const cap = opt?.dataset.cap;
  document.getElementById("capacity-hint").textContent = cap
    ? `Max capacity: ${Number(cap).toLocaleString()} kg`
    : "Select a vehicle to see its capacity";
  validateCargo();
}

function validateCargo() {
  const sel = document.getElementById("trip-vehicle");
  const opt = sel?.options[sel?.selectedIndex];
  const cap = parseFloat(opt?.dataset.cap || 0);
  const cargo = parseFloat(document.getElementById("trip-cargo")?.value || 0);
  const errEl = document.getElementById("cargo-error");
  const btn = document.getElementById("dispatch-btn");
  if (cap > 0 && cargo > cap) {
    errEl?.classList.remove("hidden");
    if (btn) btn.disabled = true;
  } else {
    errEl?.classList.add("hidden");
    if (btn) btn.disabled = false;
  }
}

function showCompleteTrip(id) {
  openModal(`
      <div class="modal-header">
        <span class="modal-title">✅ Complete Trip #${id}</span>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <form id="complete-trip-form">
        <div class="form-group">
          <label class="form-label">Final Odometer Reading (km)</label>
          <input class="form-control" type="number" name="end_odometer" placeholder="e.g. 47500" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Actual Fuel Cost (₹)</label>
            <input class="form-control" type="number" name="actual_fuel_cost" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label">Final Revenue (₹)</label>
            <input class="form-control" type="number" name="revenue" placeholder="0">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-success">Mark Completed</button>
        </div>
      </form>
    `);
  document.getElementById("complete-trip-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    const { ok, data } = await api.trips.complete(id, body);
    if (ok) {
      toast("Trip completed!", "success");
      closeModal();
      renderTrips();
    } else toast(data.message, "error");
  };
}

async function cancelTrip(id) {
  if (!confirm("Cancel this trip? Vehicles and drivers will be released."))
    return;
  const { ok, data } = await api.trips.cancel(id);
  if (ok) {
    toast("Trip cancelled", "warning");
    renderTrips();
  } else toast(data.message, "error");
}

// ── MAINTENANCE ───────────────────────────────────────────
async function renderMaintenance() {
  const [mRes, vRes] = await Promise.all([
    api.maintenance.list(),
    api.vehicles.list(),
  ]);
  const logs = mRes.data?.data || [];
  const vehicles = vRes.data?.data || [];

  document.querySelector(".page-content").innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="page-title-group"><h1>Maintenance & Service Logs</h1>
            <p>Logging a service automatically sets vehicle to <strong>In Shop</strong></p>
          </div>
          <button class="btn btn-primary" onclick="showAddMaintenanceModal(${JSON.stringify(
            vehicles
          ).replace(/"/g, "&quot;")})">
            + Log Service
          </button>
        </div>
        <div class="table-card">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr>
                <th>Log #</th><th>Vehicle</th><th>Issue / Service</th>
                <th>Cost (₹)</th><th>Date</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                ${
                  logs.length
                    ? logs
                        .map(
                          (l) => `
                  <tr>
                    <td class="mono">#${l.id}</td>
                    <td><div class="fw-600">${
                      l.vehicle_name
                    }</div><div class="fs-12 text-muted">${
                            l.license_plate
                          }</div></td>
                    <td>${l.issue_service}<br><span class="fs-12 text-muted">${
                            l.description || ""
                          }</span></td>
                    <td class="mono">${fmtRs(l.cost)}</td>
                    <td class="fs-12">${fmtDate(l.date)}</td>
                    <td>${statusPill(l.status)}</td>
                    <td>
                      ${
                        l.status !== "Completed"
                          ? `
                        <button class="btn btn-sm btn-success" onclick="resolveMaintenance(${l.id})">✅ Mark Done</button>
                      `
                          : ""
                      }
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : '<tr><td colspan="7"><div class="table-empty">No maintenance logs</div></td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
}

function showAddMaintenanceModal(vehicles) {
  const vOptions = vehicles
    .map(
      (v) => `<option value="${v.id}">[${v.license_plate}] ${v.name}</option>`
    )
    .join("");
  openModal(`
      <div class="modal-header">
        <span class="modal-title">🔧 Log Maintenance Service</span>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="alert alert-warning">Vehicle will be automatically set to <strong>In Shop</strong> status.</div>
      <form id="add-maint-form">
        <div class="form-group">
          <label class="form-label">Vehicle *</label>
          <select class="form-control" name="vehicle_id" required>
            <option value="">Select vehicle</option>
            ${vOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Issue / Service *</label>
          <input class="form-control" name="issue_service" placeholder="e.g. Engine Overheating" required>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-control" name="description" rows="2" placeholder="Detailed notes..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Cost (₹)</label>
            <input class="form-control" type="number" name="cost" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label">Date *</label>
            <input class="form-control" type="date" name="date" value="${
              new Date().toISOString().split("T")[0]
            }" required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Log Service</button>
        </div>
      </form>
    `);
  document.getElementById("add-maint-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { ok, data } = await api.maintenance.add(
      Object.fromEntries(fd.entries())
    );
    if (ok) {
      toast(data.message, "success");
      closeModal();
      renderMaintenance();
    } else toast(data.message, "error");
  };
}

async function resolveMaintenance(id) {
  const { ok, data } = await api.maintenance.update(id, {
    status: "Completed",
    issue_service: "",
  });
  if (ok) {
    toast("Maintenance marked complete. Vehicle set to Available.", "success");
    renderMaintenance();
  } else toast(data.message, "error");
}

// ── EXPENSES ──────────────────────────────────────────────
async function renderExpenses() {
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

  document.querySelector(".page-content").innerHTML = `
      <div class="page-enter">
        <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);max-width:640px">
          <div class="kpi-card teal"><div class="kpi-value">${fmtRs(
            totalFuel
          )}</div><div class="kpi-label">Total Fuel Cost</div></div>
          <div class="kpi-card warning"><div class="kpi-value">${fmtRs(
            totalMisc
          )}</div><div class="kpi-label">Misc Expenses</div></div>
          <div class="kpi-card accent"><div class="kpi-value">${fmtRs(
            totalFuel + totalMisc
          )}</div><div class="kpi-label">Total Operational</div></div>
        </div>
        <div class="page-header">
          <div class="page-title-group"><h1>Expense & Fuel Log</h1></div>
          <button class="btn btn-primary" onclick="showAddExpenseModal(
            ${JSON.stringify(trips).replace(/"/g, "&quot;")},
            ${JSON.stringify(drivers).replace(/"/g, "&quot;")}
          )">+ Add Expense</button>
        </div>
        <div class="table-card">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr>
                <th>Trip #</th><th>Driver</th><th>Route</th><th>Distance</th>
                <th>Fuel Cost</th><th>Misc</th><th>Total</th><th>Date</th>
              </tr></thead>
              <tbody>
                ${
                  expenses.length
                    ? expenses
                        .map(
                          (e) => `
                  <tr>
                    <td class="mono">#${e.trip_id}</td>
                    <td>${e.driver_name}</td>
                    <td class="fs-12">${e.origin} → ${e.destination}</td>
                    <td class="mono">${e.distance_km} km</td>
                    <td class="mono text-warning">${fmtRs(e.fuel_cost)}</td>
                    <td class="mono">${fmtRs(e.misc_expense)}</td>
                    <td class="mono fw-600">${fmtRs(e.total_cost)}</td>
                    <td class="fs-12 text-muted">${fmtDate(e.date)}</td>
                  </tr>
                `
                        )
                        .join("")
                    : '<tr><td colspan="8"><div class="table-empty">No expenses logged</div></td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
}

function showAddExpenseModal(trips, drivers) {
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
        <span class="modal-title">💰 Log Expense</span>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <form id="add-expense-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Trip *</label>
            <select class="form-control" name="trip_id" required>
              <option value="">Select trip</option>${tOpts}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Driver *</label>
            <select class="form-control" name="driver_id" required>
              <option value="">Select driver</option>${dOpts}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Fuel Cost (₹)</label>
            <input class="form-control" type="number" name="fuel_cost" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label">Fuel Liters</label>
            <input class="form-control" type="number" name="fuel_liters" placeholder="0">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Misc Expense (₹)</label>
            <input class="form-control" type="number" name="misc_expense" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label">Distance (km)</label>
            <input class="form-control" type="number" name="distance_km" placeholder="0">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date *</label>
            <input class="form-control" type="date" name="date" value="${
              new Date().toISOString().split("T")[0]
            }" required>
          </div>
          <div class="form-group">
            <label class="form-label">Notes</label>
            <input class="form-control" name="notes" placeholder="Optional notes">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Expense</button>
        </div>
      </form>
    `);
  document.getElementById("add-expense-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { ok, data } = await api.expenses.add(
      Object.fromEntries(fd.entries())
    );
    if (ok) {
      toast("Expense logged!", "success");
      closeModal();
      renderExpenses();
    } else toast(data.message, "error");
  };
}

// ── DRIVERS ───────────────────────────────────────────────
async function renderDrivers() {
  const { ok, data } = await api.drivers.list();
  if (!ok) {
    toast(data.message, "error");
    return;
  }
  const drivers = data.data;
  const today = new Date().toISOString().split("T")[0];

  document.querySelector(".page-content").innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="page-title-group"><h1>Driver Profiles</h1><p>${
            drivers.length
          } registered drivers</p></div>
          <button class="btn btn-primary" onclick="showAddDriverModal()">+ Add Driver</button>
        </div>
        <div class="toolbar">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <input class="search-input" placeholder="Search name or license..." id="d-search" oninput="debounceDriverSearch(this.value)">
          </div>
          <select class="filter-select" onchange="renderDriversFiltered(this.value)">
            <option value="">All Status</option>
            <option value="On Duty">On Duty</option>
            <option value="Off Duty">Off Duty</option>
            <option value="On Trip">On Trip</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div class="table-card">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr>
                <th>Name</th><th>License #</th><th>Category</th><th>Expiry</th>
                <th>Completion</th><th>Safety Score</th><th>Complaints</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                ${drivers
                  .map((d) => {
                    const expired = d.license_expiry < today;
                    return `
                    <tr>
                      <td class="fw-600">${d.name}</td>
                      <td class="mono">${d.license_number}</td>
                      <td>${d.license_category}</td>
                      <td class="${expired ? "text-danger fw-600" : ""}">
                        ${fmtDate(d.license_expiry)} ${
                      expired ? "⚠️ EXPIRED" : ""
                    }
                      </td>
                      <td>
                        <div style="display:flex;align-items:center;gap:8px">
                          <div style="width:60px;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden">
                            <div style="width:${
                              d.completion_rate
                            }%;height:100%;background:var(--success)"></div>
                          </div>
                          ${d.completion_rate}%
                        </div>
                      </td>
                      <td>
                        <div style="display:flex;align-items:center;gap:8px">
                          <div style="width:60px;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden">
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
                          ${d.safety_score}
                        </div>
                      </td>
                      <td class="${
                        d.complaints > 5 ? "text-danger fw-600" : ""
                      }">${d.complaints}</td>
                      <td>${statusPill(d.duty_status)}</td>
                      <td>
                        <div class="flex gap-2">
                          ${
                            d.duty_status !== "On Trip"
                              ? `
                            <select class="filter-select" style="font-size:12px;padding:4px 8px"
                              onchange="changeDriverStatus(${d.id}, this.value)" >
                              <option value="">Change Status</option>
                              <option value="On Duty">On Duty</option>
                              <option value="Off Duty">Off Duty</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          `
                              : '<span class="text-muted fs-12">On Trip</span>'
                          }
                        </div>
                      </td>
                    </tr>
                  `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
}

let driverSearchTimer;
function debounceDriverSearch(val) {
  clearTimeout(driverSearchTimer);
  driverSearchTimer = setTimeout(() => {
    const qs = val ? `?search=${encodeURIComponent(val)}` : "";
    api.drivers.list(qs).then((r) => {
      const drivers = r.data?.data || [];
      // re-render just tbody
    });
  }, 400);
}

function renderDriversFiltered(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  api.drivers.list(qs).then((r) => {
    state.drivers = r.data?.data || [];
    renderDrivers();
  });
}

async function changeDriverStatus(id, status) {
  if (!status) return;
  const { ok, data } = await api.drivers.setStatus(id, status);
  if (ok) {
    toast(data.message, "success");
    renderDrivers();
  } else toast(data.message, "error");
}

function showAddDriverModal() {
  openModal(`
      <div class="modal-header">
        <span class="modal-title">👤 Add Driver</span>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <form id="add-driver-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input class="form-control" name="name" placeholder="Ramesh Patel" required>
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input class="form-control" name="phone" placeholder="9876543210">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">License Number *</label>
            <input class="form-control" name="license_number" placeholder="GJ0120240001" required>
          </div>
          <div class="form-group">
            <label class="form-label">License Category *</label>
            <select class="form-control" name="license_category" required>
              <option value="">Select</option>
              <option>Truck</option><option>Van</option><option>Bike</option><option>All</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">License Expiry Date *</label>
          <input class="form-control" type="date" name="license_expiry" required>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Driver</button>
        </div>
      </form>
    `);
  document.getElementById("add-driver-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { ok, data } = await api.drivers.add(
      Object.fromEntries(fd.entries())
    );
    if (ok) {
      toast("Driver added!", "success");
      closeModal();
      renderDrivers();
    } else toast(data.message, "error");
  };
}

// ── ANALYTICS ─────────────────────────────────────────────
async function renderAnalytics() {
  const { ok, data } = await api.analytics.get();
  if (!ok) {
    toast(data.message, "error");
    return;
  }
  const a = data.data;

  const maxCost = Math.max(
    ...a.vehicle_efficiency.map((v) => parseFloat(v.total_cost) || 0),
    1
  );

  document.querySelector(".page-content").innerHTML = `
      <div class="page-enter">
        <div class="kpi-grid">
          <div class="kpi-card teal"><div class="kpi-value">${fmtRs(
            a.total_revenue
          )}</div><div class="kpi-label">Total Revenue</div></div>
          <div class="kpi-card warning"><div class="kpi-value">${fmtRs(
            a.total_fuel_cost
          )}</div><div class="kpi-label">Total Fuel Cost</div></div>
          <div class="kpi-card danger"><div class="kpi-value">${fmtRs(
            a.total_maintenance
          )}</div><div class="kpi-label">Maintenance Cost</div></div>
          <div class="kpi-card accent"><div class="kpi-value">${
            a.fleet_roi
          }%</div><div class="kpi-label">Fleet ROI</div></div>
          <div class="kpi-card success"><div class="kpi-value">${
            a.utilization_rate
          }%</div><div class="kpi-label">Utilization Rate</div></div>
        </div>
  
        <div class="analytics-grid">
          <div class="card">
            <div class="card-header"><span class="card-title">🔥 Top Cost Vehicles</span></div>
            <div class="bar-chart-container">
              ${
                a.vehicle_efficiency
                  .slice(0, 6)
                  .map(
                    (v) => `
                <div class="bar-item">
                  <div class="bar-label">${v.license_plate}</div>
                  <div class="bar-track">
                    <div class="bar-fill warning" style="width:${(
                      (parseFloat(v.total_cost) / maxCost) *
                      100
                    ).toFixed(1)}%"></div>
                  </div>
                  <div class="bar-value">${fmtRs(v.total_cost)}</div>
                </div>
              `
                  )
                  .join("") || '<div class="text-muted fs-13">No data yet</div>'
              }
            </div>
          </div>
  
          <div class="card">
            <div class="card-header"><span class="card-title">⛽ Fuel Efficiency (km/L)</span></div>
            <div class="bar-chart-container">
              ${
                a.vehicle_efficiency
                  .filter((v) => v.efficiency_km_per_liter > 0)
                  .slice(0, 6)
                  .map(
                    (v) => `
                <div class="bar-item">
                  <div class="bar-label">${v.vehicle_name}</div>
                  <div class="bar-track">
                    <div class="bar-fill teal" style="width:${Math.min(
                      parseFloat(v.efficiency_km_per_liter) * 5,
                      100
                    ).toFixed(1)}%"></div>
                  </div>
                  <div class="bar-value">${parseFloat(
                    v.efficiency_km_per_liter
                  ).toFixed(1)} km/L</div>
                </div>
              `
                  )
                  .join("") ||
                '<div class="text-muted fs-13">Log expenses to see efficiency</div>'
              }
            </div>
          </div>
  
          <div class="card" style="grid-column:1/-1">
            <div class="card-header">
              <span class="card-title">📊 Monthly Financial Summary</span>
              <button class="btn btn-sm btn-secondary" onclick="exportCSV()">⬇️ Export CSV</button>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead><tr><th>Month</th><th>Revenue</th><th>Fuel Cost</th><th>Maintenance</th><th>Net Profit</th></tr></thead>
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
                      <td class="text-danger mono">${fmtRs(
                        m.maintenance_cost
                      )}</td>
                      <td class="${
                        parseFloat(m.net_profit) >= 0
                          ? "text-success"
                          : "text-danger"
                      } mono fw-600">${fmtRs(m.net_profit)}</td>
                    </tr>
                  `
                          )
                          .join("")
                      : '<tr><td colspan="5" class="table-empty">Complete trips to see financial data</td></tr>'
                  }
                </tbody>
              </table>
            </div>
          </div>
  
          ${
            a.idle_vehicles.length
              ? `
          <div class="card" style="grid-column:1/-1">
            <div class="card-header"><span class="card-title">💤 Dead Stock / Idle Vehicles</span><span class="pill pill-warning">Action Required</span></div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead><tr><th>License Plate</th><th>Name</th><th>Status</th><th>Last Trip</th></tr></thead>
                <tbody>
                  ${a.idle_vehicles
                    .map(
                      (v) => `
                    <tr>
                      <td class="mono">${v.license_plate}</td>
                      <td>${v.name}</td>
                      <td>${statusPill(v.status)}</td>
                      <td class="text-muted fs-12">${
                        v.last_trip ? fmtDate(v.last_trip) : "Never used"
                      }</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
          `
              : ""
          }
        </div>
      </div>
    `;
}

function exportCSV() {
  api.analytics.get().then(({ data }) => {
    const a = data.data;
    const rows = [
      ["Month", "Revenue", "Fuel Cost", "Maintenance", "Net Profit"],
    ];
    a.monthly_summary.forEach((m) => {
      rows.push([
        m.month,
        m.revenue,
        m.fuel_cost,
        m.maintenance_cost,
        m.net_profit,
      ]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fleetflow_report.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast("CSV exported!", "success");
  });
}
