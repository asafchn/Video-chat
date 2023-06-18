import { createContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

const contextDefault: {
  webSocket: Socket<any, any> | null;
} = {
  webSocket: null,
};

export const SocketContext = createContext(contextDefault);

export function SocketProvider(props: any) {
  const socket = useRef<Socket>(io("http://localhost:3001"));
  const [currentUser, setCurrentUser] = useState("");

  function currentUserListener() {
    socket.current.on("me", (id: string) => {
      setCurrentUser(id);
      console.log(id);
    });
  }
  useEffect(() => {
    currentUserListener();
  }, []);

  const context = {
    webSocket: socket.current,
  };
  return (
    <SocketContext.Provider value={context}>
      {props.children}
    </SocketContext.Provider>
  );
}
