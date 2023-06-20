import { useContext } from "react";
import { SocketContext } from "../socket/SocketContext";
import { useSelector } from "react-redux";
import { StoreState } from "../stores/store";
import "../ClientsList/clientsList.css";
import ClientItem from "../ClientItem/ClientItem";

export default function ClientsList() {
  const { users } = useSelector((state: StoreState) => state.userStore);
  const context = useContext(SocketContext);
  function callUser(userId: string) {
    console.log(userId);
  }
  function RenderClientsList() {
    console.log(users);

    return Object.values(users).map((user) => {
      if (user.name) {
        return (
          <ClientItem
            key={user.id}
            user={user}
            onClick={(id: string) => callUser(id)}
          ></ClientItem>
        );
      }
    });
  }
  return (
    <div className="clients-container">
      <RenderClientsList></RenderClientsList>
    </div>
  );
}
