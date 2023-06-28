import { useContext } from "react";
import SimplePeer, { SignalData } from "simple-peer";
import { SocketContext } from "../socket/SocketContext";
import { SocketConst, UserCalledData } from "../../../consts";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../stores/store";
import { Socket } from "socket.io-client";
import { updateCallAccepted, updateOnCallWith } from "../stores/callStore";

export function useCallerHooks() {
  const socket = useContext(SocketContext);
  const userName = useSelector((state: StoreState) => state.userStore.userName);
  const userId = useSelector((state: StoreState) => state.userStore.userId);
  const dispatch = useDispatch();

  function getUserAnsweredData(userCalledId: string, data: SignalData) {
    const userData: UserCalledData = {
      to: userCalledId,
      from: userId,
      signal: data,
      name: userName,
    };
    return userData;
  }

  function onCallerStream(peer: SimplePeer.Instance) {
    peer.on("stream", (stream: MediaStream) => {
      socket.setMyGuestStream(stream);
    });
  }

  function onCallerSignal(peer: SimplePeer.Instance, userCalledId: string) {
    peer.on("signal", (data) => {
      if (socket.webSocket) {
        const userData = getUserAnsweredData(userCalledId, data);
        emitUserCalled(socket.webSocket, userData);
      } else {
        peer.destroy();
      }
    });
  }

  function emitUserCalled(webSocket: Socket, userData: UserCalledData) {
    webSocket.emit(SocketConst.userCalled, userData);
  }

  function callAcceptedListener(socket: Socket, peer: SimplePeer.Instance) {
    socket.on(SocketConst.callAccepted, (signal: any, userId: string) => {
      peer.signal(signal);
      dispatch(updateOnCallWith({ userId }));
      dispatch(updateCallAccepted({ callAccepted: true }));
    });
  }

  return {
    onCallerSignal,
    onCallerStream,
    callAcceptedListener,
  };
}
