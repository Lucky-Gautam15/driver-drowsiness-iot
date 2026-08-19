import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const history = [
  {
    driver: "Raj Kumar",
    vehicle: "VH-1024",
    date: "12 Aug 2026",
    duration: "02:35:21",
    alerts: 3,
    status: "Safe",
  },
  {
    driver: "Amit Sharma",
    vehicle: "VH-1032",
    date: "12 Aug 2026",
    duration: "01:45:12",
    alerts: 5,
    status: "Warning",
  },
  {
    driver: "Rahul Singh",
    vehicle: "VH-1018",
    date: "11 Aug 2026",
    duration: "03:12:42",
    alerts: 1,
    status: "Safe",
  },
  {
    driver: "Vikas Kumar",
    vehicle: "VH-1041",
    date: "11 Aug 2026",
    duration: "02:20:18",
    alerts: 7,
    status: "Critical",
  },
];

export default function History() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Driving History"
          subtitle="Historical driver monitoring records"
        />

        <section className="page-content">
          <div className="panel table-panel">
            <div className="panel-header">
              <div>
                <h2>Monitoring Sessions</h2>
                <p>Previous driver monitoring sessions</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Alerts</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}>
                      <td>{item.driver}</td>
                      <td>{item.vehicle}</td>
                      <td>{item.date}</td>
                      <td>{item.duration}</td>
                      <td>{item.alerts}</td>
                      <td>
                        <span
                          className={`table-status ${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}