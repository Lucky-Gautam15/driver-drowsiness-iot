import { UserRound, ShieldCheck } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const drivers = [
  {
    name: "Raj Kumar",
    id: "D-102",
    vehicle: "VH-1024",
    status: "Active",
    score: "24%",
  },
  {
    name: "Amit Sharma",
    id: "D-103",
    vehicle: "VH-1032",
    status: "Active",
    score: "42%",
  },
  {
    name: "Rahul Singh",
    id: "D-104",
    vehicle: "VH-1018",
    status: "Offline",
    score: "18%",
  },
  {
    name: "Vikas Kumar",
    id: "D-105",
    vehicle: "VH-1041",
    status: "Warning",
    score: "68%",
  },
];

export default function Drivers() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Drivers"
          subtitle="Manage registered drivers"
        />

        <section className="page-content">
          <div className="driver-grid">
            {drivers.map((driver) => (
              <div className="driver-card" key={driver.id}>
                <div className="driver-avatar">
                  <UserRound size={32} />
                </div>

                <h3>{driver.name}</h3>
                <span>{driver.id}</span>

                <div className="driver-info">
                  <div>
                    <small>Vehicle</small>
                    <strong>{driver.vehicle}</strong>
                  </div>

                  <div>
                    <small>Drowsiness</small>
                    <strong>{driver.score}</strong>
                  </div>
                </div>

                <div className="driver-footer">
                  <span
                    className={`driver-status ${driver.status.toLowerCase()}`}
                  >
                    {driver.status}
                  </span>

                  <ShieldCheck size={19} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}