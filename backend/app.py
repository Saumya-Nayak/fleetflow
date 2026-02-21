from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime, date
import pymysql
import pymysql.cursors
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'fleetflow_secret_key_2026'
CORS(app, supports_credentials=True, origins=[
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://127.0.0.1:5501',
    'http://localhost:5501',
    'null'
])

# ─── MySQL Config ───────────────────────────────────────────
DB_CONFIG = {
    'host':        'localhost',
    'user':        'root',
    'password':    'root',       # ← Change this to YOUR MySQL password
    'database':    'fleetflow',
    'cursorclass': pymysql.cursors.DictCursor,
    'charset':     'utf8mb4'
}

def get_db():
    return pymysql.connect(**DB_CONFIG)

def success(data=None, msg="Success"):
    return jsonify({"status": "success", "message": msg, "data": data})

def error(msg="Error", code=400):
    return jsonify({"status": "error", "message": msg}), code

def serialize(v):
    if isinstance(v, (datetime, date)):
        return v.isoformat()
    return v

def clean_row(row):
    return {k: serialize(v) for k, v in row.items()}

def clean_rows(rows):
    return [clean_row(r) for r in rows]

# ═══════════════════════════════════════════════════════════
#  AUTH
# ═══════════════════════════════════════════════════════════
@app.route('/api/login', methods=['POST'])
def login():
    data     = request.json or {}
    email    = data.get('email', '').strip()
    password = data.get('password', '').strip()
    if not email or not password:
        return error("Email and password required")

    db  = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cur.fetchone()
    cur.close(); db.close()

    if not user:
        return error("Invalid credentials", 401)

    demo = {'manager@fleetflow.com': 'admin123', 'dispatcher@fleetflow.com': 'dispatch123'}
    valid = (email in demo and demo[email] == password) or \
             check_password_hash(user['password_hash'], password)

    if not valid:
        return error("Invalid credentials", 401)

    session['user_id'] = user['id']
    session['role']    = user['role']
    return success({'id': user['id'], 'name': user['name'],
                    'email': user['email'], 'role': user['role']}, "Login successful")


@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return success(msg="Logged out")


@app.route('/api/me', methods=['GET'])
def me():
    if 'user_id' not in session:
        return error("Not authenticated", 401)
    db  = get_db()
    cur = db.cursor()
    cur.execute("SELECT id, name, email, role FROM users WHERE id=%s", (session['user_id'],))
    user = cur.fetchone()
    cur.close(); db.close()
    return success(user)


@app.route('/api/register', methods=['POST'])
def register():
    data     = request.json or {}
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip()
    password = data.get('password', '').strip()
    role     = data.get('role', 'dispatcher')
    if not all([name, email, password]):
        return error("All fields required")
    try:
        db  = get_db()
        cur = db.cursor()
        cur.execute("INSERT INTO users (name, email, password_hash, role) VALUES (%s,%s,%s,%s)",
                    (name, email, generate_password_hash(password), role))
        db.commit()
        cur.close(); db.close()
        return success(msg="User registered successfully")
    except Exception as e:
        return error(f"Email may already exist: {str(e)}")

# ═══════════════════════════════════════════════════════════
#  DASHBOARD
# ═══════════════════════════════════════════════════════════
@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    db  = get_db()
    cur = db.cursor()
    cur.execute("SELECT COUNT(*) as cnt FROM vehicles WHERE status='On Trip'")
    active_fleet = cur.fetchone()['cnt']
    cur.execute("SELECT COUNT(*) as cnt FROM vehicles WHERE status='In Shop'")
    maintenance_alerts = cur.fetchone()['cnt']
    cur.execute("SELECT COUNT(*) as total FROM vehicles WHERE status!='Retired'")
    total = cur.fetchone()['total']
    util_rate = round((active_fleet / total * 100), 1) if total > 0 else 0
    cur.execute("SELECT COUNT(*) as cnt FROM trips WHERE status='Draft'")
    pending_cargo = cur.fetchone()['cnt']
    cur.execute("""
        SELECT t.id, v.license_plate, v.type as fleet_type,
               t.origin, t.destination, d.name as driver,
               t.status, t.created_at
        FROM trips t
        JOIN vehicles v ON t.vehicle_id=v.id
        JOIN drivers  d ON t.driver_id=d.id
        ORDER BY t.created_at DESC LIMIT 10
    """)
    recent_trips = clean_rows(cur.fetchall())
    cur.execute("SELECT COUNT(*) as cnt FROM drivers WHERE license_expiry < CURDATE() AND duty_status!='Suspended'")
    expired_licenses = cur.fetchone()['cnt']
    cur.close(); db.close()
    return success({'active_fleet': active_fleet, 'maintenance_alerts': maintenance_alerts,
                    'utilization_rate': util_rate, 'pending_cargo': pending_cargo,
                    'expired_licenses': expired_licenses, 'recent_trips': recent_trips})

# ═══════════════════════════════════════════════════════════
#  VEHICLES
# ═══════════════════════════════════════════════════════════
@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    type_f=request.args.get('type',''); status_f=request.args.get('status','')
    region_f=request.args.get('region',''); search=request.args.get('search','')
    query="SELECT * FROM vehicles WHERE 1=1"; params=[]
    if type_f:   query+=" AND type=%s";   params.append(type_f)
    if status_f: query+=" AND status=%s"; params.append(status_f)
    if region_f: query+=" AND region=%s"; params.append(region_f)
    if search:
        query+=" AND (name LIKE %s OR license_plate LIKE %s OR model LIKE %s)"
        params+=[f'%{search}%',f'%{search}%',f'%{search}%']
    query+=" ORDER BY created_at DESC"
    db=get_db(); cur=db.cursor()
    cur.execute(query,params); rows=clean_rows(cur.fetchall())
    cur.close(); db.close()
    return success(rows)


@app.route('/api/vehicles', methods=['POST'])
def add_vehicle():
    d=request.json or {}
    for r in ['name','model','license_plate','type','max_capacity_kg']:
        if not d.get(r): return error(f"Missing field: {r}")
    try:
        db=get_db(); cur=db.cursor()
        cur.execute("""INSERT INTO vehicles
            (name,model,license_plate,type,max_capacity_kg,odometer_km,acquisition_cost,region,status)
            VALUES(%s,%s,%s,%s,%s,%s,%s,%s,'Available')""",
            (d['name'],d['model'],d['license_plate'],d['type'],d['max_capacity_kg'],
             d.get('odometer_km',0),d.get('acquisition_cost',0),d.get('region','')))
        db.commit(); new_id=cur.lastrowid; cur.close(); db.close()
        return success({'id':new_id},"Vehicle registered successfully")
    except Exception as e: return error(str(e))


@app.route('/api/vehicles/<int:vid>', methods=['PUT'])
def update_vehicle(vid):
    d=request.json or {}
    try:
        db=get_db(); cur=db.cursor()
        cur.execute("""UPDATE vehicles SET name=%s,model=%s,type=%s,max_capacity_kg=%s,
            odometer_km=%s,acquisition_cost=%s,region=%s,status=%s WHERE id=%s""",
            (d.get('name'),d.get('model'),d.get('type'),d.get('max_capacity_kg'),
             d.get('odometer_km'),d.get('acquisition_cost'),d.get('region'),d.get('status'),vid))
        db.commit(); cur.close(); db.close()
        return success(msg="Vehicle updated")
    except Exception as e: return error(str(e))


@app.route('/api/vehicles/<int:vid>', methods=['DELETE'])
def delete_vehicle(vid):
    try:
        db=get_db(); cur=db.cursor()
        cur.execute("UPDATE vehicles SET status='Retired' WHERE id=%s",(vid,))
        db.commit(); cur.close(); db.close()
        return success(msg="Vehicle retired")
    except Exception as e: return error(str(e))


@app.route('/api/vehicles/<int:vid>/toggle-service', methods=['POST'])
def toggle_service(vid):
    db=get_db(); cur=db.cursor()
    cur.execute("SELECT status FROM vehicles WHERE id=%s",(vid,))
    v=cur.fetchone()
    if not v: cur.close(); db.close(); return error("Vehicle not found",404)
    new_status='Available' if v['status']=='In Shop' else 'In Shop'
    cur.execute("UPDATE vehicles SET status=%s WHERE id=%s",(new_status,vid))
    db.commit(); cur.close(); db.close()
    return success({'new_status':new_status})

# ═══════════════════════════════════════════════════════════
#  DRIVERS
# ═══════════════════════════════════════════════════════════
@app.route('/api/drivers', methods=['GET'])
def get_drivers():
    search=request.args.get('search',''); status_f=request.args.get('status','')
    query="SELECT * FROM drivers WHERE 1=1"; params=[]
    if search:
        query+=" AND (name LIKE %s OR license_number LIKE %s)"
        params+=[f'%{search}%',f'%{search}%']
    if status_f: query+=" AND duty_status=%s"; params.append(status_f)
    query+=" ORDER BY name"
    db=get_db(); cur=db.cursor()
    cur.execute(query,params); drivers=clean_rows(cur.fetchall())
    cur.close(); db.close()
    today=date.today().isoformat()
    for d in drivers: d['license_expired']=d['license_expiry']<today
    return success(drivers)


@app.route('/api/drivers', methods=['POST'])
def add_driver():
    d=request.json or {}
    for r in ['name','license_number','license_expiry','license_category']:
        if not d.get(r): return error(f"Missing field: {r}")
    try:
        db=get_db(); cur=db.cursor()
        cur.execute("""INSERT INTO drivers(name,license_number,license_expiry,license_category,phone)
            VALUES(%s,%s,%s,%s,%s)""",
            (d['name'],d['license_number'],d['license_expiry'],d['license_category'],d.get('phone','')))
        db.commit(); new_id=cur.lastrowid; cur.close(); db.close()
        return success({'id':new_id},"Driver added successfully")
    except Exception as e: return error(str(e))


@app.route('/api/drivers/<int:did>', methods=['PUT'])
def update_driver(did):
    d=request.json or {}
    try:
        db=get_db(); cur=db.cursor()
        cur.execute("""UPDATE drivers SET name=%s,license_number=%s,license_expiry=%s,
            license_category=%s,phone=%s,safety_score=%s,completion_rate=%s,complaints=%s,duty_status=%s
            WHERE id=%s""",
            (d.get('name'),d.get('license_number'),d.get('license_expiry'),d.get('license_category'),
             d.get('phone'),d.get('safety_score'),d.get('completion_rate'),d.get('complaints'),d.get('duty_status'),did))
        db.commit(); cur.close(); db.close()
        return success(msg="Driver updated")
    except Exception as e: return error(str(e))


@app.route('/api/drivers/<int:did>/status', methods=['POST'])
def change_driver_status(did):
    new_status=(request.json or {}).get('status')
    if new_status not in ['On Duty','Off Duty','Suspended']: return error("Invalid status")
    db=get_db(); cur=db.cursor()
    cur.execute("UPDATE drivers SET duty_status=%s WHERE id=%s",(new_status,did))
    db.commit(); cur.close(); db.close()
    return success(msg=f"Driver status → {new_status}")

# ═══════════════════════════════════════════════════════════
#  TRIPS
# ═══════════════════════════════════════════════════════════
@app.route('/api/trips', methods=['GET'])
def get_trips():
    status_f=request.args.get('status','')
    query="""SELECT t.*,v.license_plate,v.name as vehicle_name,v.type as fleet_type,
               v.max_capacity_kg,d.name as driver_name
        FROM trips t JOIN vehicles v ON t.vehicle_id=v.id JOIN drivers d ON t.driver_id=d.id WHERE 1=1"""
    params=[]
    if status_f: query+=" AND t.status=%s"; params.append(status_f)
    query+=" ORDER BY t.created_at DESC"
    db=get_db(); cur=db.cursor()
    cur.execute(query,params); rows=clean_rows(cur.fetchall())
    cur.close(); db.close()
    return success(rows)


@app.route('/api/trips', methods=['POST'])
def create_trip():
    d=request.json or {}
    for r in ['vehicle_id','driver_id','cargo_weight_kg','origin','destination']:
        if not d.get(r): return error(f"Missing field: {r}")
    db=get_db(); cur=db.cursor()

    cur.execute("SELECT * FROM vehicles WHERE id=%s",(d['vehicle_id'],))
    vehicle=cur.fetchone()
    if not vehicle: cur.close(); db.close(); return error("Vehicle not found",404)
    if vehicle['status']!='Available':
        cur.close(); db.close(); return error(f"Vehicle is '{vehicle['status']}' — not available")

    if float(d['cargo_weight_kg'])>float(vehicle['max_capacity_kg']):
        cur.close(); db.close()
        return error(f"Cargo {d['cargo_weight_kg']}kg exceeds capacity {vehicle['max_capacity_kg']}kg!")

    cur.execute("SELECT * FROM drivers WHERE id=%s",(d['driver_id'],))
    driver=cur.fetchone()
    if not driver: cur.close(); db.close(); return error("Driver not found",404)
    if driver['duty_status']!='On Duty':
        cur.close(); db.close(); return error(f"Driver is '{driver['duty_status']}' — must be On Duty")

    expiry=driver['license_expiry']
    if isinstance(expiry,str): expiry=datetime.strptime(expiry,'%Y-%m-%d').date()
    if expiry<date.today():
        cur.close(); db.close(); return error("Driver license EXPIRED — assignment blocked!")

    try:
        cur.execute("""INSERT INTO trips(vehicle_id,driver_id,cargo_weight_kg,origin,destination,
            estimated_fuel_cost,revenue,status,start_odometer)
            VALUES(%s,%s,%s,%s,%s,%s,%s,'Dispatched',%s)""",
            (d['vehicle_id'],d['driver_id'],d['cargo_weight_kg'],d['origin'],d['destination'],
             d.get('estimated_fuel_cost',0),d.get('revenue',0),vehicle['odometer_km']))
        cur.execute("UPDATE vehicles SET status='On Trip' WHERE id=%s",(d['vehicle_id'],))
        cur.execute("UPDATE drivers SET duty_status='On Trip' WHERE id=%s",(d['driver_id'],))
        db.commit(); new_id=cur.lastrowid; cur.close(); db.close()
        return success({'id':new_id},"Trip dispatched! 🚛")
    except Exception as e: cur.close(); db.close(); return error(str(e))


@app.route('/api/trips/<int:tid>/complete', methods=['POST'])
def complete_trip(tid):
    d=request.json or {}
    end_odometer=float(d.get('end_odometer',0))
    db=get_db(); cur=db.cursor()
    cur.execute("SELECT * FROM trips WHERE id=%s",(tid,))
    trip=cur.fetchone()
    if not trip: cur.close(); db.close(); return error("Trip not found",404)
    distance=end_odometer-float(trip['start_odometer'] or 0)
    cur.execute("""UPDATE trips SET status='Completed',end_odometer=%s,distance_km=%s,
        actual_fuel_cost=%s,revenue=%s,completed_at=NOW() WHERE id=%s""",
        (end_odometer,distance,d.get('actual_fuel_cost',0),d.get('revenue',0),tid))
    cur.execute("UPDATE vehicles SET status='Available',odometer_km=%s WHERE id=%s",(end_odometer,trip['vehicle_id']))
    cur.execute("UPDATE drivers SET duty_status='On Duty' WHERE id=%s",(trip['driver_id'],))
    cur.execute("""UPDATE drivers SET completion_rate=(
        SELECT ROUND((SELECT COUNT(*) FROM trips WHERE driver_id=%s AND status='Completed')*100.0
        /GREATEST((SELECT COUNT(*) FROM trips WHERE driver_id=%s),1),1)) WHERE id=%s""",
        (trip['driver_id'],trip['driver_id'],trip['driver_id']))
    db.commit(); cur.close(); db.close()
    return success(msg="Trip completed! Vehicle & driver now available.")


@app.route('/api/trips/<int:tid>/cancel', methods=['POST'])
def cancel_trip(tid):
    db=get_db(); cur=db.cursor()
    cur.execute("SELECT * FROM trips WHERE id=%s",(tid,))
    trip=cur.fetchone()
    if not trip: cur.close(); db.close(); return error("Trip not found",404)
    cur.execute("UPDATE trips SET status='Cancelled' WHERE id=%s",(tid,))
    cur.execute("UPDATE vehicles SET status='Available' WHERE id=%s",(trip['vehicle_id'],))
    cur.execute("UPDATE drivers SET duty_status='On Duty' WHERE id=%s",(trip['driver_id'],))
    db.commit(); cur.close(); db.close()
    return success(msg="Trip cancelled. Resources released.")

# ═══════════════════════════════════════════════════════════
#  MAINTENANCE
# ═══════════════════════════════════════════════════════════
@app.route('/api/maintenance', methods=['GET'])
def get_maintenance():
    db=get_db(); cur=db.cursor()
    cur.execute("""SELECT m.*,v.license_plate,v.name as vehicle_name
        FROM maintenance_logs m JOIN vehicles v ON m.vehicle_id=v.id ORDER BY m.date DESC""")
    rows=clean_rows(cur.fetchall()); cur.close(); db.close()
    return success(rows)


@app.route('/api/maintenance', methods=['POST'])
def add_maintenance():
    d=request.json or {}
    if not d.get('vehicle_id') or not d.get('issue_service') or not d.get('date'):
        return error("vehicle_id, issue_service, and date required")
    try:
        db=get_db(); cur=db.cursor()
        cur.execute("""INSERT INTO maintenance_logs(vehicle_id,issue_service,description,cost,date,status)
            VALUES(%s,%s,%s,%s,%s,'New')""",
            (d['vehicle_id'],d['issue_service'],d.get('description',''),d.get('cost',0),d['date']))
        cur.execute("UPDATE vehicles SET status='In Shop' WHERE id=%s",(d['vehicle_id'],))
        db.commit(); new_id=cur.lastrowid; cur.close(); db.close()
        return success({'id':new_id},"Maintenance logged. Vehicle set to In Shop.")
    except Exception as e: return error(str(e))


@app.route('/api/maintenance/<int:mid>', methods=['PUT'])
def update_maintenance(mid):
    d=request.json or {}
    try:
        db=get_db(); cur=db.cursor()
        cur.execute("SELECT vehicle_id FROM maintenance_logs WHERE id=%s",(mid,))
        log=cur.fetchone()
        cur.execute("""UPDATE maintenance_logs SET issue_service=%s,description=%s,cost=%s,status=%s
            WHERE id=%s""",(d.get('issue_service'),d.get('description'),d.get('cost'),d.get('status'),mid))
        if d.get('status')=='Completed' and log:
            cur.execute("UPDATE vehicles SET status='Available' WHERE id=%s AND status='In Shop'",(log['vehicle_id'],))
        db.commit(); cur.close(); db.close()
        return success(msg="Maintenance updated. Vehicle set back to Available.")
    except Exception as e: return error(str(e))

# ═══════════════════════════════════════════════════════════
#  EXPENSES
# ═══════════════════════════════════════════════════════════
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    db=get_db(); cur=db.cursor()
    cur.execute("""SELECT e.*,d.name as driver_name,t.origin,t.destination,v.license_plate,
        (e.fuel_cost+e.misc_expense) as total_cost
        FROM expenses e JOIN drivers d ON e.driver_id=d.id
        JOIN trips t ON e.trip_id=t.id JOIN vehicles v ON t.vehicle_id=v.id
        ORDER BY e.date DESC""")
    rows=clean_rows(cur.fetchall()); cur.close(); db.close()
    return success(rows)


@app.route('/api/expenses', methods=['POST'])
def add_expense():
    d=request.json or {}
    if not d.get('trip_id') or not d.get('driver_id') or not d.get('date'):
        return error("trip_id, driver_id, date required")
    try:
        db=get_db(); cur=db.cursor()
        cur.execute("""INSERT INTO expenses(trip_id,driver_id,fuel_liters,fuel_cost,misc_expense,distance_km,date,notes)
            VALUES(%s,%s,%s,%s,%s,%s,%s,%s)""",
            (d['trip_id'],d['driver_id'],d.get('fuel_liters',0),d.get('fuel_cost',0),
             d.get('misc_expense',0),d.get('distance_km',0),d['date'],d.get('notes','')))
        db.commit(); new_id=cur.lastrowid; cur.close(); db.close()
        return success({'id':new_id},"Expense logged")
    except Exception as e: return error(str(e))

# ═══════════════════════════════════════════════════════════
#  ANALYTICS
# ═══════════════════════════════════════════════════════════
@app.route('/api/analytics', methods=['GET'])
def analytics():
    db=get_db(); cur=db.cursor()
    cur.execute("SELECT COALESCE(SUM(fuel_cost),0) as t FROM expenses")
    total_fuel=float(cur.fetchone()['t'])
    cur.execute("SELECT COALESCE(SUM(cost),0) as t FROM maintenance_logs WHERE status='Completed'")
    total_maint=float(cur.fetchone()['t'])
    cur.execute("SELECT COALESCE(SUM(revenue),0) as t FROM trips WHERE status='Completed'")
    total_rev=float(cur.fetchone()['t'])
    cur.execute("SELECT COALESCE(SUM(acquisition_cost),0) as t FROM vehicles")
    total_acq=float(cur.fetchone()['t'])
    fleet_roi=round(((total_rev-total_fuel-total_maint)/total_acq)*100,2) if total_acq>0 else 0
    cur.execute("SELECT COUNT(*) as t FROM vehicles WHERE status!='Retired'")
    total_v=cur.fetchone()['t']
    cur.execute("SELECT COUNT(*) as t FROM vehicles WHERE status='On Trip'")
    on_trip=cur.fetchone()['t']
    util=round(on_trip/total_v*100,1) if total_v>0 else 0
    cur.execute("""SELECT v.license_plate,v.name as vehicle_name,
        COALESCE(SUM(e.distance_km),0) as total_km,COALESCE(SUM(e.fuel_liters),0) as total_liters,
        CASE WHEN SUM(e.fuel_liters)>0 THEN ROUND(SUM(e.distance_km)/SUM(e.fuel_liters),2) ELSE 0 END as efficiency_km_per_liter,
        COALESCE(SUM(e.fuel_cost)+SUM(e.misc_expense),0) as total_cost
        FROM vehicles v LEFT JOIN trips t ON v.id=t.vehicle_id LEFT JOIN expenses e ON t.id=e.trip_id
        GROUP BY v.id,v.license_plate,v.name ORDER BY total_cost DESC LIMIT 10""")
    vehicle_eff=clean_rows(cur.fetchall())
    cur.execute("""SELECT DATE_FORMAT(t.completed_at,'%%Y-%%m') as month,
        COALESCE(SUM(t.revenue),0) as revenue,COALESCE(SUM(e.fuel_cost),0) as fuel_cost,
        COALESCE(SUM(m.cost),0) as maintenance_cost,
        COALESCE(SUM(t.revenue)-SUM(e.fuel_cost)-SUM(m.cost),0) as net_profit
        FROM trips t LEFT JOIN expenses e ON t.id=e.trip_id
        LEFT JOIN maintenance_logs m ON t.vehicle_id=m.vehicle_id
            AND DATE_FORMAT(m.date,'%%Y-%%m')=DATE_FORMAT(t.completed_at,'%%Y-%%m')
        WHERE t.status='Completed' AND t.completed_at IS NOT NULL
        GROUP BY DATE_FORMAT(t.completed_at,'%%Y-%%m') ORDER BY month DESC LIMIT 6""")
    monthly=clean_rows(cur.fetchall())
    cur.execute("""SELECT v.license_plate,v.name,v.status,MAX(t.completed_at) as last_trip
        FROM vehicles v LEFT JOIN trips t ON v.id=t.vehicle_id WHERE v.status='Available'
        GROUP BY v.id,v.license_plate,v.name,v.status
        HAVING last_trip IS NULL OR last_trip<DATE_SUB(NOW(),INTERVAL 7 DAY)""")
    idle=clean_rows(cur.fetchall())
    cur.close(); db.close()
    return success({'total_fuel_cost':total_fuel,'total_maintenance':total_maint,
                    'total_revenue':total_rev,'fleet_roi':fleet_roi,'utilization_rate':util,
                    'vehicle_efficiency':vehicle_eff,'monthly_summary':monthly,'idle_vehicles':idle})


if __name__ == '__main__':
    print("\n🚛  FleetFlow Backend")
    print("📡  API: http://127.0.0.1:5000")
    print("🔑  Login: manager@fleetflow.com / admin123\n")
    app.run(debug=True, port=5000)