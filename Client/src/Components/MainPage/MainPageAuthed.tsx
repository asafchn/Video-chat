import ClientsList from "../ClientsList/ClientsList";
import "./MainPage.css";
import { useSelector } from "react-redux";
import { StoreState } from "../../stores/store";
import VideoCall from "../VideoCall/VideoCall/VideoCall";
import CallAcceptModal from "../atoms/modal/CallAcceptModal/CallAcceptModal";
import "./MainPageAuthed.css";
import CallingModal from "../atoms/modal/CallingModal/CallingModal";
import { useCallUtils } from "../../customHooks/callUtils";

export default function MainPageAuthed() {
  const callingUser = useSelector(
    (state: StoreState) => state.callStore.callingUser
  );

  const callDeclined = useSelector(
    (state: StoreState) => state.callStore.callDeclined
  );

  const callUtils = useCallUtils();

  const userName = useSelector((state: StoreState) => state.userStore.userName);

  const receivingCall = useSelector(
    (state: StoreState) => state.callStore.receivingCall
  );

  function RenderCallingModal() {
    if (callingUser.status || callDeclined) {
      return (
        <CallingModal
          callDeclined={callDeclined}
          userWeCall={callUtils.getGuestName(callingUser.id) ?? ""}
        ></CallingModal>
      );
    } else {
      return null;
    }
  }

  function modalIsOpen() {
    return receivingCall || callingUser.status || callDeclined;
  }

  function mainContainerClassName() {
    return `main-container ${modalIsOpen() ? "receiving-call" : ""}`;
  }

  return (
    <>
      <div className={mainContainerClassName()}>
        <div className="call-container">
          <CallAcceptModal></CallAcceptModal>
          <RenderCallingModal></RenderCallingModal>
          <VideoCall userName={userName}></VideoCall>
        </div>
        <ClientsList></ClientsList>
      </div>
    </>
  );
}
