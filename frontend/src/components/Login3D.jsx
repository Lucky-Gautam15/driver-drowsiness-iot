import React, { useState } from "react";

export default function Login3D({
  loginForm,
  setLoginForm,
  regForm,
  setRegForm,
  isRegisterMode,
  setIsRegisterMode,
  handleLoginSubmit,
  handleRegisterSubmit,
  authLoading,
  authError,
  setAuthError,
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = -((y - cy) / cy) * 12;
    const rotateY = ((x - cx) / cx) * 12;
    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div className="login3d-viewport">
      {/* 3D CYBER HIGHWAY GRID BACKGROUND */}
      <div className="cyber-space">
        <div className="cyber-horizon"></div>
        <div className="cyber-grid"></div>
        <div className="neon-beam beam-left"></div>
        <div className="neon-beam beam-right"></div>
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
      </div>

      {/* FLOATING 3D SPECS BADGES */}
      <div className="floating-badge badge-left">
        <span className="badge-pulse"></span>
        <div>
          <strong>AI Edge Vision</strong>
          <small>468 3D Landmarks • 60 FPS</small>
        </div>
      </div>

      <div className="floating-badge badge-right">
        <span className="badge-pulse green"></span>
        <div>
          <strong>Smart IoT Safety</strong>
          <small>0-100% Adaptive Calibration</small>
        </div>
      </div>

      {/* 3D TILT CONTAINER */}
      <div
        className="tilt-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="login3d-card"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
          }}
        >
          {/* DYNAMIC SPECULAR GLARE OVERLAY */}
          <div
            className="card-glare"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(56, 189, 248, ${glare.opacity}) 0%, transparent 60%)`,
            }}
          />

          {/* 3D HOLOGRAPHIC RADAR CORE */}
          <div className="hologram-stage">
            <div className="holo-ring ring-outer"></div>
            <div className="holo-ring ring-mid"></div>
            <div className="holo-ring ring-inner"></div>
            <div className="holo-core">
              <span className="holo-car">🚗</span>
            </div>
            <div className="holo-scanline"></div>
          </div>

          <div className="auth3d-header">
            <h1 className="auth3d-title">DrowsyGuard IoT</h1>
            <p className="auth3d-sub">Next-Gen AI Driver Safety & Fatigue Console</p>
          </div>

          {/* 3D PILL TABS */}
          <div className="tabs3d-container">
            <button
              type="button"
              className={`tab3d-btn ${!isRegisterMode ? "active" : ""}`}
              onClick={() => {
                setIsRegisterMode(false);
                setAuthError("");
              }}
            >
              <span>🔑</span> Driver Login
            </button>
            <button
              type="button"
              className={`tab3d-btn ${isRegisterMode ? "active" : ""}`}
              onClick={() => {
                setIsRegisterMode(true);
                setAuthError("");
              }}
            >
              <span>👤</span> Register Driver
            </button>
          </div>

          {authError && (
            <div className="auth3d-alert">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          {/* FORMS */}
          {!isRegisterMode ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="auth3d-form">
              <div className="input3d-group">
                <label>Driver ID or Email</label>
                <div className="input3d-box">
                  <span className="input3d-icon">🆔</span>
                  <input
                    type="text"
                    placeholder="e.g. driver_01 or rajesh@fleet.com"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="input3d-group">
                <label>Password</label>
                <div className="input3d-box">
                  <span className="input3d-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Enter cabin password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn3d-submit"
                disabled={authLoading}
              >
                <span className="btn3d-glow"></span>
                <span className="btn3d-text">
                  {authLoading ? "Authenticating AI..." : "🚀 Launch Cabin Console"}
                </span>
              </button>

              <div className="auth3d-footer-hint">
                First time onboarding? Click{" "}
                <button
                  type="button"
                  className="link3d-btn"
                  onClick={() => setIsRegisterMode(true)}
                >
                  Register Driver
                </button>{" "}
                to create your ID.
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="auth3d-form">
              <div className="input3d-group">
                <label>Full Driver Name</label>
                <div className="input3d-box">
                  <span className="input3d-icon">👤</span>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={regForm.name}
                    onChange={(e) =>
                      setRegForm({ ...regForm, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form3d-row">
                <div className="input3d-group">
                  <label>Driver ID / Email</label>
                  <div className="input3d-box">
                    <span className="input3d-icon">🆔</span>
                    <input
                      type="text"
                      placeholder="driver_01"
                      value={regForm.email}
                      onChange={(e) =>
                        setRegForm({ ...regForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="input3d-group">
                  <label>Create Password</label>
                  <div className="input3d-box">
                    <span className="input3d-icon">🔑</span>
                    <input
                      type="password"
                      placeholder="Min 4 chars"
                      value={regForm.password}
                      onChange={(e) =>
                        setRegForm({ ...regForm, password: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form3d-row">
                <div className="input3d-group">
                  <label>Vehicle Number</label>
                  <div className="input3d-box">
                    <span className="input3d-icon">🚗</span>
                    <input
                      type="text"
                      placeholder="DL-01-AB-1234"
                      value={regForm.vehicleNumber}
                      onChange={(e) =>
                        setRegForm({ ...regForm, vehicleNumber: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="input3d-group">
                  <label>License Number</label>
                  <div className="input3d-box">
                    <span className="input3d-icon">📜</span>
                    <input
                      type="text"
                      placeholder="DL-142023000987"
                      value={regForm.licenseNumber}
                      onChange={(e) =>
                        setRegForm({ ...regForm, licenseNumber: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="input3d-group">
                <label>Contact Phone</label>
                <div className="input3d-box">
                  <span className="input3d-icon">📞</span>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={regForm.phone}
                    onChange={(e) =>
                      setRegForm({ ...regForm, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn3d-submit"
                disabled={authLoading}
              >
                <span className="btn3d-glow"></span>
                <span className="btn3d-text">
                  {authLoading ? "Enrolling..." : "✨ Create Driver Profile"}
                </span>
              </button>

              <div className="auth3d-footer-hint">
                Already registered?{" "}
                <button
                  type="button"
                  className="link3d-btn"
                  onClick={() => setIsRegisterMode(false)}
                >
                  Sign In with Existing ID
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
