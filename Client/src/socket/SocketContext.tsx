import { createContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { SocketConst, Users } from "../../../consts";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { updateUserId, updateClientsList } from "../stores/userStore";
import { StoreState } from "../stores/store";
import { useCallHooks } from "../customHooks/callHooks";
import SimplePeer from "simple-peer";
import { updateGuestStream } from "../stores/streamStore";

const contextDefault: {
  webSocket: Socket<any, any> | null;
  userId: string;
  myStream: MediaStream | null;
  guestStream: MediaStream | null;
  connection: SimplePeer.Instance | null;
  setMyStream: (stream: MediaStream | null) => void;
  setMyGuestStream: (stream: MediaStream | null) => void;
  setMyPeer: (peer: SimplePeer.Instance | null) => void;
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
  setMyPeer: (_: SimplePeer.Instance | null) => {
    return;
  },

  userId: "",
};

export const SocketContext = createContext(contextDefault);

export function SocketProvider(props: any) {
  const dispatch = useDispatch();
  const socket = useRef<Socket | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [myPeer, setMyPeer] = useState<SimplePeer.Instance | null>(null);
  const [guestStream, setMyGuestStream] = useState<MediaStream | null>(null);
  const { addCallingSocketListener } = useCallHooks();

  const userId = useSelector(
    (state: StoreState) => state.userStore.userId,
    shallowEqual
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

  useEffect(() => {
    socket.current = io("http://localhost:3001");
    currentUserListener();
    clientsListListener();
    addCallingSocketListener(socket.current);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const context = {
    webSocket: socket.current,
    userId: userId,
    connection: myPeer,
    guestStream: guestStream,
    myStream: myStream,
    setMyPeer,
    setMyStream,
    setMyGuestStream,
  };
  return (
    <SocketContext.Provider value={context}>
      {props.children}
    </SocketContext.Provider>
  );
}
