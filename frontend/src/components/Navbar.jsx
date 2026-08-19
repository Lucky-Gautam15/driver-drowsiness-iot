import { Bell, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ title, subtitle }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-info">
          <UserCircle size={38} />

          <div>
            <strong>{user?.name || "Admin"}</strong>
            <span>{user?.role || "Administrator"}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}