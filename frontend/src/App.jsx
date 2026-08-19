import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

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

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [detection, setDetection] = useState(initialDetection);
  const [monitoring, setMonitoring] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH DETECTION STATUS
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/detection/status`
        );

        if (!response.ok) {
          throw new Error("Backend unavailable");
        }

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
        console.error("Status Error:", err);

        if (mounted) {
          setDetection((previous) => ({
            ...previous,
            status: "OFFLINE",
            camera: false,
          }));

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
  // START MONITORING
  // --------------------------------------------------

  const startMonitoring = async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/detection/start`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Could not start detection");
      }

      const data = await response.json();

      console.log("Detection started:", data);

      setMonitoring(true);
    } catch (err) {
      console.error("Start Error:", err);

      setMonitoring(false);

      setError(
        "Could not start AI detection. Make sure the FastAPI server is running and the webcam is available."
      );
    }
  };

  // --------------------------------------------------
  // STOP MONITORING
  // --------------------------------------------------

  const stopMonitoring = async () => {
    try {
      setError("");

      await fetch(
        `${API_URL}/api/detection/stop`,
        {
          method: "POST",
        }
      );
    } catch (err) {
      console.error("Stop Error:", err);
    }

    setMonitoring(false);

    setDetection(initialDetection);
  };

  // --------------------------------------------------
  // VARIABLES
  // --------------------------------------------------

  const score = Math.min(
    100,
    Math.max(0, Number(detection.score) || 0)
  );

  const ear = Number(detection.ear) || 0;
  const mar = Number(detection.mar) || 0;

  const status = detection.status || "OFFLINE";

  const statusColor = getStatusColor(status);

  const gaugeDegrees = score * 3.6;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}

      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🚗</div>

          <div>
            <h2 style={styles.logoTitle}>DriveSafe</h2>

            <span style={styles.logoSub}>
              IoT Monitoring
            </span>
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
                ...(activePage === item.name
                  ? styles.activeMenu
                  : {}),
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
                background: detection.camera
                  ? "#22c55e"
                  : "#ef4444",
                boxShadow: detection.camera
                  ? "0 0 10px #22c55e"
                  : "0 0 10px #ef4444",
              }}
            />

            <div>
              <div style={{ fontWeight: "600" }}>
                {detection.camera
                  ? "Device Online"
                  : "Device Offline"}
              </div>

              <small style={{ color: "#94a3b8" }}>
                {detection.camera
                  ? "AI Camera Connected"
                  : "Camera Not Connected"}
              </small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main style={styles.main}>
        {/* HEADER */}

        <header style={styles.header}>
          <div>
            <h1 style={styles.heading}>{activePage}</h1>

            <p style={styles.subtitle}>
              Driver Drowsiness Detection System
            </p>
          </div>

          <div style={styles.headerRight}>
            <div
              style={{
                ...styles.systemOnline,
                color: detection.camera
                  ? "#22c55e"
                  : "#ef4444",
              }}
            >
              <span
                style={{
                  ...styles.onlineDot,
                  background: detection.camera
                    ? "#22c55e"
                    : "#ef4444",
                }}
              />

              {detection.camera
                ? "System Online"
                : "System Offline"}
            </div>

            <div style={styles.profile}>
              <div style={styles.avatar}>LG</div>

              <div>
                <strong>Driver</strong>

                <small
                  style={{
                    display: "block",
                    color: "#94a3b8",
                  }}
                >
                  Active Session
                </small>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD */}

        {activePage === "Dashboard" && (
          <>
            {/* STATS */}

            <section style={styles.statsGrid}>
              <StatCard
                title="Driver Status"
                value={status}
                icon={
                  status === "DROWSY"
                    ? "🚨"
                    : status === "WARNING"
                    ? "⚠️"
                    : "🛡️"
                }
                color={statusColor}
                description={getStatusDescription(status)}
              />

              <StatCard
                title="Drowsiness Score"
                value={`${score.toFixed(0)}%`}
                icon="😴"
                color={statusColor}
                description={getRiskDescription(score)}
              />

              <StatCard
                title="Eye Status"
                value={
                  detection.eyes_closed
                    ? "CLOSED"
                    : "OPEN"
                }
                icon="👁️"
                color={
                  detection.eyes_closed
                    ? "#ef4444"
                    : "#22c55e"
                }
                description={`EAR: ${ear.toFixed(3)}`}
              />

              <StatCard
                title="Device Status"
                value={
                  detection.camera
                    ? "ONLINE"
                    : "OFFLINE"
                }
                icon="📡"
                color={
                  detection.camera
                    ? "#22c55e"
                    : "#ef4444"
                }
                description={
                  detection.camera
                    ? "AI camera connected"
                    : "Camera disconnected"
                }
              />
            </section>

            {/* CAMERA + DROWSINESS */}

            <section style={styles.contentGrid}>
              {/* LIVE CAMERA */}

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.cardTitle}>
                      Live Camera
                    </h2>

                    <p style={styles.cardSubtitle}>
                      Real-time driver monitoring
                    </p>
                  </div>

                  <span
                    style={{
                      ...styles.liveBadge,
                      color: monitoring
                        ? "#22c55e"
                        : "#ef4444",
                      background: monitoring
                        ? "#22c55e15"
                        : "#ef444415",
                    }}
                  >
                    ● {monitoring ? "LIVE" : "OFFLINE"}
                  </span>
                </div>

                {/* IMPORTANT:
                    No browser camera here.
                    We display the FastAPI/OpenCV stream.
                */}

                <div style={styles.camera}>
                  {monitoring ? (
                    <>
                      <img
                        src={`${API_URL}/api/camera/stream`}
                        alt="Live driver camera"
                        style={styles.video}
                      />

                      <div style={styles.cameraOverlay}>
                        <span>
                          ● LIVE AI MONITORING
                        </span>

                        <span>
                          {status}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={styles.cameraIcon}>
                        🎥
                      </div>

                      <h3>Camera Feed</h3>

                      <p style={styles.cameraText}>
                        Start monitoring to open
                        your camera
                      </p>
                    </>
                  )}

                  {error && (
                    <div style={styles.cameraError}>
                      ⚠️ {error}
                    </div>
                  )}
                </div>

                <div style={styles.cameraButtons}>
                  {!monitoring ? (
                    <button
                      style={styles.startButton}
                      onClick={startMonitoring}
                    >
                      ▶ Start Monitoring
                    </button>
                  ) : (
                    <button
                      style={styles.stopButton}
                      onClick={stopMonitoring}
                    >
                      ■ Stop Monitoring
                    </button>
                  )}
                </div>
              </div>

              {/* DROWSINESS */}

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.cardTitle}>
                      Drowsiness Level
                    </h2>

                    <p style={styles.cardSubtitle}>
                      Current driver condition
                    </p>
                  </div>
                </div>

                <div style={styles.gaugeContainer}>
                  <div
                    style={{
                      ...styles.gauge,
                      background: `conic-gradient(
                        ${statusColor} 0deg ${gaugeDegrees}deg,
                        #334155 ${gaugeDegrees}deg 360deg
                      )`,
                    }}
                  >
                    <div style={styles.gaugeInner}>
                      <strong
                        style={{
                          color: statusColor,
                          fontSize: "28px",
                        }}
                      >
                        {score.toFixed(0)}%
                      </strong>

                      <span
                        style={{
                          color: statusColor,
                          fontWeight: "700",
                        }}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.metrics}>
                  <Metric
                    label="EAR"
                    value={ear.toFixed(3)}
                  />

                  <Metric
                    label="MAR"
                    value={mar.toFixed(3)}
                  />

                  <Metric
                    label="Head Pose"
                    value={
                      detection.head_pose
                    }
                  />
                </div>
              </div>
            </section>

            {/* DETECTION DETAILS */}

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Detection Details
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Real-time AI detection parameters
                  </p>
                </div>

                <span
                  style={{
                    color: statusColor,
                    fontWeight: "700",
                  }}
                >
                  {status}
                </span>
              </div>

              <div style={styles.detailsGrid}>
                <Detail
                  label="Eye Status"
                  value={
                    detection.eyes_closed
                      ? "CLOSED"
                      : "OPEN"
                  }
                  danger={detection.eyes_closed}
                />

                <Detail
                  label="Yawning"
                  value={
                    detection.yawning
                      ? "YES"
                      : "NO"
                  }
                  danger={detection.yawning}
                />

                <Detail
                  label="Head Position"
                  value={
                    detection.head_down
                      ? "HEAD DOWN"
                      : detection.head_pose
                  }
                  danger={detection.head_down}
                />

                <Detail
                  label="Camera"
                  value={
                    detection.camera
                      ? "CONNECTED"
                      : "DISCONNECTED"
                  }
                  danger={!detection.camera}
                />
              </div>
            </div>

            {/* ACTIVITY */}

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Drowsiness Activity
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Current monitoring activity
                  </p>
                </div>
              </div>

              <div style={styles.activityContainer}>
                <div
                  style={{
                    ...styles.activityBar,
                    width: `${score}%`,
                    background: statusColor,
                  }}
                />
              </div>

              <div style={styles.activityLabels}>
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* ALERTS */}

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Recent Alerts
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Latest drowsiness events
                  </p>
                </div>

                <button
                  onClick={() =>
                    setActivePage("Alerts")
                  }
                  style={styles.viewButton}
                >
                  View All →
                </button>
              </div>

              {status === "DROWSY" && (
                <Alert
                  type="Danger"
                  message="High drowsiness detected"
                  time="Just now"
                />
              )}

              {status === "WARNING" && (
                <Alert
                  type="Warning"
                  message="Possible drowsiness detected"
                  time="Just now"
                />
              )}

              {detection.eyes_closed && (
                <Alert
                  type="Warning"
                  message="Driver's eyes are closed"
                  time="Just now"
                />
              )}

              {detection.yawning && (
                <Alert
                  type="Warning"
                  message="Yawning detected"
                  time="Just now"
                />
              )}

              {status === "SAFE" &&
                !detection.eyes_closed &&
                !detection.yawning && (
                  <Alert
                    type="Info"
                    message="Driver is alert and monitoring is active"
                    time="Just now"
                  />
                )}

              {status === "NO FACE" && (
                <Alert
                  type="Warning"
                  message="Driver face is not detected"
                  time="Just now"
                />
              )}

              {status === "OFFLINE" && (
                <Alert
                  type="Danger"
                  message="AI detection service is offline"
                  time="Just now"
                />
              )}
            </div>
          </>
        )}

        {/* OTHER PAGES */}

        {activePage !== "Dashboard" && (
          <div style={styles.placeholder}>
            <div style={{ fontSize: "60px" }}>
              {
                menuItems.find(
                  (x) => x.name === activePage
                )?.icon
              }
            </div>

            <h2>{activePage}</h2>

            <p>
              This module will be connected to
              the backend and AI service.
            </p>

            <button
              style={styles.startButton}
              onClick={() =>
                setActivePage("Dashboard")
              }
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ======================================================
// HELPERS
// ======================================================

function getStatusColor(status) {
  if (status === "DROWSY") return "#ef4444";
  if (status === "WARNING") return "#f59e0b";

  if (
    status === "OFFLINE" ||
    status === "CAMERA ERROR"
  ) {
    return "#64748b";
  }

  if (status === "NO FACE") return "#f59e0b";

  return "#22c55e";
}

function getStatusDescription(status) {
  if (status === "DROWSY")
    return "Drowsiness detected";

  if (status === "WARNING")
    return "Possible drowsiness detected";

  if (status === "NO FACE")
    return "Driver face not detected";

  if (status === "CAMERA ERROR")
    return "Camera error";

  if (status === "OFFLINE")
    return "AI service offline";

  return "Driver is alert";
}

function getRiskDescription(score) {
  if (score >= 60) return "High risk level";
  if (score >= 30) return "Moderate risk level";
  return "Low risk level";
}

// ======================================================
// COMPONENTS
// ======================================================

function StatCard({
  title,
  value,
  icon,
  color,
  description,
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <div>
          <p style={styles.statTitle}>
            {title}
          </p>

          <h2
            style={{
              ...styles.statValue,
              color,
            }}
          >
            {value}
          </h2>
        </div>

        <div
          style={{
            ...styles.statIcon,
            background: `${color}20`,
          }}
        >
          {icon}
        </div>
      </div>

      <p style={styles.statDescription}>
        {description}
      </p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={styles.metric}>
      <span
        style={{
          display: "block",
          color: "#94a3b8",
          fontSize: "12px",
          marginBottom: "5px",
        }}
      >
        {label}
      </span>

      <strong>{value}</strong>
    </div>
  );
}

function Detail({
  label,
  value,
  danger = false,
}) {
  return (
    <div style={styles.detail}>
      <span style={styles.detailLabel}>
        {label}
      </span>

      <strong
        style={{
          color: danger
            ? "#ef4444"
            : "#22c55e",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function Alert({
  type,
  message,
  time,
}) {
  const isDanger = type === "Danger";
  const isWarning = type === "Warning";

  const color = isDanger
    ? "#ef4444"
    : isWarning
    ? "#f59e0b"
    : "#3b82f6";

  return (
    <div style={styles.alert}>
      <div
        style={{
          ...styles.alertIcon,
          background: `${color}20`,
        }}
      >
        {isDanger
          ? "🚨"
          : isWarning
          ? "⚠️"
          : "ℹ️"}
      </div>

      <div style={{ flex: 1 }}>
        <strong>{message}</strong>

        <small
          style={{
            display: "block",
            color: "#64748b",
            marginTop: "4px",
          }}
        >
          {time}
        </small>
      </div>

      <span
        style={{
          ...styles.alertType,
          color,
        }}
      >
        {type}
      </span>
    </div>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#0f172a",
    color: "#f8fafc",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  sidebar: {
    width: "250px",
    background: "#111827",
    borderRight: "1px solid #1e293b",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    minHeight: "100vh",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 10px 30px",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    background: "#2563eb",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  logoTitle: {
    margin: 0,
    fontSize: "20px",
  },

  logoSub: {
    color: "#64748b",
    fontSize: "12px",
  },

  menuTitle: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
    padding: "0 12px 10px",
    letterSpacing: "1px",
  },

  menuItem: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    padding: "12px",
    marginBottom: "4px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "left",
  },

  activeMenu: {
    background: "#2563eb",
    color: "white",
  },

  sidebarBottom: {
    marginTop: "auto",
    borderTop: "1px solid #1e293b",
    paddingTop: "18px",
  },

  deviceStatus: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "10px",
    background: "#1e293b",
    borderRadius: "10px",
    fontSize: "13px",
  },

  onlineDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    display: "inline-block",
  },

  main: {
    flex: 1,
    padding: "28px 32px",
    overflow: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  heading: {
    margin: 0,
    fontSize: "28px",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#64748b",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },

  systemOnline: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "20px",
  },

  statCard: {
    background: "#1e293b",
    border: "1px solid #263449",
    borderRadius: "14px",
    padding: "20px",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statTitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  statValue: {
    margin: "8px 0 0",
    fontSize: "25px",
  },

  statIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  statDescription: {
    color: "#64748b",
    fontSize: "12px",
    margin: "14px 0 0",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#1e293b",
    border: "1px solid #263449",
    borderRadius: "14px",
    padding: "22px",
    marginBottom: "20px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "17px",
  },

  cardSubtitle: {
    color: "#64748b",
    margin: "5px 0 0",
    fontSize: "12px",
  },

  liveBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  camera: {
    height: "300px",
    background: "#0b1120",
    borderRadius: "12px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed #334155",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)",
    display: "block",
  },

  cameraOverlay: {
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    display: "flex",
    justifyContent: "space-between",
    color: "#22c55e",
    fontSize: "12px",
    fontWeight: "700",
    textShadow: "0 1px 3px black",
  },

  cameraIcon: {
    fontSize: "50px",
    marginBottom: "8px",
  },

  cameraText: {
    color: "#64748b",
    fontSize: "13px",
  },

  cameraError: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    right: "10px",
    padding: "10px",
    background: "#7f1d1d",
    color: "#fecaca",
    borderRadius: "8px",
    fontSize: "12px",
    textAlign: "center",
  },

  cameraButtons: {
    display: "flex",
    justifyContent: "center",
  },

  startButton: {
    marginTop: "15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  stopButton: {
    marginTop: "15px",
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  gaugeContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "15px",
  },

  gauge: {
    width: "170px",
    height: "170px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  gaugeInner: {
    width: "130px",
    height: "130px",
    background: "#1e293b",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  metrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "8px",
  },

  metric: {
    background: "#172033",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "12px",
  },

  detail: {
    background: "#172033",
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  detailLabel: {
    color: "#94a3b8",
    fontSize: "12px",
  },

  activityContainer: {
    height: "15px",
    background: "#334155",
    borderRadius: "20px",
    overflow: "hidden",
  },

  activityBar: {
    height: "100%",
    borderRadius: "20px",
    transition: "width 0.5s ease",
  },

  activityLabels: {
    display: "flex",
    justifyContent: "space-between",
    color: "#64748b",
    fontSize: "11px",
    marginTop: "8px",
  },

  viewButton: {
    background: "transparent",
    color: "#60a5fa",
    border: "none",
    cursor: "pointer",
  },

  alert: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    background: "#172033",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  alertIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  alertType: {
    fontSize: "12px",
    fontWeight: "700",
  },

  placeholder: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
  },
};

export default App;