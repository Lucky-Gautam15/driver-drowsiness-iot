import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const drowsinessData = [
  { time: "10:00", value: 18 },
  { time: "10:10", value: 22 },
  { time: "10:20", value: 28 },
  { time: "10:30", value: 25 },
  { time: "10:40", value: 41 },
  { time: "10:50", value: 34 },
  { time: "11:00", value: 27 },
  { time: "11:10", value: 21 },
];

const alertData = [
  { day: "Mon", alerts: 4 },
  { day: "Tue", alerts: 7 },
  { day: "Wed", alerts: 3 },
  { day: "Thu", alerts: 8 },
  { day: "Fri", alerts: 5 },
  { day: "Sat", alerts: 2 },
  { day: "Sun", alerts: 4 },
];

export function DrowsinessChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={drowsinessData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="time" />

        <YAxis domain={[0, 100]} />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AlertChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={alertData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="day" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="alerts" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}