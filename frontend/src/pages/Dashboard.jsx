import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Users,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatusCard from "../components/StatusCard";
import DrowsinessGauge from "../components/DrowsinessGauge";
import AlertCard from "../components/AlertCard";
import { DrowsinessChart, AlertChart } from "../components/Charts";

import useDrowsiness from "../hooks/useDrowsiness";

export default function Dashboard() {
  const {
    drowsiness,
    status,
    ear,
    mar,
    headPose,
    eyesClosed,
    yawning,
    headDown,
    camera,
    error,
  } = useDrowsiness();

  // -----------------------------
  // Status helpers
  // -----------------------------

  const getStatusClass = () => {
    if (status === "DROWSY") {
      return "danger-text";
    }

    if (status === "WARNING") {
      return "warning-text";
    }

    return "safe-text";
  };

  const getStatusMessage = () => {
    if (status === "DROWSY") {
      return "Drowsiness detected! Driver attention required.";
    }

    if (status === "WARNING") {
      return "Warning: Possible signs of drowsiness detected.";
    }

    if (status === "NO FACE") {
      return "No driver face detected.";
    }

    if (status === "CAMERA ERROR") {
      return "Camera error. Please check the camera.";
    }

    return "Driver is alert. No significant drowsiness detected.";
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Dashboard"
          subtitle="Real-time driver safety monitoring"
        />

        <section className="dashboard-content">

          {/* ================= STATUS CARDS ================= */}

          <div className="status-grid">

            <StatusCard
              title="Driver Status"
              value={status}
              subtitle="Live AI detection"
              icon={Users}
              type={
                status === "DROWSY"
                  ? "orange"
                  : status === "WARNING"
                  ? "orange"
                  : "green"
              }
            />

            <StatusCard
              title="Drowsiness Score"
              value={`${Number(drowsiness).toFixed(0)}%`}
              subtitle="Real-time risk score"
              icon={Activity}
              type={
                drowsiness >= 60
                  ? "orange"
                  : drowsiness >= 30
                  ? "blue"
                  : "green"
              }
            />

            <StatusCard
              title="Eye Status"
              value={eyesClosed ? "CLOSED" : "OPEN"}
              subtitle={`EAR: ${Number(ear).toFixed(3)}`}
              icon={AlertTriangle}
              type={eyesClosed ? "orange" : "green"}
            />

            <StatusCard
              title="AI System"
              value={camera ? "ONLINE" : "OFFLINE"}
              subtitle={
                error
                  ? "FastAPI connection error"
                  : "FastAPI connected"
              }
              icon={ShieldCheck}
              type={camera ? "purple" : "orange"}
            />

          </div>

          {/* ================= MAIN DASHBOARD ================= */}

          <div className="dashboard-grid">

            {/* ================= DRIVER STATUS ================= */}

            <div className="panel drowsiness-panel">

              <div className="panel-header">

                <div>
                  <h2>Current Driver Status</h2>

                  <p>
                    Vehicle #VH-1024 • Driver: Raj Kumar
                  </p>
                </div>

                <span
                  className={`live-pill ${
                    camera ? "live-active" : "live-inactive"
                  }`}
                >
                  <span></span>

                  {camera ? "LIVE" : "OFFLINE"}
                </span>

              </div>

              <div className="drowsiness-content">

                {/* ================= GAUGE ================= */}

                <DrowsinessGauge
                  value={Number(drowsiness)}
                />

                {/* ================= DRIVER DETAILS ================= */}

                <div className="driver-details">

                  {/* STATUS */}

                  <div className="detail-row">
                    <span>Current Status</span>

                    <strong className={getStatusClass()}>
                      {status}
                    </strong>
                  </div>

                  {/* EYES */}

                  <div className="detail-row">
                    <span>Eye Status</span>

                    <strong
                      className={
                        eyesClosed
                          ? "danger-text"
                          : "safe-text"
                      }
                    >
                      {eyesClosed ? "Closed" : "Open"}
                    </strong>
                  </div>

                  {/* EAR */}

                  <div className="detail-row">
                    <span>EAR</span>

                    <strong>
                      {Number(ear).toFixed(3)}
                    </strong>
                  </div>

                  {/* MAR */}

                  <div className="detail-row">
                    <span>MAR</span>

                    <strong>
                      {Number(mar).toFixed(3)}
                    </strong>
                  </div>

                  {/* YAWNING */}

                  <div className="detail-row">
                    <span>Yawning</span>

                    <strong
                      className={
                        yawning
                          ? "danger-text"
                          : "safe-text"
                      }
                    >
                      {yawning ? "Yes" : "No"}
                    </strong>
                  </div>

                  {/* HEAD POSE */}

                  <div className="detail-row">
                    <span>Head Position</span>

                    <strong
                      className={
                        headDown
                          ? "warning-text"
                          : "safe-text"
                      }
                    >
                      {headPose}
                    </strong>
                  </div>

                  {/* CAMERA */}

                  <div className="detail-row">
                    <span>Camera</span>

                    <strong
                      className={
                        camera
                          ? "safe-text"
                          : "danger-text"
                      }
                    >
                      {camera ? "Connected" : "Disconnected"}
                    </strong>
                  </div>

                </div>
              </div>

              {/* ================= STATUS MESSAGE ================= */}

              <div className="driver-status-message">

                {status === "DROWSY" && (
                  <>
                    <AlertTriangle size={20} />

                    <span>
                      {getStatusMessage()}
                    </span>
                  </>
                )}

                {status === "WARNING" && (
                  <>
                    <AlertTriangle size={20} />

                    <span>
                      {getStatusMessage()}
                    </span>
                  </>
                )}

                {status === "SAFE" && (
                  <>
                    <ShieldCheck size={20} />

                    <span>
                      {getStatusMessage()}
                    </span>
                  </>
                )}

                {status === "NO FACE" && (
                  <>
                    <AlertTriangle size={20} />

                    <span>
                      {getStatusMessage()}
                    </span>
                  </>
                )}

                {status === "CAMERA ERROR" && (
                  <>
                    <AlertTriangle size={20} />

                    <span>
                      {getStatusMessage()}
                    </span>
                  </>
                )}

              </div>

            </div>

            {/* ================= RECENT ALERTS ================= */}

            <div className="panel">

              <div className="panel-header">

                <div>
                  <h2>Recent Alerts</h2>

                  <p>
                    Latest driver safety events
                  </p>
                </div>

                <a href="/alerts">
                  View All
                </a>

              </div>

              <div className="alerts-list">

                {status === "DROWSY" && (
                  <AlertCard
                    type="danger"
                    title="High Drowsiness Detected"
                    message="Driver is showing significant signs of drowsiness."
                    time="Just now"
                  />
                )}

                {status === "WARNING" && (
                  <AlertCard
                    type="warning"
                    title="Drowsiness Warning"
                    message="Possible signs of driver drowsiness detected."
                    time="Just now"
                  />
                )}

                {eyesClosed && (
                  <AlertCard
                    type="warning"
                    title="Eye Closure Detected"
                    message="Driver's eyes are currently detected as closed."
                    time="Just now"
                  />
                )}

                {yawning && (
                  <AlertCard
                    type="warning"
                    title="Yawning Detected"
                    message="Driver yawning detected by AI system."
                    time="Just now"
                  />
                )}

                {headDown && (
                  <AlertCard
                    type="warning"
                    title="Head Position Warning"
                    message="Driver's head position indicates possible distraction or drowsiness."
                    time="Just now"
                  />
                )}

                {status === "SAFE" &&
                  !eyesClosed &&
                  !yawning &&
                  !headDown && (
                    <AlertCard
                      type="success"
                      title="Driver Safe"
                      message="No immediate drowsiness indicators detected."
                      time="Just now"
                    />
                  )}

              </div>
            </div>

          </div>

          {/* ================= CHARTS ================= */}

          <div className="chart-grid">

            {/* DROWSINESS CHART */}

            <div className="panel">

              <div className="panel-header">

                <div>
                  <h2>Drowsiness Trend</h2>

                  <p>
                    Driver monitoring over the last 60 minutes
                  </p>
                </div>

                <Activity size={20} />

              </div>

              <DrowsinessChart />

            </div>

            {/* ALERT CHART */}

            <div className="panel">

              <div className="panel-header">

                <div>
                  <h2>Weekly Alerts</h2>

                  <p>
                    Number of safety alerts
                  </p>
                </div>

              </div>

              <AlertChart />

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}