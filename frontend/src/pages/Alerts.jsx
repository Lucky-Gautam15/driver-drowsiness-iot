import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AlertCard from "../components/AlertCard";

export default function Alerts() {
  const alerts = [
    {
      type: "danger",
      title: "Severe Drowsiness",
      message: "Driver D-102 eyes remained closed for 3.1 seconds.",
      time: "10 minutes ago",
    },
    {
      type: "warning",
      title: "Frequent Yawning",
      message: "Multiple yawning events detected.",
      time: "25 minutes ago",
    },
    {
      type: "warning",
      title: "Eye Closure Warning",
      message: "Abnormal eye closure pattern detected.",
      time: "1 hour ago",
    },
    {
      type: "warning",
      title: "Driver Attention Low",
      message: "Head pose indicates reduced attention.",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Alerts"
          subtitle="Driver safety alerts and notifications"
        />

        <section className="page-content">
          <div className="page-title-row">
            <div>
              <h2>Safety Alerts</h2>
              <p>Monitor all detected driver safety events.</p>
            </div>
          </div>

          <div className="alerts-page">
            {alerts.map((alert, index) => (
              <AlertCard key={index} {...alert} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}