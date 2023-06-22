import { useContext, useRef } from "react";
import { SocketContext } from "../socket/SocketContext";
import { type Caller, type UserCalledData, SocketConst } from "../../../consts";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCallAccepted,
  updateCaller,
  updateReceivingCall,
} from "../stores/callStore";
import Peer from "simple-peer";
import { StoreState } from "../stores/store";
import SimplePeer from "simple-peer";
import { updatePeer, updateGuestStream } from "../stores/streamStore";
import { Socket } from "socket.io-client";

export function useCallHooks() {
  const dispatch = useDispatch();
  const { stream } = useSelector((state: StoreState) => state.streamStore);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const { userId, userName } = useSelector(
    (state: StoreState) => state.userStore
  );
  const { caller } = useSelector((state: StoreState) => state.callStore);
  const { webSocket } = useContext(SocketContext);

  function addCallingSocketListener(socket: Socket) {
    socket.on(SocketConst.userCalled, (caller: Caller) => {
      dispatch(updateReceivingCall({ receivingCall: true }));
      dispatch(updateCaller({ caller: caller }));
    });
  }

  function createPeer(): SimplePeer.Instance | undefined {
    const peer = new Peer({
      initiator: true,
      trickle: true,
      stream: stream ?? undefined,
    });
    peerRef.current = peer;
    return peer;
  }

  function callUser(id: string) {
    createPeer();

    if (peerRef.current && webSocket) {
      peerRef.current.on("signal", (data) => {
        const userData: UserCalledData = {
          to: id,
          from: userId,
          signal: data,
          name: userName,
        };
        webSocket.emit(SocketConst.userCalled, userData);
      });

      peerRef.current.on("stream", (stream: MediaStream) => {
        dispatch(updateGuestStream({ stream: stream }));
      });
      callAcceptedListener(webSocket, peerRef.current);
    }
  }

  function callAcceptedListener(socket: Socket, peer: SimplePeer.Instance) {
    socket.on(SocketConst.callAccepted, (signal: any) => {
      debugger;
      if (peerRef.current) {
        console.log(peerRef.current);

        peerRef.current.signal(signal);
      }
      dispatch(updateCallAccepted({ callAccepted: true }));
    });
  }
  function acceptCall(socket: Socket) {
    dispatch(updateCallAccepted({ callAccepted: true }));
    createPeer();

    if (peerRef.current && socket && caller) {
      peerRef.current.on("signal", (data) => {
        socket.emit(SocketConst.callAccepted, {
          signal: data,
          to: caller.callerId,
        });
      });
      peerRef.current.on("stream", (stream) => {
        dispatch(updateGuestStream({ stream }));
      });
      peerRef.current.signal(caller.callerSignal);
    }
  }
  return {
    acceptCall,
    addCallingSocketListener,
    callAcceptedListener,
    callUser,
  };
}
