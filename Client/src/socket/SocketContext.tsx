import { createContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { SocketConst, Users } from "../../../consts";
import { useDispatch, useSelector } from "react-redux";
import { updateUserId, updateClientsList } from "../stores/userStore";
import { StoreState } from "../stores/store";

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
  const socket = useRef<Socket>(io("http://localhost:3001"));

  const { userId } = useSelector((state: StoreState) => state.userStore);

  function currentUserListener() {
    socket.current.on(SocketConst.me, (id: string) => {
      dispatch(updateUserId({ id }));
    });
  }

  function clientsListListener() {
    socket.current.on(SocketConst.clientsList, (clients: Users) => {
      dispatch(updateClientsList({ users: clients }));
    });
  }
  useEffect(() => {
    currentUserListener();
    clientsListListener();
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
