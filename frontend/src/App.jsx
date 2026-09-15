import React, { useEffect, useState, useRef } from "react";
import {
  driverService,
  deviceService,
  alertService,
  detectionService,
  dashboardService,
} from "./services/api";

const AI_URL = import.meta.env.VITE_AI_URL || "http://127.0.0.1:8000";
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const menuItems = [
  { name: "Dashboard", icon: "📊" },
  { name: "Live Monitoring", icon: "🎥" },
  { name: "History", icon: "📈" },
  { name: "Alerts", icon: "🚨" },
  { name: "Drivers", icon: "👤" },
  { name: "Devices", icon: "📡" },
  { name: "Settings", icon: "⚙️" },
];

const initialDetection = {
  status: "OFFLINE",
  score: 0,
  ear: 0,
  mar: 0,
  head_pose: "UNKNOWN",
  eyes_closed: false,
  yawning: false,
  head_down: false,
  camera: false,
};

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [detection, setDetection] = useState(initialDetection);
  const [monitoring, setMonitoring] = useState(false);
  const [error, setError] = useState("");

  // Backend Dynamic States
  const [drivers, setDrivers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: "", email: "", phone: "", licenseNumber: "" });
  const [showDriverModal, setShowDriverModal] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    earThreshold: 0.22,
    marThreshold: 0.60,
    soundAlert: true,
    esp32Alert: true,
    esp32Ip: "192.168.1.150",
  });

  // --------------------------------------------------
  // 1. POLL AI DETECTION STATUS
  // --------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`${AI_URL}/api/detection/status`);
        if (!response.ok) throw new Error("AI service offline");
        const data = await response.json();

        if (mounted) {
          setDetection({
            status: data.status ?? "OFFLINE",
            score: Number(data.score ?? 0),
            ear: Number(data.ear ?? 0),
            mar: Number(data.mar ?? 0),
            head_pose: data.head_pose ?? "UNKNOWN",
            eyes_closed: Boolean(data.eyes_closed),
            yawning: Boolean(data.yawning),
            head_down: Boolean(data.head_down),
            camera: Boolean(data.camera),
          });
          setMonitoring(Boolean(data.camera));
        }
      } catch (err) {
        if (mounted) {
          setDetection((prev) => ({ ...prev, status: "OFFLINE", camera: false }));
          setMonitoring(false);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // --------------------------------------------------
  // 2. FETCH BACKEND DATA (DRIVERS, DEVICES, ALERTS, HISTORY)
  // --------------------------------------------------
  const refreshBackendData = async () => {
    try {
      const [driversRes, devicesRes, alertsRes, histRes] = await Promise.allSettled([
        driverService.getAll(),
        deviceService.getAll(),
        alertService.getAll(),
        detectionService.getAll(25),
      ]);

      if (driversRes.status === "fulfilled" && driversRes.value.data.drivers) {
        setDrivers(driversRes.value.data.drivers);
        setBackendOnline(true);
      }
      if (devicesRes.status === "fulfilled" && devicesRes.value.data.devices) {
        setDevices(devicesRes.value.data.devices);
      }
      if (alertsRes.status === "fulfilled" && alertsRes.value.data.alerts) {
        setAlerts(alertsRes.value.data.alerts);
      }
      if (histRes.status === "fulfilled" && histRes.value.data.detections) {
        setHistory(histRes.value.data.detections);
      }
    } catch (err) {
      console.warn("Backend sync notice:", err.message);
    }
  };

  useEffect(() => {
    refreshBackendData();
    const dataInterval = setInterval(refreshBackendData, 4000);
    return () => clearInterval(dataInterval);
  }, []);

  // --------------------------------------------------
  // 3. MONITORING CONTROLS
  // --------------------------------------------------
  const startMonitoring = async () => {
    try {
      setError("");
      const response = await fetch(`${AI_URL}/api/detection/start`, { method: "POST" });
      if (!response.ok) throw new Error("Could not start detection");
      setMonitoring(true);
    } catch (err) {
      setMonitoring(false);
      setError("Could not connect to AI camera. Make sure the FastAPI service is running on port 8000.");
    }
  };

  const stopMonitoring = async () => {
    try {
      setError("");
      await fetch(`${AI_URL}/api/detection/stop`, { method: "POST" });
    } catch (err) {
      console.error("Stop error:", err);
    }
    setMonitoring(false);
    setDetection(initialDetection);
  };

  // --------------------------------------------------
  // 4. ACTION HANDLERS
  // --------------------------------------------------
  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await alertService.acknowledge(alertId);
      setAlerts((prev) =>
        prev.map((a) => (a._id === alertId ? { ...a, acknowledged: true } : a))
      );
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.email) return;
    try {
      const res = await driverService.create(newDriver);
      if (res.data && res.data.driver) {
        setDrivers((prev) => [res.data.driver, ...prev]);
        setNewDriver({ name: "", email: "", phone: "", licenseNumber: "" });
        setShowDriverModal(false);
      }
    } catch (err) {
      alert("Error adding driver: " + (err.response?.data?.message || err.message));
    }
  };

  const score = Math.min(100, Math.max(0, Number(detection.score) || 0));
  const status = detection.status || "OFFLINE";
  const statusColor = getStatusColor(status);

  // --------------------------------------------------
  // 5. RENDER UI
  // --------------------------------------------------
  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🚗</div>
          <div>
            <h2 style={styles.logoTitle}>DrowsyGuard</h2>
            <span style={styles.logoSub}>IoT Driver Safety</span>
          </div>
        </div>

        <div style={styles.menuTitle}>MAIN MENU</div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              style={{
                ...styles.menuItem,
                ...(activePage === item.name ? styles.activeMenu : {}),
              }}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.deviceStatus}>
            <span
              style={{
                ...styles.onlineDot,
                background: detection.camera ? "#22c55e" : "#ef4444",
                boxShadow: detection.camera ? "0 0 10px #22c55e" : "0 0 10px #ef4444",
              }}
            />
            <div>
              <div style={{ fontWeight: "600", fontSize: "13px" }}>
                {detection.camera ? "AI Camera Active" : "Camera Standby"}
              </div>
              <small style={{ color: "#94a3b8", fontSize: "11px" }}>
                {backendOnline ? "MongoDB API Connected" : "Local Demo Mode"}
              </small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main style={styles.main}>
        {/* HEADER */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.heading}>{activePage}</h1>
            <p style={styles.subtitle}>
              IoT-Based Driver Drowsiness Detection & Alert Platform
            </p>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.systemStatus}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>ESP32 IoT Sync:</span>
              <span
                style={{
                  ...styles.statusBadge,
                  background: devices.some((d) => d.status === "Online")
                    ? "rgba(34, 197, 94, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",
                  color: devices.some((d) => d.status === "Online") ? "#22c55e" : "#ef4444",
                }}
              >
                {devices.some((d) => d.status === "Online") ? "● HARDWARE SYNCED" : "● DISCONNECTED"}
              </span>
            </div>
          </div>
        </header>

        {/* ----------------- 1. DASHBOARD PAGE ----------------- */}
        {activePage === "Dashboard" && (
          <>
            <section style={styles.statsGrid}>
              <StatCard
                title="Drowsiness Score"
                value={`${score}%`}
                icon="⚡"
                color={statusColor}
                description={getRiskDescription(score)}
              />
              <StatCard
                title="Driver State"
                value={status}
                icon="🧠"
                color={statusColor}
                description={getStatusDescription(status)}
              />
              <StatCard
                title="Active Fleet Drivers"
                value={drivers.filter((d) => d.status === "ACTIVE").length || 4}
                icon="👤"
                color="#3b82f6"
                description={`${drivers.length || 4} drivers registered`}
              />
              <StatCard
                title="IoT Alert Devices"
                value={devices.filter((d) => d.status === "Online").length || 1}
                icon="📡"
                color="#8b5cf6"
                description={`${devices.length || 3} hardware units`}
              />
            </section>

            <section style={styles.contentGrid}>
              {/* LIVE CAMERA */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.cardTitle}>Live AI Video Stream</h2>
                    <p style={styles.cardSubtitle}>Real-time MediaPipe computer vision</p>
                  </div>
                  <span
                    style={{
                      ...styles.liveBadge,
                      color: monitoring ? "#22c55e" : "#ef4444",
                      background: monitoring ? "#22c55e15" : "#ef444415",
                    }}
                  >
                    ● {monitoring ? "STREAMING" : "STANDBY"}
                  </span>
                </div>

                <div style={styles.camera}>
                  {monitoring ? (
                    <>
                      <img
                        src={`${AI_URL}/api/camera/stream`}
                        alt="Live AI Camera Stream"
                        style={styles.video}
                      />
                      <div style={styles.cameraOverlay}>
                        <span>● REAL-TIME AI INFERENCE</span>
                        <span>{status}</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎥</div>
                      <h3 style={{ margin: "0 0 6px 0", color: "#f8fafc" }}>Camera Feed Offline</h3>
                      <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                        Press Start Monitoring below to trigger the AI service
                      </p>
                    </div>
                  )}

                  {error && <div style={styles.cameraError}>⚠️ {error}</div>}
                </div>

                <div style={styles.cameraButtons}>
                  {!monitoring ? (
                    <button style={styles.startButton} onClick={startMonitoring}>
                      ▶ Start Monitoring
                    </button>
                  ) : (
                    <button style={styles.stopButton} onClick={stopMonitoring}>
                      ⏹ Stop Monitoring
                    </button>
                  )}
                </div>
              </div>

              {/* DROWSINESS GAUGE */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.cardTitle}>Fatigue Gauge</h2>
                    <p style={styles.cardSubtitle}>Combined risk index</p>
                  </div>
                </div>

                <div style={styles.gaugeContainer}>
                  <div
                    style={{
                      ...styles.gaugeOuter,
                      background: `conic-gradient(${statusColor} ${score * 3.6}deg, #334155 0deg)`,
                    }}
                  >
                    <div style={styles.gaugeInner}>
                      <span style={{ fontSize: "38px", fontWeight: "800", color: statusColor }}>
                        {score}%
                      </span>
                      <small style={{ color: "#94a3b8" }}>Fatigue Level</small>
                    </div>
                  </div>
                </div>

                <div style={styles.detailsGrid}>
                  <Detail label="Eye Closure (EAR)" value={detection.eyes_closed ? "CLOSED" : `${detection.ear.toFixed(2)}`} danger={detection.eyes_closed} />
                  <Detail label="Mouth/Yawn (MAR)" value={detection.yawning ? "YAWNING" : `${detection.mar.toFixed(2)}`} danger={detection.yawning} />
                  <Detail label="Head Tilt" value={detection.head_down ? "HEAD DOWN" : detection.head_pose} danger={detection.head_down} />
                  <Detail label="IoT Alarm Status" value={score >= 50 ? "ACTIVE (BEEP)" : "STANDBY"} danger={score >= 50} />
                </div>
              </div>
            </section>

            {/* RECENT ALERTS PREVIEW */}
            <div style={{ ...styles.card, marginTop: "24px" }}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Recent Safety Incidents</h2>
                  <p style={styles.cardSubtitle}>Latest database alerts</p>
                </div>
                <button onClick={() => setActivePage("Alerts")} style={styles.viewButton}>
                  View All Alerts →
                </button>
              </div>

              {alerts.slice(0, 3).map((a, idx) => (
                <AlertItem key={a._id || idx} alert={a} onAcknowledge={handleAcknowledgeAlert} />
              ))}
            </div>
          </>
        )}

        {/* ----------------- 2. LIVE MONITORING PAGE ----------------- */}
        {activePage === "Live Monitoring" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Cabin AI Video Feed</h2>
                  <p style={styles.cardSubtitle}>Full-resolution driver monitoring feed</p>
                </div>
                <span style={{ color: monitoring ? "#22c55e" : "#ef4444", fontWeight: "600" }}>
                  ● {monitoring ? "LIVE" : "DISCONNECTED"}
                </span>
              </div>

              <div style={{ ...styles.camera, minHeight: "420px" }}>
                {monitoring ? (
                  <img src={`${AI_URL}/api/camera/stream`} alt="AI Stream" style={styles.video} />
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <span style={{ fontSize: "56px" }}>🎥</span>
                    <h3 style={{ marginTop: "16px" }}>Video Monitor Inactive</h3>
                    <p style={{ color: "#94a3b8" }}>Start the stream to track Eye Aspect Ratio and Yawning landmarks</p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                {!monitoring ? (
                  <button style={styles.startButton} onClick={startMonitoring}>Start Live Stream</button>
                ) : (
                  <button style={styles.stopButton} onClick={stopMonitoring}>Disconnect Camera</button>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={styles.card}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Telemetry Metrics</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <MetricRow label="Eye Aspect Ratio (EAR)" value={detection.ear.toFixed(3)} target="> 0.22" ok={detection.ear >= 0.22} />
                  <MetricRow label="Mouth Aspect Ratio (MAR)" value={detection.mar.toFixed(3)} target="< 0.60" ok={detection.mar < 0.60} />
                  <MetricRow label="Head Pitch/Pose" value={detection.head_pose} target="NORMAL" ok={!detection.head_down} />
                  <MetricRow label="Attention Score" value={`${Math.max(0, 100 - score)}%`} target="> 50%" ok={score < 50} />
                </div>
              </div>

              <div style={styles.card}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>Hardware Alert Emulation</h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
                  Trigger instant test buzzer on the connected ESP32 unit.
                </p>
                <button
                  style={{ ...styles.viewButton, background: "#ef4444", color: "white", padding: "10px 16px", width: "100%" }}
                  onClick={() => alert("Simulated IoT Buzzer Sound sent to ESP32!")}
                >
                  🔊 Test Hardware Alarm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 3. ALERTS PAGE ----------------- */}
        {activePage === "Alerts" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Safety Alerts Log</h2>
                <p style={styles.cardSubtitle}>History of fatigue events and acknowledgments</p>
              </div>
              <button style={styles.viewButton} onClick={refreshBackendData}>
                🔄 Refresh Logs
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
              {alerts.length === 0 ? (
                <p style={{ color: "#94a3b8", textAlign: "center", padding: "30px" }}>No alerts found.</p>
              ) : (
                alerts.map((a) => (
                  <AlertItem key={a._id} alert={a} onAcknowledge={handleAcknowledgeAlert} />
                ))
              )}
            </div>
          </div>
        )}

        {/* ----------------- 4. DRIVERS PAGE ----------------- */}
        {activePage === "Drivers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>Registered Fleet Drivers</h2>
                <p style={{ color: "#94a3b8", margin: "4px 0 0 0", fontSize: "14px" }}>
                  Manage authorized drivers and license records
                </p>
              </div>
              <button style={styles.startButton} onClick={() => setShowDriverModal(true)}>
                + Register New Driver
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {drivers.map((driver) => (
                <div key={driver._id} style={styles.card}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#3b82f620", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                      👤
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "16px", color: "#f8fafc" }}>{driver.name}</h3>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>{driver.licenseNumber || "DL-PENDING"}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#94a3b8" }}>
                    <div>✉️ {driver.email}</div>
                    <div>📞 {driver.phone || "Not provided"}</div>
                  </div>

                  <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: driver.status === "ACTIVE" ? "#22c55e" : "#94a3b8", fontWeight: "600" }}>
                      ● {driver.status}
                    </span>
                    <button
                      onClick={async () => {
                        if (confirm(`Remove driver ${driver.name}?`)) {
                          await driverService.delete(driver._id);
                          refreshBackendData();
                        }
                      }}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* NEW DRIVER MODAL */}
            {showDriverModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                  <h3 style={{ margin: "0 0 16px 0" }}>Add New Fleet Driver</h3>
                  <form onSubmit={handleAddDriver} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input
                      style={styles.input}
                      placeholder="Full Name (e.g. Suresh Kumar)"
                      value={newDriver.name}
                      onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                      required
                    />
                    <input
                      style={styles.input}
                      type="email"
                      placeholder="Email (e.g. suresh@fleet.com)"
                      value={newDriver.email}
                      onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                      required
                    />
                    <input
                      style={styles.input}
                      placeholder="Phone Number (+91 ...)"
                      value={newDriver.phone}
                      onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    />
                    <input
                      style={styles.input}
                      placeholder="License Number (e.g. DL-1420230001)"
                      value={newDriver.licenseNumber}
                      onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                    />

                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                      <button type="submit" style={styles.startButton}>Save Driver</button>
                      <button type="button" style={styles.stopButton} onClick={() => setShowDriverModal(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- 5. DEVICES PAGE ----------------- */}
        {activePage === "Devices" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>ESP32 In-Cabin IoT Units</h2>
                <p style={styles.cardSubtitle}>Hardware alert devices with active buzzer & LED actuators</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "16px" }}>
              {devices.map((dev) => (
                <div key={dev._id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <strong style={{ fontSize: "16px", color: "#f8fafc" }}>{dev.deviceId}</strong>
                    <span style={{ color: dev.status === "Online" ? "#22c55e" : "#ef4444", fontSize: "12px", fontWeight: "600" }}>
                      ● {dev.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>Vehicle: <strong style={{ color: "#f8fafc" }}>{dev.vehicleNumber}</strong></div>
                    <div>Location: {dev.location}</div>
                    <div>Signal: {dev.signal}</div>
                    <div>Last Sync: {new Date(dev.lastPing).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 6. HISTORY PAGE ----------------- */}
        {activePage === "History" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Drowsiness Detection Logs</h2>
                <p style={styles.cardSubtitle}>Recent computer vision telemetry recordings</p>
              </div>
              <button style={styles.viewButton} onClick={refreshBackendData}>🔄 Reload Logs</button>
            </div>

            <div style={{ overflowX: "auto", marginTop: "16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                    <th style={{ padding: "10px" }}>TIMESTAMP</th>
                    <th style={{ padding: "10px" }}>STATUS</th>
                    <th style={{ padding: "10px" }}>SCORE</th>
                    <th style={{ padding: "10px" }}>EAR</th>
                    <th style={{ padding: "10px" }}>MAR</th>
                    <th style={{ padding: "10px" }}>HEAD POSE</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                        No historical logs recorded yet. Start monitoring to log sessions.
                      </td>
                    </tr>
                  ) : (
                    history.map((row) => (
                      <tr key={row._id} style={{ borderBottom: "1px solid #1e293b" }}>
                        <td style={{ padding: "12px 10px", color: "#cbd5e1" }}>
                          {new Date(row.createdAt).toLocaleTimeString()}
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <span style={{ color: getStatusColor(row.status), fontWeight: "600" }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px", fontWeight: "700" }}>{row.score}%</td>
                        <td style={{ padding: "12px 10px" }}>{Number(row.ear).toFixed(2)}</td>
                        <td style={{ padding: "12px 10px" }}>{Number(row.mar).toFixed(2)}</td>
                        <td style={{ padding: "12px 10px" }}>{row.headPose}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- 7. SETTINGS PAGE ----------------- */}
        {activePage === "Settings" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>System Configuration</h2>
            <p style={styles.cardSubtitle}>Fine-tune detection thresholds and hardware sync parameters</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px", maxWidth: "600px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>
                  Eye Aspect Ratio (EAR) Threshold: {settings.earThreshold}
                </label>
                <input
                  type="range"
                  min="0.15"
                  max="0.30"
                  step="0.01"
                  value={settings.earThreshold}
                  onChange={(e) => setSettings({ ...settings, earThreshold: parseFloat(e.target.value) })}
                  style={{ width: "100%" }}
                />
                <small style={{ color: "#94a3b8" }}>Default: 0.22. Values below this trigger eye-closure counter.</small>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>
                  Mouth Aspect Ratio (MAR) Threshold: {settings.marThreshold}
                </label>
                <input
                  type="range"
                  min="0.45"
                  max="0.80"
                  step="0.01"
                  value={settings.marThreshold}
                  onChange={(e) => setSettings({ ...settings, marThreshold: parseFloat(e.target.value) })}
                  style={{ width: "100%" }}
                />
                <small style={{ color: "#94a3b8" }}>Default: 0.60. Values above this signify active yawning.</small>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>
                  ESP32 Microcontroller IP Address
                </label>
                <input
                  style={styles.input}
                  value={settings.esp32Ip}
                  onChange={(e) => setSettings({ ...settings, esp32Ip: e.target.value })}
                />
              </div>

              <div style={{ paddingTop: "14px" }}>
                <button
                  style={styles.startButton}
                  onClick={() => alert("Settings saved successfully!")}
                >
                  💾 Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ======================================================
// HELPER COMPONENTS
// ======================================================

function StatCard({ title, value, icon, color, description }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <span style={styles.statTitle}>{title}</span>
        <span style={{ ...styles.statIcon, background: `${color}15`, color }}>{icon}</span>
      </div>
      <div style={{ ...styles.statValue, color }}>{value}</div>
      <small style={styles.statDescription}>{description}</small>
    </div>
  );
}

function Detail({ label, value, danger = false }) {
  return (
    <div style={styles.detail}>
      <span style={styles.detailLabel}>{label}</span>
      <strong style={{ color: danger ? "#ef4444" : "#22c55e" }}>{value}</strong>
    </div>
  );
}

function MetricRow({ label, value, target, ok }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #334155", fontSize: "13px" }}>
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <div>
        <strong style={{ color: ok ? "#22c55e" : "#ef4444", marginRight: "8px" }}>{value}</strong>
        <small style={{ color: "#64748b" }}>({target})</small>
      </div>
    </div>
  );
}

function AlertItem({ alert, onAcknowledge }) {
  const isCritical = alert.severity === "CRITICAL" || alert.type === "DROWSINESS";
  const isWarning = alert.severity === "HIGH" || alert.type === "YAWNING";
  const color = isCritical ? "#ef4444" : isWarning ? "#f59e0b" : "#3b82f6";

  return (
    <div style={{ ...styles.alert, borderLeft: `4px solid ${color}` }}>
      <div style={{ ...styles.alertIcon, background: `${color}20` }}>
        {isCritical ? "🚨" : isWarning ? "⚠️" : "ℹ️"}
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: "14px", color: "#f8fafc" }}>{alert.message}</strong>
        <small style={{ display: "block", color: "#94a3b8", marginTop: "3px", fontSize: "12px" }}>
          Severity: <span style={{ color }}>{alert.severity || "MEDIUM"}</span> •{" "}
          {new Date(alert.createdAt || Date.now()).toLocaleTimeString()}
        </small>
      </div>
      {!alert.acknowledged ? (
        <button
          onClick={() => onAcknowledge(alert._id)}
          style={{ ...styles.viewButton, fontSize: "12px", padding: "6px 12px" }}
        >
          Acknowledge
        </button>
      ) : (
        <span style={{ fontSize: "12px", color: "#22c55e" }}>✓ Cleared</span>
      )}
    </div>
  );
}

function getStatusColor(status) {
  if (status === "DROWSY") return "#ef4444";
  if (status === "WARNING") return "#f59e0b";
  if (status === "OFFLINE" || status === "CAMERA ERROR") return "#64748b";
  if (status === "NO FACE") return "#f59e0b";
  return "#22c55e";
}

function getStatusDescription(status) {
  if (status === "DROWSY") return "High fatigue detected!";
  if (status === "WARNING") return "Possible drowsiness detected";
  if (status === "NO FACE") return "Driver face not in frame";
  if (status === "OFFLINE") return "AI microservice standby";
  return "Driver is attentive & safe";
}

function getRiskDescription(score) {
  if (score >= 60) return "Critical hazard level";
  if (score >= 30) return "Moderate risk caution";
  return "Optimal safety zone";
}

// ======================================================
// STYLES OBJECT
// ======================================================

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#0f172a",
    color: "#f8fafc",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  sidebar: {
    width: "260px",
    background: "#111827",
    borderRight: "1px solid #1e293b",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
    paddingLeft: "8px",
  },
  logoIcon: {
    fontSize: "24px",
    background: "#3b82f620",
    borderRadius: "10px",
    padding: "8px",
  },
  logoTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  logoSub: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  menuTitle: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: "#64748b",
    marginBottom: "12px",
    paddingLeft: "8px",
  },
  menuItem: {
    width: "100%",
    background: "none",
    border: "none",
    color: "#94a3b8",
    padding: "12px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "4px",
    transition: "all 0.15s ease",
    textAlign: "left",
  },
  activeMenu: {
    background: "#3b82f6",
    color: "#ffffff",
    fontWeight: "600",
  },
  sidebarBottom: {
    marginTop: "auto",
    paddingTop: "20px",
    borderTop: "1px solid #1e293b",
  },
  deviceStatus: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    background: "#1e293b",
    borderRadius: "10px",
  },
  onlineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  main: {
    flex: 1,
    padding: "32px 40px",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "#94a3b8",
    margin: "6px 0 0 0",
    fontSize: "14px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  statusBadge: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "6px 12px",
    borderRadius: "20px",
    marginLeft: "8px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "20px",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  statTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#94a3b8",
  },
  statIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "4px",
  },
  statDescription: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "24px",
  },
  card: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "22px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: 0,
  },
  cardSubtitle: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: "4px 0 0 0",
  },
  liveBadge: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  camera: {
    background: "#0f172a",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #334155",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cameraOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    fontWeight: "600",
    color: "white",
    background: "rgba(0, 0, 0, 0.6)",
    padding: "6px 12px",
    borderRadius: "8px",
  },
  cameraError: {
    color: "#f87171",
    fontSize: "13px",
    marginTop: "12px",
    textAlign: "center",
    padding: "0 16px",
  },
  cameraButtons: {
    marginTop: "16px",
  },
  startButton: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  stopButton: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  gaugeContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "20px 0",
  },
  gaugeOuter: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeInner: {
    width: "144px",
    height: "144px",
    background: "#1e293b",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "16px",
  },
  detail: {
    background: "#0f172a",
    padding: "10px 14px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
  },
  detailLabel: {
    color: "#94a3b8",
  },
  viewButton: {
    background: "#334155",
    color: "#f8fafc",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  alert: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#0f172a",
    padding: "12px 16px",
    borderRadius: "10px",
    marginTop: "8px",
  },
  alertIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    color: "#f8fafc",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "24px",
    width: "420px",
    maxWidth: "90%",
  },
};