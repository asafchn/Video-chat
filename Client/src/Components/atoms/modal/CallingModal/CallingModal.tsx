import "./calling-modal.css";
import Modal from "../Modal";

export default function CallingModal(props: {
  callDeclined: boolean;
  userWeCall: string;
}) {
  function renderText() {
    if (!props.callDeclined) {
      return `Calling ${props.userWeCall}`;
    } else {
      return `Call has been declined`;
    }
  }
  return <Modal>{renderText()}</Modal>;
}
