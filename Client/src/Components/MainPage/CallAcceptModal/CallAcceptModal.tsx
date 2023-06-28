import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../socket/SocketContext";
import { StoreState } from "../../../stores/store";
import { useCallHooks } from "../../../customHooks/callHooks";
import Modal from "../../atoms/modal/Modal";
import Button from "../../atoms/button/Button";

export default function CallAcceptModal() {
  const { acceptCall, getMediaOnInitialConnection } = useCallHooks();
  const socket = useContext(SocketContext);
  const caller = useSelector((state: StoreState) => state.callStore.caller);
  const receivingCall = useSelector(
    (state: StoreState) => state.callStore.receivingCall
  );
  const callAccepted = useSelector(
    (state: StoreState) => state.callStore.callAccepted
  );

  const webSocket = socket.webSocket ?? null;

  async function handleAcceptCall() {
    if (webSocket) {
      const stream = await getMediaOnInitialConnection();
      acceptCall(stream);
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
        <div>{caller!.callerName} is calling</div>
        <div>
          <Button
            disabled={false}
            text={"Answer"}
            secondary={false}
            onClick={handleAcceptCall}
          ></Button>
        </div>
      </Modal>
    );
  } else {
    return null;
  }
}
