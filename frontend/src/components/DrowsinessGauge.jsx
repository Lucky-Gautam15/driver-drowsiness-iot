export default function DrowsinessGauge({ value = 25 }) {
  const getStatus = () => {
    if (value < 30) return "Alert";
    if (value < 60) return "Moderate";
    return "Drowsy";
  };

  const getClass = () => {
    if (value < 30) return "safe";
    if (value < 60) return "warning";
    return "danger";
  };

  return (
    <div className="gauge-container">
      <div
        className={`gauge ${getClass()}`}
        style={{
          "--progress": `${value * 3.6}deg`,
        }}
      >
        <div className="gauge-inner">
          <strong>{value}%</strong>
          <span>Drowsiness</span>
        </div>
      </div>

      <div className={`gauge-status ${getClass()}`}>
        <span className="status-dot"></span>
        {getStatus()}
      </div>
    </div>
  );
}