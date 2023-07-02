import Button from "../../atoms/button/Button";
import "./callControls.css";
import { CallControlProps, videoStreamType } from "../../../../../consts";
import { ButtonColors } from "../../atoms/button/Button";
import { ButtonType } from "../../atoms/button/Button";
import {
  LuScreenShare,
  LuCamera,
  LuCameraOff,
  LuScreenShareOff,
} from "react-icons/lu";
import { ImPhoneHangUp } from "react-icons/im";

export default function CallControls({
  shareScreen,
  showCamera,
  stopStreaming,
  endCall,
  currentlyStreaming,
}: CallControlProps) {
  function StopStreamingIcon() {
    if (!currentlyStreaming) {
      return null;
    }
    if (currentlyStreaming === videoStreamType.camera) {
      return <LuCameraOff></LuCameraOff>;
    }
    if (currentlyStreaming === videoStreamType.screenShare) {
      return <LuScreenShareOff></LuScreenShareOff>;
    }
  }

  return (
    <div className="call-controls-container">
      <div className="actions">
        <Button onClick={shareScreen} disabled={false} type={ButtonType.small}>
          <LuScreenShare />
        </Button>
        <Button onClick={showCamera} disabled={false} type={ButtonType.small}>
          <LuCamera></LuCamera>
        </Button>
        {currentlyStreaming ? (
          <Button
            onClick={stopStreaming}
            disabled={false}
            type={ButtonType.small}
          >
            <StopStreamingIcon></StopStreamingIcon>
          </Button>
        ) : null}
      </div>
      <Button
        onClick={endCall}
        disabled={false}
        color={ButtonColors.red}
        type={ButtonType.extended}
      >
        <span className="end-call">
          <ImPhoneHangUp></ImPhoneHangUp>
        </span>
      </Button>
    </div>
  );
}
