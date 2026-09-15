import React, { useState, useEffect } from "react";

export default function DriverMeshHUD() {
  // Real-time simulated micro-variations to make it feel 100% alive
  const [telemetry, setTelemetry] = useState({
    ear: 0.282,
    mar: 0.115,
    pitch: 1.2,
    blinks: 18,
    status: "ATTENTIVE",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => ({
        ear: +(0.275 + Math.random() * 0.018).toFixed(3),
        mar: +(0.110 + Math.random() * 0.012).toFixed(3),
        pitch: +(1.0 + Math.random() * 0.6).toFixed(1),
        blinks: 18,
        status: "ATTENTIVE",
      }));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="driver-hud-container">
      {/* BACKGROUND PHOTOREALISTIC CABIN DRIVER IMAGE */}
      <img
        src="/driver_telemetry.jpg"
        alt="Real-time Driver Fatigue AI Monitoring"
        className="driver-hud-img"
      />

      {/* AMBIENT COCKPIT VIGNETTE & SCANLINES */}
      <div className="driver-hud-vignette"></div>
      <div className="driver-hud-scanlines"></div>

      {/* SVG COMPUTER VISION FACIAL MESH OVERLAY */}
      <svg
        className="driver-hud-svg"
        viewBox="0 0 1000 562.5"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Glowing Green Filter */}
          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glowing Cyan Filter */}
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glowing Yellow Filter */}
          <filter id="glow-yellow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Vertical Scanner Gradient */}
          <linearGradient id="scan-laser" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
            <stop offset="90%" stopColor="rgba(56, 189, 248, 0.4)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0.95)" />
          </linearGradient>
        </defs>

        {/* ---------------------------------------------------- */}
        {/* GREEN TARGET BOUNDING BOX [   ]                      */}
        {/* ---------------------------------------------------- */}
        <g filter="url(#glow-green)" stroke="#22c55e" strokeWidth="2.5" fill="none">
          {/* Top-Left Corner */}
          <path d="M 610 170 L 610 130 L 650 130" />
          {/* Top-Right Corner */}
          <path d="M 830 130 L 870 130 L 870 170" />
          {/* Bottom-Left Corner */}
          <path d="M 610 440 L 610 480 L 650 480" />
          {/* Bottom-Right Corner */}
          <path d="M 830 480 L 870 480 L 870 440" />

          {/* Subdued Bounding Box outline */}
          <rect
            x="610"
            y="130"
            width="260"
            height="350"
            stroke="rgba(34, 197, 94, 0.25)"
            strokeWidth="1"
            strokeDasharray="6 4"
          />
        </g>

        {/* SCANNING LASER BEAM */}
        <g>
          <rect
            className="hud-scan-beam"
            x="610"
            y="130"
            width="260"
            height="50"
            fill="url(#scan-laser)"
          />
        </g>

        {/* BOUNDING BOX HUD BADGES */}
        <g>
          <rect
            x="610"
            y="104"
            width="160"
            height="22"
            rx="4"
            fill="rgba(8, 14, 28, 0.85)"
            stroke="rgba(34, 197, 94, 0.5)"
            strokeWidth="1"
          />
          <circle cx="622" cy="115" r="3.5" fill="#22c55e" />
          <text
            x="632"
            y="119"
            fill="#4ade80"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            DRIVER ID #468 LOCK
          </text>
        </g>

        {/* ---------------------------------------------------- */}
        {/* CYAN FACIAL WIREFRAME MESH (Exact match to ref image)*/}
        {/* ---------------------------------------------------- */}
        <g
          filter="url(#glow-cyan)"
          stroke="rgba(56, 189, 248, 0.75)"
          strokeWidth="1.6"
          fill="none"
          strokeLinejoin="round"
        >
          {/* Outer Facial Contour & Forehead lines */}
          <polyline points="725,175 805,215 825,270 820,350 795,410 740,465 690,480 660,465" />
          <line x1="725" y1="175" x2="685" y2="210" />
          <line x1="685" y1="210" x2="660" y2="245" />

          {/* Eyebrow & Temple Mesh */}
          <polyline points="660,245 700,240 735,248 775,255" />
          <line x1="700" y1="240" x2="805" y2="215" />
          <line x1="735" y1="248" x2="825" y2="270" />

          {/* Eye Orbit Geometry */}
          <polygon points="665,278 695,270 725,278 700,285" stroke="#38bdf8" strokeWidth="1.8" />
          <line x1="665" y1="278" x2="660" y2="245" />
          <line x1="695" y1="270" x2="700" y2="240" />
          <line x1="725" y1="278" x2="735" y2="248" />

          {/* Nose Bridge and Profile Mesh */}
          <polyline points="665,278 650,305 640,340 655,355 675,348" />
          <line x1="650" y1="305" x2="695" y2="330" />
          <line x1="640" y1="340" x2="695" y2="330" />
          <line x1="655" y1="355" x2="675" y2="380" />

          {/* Cheek and Mid-Face Triangulation */}
          <line x1="725" y1="278" x2="760" y2="330" />
          <line x1="700" y1="285" x2="695" y2="330" />
          <line x1="695" y1="330" x2="760" y2="330" />
          <line x1="760" y1="330" x2="820" y2="350" />
          <line x1="760" y1="330" x2="750" y2="400" />
          <line x1="695" y1="330" x2="710" y2="385" />

          {/* Mouth & Lips Mesh */}
          <polygon points="655,402 680,392 715,400 682,412" stroke="#38bdf8" strokeWidth="1.8" />
          <polyline points="655,402 682,425 715,400" />
          <line x1="680" y1="392" x2="675" y2="380" />
          <line x1="710" y1="385" x2="715" y2="400" />

          {/* Chin & Jaw Connections */}
          <line x1="682" y1="425" x2="690" y2="480" />
          <line x1="715" y1="400" x2="750" y2="400" />
          <line x1="750" y1="400" x2="740" y2="465" />
          <line x1="750" y1="400" x2="795" y2="410" />
          <line x1="655" y1="402" x2="660" y2="465" />
        </g>

        {/* ---------------------------------------------------- */}
        {/* YELLOW TRACKING CROSSHAIRS (+) (Matching ref image) */}
        {/* ---------------------------------------------------- */}
        <g
          filter="url(#glow-yellow)"
          stroke="#eab308"
          strokeWidth="2"
          strokeLinecap="round"
          className="hud-crosshair-group"
        >
          {/* Eye Landmark Crosses */}
          <g transform="translate(665, 278)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>
          <g transform="translate(695, 270)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>
          <g transform="translate(725, 278)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>

          {/* Temple & Forehead Crosses */}
          <g transform="translate(780, 255)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>
          <g transform="translate(805, 280)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>

          {/* Nose Landmark Crosses */}
          <g transform="translate(640, 340)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>
          <g transform="translate(675, 348)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>

          {/* Cheek Landmark Cross */}
          <g transform="translate(760, 330)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>

          {/* Mouth & Chin Landmark Crosses */}
          <g transform="translate(655, 402)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>
          <g transform="translate(715, 400)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>
          <g transform="translate(682, 425)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>
          <g transform="translate(690, 480)">
            <line x1="-5" y1="0" x2="5" y2="0" />
            <line x1="0" y1="-5" x2="0" y2="5" />
          </g>
        </g>
      </svg>

      {/* FLOATING CORNER TELEMETRY OSD HUD OVERLAYS */}
      <div className="driver-osd-top-left">
        <div className="osd-pill live-pill">
          <span className="osd-dot pulse"></span>
          <span>CV AI STREAM: 60 FPS</span>
        </div>
      </div>

      <div className="driver-osd-bottom-left">
        <div className="osd-telemetry-box">
          <div className="osd-stat-row">
            <span className="osd-lbl">EAR (Eyes):</span>
            <span className="osd-val text-cyan">{telemetry.ear}</span>
            <span className="osd-sub text-emerald">OPEN</span>
          </div>
          <div className="osd-stat-row">
            <span className="osd-lbl">MAR (Mouth):</span>
            <span className="osd-val text-blue">{telemetry.mar}</span>
            <span className="osd-sub text-slate">NORMAL</span>
          </div>
          <div className="osd-stat-row">
            <span className="osd-lbl">Fatigue Risk:</span>
            <span className="osd-val text-emerald">0.0%</span>
            <span className="osd-sub text-emerald">[SAFE]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
