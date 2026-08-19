export default function StatusCard({
  title,
  value,
  subtitle,
  icon: Icon,
  type = "normal",
}) {
  return (
    <div className="status-card">
      <div className={`status-icon ${type}`}>
        <Icon size={23} />
      </div>

      <div className="status-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}