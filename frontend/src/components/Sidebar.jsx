import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  History,
  Bell,
  Cpu,
  Users,
  Settings,
  Car,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Live Monitoring",
    path: "/monitoring",
    icon: Video,
  },
  {
    name: "History",
    path: "/history",
    icon: History,
  },
  {
    name: "Alerts",
    path: "/alerts",
    icon: Bell,
  },
  {
    name: "Devices",
    path: "/devices",
    icon: Cpu,
  },
  {
    name: "Drivers",
    path: "/drivers",
    icon: Users,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <Car size={22} />
        </div>

        <div>
          <h2>DrowsyGuard</h2>
          <span>IoT Safety System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="menu-label">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="online-dot"></span>

          <div>
            <strong>System Online</strong>
            <small>All services operational</small>
          </div>
        </div>
      </div>
    </aside>
  );
}