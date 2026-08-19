import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LiveCamera from "../components/LiveCamera";
import DrowsinessGauge from "../components/DrowsinessGauge";
import SensorCard from "../components/SensorCard";

export default function LiveMonitoring() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Live Monitoring"
          subtitle="Real-time driver monitoring system"
        />

        <section className="page-content">
          <div className="monitoring-grid">
            <LiveCamera />

            <div className="panel monitoring-status">
              <div className="panel-header">
                <div>
                  <h2>Driver Analysis</h2>
                  <p>Real-time AI analysis</p>
                </div>
              </div>

              <DrowsinessGauge value={24} />

              <div className="analysis-list">
                <div>
                  <span>Eyes</span>
                  <strong className="safe-text">Open</strong>
                </div>

                <div>
                  <span>Mouth</span>
                  <strong className="safe-text">Normal</strong>
                </div>

                <div>
                  <span>Head Pose</span>
                  <strong className="safe-text">Normal</strong>
                </div>

                <div>
                  <span>Attention</span>
                  <strong className="safe-text">High</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="sensor-grid">
            <SensorCard
              title="Eye Aspect Ratio"
              value="0.31"
              unit="EAR"
              status="Normal"
            />

            <SensorCard
              title="Mouth Aspect Ratio"
              value="0.28"
              unit="MAR"
              status="Normal"
            />

            <SensorCard
              title="Heart Rate"
              value="76"
              unit="BPM"
              status="Normal"
            />

            <SensorCard
              title="Vehicle Speed"
              value="62"
              unit="KM/H"
              status="Normal"
            />
          </div>
        </section>
      </main>
    </div>
  );
}