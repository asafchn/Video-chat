import { useContext, useRef } from "react";
import Cameras from "../Cameras/Cameras";
import CallControls from "../Controls/CallControls";
import "./video-call.css";
import { SocketContext } from "../../../socket/SocketContext";
import { useCallHooks } from "../../../customHooks/callHooks";
import { Caller, Users, videoStreamType } from "../../../../../consts";
import { StoreState } from "../../../stores/store";
import { useSelector } from "react-redux";

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
  const { replaceStreamForPeer, emitEndCall } = useCallHooks();
  const onCallWith = useSelector(
    (state: StoreState) => state.callStore.onCallWith
  );

  const streamTypeRef = useRef<videoStreamType | null>(null);
  const myStream = socket.myStream;
  const guestStream = socket.guestStream;
  const user = { stream: myStream, name: userName };
  const guest = { stream: guestStream, name: getGuestName() };

  function getGuestName() {
    if (caller?.callerId) {
      if (users[caller.callerId]) {
        return users[caller.callerId].name;
      }
    }
    return null;
  }

  function endCall() {
    socket.callDisconnected();
    emitEndCall(onCallWith);
  }

  function shareScreen() {
    resetTracks();
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((mediaStream) => {
        streamTypeRef.current = videoStreamType.screenShare;
        socket.setMyStream(mediaStream);
        replaceStreamForPeer(mediaStream);
      });
  }

  function showCamera() {
    resetTracks();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        streamTypeRef.current = videoStreamType.camera;

        socket.setMyStream(mediaStream);
        replaceStreamForPeer(mediaStream);
      });
  }

  function stopStreaming() {
    streamTypeRef.current = null;

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
      <Cameras user={user} guest={guest} onCallWith={onCallWith}></Cameras>
      {onCallWith ? (
        <CallControls
          currentlyStreaming={streamTypeRef.current}
          shareScreen={shareScreen}
          showCamera={showCamera}
          endCall={endCall}
          stopStreaming={stopStreaming}
        ></CallControls>
      ) : null}
    </div>
  );
}
