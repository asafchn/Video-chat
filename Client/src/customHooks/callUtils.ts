import { useSelector } from "react-redux";
import { StoreState } from "../stores/store";

export function useCallUtils() {
  const caller = useSelector((state: StoreState) => state.callStore.caller);
  const users = useSelector((state: StoreState) => state.userStore.users);
  function getGuestName(id?: string) {
    if (id) {
      return users[id]?.name;
    } else if (caller?.callerId) {
      if (users[caller.callerId]) {
        return users[caller.callerId].name;
      }
    }
    return null;
  }
  return { getGuestName };
}
