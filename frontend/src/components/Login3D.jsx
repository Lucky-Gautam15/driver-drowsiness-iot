import React, { useState } from "react";
import DriverMeshHUD from "./DriverMeshHUD";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // 3D Parallax Tilt state for Cockpit & Auth cards
  const [cockpitTilt, setCockpitTilt] = useState({ x: 0, y: 0 });
  const [authTilt, setAuthTilt] = useState({ x: 0, y: 0 });

  const handleCockpitMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setCockpitTilt({ x, y });
  };

  const handleAuthMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 7;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -7;
    setAuthTilt({ x, y });
  };

  const handleResetTilt = (setter) => {
    setter({ x: 0, y: 0 });
  };

  return (
    <div className="lux-portal-container">
      {/* LUXURY AMBIENT BACKGROUND WITH RADIAL BEAMS */}
      <div className="lux-bg-glow glow-top-left"></div>
      <div className="lux-bg-glow glow-bottom-right"></div>
      <div className="lux-grid-overlay"></div>

      <div className="lux-portal-wrapper">
        {/* LEFT PANEL: REAL COMPUTER VISION DRIVER DROWSINESS SHOWCASE */}
        <div className="lux-cockpit-panel">
          <div className="lux-brand-header">
            <div className="lux-shield-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <div className="lux-brand-title">DrowsyGuard OS</div>
              <div className="lux-brand-subtitle">AI & IoT Real-Time Driver Drowsiness Detection System</div>
            </div>
          </div>

          {/* COMPUTER VISION HUD CARD WITH 3D TILT */}
          <div
            className="lux-hud-card"
            style={{
              transform: `perspective(1000px) rotateX(${cockpitTilt.y}deg) rotateY(${cockpitTilt.x}deg)`,
            }}
            onMouseMove={handleCockpitMouseMove}
            onMouseLeave={() => handleResetTilt(setCockpitTilt)}
          >
            <div className="lux-hud-header">
              <span className="lux-hud-pill">
                <span className="lux-hud-dot"></span> REAL-TIME FACIAL FATIGUE DETECTION
              </span>
              <span className="lux-hud-fps">MEDIAPIPE CV • 60 FPS</span>
            </div>

            {/* COMPUTER VISION CABIN DRIVER TELEMETRY WITH FACIAL MESH & CROSSHAIRS */}
            <DriverMeshHUD />

            <div className="lux-hud-stats" style={{ marginTop: "14px" }}>
              <div className="lux-stat-item">
                <span className="stat-name">Facial Mesh</span>
                <span className="stat-val text-cyan">468 Landmarks</span>
              </div>
              <div className="lux-stat-divider"></div>
              <div className="lux-stat-item">
                <span className="stat-name">Fatigue Scale</span>
                <span className="stat-val text-emerald">0.0% – 100.0%</span>
              </div>
              <div className="lux-stat-divider"></div>
              <div className="lux-stat-item">
                <span className="stat-name">IoT Interlock</span>
                <span className="stat-val text-blue">ESP32 Ready</span>
              </div>
            </div>
          </div>

          {/* TELEMETRY FEATURE HIGHLIGHTS */}
          <div className="lux-features-grid">
            <div className="lux-feature-card">
              <div className="feat-icon blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m10 15 5-3-5-3v6z"/>
                </svg>
              </div>
              <div>
                <strong>Manual Camera Interlock</strong>
                <p>Telemetry only initiates when explicitly started by driver</p>
              </div>
            </div>

            <div className="lux-feature-card">
              <div className="feat-icon emerald">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12h20"/>
                  <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/>
                  <path d="m12 2 8 8H4z"/>
                </svg>
              </div>
              <div>
                <strong>Adaptive Calibration</strong>
                <p>Self-adjusting EAR baseline eliminates false eye-closure alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: PILOT AUTHENTICATION CONSOLE WITH 3D PERSPECTIVE TILT */}
        <div className="lux-auth-panel">
          <div
            className="lux-auth-card"
            style={{
              transform: `perspective(1000px) rotateX(${authTilt.y}deg) rotateY(${authTilt.x}deg)`,
            }}
            onMouseMove={handleAuthMouseMove}
            onMouseLeave={() => handleResetTilt(setAuthTilt)}
          >
            <div className="lux-console-badge">
              <span className="badge-shield-icon">🛡️</span>
              <span>ENTERPRISE CABIN CONSOLE</span>
            </div>

            <h2 className="lux-auth-title">Driver Authentication</h2>
            <p className="lux-auth-desc">
              Sign in with your driver Gmail or ID to initialize your live safety session.
            </p>

            {/* TAB SELECTOR */}
            <div className="lux-tab-selector">
              <button
                type="button"
                className={`lux-tab-btn ${!isRegisterMode ? "active" : ""}`}
                onClick={() => {
                  setIsRegisterMode(false);
                  setAuthError("");
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Driver Sign In
              </button>

              <button
                type="button"
                className={`lux-tab-btn ${isRegisterMode ? "active" : ""}`}
                onClick={() => {
                  setIsRegisterMode(true);
                  setAuthError("");
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Enroll New Driver
              </button>
            </div>

            {authError && (
              <div className="lux-error-banner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{authError}</span>
              </div>
            )}

            {!isRegisterMode ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="lux-form" autoComplete="off">
                <div className="lux-input-group">
                  <label htmlFor="login_email">Enter your Gmail or Driver ID</label>
                  <div className="lux-input-wrapper">
                    <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <input
                      id="login_email"
                      name="pilot_login_email_unq"
                      type="text"
                      placeholder="Enter your Gmail (e.g. driver@gmail.com)"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="lux-input-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label htmlFor="login_pass">Password</label>
                  </div>
                  <div className="lux-input-wrapper">
                    <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      id="login_pass"
                      name="pilot_login_pass_unq"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="lux-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="lux-submit-btn" disabled={authLoading}>
                  {authLoading ? (
                    <span>Authenticating Session...</span>
                  ) : (
                    <>
                      <span>Sign In to Cabin Console</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>

                <div className="lux-helper-note">
                  New driver?{" "}
                  <button
                    type="button"
                    className="lux-text-link"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setAuthError("");
                    }}
                  >
                    Enroll your driver Gmail here
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="lux-form" autoComplete="off">
                <div className="lux-input-group">
                  <label>Full Driver Name</label>
                  <div className="lux-input-wrapper">
                    <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      name="pilot_reg_name_unq"
                      type="text"
                      placeholder="Enter driver full name"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="lux-form-row">
                  <div className="lux-input-group">
                    <label>Enter your Gmail</label>
                    <div className="lux-input-wrapper">
                      <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      <input
                        name="pilot_reg_email_unq"
                        type="text"
                        placeholder="Enter your Gmail (e.g. driver@gmail.com)"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="lux-input-group">
                    <label>Password</label>
                    <div className="lux-input-wrapper">
                      <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input
                        name="pilot_reg_pass_unq"
                        type={showRegPassword ? "text" : "password"}
                        placeholder="Enter password (min 4 chars)"
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="lux-password-toggle"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        title={showRegPassword ? "Hide password" : "Show password"}
                      >
                        {showRegPassword ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="1" y1="1" x2="23" y2="23"/>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lux-form-row">
                  <div className="lux-input-group">
                    <label>Vehicle Number</label>
                    <div className="lux-input-wrapper">
                      <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                      <input
                        name="pilot_reg_veh_unq"
                        type="text"
                        placeholder="e.g. DL-01-AB-1234"
                        value={regForm.vehicleNumber}
                        onChange={(e) => setRegForm({ ...regForm, vehicleNumber: e.target.value })}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="lux-input-group">
                    <label>Contact Phone</label>
                    <div className="lux-input-wrapper">
                      <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <input
                        name="pilot_reg_phone_unq"
                        type="text"
                        placeholder="e.g. +91 98765 43210"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="lux-submit-btn" disabled={authLoading}>
                  {authLoading ? "Enrolling Driver..." : "Enroll Driver & Initialize →"}
                </button>

                <div className="lux-helper-note">
                  Already registered?{" "}
                  <button
                    type="button"
                    className="lux-text-link"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setAuthError("");
                    }}
                  >
                    Sign In with Existing Gmail
                  </button>
                </div>
              </form>
            )}

            {/* LIVE TELEMETRY HEALTH STATUS FOOTER */}
            <div className="lux-status-footer">
              <div className="status-indicator">
                <span className="dot dot-green"></span>
                <span>FastAPI AI 127.0.0.1:8000</span>
              </div>
              <div className="status-indicator">
                <span className="dot dot-green"></span>
                <span>MongoDB Atlas Sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
