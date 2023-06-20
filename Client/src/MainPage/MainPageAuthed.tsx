import ClientsList from "../ClientsList/ClientsList";
import CameraView from "../CameraView/CameraView";
import Button from "../atoms/Input/button/Button";
import "./MainPage.css";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../stores/store";
import { updateStream } from "../stores/streamStore";

export default function MainPageAuthed() {
  const dispatch = useDispatch();
  const { userName } = useSelector((state: StoreState) => state.userStore);
  const { stream } = useSelector((state: StoreState) => state.streamStore);

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

  return (
    <div className="main-container">
      <div className="camera-view">
        <RenderCamera></RenderCamera>
        <div className="buttons-container">
          <Button
            onClick={shareScreen}
            secondary={false}
            disabled={false}
            text="Share screen"
          ></Button>
          <Button
            onClick={showCamera}
            secondary={false}
            disabled={false}
            text="Open Camera"
          ></Button>
          <Button
            onClick={stopStreaming}
            secondary={false}
            disabled={false}
            text="Stop Sharing"
          ></Button>
        </div>
      </div>

      <ClientsList></ClientsList>
    </div>
  );
}
