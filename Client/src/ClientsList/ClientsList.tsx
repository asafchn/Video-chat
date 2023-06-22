import { shallowEqual, useSelector } from "react-redux";
import { StoreState } from "../stores/store";
import "../ClientsList/clientsList.css";
import ClientItem from "../ClientItem/ClientItem";
import { useCallHooks } from "../customHooks/callHooks";

export default function ClientsList() {
  const users = useSelector((state: StoreState) => state.userStore.users);
  const userId = useSelector((state: StoreState) => state.userStore.userId);

  function RenderClientsList() {
    const { callUser } = useCallHooks();

    function handleCallUser(userId: string) {
      callUser(userId);
    }
    const clonedUsers = { ...users };
    return Object.values(clonedUsers).map((user) => {
      if (user.name && user.id !== userId) {
        return (
          <ClientItem
            key={user.id}
            user={user}
            onClick={(id: string) => handleCallUser(id)}
          ></ClientItem>
        );
      } else {
        return null;
      }
    });
  }

  return <div className="clients-container">{RenderClientsList()}</div>;
}
