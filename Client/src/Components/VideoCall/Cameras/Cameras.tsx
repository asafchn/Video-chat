import CameraView from "./CameraView/CameraView";

export default function Cameras({
  user,
  guest,
}: {
  user: { stream: MediaStream | null; name: string | null };
  guest: { stream: MediaStream | null; name: string | null };
}) {
  function RenderCamera() {
    if (user.stream) {
      return <CameraView stream={user.stream}></CameraView>;
    } else if (user.name) {
      return <div className="placeholder">{user.name}</div>;
    }
    return null;
  }

  function RenderGuestCamera() {
    if (guest.stream) {
      return <CameraView stream={guest.stream}></CameraView>;
    } else if (guest.name) {
      return <div className="placeholder">{guest.name}</div>;
    }
    return null;
  }

  return (
    <>
      <RenderCamera></RenderCamera>
      <RenderGuestCamera></RenderGuestCamera>
    </>
  );
}
