import { useEffect, useRef } from "react";
import "./CameraView.css";

export default function CameraView({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [videoRef]);

  return (
    <div className="camera-container">
      <video className="video" ref={videoRef}></video>
      <button onClick={() => videoRef.current?.play()}>play</button>
    </div>
  );
}
