import { shallowEqual, useSelector } from "react-redux";
import { StoreState } from "../../stores/store";
import "../ClientsList/clientsList.css";
import ClientItem from "./ClientItem/ClientItem";
import { useCallHooks } from "../../customHooks/callHooks";
import { User } from "../../../../consts";

export default function ClientsList() {
  const users = useSelector((state: StoreState) => state.userStore.users);
  const userId = useSelector(
    (state: StoreState) => state.userStore.userId,
    shallowEqual
  );

  function RenderClientsList() {
    const { callUser, getMediaOnInitialConnection } = useCallHooks();

    function shouldRenderClientItem(user: User) {
      if (!user.name) {
        return false;
      }
      if (user.id) {
        return user.id !== userId;
      }
      return false;
    }

    async function handleCallUser(userId: string) {
      const stream = await getMediaOnInitialConnection();
      callUser(userId, stream);
    }

    return Object.values(users).map((user) => {
      if (shouldRenderClientItem(user)) {
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
