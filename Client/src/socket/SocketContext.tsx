import { createContext, useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { SocketConst, Users } from "../../../consts";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { updateUserId, updateClientsList } from "../stores/userStore";
import { StoreState } from "../stores/store";
import { useCallHooks } from "../customHooks/callHooks";

const contextDefault: {
  webSocket: Socket<any, any> | null;
  userId: string;
} = {
  webSocket: null,
  userId: "",
};

export const SocketContext = createContext(contextDefault);

export function SocketProvider(props: any) {
  const dispatch = useDispatch();
  const socket = useRef<Socket | null>(null);
  const { callAcceptedListener, addCallingSocketListener } = useCallHooks();

  const { userId } = useSelector(
    (state: StoreState) => state.userStore,
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
      console.log("unmount");
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const context = {
    webSocket: socket.current,
    userId: userId,
  };
  return (
    <SocketContext.Provider value={context}>
      {props.children}
    </SocketContext.Provider>
  );
}
