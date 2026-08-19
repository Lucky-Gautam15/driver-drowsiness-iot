import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";

export default function LiveCamera() {
  const videoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");

  const startCamera = async () => {
    try {
      setError("");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setCameraOn(true);
    } catch (err) {
      setError("Camera permission denied or camera unavailable.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
    setCameraOn(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="camera-container">
      <div className="camera-header">
        <div>
          <h3>Driver Camera</h3>

          <span className={cameraOn ? "camera-live" : "camera-off"}>
            <span></span>
            {cameraOn ? "LIVE" : "OFFLINE"}
          </span>
        </div>

        {!cameraOn ? (
          <button className="camera-btn" onClick={startCamera}>
            <Camera size={18} />
            Start Camera
          </button>
        ) : (
          <button className="camera-btn danger-btn" onClick={stopCamera}>
            <CameraOff size={18} />
            Stop
          </button>
        )}
      </div>

      <div className="video-wrapper">
        {cameraOn ? (
          <video ref={videoRef} autoPlay playsInline muted />
        ) : (
          <div className="camera-placeholder">
            <Camera size={55} />
            <h3>Camera is Off</h3>
            <p>Start the camera to monitor the driver</p>
          </div>
        )}
      </div>

      {error && <p className="camera-error">{error}</p>}
    </div>
  );
}