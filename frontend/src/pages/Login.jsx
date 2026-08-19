import { useState } from "react";
import { Navigate, Car, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="logo-icon">
            <Car size={25} />
          </div>

          <div>
            <h2>DrowsyGuard</h2>
            <span>IoT Driver Safety System</span>
          </div>
        </div>

        <div className="login-hero">
          <ShieldCheck size={65} />

          <h1>
            Safer Driving
            <br />
            Through Smart Technology
          </h1>

          <p>
            AI-powered driver monitoring system that detects signs of
            drowsiness and helps prevent accidents in real time.
          </p>
        </div>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Welcome Back</h1>

          <p>Login to your monitoring dashboard</p>

          {error && <div className="login-error">{error}</div>}

          <label>Email Address</label>

          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Login to Dashboard
          </button>

          <small className="demo-login">
            Demo: enter any email and password
          </small>
        </form>
      </div>
    </div>
  );
}