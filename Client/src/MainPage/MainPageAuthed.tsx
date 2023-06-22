import ClientsList from "../ClientsList/ClientsList";
import CameraView from "../CameraView/CameraView";
import "./MainPage.css";
import { shallowEqual, useSelector } from "react-redux";
import { StoreState } from "../stores/store";
import { useContext } from "react";
import CallControls from "./Controls/CallControls";
import Modal from "../atoms/modal/Modal";
import { SocketContext } from "../socket/SocketContext";
import Button from "../atoms/button/Button";
import { useCallHooks } from "../customHooks/callHooks";
export default function MainPageAuthed() {
  const { acceptCall, replaceStreamForPeer } = useCallHooks();
  const userName = useSelector(
    (state: StoreState) => state.userStore.userName,
    shallowEqual
  );
  const socket = useContext(SocketContext);
  const webSocket = socket.webSocket ?? null;
  const myStream = socket.myStream;
  const guestStream = socket.guestStream;
  const peer = socket.connection;
  const caller = useSelector((state: StoreState) => state.callStore.caller);
  const receivingCall = useSelector(
    (state: StoreState) => state.callStore.receivingCall
  );
  const callAccepted = useSelector(
    (state: StoreState) => state.callStore.callAccepted
  );

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

  function RenderCamera() {
    if (myStream) {
      return <CameraView stream={myStream}></CameraView>;
    } else {
      return <div className="placeholder">{userName}</div>;
    }
  }

  function RenderGuestCamera() {
    if (guestStream) {
      return <CameraView stream={guestStream}></CameraView>;
    } else {
      return null;
    }
  }

  function RenderModalIfNeeded() {
    function handleAcceptAll() {
      if (webSocket) {
        acceptCall();
      }
    }

    if (caller && receivingCall && !callAccepted) {
      return (
        <Modal>
          <div>{caller.callerName} is calling</div>
          <div>
            <Button
              disabled={false}
              text={"Answer"}
              secondary={false}
              onClick={handleAcceptAll}
            ></Button>
          </div>
        </Modal>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <RenderModalIfNeeded></RenderModalIfNeeded>
      <div
        className={`main-container ${receivingCall ? "receiving-call" : ""}`}
      >
        <div className="camera-view">
          <RenderCamera></RenderCamera>
          <RenderGuestCamera></RenderGuestCamera>
          <CallControls
            shareScreen={shareScreen}
            showCamera={showCamera}
            stopStreaming={stopStreaming}
          ></CallControls>
        </div>

        <ClientsList></ClientsList>
      </div>
    </>
  );
}
