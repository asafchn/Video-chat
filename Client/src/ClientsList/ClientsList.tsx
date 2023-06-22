import { shallowEqual, useSelector } from "react-redux";
import { StoreState } from "../stores/store";
import "../ClientsList/clientsList.css";
import ClientItem from "../ClientItem/ClientItem";
import { useCallHooks } from "../customHooks/callHooks";

export default function ClientsList() {
  const { users, userId } = useSelector(
    (state: StoreState) => state.userStore,
    shallowEqual
  );

  function RenderClientsList() {
    const { callUser } = useCallHooks();

    function handleCallUser(userId: string) {
      callUser(userId);
    }

    return Object.values(users).map((user) => {
      if (user.name && user.id !== userId) {
        return (
          <ClientItem
            key={user.id}
            user={user}
            onClick={(id: string) => handleCallUser(id)}
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
