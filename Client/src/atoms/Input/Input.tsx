import { ForwardedRef, forwardRef } from "react";
import "./input.css";

const Input = forwardRef(function renderInput(
  _,
  inputRef: ForwardedRef<HTMLInputElement | null>
) {
  return (
    <div className="input-container">
      <input
        className="input"
        ref={inputRef}
        placeholder="Add Your name"
      ></input>
    </div>
  );
});
export default Input;
