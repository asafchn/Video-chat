import { useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketConst } from "../../../../consts";
import { SocketContext } from "../../socket/SocketContext";
import { useDispatch } from "react-redux";
import { updateUserName } from "../../stores/userStore";
import "../AddUser/addUser.css";
import Button from "../atoms/button/Button";
import Modal from "../atoms/modal/Modal";
import { StoreState } from "../../stores/store";
import Input from "../atoms/Input/Input";

export default function AddUser() {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const userId = useSelector((state: StoreState) => {
    state.userStore.userId;
  });

  function createUser() {
    if (socket.webSocket) {
      const inputValue = inputRef.current?.value ?? "";
      dispatch(updateUserName({ userName: inputValue }));
      socket.webSocket.emit(SocketConst.updateUser, {
        id: userId,
        name: inputValue,
      });
    }
  }
  return (
    <Modal>
      <Input ref={inputRef}></Input>
      <Button
        text="All is set"
        secondary={false}
        onClick={createUser}
        disabled={false}
      ></Button>
    </Modal>
  );
}
