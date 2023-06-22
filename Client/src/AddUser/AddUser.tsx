import { useState, useRef, useContext } from "react";
import { Input } from "../atoms/Input/Input";
import { SocketContext } from "../socket/SocketContext";
import { SocketConst } from "../../../consts";
import { useDispatch } from "react-redux";
import { updateUserName } from "../stores/userStore";
import "../AddUser/addUser.css";
import Button from "../atoms/button/Button";
import Modal from "../atoms/modal/Modal";

export default function AddUser() {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const inputRef = useRef<HTMLInputElement>(null);
  function createUser() {
    if (socket.webSocket) {
      const inputValue = inputRef.current?.value ?? "";
      dispatch(updateUserName({ userName: inputValue }));
      socket.webSocket.emit(SocketConst.updateUser, {
        id: socket.userId,
        name: inputValue,
      });
    }
  }
  return (
    <Modal>
      <div>
        <input ref={inputRef}></input>
      </div>
      <Button
        text="All is set"
        secondary={false}
        onClick={createUser}
        disabled={false}
      ></Button>
    </Modal>
  );
}
