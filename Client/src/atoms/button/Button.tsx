import "./button.css";
import { MouseEvent } from "react";
export default function Button({
  onClick,
  secondary,
  disabled,
  text,
}: {
  onClick: () => void;
  secondary: boolean;
  disabled: boolean;
  text: string;
}) {
  function handleClick(event: MouseEvent) {
    event.preventDefault();
    onClick();
  }
  return (
    <button
      disabled={disabled}
      className={`button ${secondary ? "secondary" : ""} ${
        disabled ? "disabled" : ""
      }`}
      onClick={(e) => handleClick(e)}
    >
      {text}
    </button>
  );
}
