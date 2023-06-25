import { useContext } from "react";
import Cameras from "../Cameras/Cameras";
import CallControls from "../Controls/CallControls";
import "./video-call.css";
import { SocketContext } from "../../socket/SocketContext";
import { useCallHooks } from "../../customHooks/callHooks";
import { Caller, Users } from "../../../../consts";

export default function VideoCall({
  caller,
  userName,
  users,
}: {
  caller: Caller | null;
  userName: string | null;
  users: Users;
}) {
  const socket = useContext(SocketContext);
  const { replaceStreamForPeer } = useCallHooks();

  const myStream = socket.myStream;
  const guestStream = socket.guestStream;
  const user = { stream: myStream, name: userName };
  const guest = { stream: guestStream, name: getGuestName() };

  function getGuestName() {
    if (caller?.callerId) {
      return users[caller.callerId].name;
    }
    return null;
  }

  function shareScreen() {
    resetTracks();
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((mediaStream) => {
        socket.setMyStream(mediaStream);
        replaceStreamForPeer(mediaStream);
      });
  }

  function showCamera() {
    resetTracks();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        socket.setMyStream(mediaStream);
        replaceStreamForPeer(mediaStream);
      });
  }

  function stopStreaming() {
    resetTracks();
    socket.setMyStream(null);
  }

  function resetTracks() {
    if (myStream) {
      const allTracks = myStream.getTracks();
      allTracks.forEach((track) => {
        track.stop();
      });
    }
  }

  return (
    <div className="video-call-container">
      <Cameras user={user} guest={guest}></Cameras>
      <CallControls
        shareScreen={shareScreen}
        showCamera={showCamera}
        stopStreaming={stopStreaming}
      ></CallControls>
    </div>
  );
}
