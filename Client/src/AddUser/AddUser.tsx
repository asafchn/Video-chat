import { useState, useRef, useContext } from "react";
import { Input } from "../atoms/Input/Input";
import { SocketContext } from "../socket/SocketContext";
import { SocketConst } from "../../../consts";
import { useDispatch } from "react-redux";
import { updateUserName } from "../stores/userStore";
import "../AddUser/addUser.css";
import Button from "../atoms/Input/button/Button";

export default function AddUser() {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const socket = useContext(SocketContext);

  function createUser() {
    if (socket.webSocket) {
      dispatch(updateUserName({ userName: inputValue }));
      socket.webSocket.emit(SocketConst.updateUser, {
        id: socket.userId,
        name: inputValue,
      });
    }
  }
  return (
    <div className="container">
      <div>
        <Input
          onChange={(str) => setInputValue(str)}
          withLabel="Please fill in your Name"
          noBorder={false}
        ></Input>
      </div>
      <Button
        text="All is set"
        secondary={false}
        onClick={createUser}
        disabled={!inputValue}
      ></Button>
    </div>
  );
}
