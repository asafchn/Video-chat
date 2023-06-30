import Button from "../../atoms/button/Button";
import "./callControls.css";
import type { CallControlFunctions } from "../../../../../consts";
import { ButtonColors } from "../../atoms/button/Button";
import { ButtonType } from "../../atoms/button/Button";

export default function CallControls({
  shareScreen,
  showCamera,
  stopStreaming,
  endCall,
}: CallControlFunctions) {
  return (
    <div className="call-controls-container">
      <div className="actions">
        <Button
          onClick={shareScreen}
          disabled={false}
          text="Share screen"
        ></Button>
        <Button
          onClick={showCamera}
          disabled={false}
          text="Open Camera"
        ></Button>
        <Button
          onClick={stopStreaming}
          disabled={false}
          text="Stop Sharing"
        ></Button>
      </div>
      <Button
        onClick={endCall}
        disabled={false}
        text="End Call"
        color={ButtonColors.red}
        type={ButtonType.extended}
      ></Button>
    </div>
  );
}
