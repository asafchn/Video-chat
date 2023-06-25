import Button from "../../atoms/button/Button";
import "./callControls.css";
import type { CallControlFunctions } from "../../../../consts";

export default function CallControls({
  shareScreen,
  showCamera,
  stopStreaming,
}: CallControlFunctions) {
  return (
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
  );
}
