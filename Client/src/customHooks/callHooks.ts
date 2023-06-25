import { useContext } from "react";
import { SocketContext } from "../socket/SocketContext";
import { type Caller, type UserCalledData, SocketConst } from "../../../consts";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCallAccepted,
  updateCaller,
  updateOnCallWith,
  updateReceivingCall,
} from "../stores/callStore";
import Peer from "simple-peer";
import { StoreState } from "../stores/store";
import SimplePeer from "simple-peer";
import { Socket } from "socket.io-client";

export function useCallHooks() {
  const dispatch = useDispatch();

  const userName = useSelector((state: StoreState) => state.userStore.userName);
  const userId = useSelector((state: StoreState) => state.userStore.userId);
  const caller = useSelector((state: StoreState) => state.callStore.caller);
  const socket = useContext(SocketContext);
  const peer = socket.connection;

  function addCallingSocketListener(socket: Socket) {
    socket.on(SocketConst.userCalled, (caller: Caller) => {
      dispatch(updateReceivingCall({ receivingCall: true }));
      dispatch(updateCaller({ caller: caller }));
    });
  }

  function callUser(id: string) {
    if (socket.myStream) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: socket.myStream,
      });
      if (peer && socket.webSocket) {
        peer.on("signal", (data) => {
          if (socket.webSocket) {
            const userData: UserCalledData = {
              to: id,
              from: userId,
              signal: data,
              name: userName,
            };
            socket.webSocket.emit(SocketConst.userCalled, userData);
          }
        });

        peer.on("stream", (stream: MediaStream) => {
          socket.setMyGuestStream(stream);
        });
        callAcceptedListener(socket.webSocket, peer);
        socket.setMyPeer(peer);
      }
    }
  }

  function callAcceptedListener(socket: Socket, peer: SimplePeer.Instance) {
    socket.on(SocketConst.callAccepted, (signal: any, userId: string) => {
      console.log(signal);

      peer.signal(signal);
      dispatch(updateOnCallWith({ userId }));
      dispatch(updateCallAccepted({ callAccepted: true }));
    });
  }
  function replaceStreamForPeer(mediaStream: MediaStream) {
    if (peer) {
      peer.replaceTrack(
        peer.streams[0].getVideoTracks()[0],
        mediaStream.getVideoTracks()[0],
        peer.streams[0]
      );
    }
  }

  function acceptCall() {
    if (socket.myStream) {
      dispatch(updateCallAccepted({ callAccepted: true }));
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: socket.myStream,
      });

      if (peer && socket.webSocket && caller) {
        peer.on("signal", (data) => {
          if (socket.webSocket) {
            socket.webSocket.emit(SocketConst.callAccepted, {
              signal: data,
              to: caller.callerId,
              userId: userId,
            });
          }
        });
        peer.on("stream", (stream) => {
          socket.setMyGuestStream(stream);
        });
        peer.signal(caller.callerSignal);
        socket.setMyPeer(peer);
        dispatch(updateOnCallWith({ userId }));
      }
    }
  }
  return {
    acceptCall,
    addCallingSocketListener,
    replaceStreamForPeer,
    callAcceptedListener,
    callUser,
  };
}
