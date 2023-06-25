import ClientsList from "../ClientsList/ClientsList";
import "./MainPage.css";
import { useSelector } from "react-redux";
import { StoreState } from "../../stores/store";
import VideoCall from "../VideoCall/VideoCall/VideoCall";
import CallAcceptModal from "./CallAcceptModal/CallAcceptModal";

export default function MainPageAuthed() {
  const caller = useSelector((state: StoreState) => state.callStore.caller);
  const userName = useSelector((state: StoreState) => state.userStore.userName);
  const users = useSelector((state: StoreState) => state.userStore.users);

  const receivingCall = useSelector(
    (state: StoreState) => state.callStore.receivingCall
  );

  function mainContainerClassName() {
    return `main-container ${receivingCall ? "receiving-call" : ""}`;
  }

  return (
    <>
      <CallAcceptModal></CallAcceptModal>
      <div className={mainContainerClassName()}>
        <VideoCall
          caller={caller}
          userName={userName}
          users={users}
        ></VideoCall>
        <ClientsList></ClientsList>
      </div>
    </>
  );
}
