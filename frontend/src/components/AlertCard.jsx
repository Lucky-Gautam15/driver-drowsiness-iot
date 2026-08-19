import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function AlertCard({
  type = "warning",
  title,
  message,
  time,
}) {
  const Icon = type === "danger" ? AlertTriangle : CheckCircle;

  return (
    <div className={`alert-card ${type}`}>
      <div className="alert-icon">
        <Icon size={20} />
      </div>

      <div className="alert-content">
        <strong>{title}</strong>
        <p>{message}</p>

        <small>
          <Clock size={13} />
          {time}
        </small>
      </div>
    </div>
  );
}