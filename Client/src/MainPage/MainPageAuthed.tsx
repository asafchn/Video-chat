import ClientsList from "../ClientsList/ClientsList";
import CameraView from "../CameraView/CameraView";
import "./MainPage.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { StoreState } from "../stores/store";
import { updateStream } from "../stores/streamStore";
import { useEffect, useContext, MouseEvent } from "react";
import CallControls from "./Controls/CallControls";
import Modal from "../atoms/modal/Modal";
import { SocketContext } from "../socket/SocketContext";
import Button from "../atoms/button/Button";
import { useCallHooks } from "../customHooks/callHooks";
export default function MainPageAuthed() {
  const { acceptCall } = useCallHooks();
  const dispatch = useDispatch();
  const { userName } = useSelector(
    (state: StoreState) => state.userStore,
    shallowEqual
  );
  const { webSocket } = useContext(SocketContext);

  const { stream, guestStream } = useSelector(
    (state: StoreState) => state.streamStore
  );
  const { caller, receivingCall, callAccepted } = useSelector(
    (state: StoreState) => state.callStore
  );

  function shareScreen() {
    resetTracks();
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((mediaStrea) => {
        dispatch(updateStream({ stream: mediaStrea }));
      });
  }

  function showCamera() {
    resetTracks();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStrea) => {
        dispatch(updateStream({ stream: mediaStrea }));
      });
  }

  function stopStreaming() {
    resetTracks();
    dispatch(updateStream({ stream: null }));
  }

  function resetTracks() {
    if (stream) {
      const allTracks = stream.getTracks();
      allTracks.forEach((track) => {
        track.stop();
      });
    }
  }

  function RenderCamera() {
    if (stream) {
      return <CameraView stream={stream}></CameraView>;
    } else {
      return <div className="placeholder">{userName}</div>;
    }
  }

  function RenderGuestCamera() {
    if (guestStream) {
      console.log(guestStream, "guest");

      return <CameraView stream={guestStream}></CameraView>;
    } else {
      return null;
    }
  }

  function RenderModalIfNeeded() {
    function handleAcceptAll() {
      if (webSocket) {
        acceptCall(webSocket);
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
