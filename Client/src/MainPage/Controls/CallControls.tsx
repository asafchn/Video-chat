import Button from "../../atoms/button/Button";
import "./callControls.css";
type CallControlFunc = () => void;

export default function CallControls({
  shareScreen,
  showCamera,
  stopStreaming,
}: {
  shareScreen: CallControlFunc;
  showCamera: CallControlFunc;
  stopStreaming: CallControlFunc;
}) {
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
