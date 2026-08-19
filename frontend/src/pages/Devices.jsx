import { Cpu, Wifi, WifiOff } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const devices = [
  {
    id: "ESP32-001",
    vehicle: "VH-1024",
    location: "Delhi Highway",
    status: "Online",
    signal: "Excellent",
  },
  {
    id: "ESP32-002",
    vehicle: "VH-1032",
    location: "Jaipur Road",
    status: "Online",
    signal: "Good",
  },
  {
    id: "ESP32-003",
    vehicle: "VH-1018",
    location: "City Center",
    status: "Offline",
    signal: "No Signal",
  },
];

export default function Devices() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="IoT Devices"
          subtitle="ESP32 device monitoring"
        />

        <section className="page-content">
          <div className="device-grid">
            {devices.map((device) => {
              const online = device.status === "Online";

              return (
                <div className="device-card" key={device.id}>
                  <div className="device-top">
                    <div className="device-icon">
                      <Cpu size={26} />
                    </div>

                    {online ? (
                      <Wifi className="online-icon" />
                    ) : (
                      <WifiOff className="offline-icon" />
                    )}
                  </div>

                  <h3>{device.id}</h3>

                  <p>{device.vehicle}</p>

                  <div className="device-details">
                    <span>Location</span>
                    <strong>{device.location}</strong>

                    <span>Signal</span>
                    <strong>{device.signal}</strong>
                  </div>

                  <div className={`device-status ${online ? "online" : "offline"}`}>
                    <span></span>
                    {device.status}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}