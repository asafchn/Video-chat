import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../../socket/SocketContext";
import { StoreState } from "../../../../stores/store";
import { useCallHooks } from "../../../../customHooks/callHooks";
import Modal from "../Modal";
import Button, { ButtonColors } from "../../button/Button";
import "./call-accept-modal.css";

export default function CallAcceptModal() {
  const { acceptCall, declineCall } = useCallHooks();
  const socket = useContext(SocketContext);
  const caller = useSelector((state: StoreState) => state.callStore.caller);
  const receivingCall = useSelector(
    (state: StoreState) => state.callStore.receivingCall
  );
  const callAccepted = useSelector(
    (state: StoreState) => state.callStore.callAccepted
  );

  const webSocket = socket.webSocket ?? null;

  function handleAcceptCall() {
    if (webSocket) {
      acceptCall();
    }
  }

  function handleDecline() {
    if (caller) {
      declineCall(caller.callerId);
    }
  }

  function shouldShowModal() {
    if (caller) {
      if (receivingCall) {
        return !callAccepted;
      }
    }
    return false;
  }

  if (shouldShowModal()) {
    return (
      <Modal>
        <div className="caller-name">{caller!.callerName} is calling</div>
        <div className="call-modal-actions">
          <Button disabled={false} onClick={handleAcceptCall}>
            Answer
          </Button>
          <Button
            disabled={false}
            onClick={handleDecline}
            color={ButtonColors.red}
          >
            Decline
          </Button>
        </div>
      </Modal>
    );
  } else {
    return null;
  }
}
