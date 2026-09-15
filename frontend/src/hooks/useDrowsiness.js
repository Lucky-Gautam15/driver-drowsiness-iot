import { useEffect, useState } from "react";

export default function useDrowsiness() {
  const [drowsiness, setDrowsiness] = useState(0);
  const [status, setStatus] = useState("OFFLINE");
  const [ear, setEar] = useState(0);
  const [mar, setMar] = useState(0);
  const [headPose, setHeadPose] = useState("UNKNOWN");
  const [eyesClosed, setEyesClosed] = useState(false);
  const [yawning, setYawning] = useState(false);
  const [headDown, setHeadDown] = useState(false);
  const [camera, setCamera] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const aiUrl = import.meta.env.VITE_AI_URL || "http://127.0.0.1:8000";
        const response = await fetch(
          `${aiUrl}/api/detection/status`
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        console.log("AI DATA:", data);

        setDrowsiness(data.score ?? 0);
        setStatus(data.status ?? "OFFLINE");
        setEar(data.ear ?? 0);
        setMar(data.mar ?? 0);
        setHeadPose(data.head_pose ?? "UNKNOWN");
        setEyesClosed(data.eyes_closed ?? false);
        setYawning(data.yawning ?? false);
        setHeadDown(data.head_down ?? false);
        setCamera(data.camera ?? false);
      } catch (error) {
        console.error("AI Service Error:", error);
        setStatus("OFFLINE");
        setCamera(false);
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    drowsiness,
    status,
    ear,
    mar,
    headPose,
    eyesClosed,
    yawning,
    headDown,
    camera,
  };
}