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
  return (
    <div className="lux-portal-container">
      {/* LUXURY AMBIENT BACKGROUND WITH RADIAL BEAMS */}
      <div className="lux-bg-glow glow-top-left"></div>
      <div className="lux-bg-glow glow-bottom-right"></div>
      <div className="lux-grid-overlay"></div>

      <div className="lux-portal-wrapper">
        {/* LEFT PANEL: AUTOMOTIVE COCKPIT TELEMETRY SHOWCASE */}
        <div className="lux-cockpit-panel">
          <div className="lux-brand-header">
            <div className="lux-shield-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <div className="lux-brand-title">DrowsyGuard OS</div>
              <div className="lux-brand-subtitle">AI & IoT Commercial Fleet Safety</div>
            </div>
          </div>

          {/* INTERACTIVE 3D RADAR HUD CANVAS */}
          <div className="lux-hud-card">
            <div className="lux-hud-header">
              <span className="lux-hud-pill">
                <span className="lux-hud-dot"></span> CABIN TELEMETRY RADAR
              </span>
              <span className="lux-hud-fps">60 FPS EDGE AI</span>
            </div>

            <div className="lux-radar-visual">
              <div className="lux-radar-circle c-1"></div>
              <div className="lux-radar-circle c-2"></div>
              <div className="lux-radar-circle c-3"></div>
              <div className="lux-radar-cross-h"></div>
              <div className="lux-radar-cross-v"></div>
              <div className="lux-radar-sweep"></div>

              {/* TARGET DRIVER RETICLE */}
              <div className="lux-target-reticle">
                <div className="reticle-box"></div>
                <span className="reticle-label">DRIVER FOCAL LOCK</span>
              </div>
            </div>

            <div className="lux-hud-stats">
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

        {/* RIGHT PANEL: PILOT AUTHENTICATION CONSOLE */}
        <div className="lux-auth-panel">
          <div className="lux-auth-card">
            <div className="lux-console-badge">
              <span className="badge-shield-icon">🛡️</span>
              <span>ENTERPRISE FLEET ACCESS</span>
            </div>

            <h2 className="lux-auth-title">Driver Authentication</h2>
            <p className="lux-auth-desc">
              Sign in with your driver credentials to initialize your monitoring session.
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
              <form onSubmit={handleLoginSubmit} className="lux-form">
                <div className="lux-input-group">
                  <label>Driver ID or Email</label>
                  <div className="lux-input-wrapper">
                    <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="e.g. driver_01 or rajesh@fleet.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      autoComplete="username"
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
                      type="password"
                      placeholder="Enter cabin password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      autoComplete="current-password"
                    />
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
                    Enroll your driver ID here
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="lux-form">
                <div className="lux-input-group">
                  <label>Full Driver Name</label>
                  <div className="lux-input-wrapper">
                    <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="lux-form-row">
                  <div className="lux-input-group">
                    <label>Driver ID / Email</label>
                    <div className="lux-input-wrapper">
                      <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="driver_01"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        required
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
                        type="password"
                        placeholder="Min 4 chars"
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="lux-form-row">
                  <div className="lux-input-group">
                    <label>Assigned Vehicle</label>
                    <div className="lux-input-wrapper">
                      <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="DL-01-AB-1234"
                        value={regForm.vehicleNumber}
                        onChange={(e) => setRegForm({ ...regForm, vehicleNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="lux-input-group">
                    <label>License Number</label>
                    <div className="lux-input-wrapper">
                      <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="DL-142023000987"
                        value={regForm.licenseNumber}
                        onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="lux-input-group">
                  <label>Contact Phone</label>
                  <div className="lux-input-wrapper">
                    <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    />
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
                    Sign In with Existing ID
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
