import { useContext } from "react";
import { SocketContext } from "../socket/SocketContext";
import { type Caller, type UserCalledData, SocketConst } from "../../../consts";
import { useDispatch, useSelector } from "react-redux";
import { updateCaller, updateReceivingCall } from "../stores/callStore";
import Peer from "simple-peer";
import { StoreState } from "../stores/store";
import SimplePeer from "simple-peer";
import { updatePeer, updateGuestStream } from "../stores/streamStore";

export function useCallHooks() {
  const dispatch = useDispatch();
  const { stream, peer } = useSelector(
    (state: StoreState) => state.streamStore
  );
  const { userId, userName } = useSelector(
    (state: StoreState) => state.userStore
  );
  const { webSocket } = useContext(SocketContext);

  function addCallingSocketListener() {
    if (webSocket) {
      webSocket.on(SocketConst.userCalled, (caller: Caller) => {
        updateReceivingCall({ receivingCall: true });
        updateCaller({ caller: caller });
      });
    }
  }

  function createPeer(): SimplePeer.Instance | undefined {
    if (stream) {
      const peer = new Peer({
        initiator: true,
        trickle: true,
        stream: stream,
      });
      return peer;
    }
  }

  function callUser(id: string) {
    if (peer) {
      peer.destroy();
    }
    const newPeer = createPeer();
    if (newPeer && webSocket) {
      dispatch(updatePeer({ peer: newPeer }));

      newPeer.on("signal", (data) => {
        const userData: UserCalledData = {
          userToCall: id,
          from: userId,
          signalData: data,
          name: userName,
        };
        webSocket.emit(SocketConst.userCalled, userData);
      });

      newPeer.on("stream", (stream: MediaStream) => {
        dispatch(updateGuestStream({ stream: stream }));
      });
    }
  }

  function callAcceptedListener() {
    if (webSocket) {
      webSocket.on(SocketConst.callAccepted, (signal: any) => {});
    }
  }
}
