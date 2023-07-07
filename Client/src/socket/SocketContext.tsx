import { createContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { SocketConst, Users } from "../../../consts";
import { useSelector, useDispatch } from "react-redux";
import { updateUserId, updateClientsList } from "../stores/userStore";
import {
  resetState as resetCallStore,
  updateCallDeclined,
} from "../stores/callStore";
import { useCallHooks } from "../customHooks/callHooks";
import SimplePeer from "simple-peer";
import { StoreState } from "../stores/store";

const contextDefault: {
  webSocket: Socket<any, any> | null;
  myStream: MediaStream | null;
  guestStream: MediaStream | null;
  connection: SimplePeer.Instance | null;
  setMyStream: (stream: MediaStream | null) => void;
  setMyGuestStream: (stream: MediaStream | null) => void;
  setMyPeer: (peer: SimplePeer.Instance | null) => void;
  callDisconnected: () => void;
} = {
  webSocket: null,
  myStream: null,
  guestStream: null,
  connection: null,
  setMyStream: (_: MediaStream | null) => {
    return;
  },
  setMyGuestStream: (_: MediaStream | null) => {
    return;
  },
  callDisconnected: () => {
    return;
  },
  setMyPeer: (_: SimplePeer.Instance | null) => {
    return;
  },
};

export const SocketContext = createContext(contextDefault);

export function SocketProvider(props: any) {
  const dispatch = useDispatch();
  const socket = useRef<Socket | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [myPeer, setMyPeer] = useState<SimplePeer.Instance | null>(null);
  const [guestStream, setMyGuestStream] = useState<MediaStream | null>(null);

  function resetStreams() {
    setMyStream(null);
    setMyGuestStream(null);
  }
  function onCallDeclined() {
    dispatch(updateCallDeclined({ status: true }));
    setTimeout(() => {
      dispatch(updateCallDeclined({ status: false }));
    }, 1500);
  }

  const { userIsCallingListener, emitEndCall } = useCallHooks();
  const onCallWith = useSelector(
    (state: StoreState) => state.callStore.onCallWith
  );

  function currentUserListener() {
    if (socket.current) {
      socket.current.on(SocketConst.me, (id: string) => {
        dispatch(updateUserId({ id }));
      });
    }
  }

  function clientsListListener() {
    if (socket.current) {
      socket.current.on(SocketConst.clientsList, (clients: Users) => {
        dispatch(updateClientsList({ users: clients }));
      });
    }
  }

  function callDeclinedListener(socket: Socket) {
    socket.on(SocketConst.callDeclined, () => {
      onCallDeclined();
      callDisconnected();
    });
  }

  function callEndedListener() {
    if (socket.current) {
      socket.current.on(SocketConst.callDisconnected, () => {
        callDisconnected();
      });
    }
  }
  function callDisconnected() {
    if (myPeer) {
      myPeer.destroy();
    }

    dispatch(resetCallStore());
    resetStreams();
  }

  useEffect(() => {
    socket.current = io("http://localhost:3001");
    currentUserListener();
    clientsListListener();
    callDeclinedListener(socket.current);
    userIsCallingListener(socket.current);
    callEndedListener();
    return () => {
      if (socket.current) {
        emitEndCall(onCallWith);
        socket.current.disconnect();
      }
    };
  }, []);

  const context = {
    webSocket: socket.current,
    connection: myPeer,
    guestStream: guestStream,
    resetStreams,
    myStream: myStream,
    setMyPeer,
    setMyStream,
    callDisconnected,
    setMyGuestStream,
  };
  return (
    <SocketContext.Provider value={context}>
      {props.children}
    </SocketContext.Provider>
  );
}
