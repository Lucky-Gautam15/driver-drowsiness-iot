import { Activity } from "lucide-react";

export default function SensorCard({
  title,
  value,
  unit,
  status = "Normal",
}) {
  return (
    <div className="sensor-card">
      <div className="sensor-header">
        <span>{title}</span>
        <Activity size={18} />
      </div>

      <div className="sensor-value">
        {value}
        <small>{unit}</small>
      </div>

      <span className="sensor-status">
        <span></span>
        {status}
      </span>
    </div>
  );
}