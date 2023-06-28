import { useDispatch, useSelector } from "react-redux";
import {
  updateCallAccepted,
  updateCaller,
  updateOnCallWith,
  updateReceivingCall,
} from "../stores/callStore";
import { SocketContext } from "../socket/SocketContext";
import { StoreState } from "../stores/store";
import { useContext } from "react";
import SimplePeer, { SignalData } from "simple-peer";
import { Caller, SocketConst } from "../../../consts";
import { Socket } from "socket.io-client";

export function useCalleeHooks() {
  const dispatch = useDispatch();
  const userId = useSelector((state: StoreState) => state.userStore.userId);
  const caller = useSelector((state: StoreState) => state.callStore.caller);
  const socket = useContext(SocketContext);

  function onCallAccepted() {
    dispatch(updateCallAccepted({ callAccepted: true }));
  }

  function onCalleeSignal(peer: SimplePeer.Instance) {
    peer.on("signal", (data) => {
      if (socket.webSocket && caller) {
        emitCallAccepted(socket.webSocket, data);
      } else {
        peer.destroy();
      }
    });
  }

  function onCalleeStream(peer: SimplePeer.Instance) {
    peer.on("stream", (stream) => {
      socket.setMyGuestStream(stream);
    });
  }

  function emitCallAccepted(socket: Socket, data: SignalData) {
    socket.emit(SocketConst.callAccepted, {
      signal: data,
      to: caller!.callerId,
      userId: userId,
    });
  }

  function updateCalleeStates(peer: SimplePeer.Instance) {
    const signalResult = sendCalleeSignal(peer);
    if (signalResult) {
      socket.setMyPeer(peer);
    }
  }

  function sendCalleeSignal(peer: SimplePeer.Instance) {
    if (caller) {
      peer.signal(caller.callerSignal);
      dispatch(updateOnCallWith({ userId: caller.callerId }));
      return true;
    } else {
      peer.destroy();
      return false;
    }
  }

  function userIsCallingListener(socket: Socket) {
    socket.on(SocketConst.userCalled, (caller: Caller) => {
      dispatch(updateReceivingCall({ receivingCall: true }));
      dispatch(updateCaller({ caller: caller }));
    });
  }
  return {
    onCallAccepted,
    onCalleeSignal,
    onCalleeStream,
    updateCalleeStates,
    userIsCallingListener,
  };
}
