import CameraView from "./CameraView/CameraView";
import "./Cameras.css";

export default function Cameras({
  user,
  guest,
  onCallWith,
}: {
  user: { stream: MediaStream | null; name: string | null };
  guest: { stream: MediaStream | null; name: string | null };
  onCallWith: string | null;
}) {
  function RenderCamera() {
    if (user.stream) {
      return <CameraView stream={user.stream}></CameraView>;
    } else if (user.name) {
      return <div className="placeholder video">{user.name}</div>;
    }
    return null;
  }

  function RenderGuestCamera() {
    if (onCallWith) {
      if (guest.stream) {
        return <CameraView stream={guest.stream}></CameraView>;
      } else {
        return <div>{guest?.name ?? onCallWith}</div>;
      }
    } else {
      return null;
    }
  }

  return (
    <div className="cameras-container">
      <RenderCamera></RenderCamera>
      <RenderGuestCamera></RenderGuestCamera>
    </div>
  );
}
