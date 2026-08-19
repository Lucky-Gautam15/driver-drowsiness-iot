import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Settings() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Settings"
          subtitle="Configure monitoring system"
        />

        <section className="page-content">
          <div className="panel settings-panel">
            <h2>Detection Settings</h2>
            <p className="settings-description">
              Configure thresholds used by the driver monitoring system.
            </p>

            <div className="setting-row">
              <div>
                <strong>Eye Closure Threshold</strong>
                <span>Time before an eye closure warning is triggered.</span>
              </div>

              <input type="number" defaultValue="1.5" step="0.1" />
              <small>seconds</small>
            </div>

            <div className="setting-row">
              <div>
                <strong>Drowsiness Threshold</strong>
                <span>Score above which the driver is considered drowsy.</span>
              </div>

              <input type="number" defaultValue="60" />
              <small>%</small>
            </div>

            <div className="setting-row">
              <div>
                <strong>Alert Sound</strong>
                <span>Play an audible warning when drowsiness is detected.</span>
              </div>

              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <div className="setting-row">
              <div>
                <strong>ESP32 IoT Alert</strong>
                <span>Send alerts to the connected IoT device.</span>
              </div>

              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <button className="primary-btn">Save Settings</button>
          </div>
        </section>
      </main>
    </div>
  );
}