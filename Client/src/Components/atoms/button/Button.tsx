import "./button.css";
import { MouseEvent } from "react";

export enum ButtonColors {
  red = "red",
}

export enum ButtonType {
  extended = "extended",
}

export default function Button({
  onClick,
  disabled,
  text,
  color,
  type,
}: {
  onClick: () => void;
  disabled: boolean;
  text: string;
  color?: ButtonColors;
  type?: ButtonType;
}) {
  function buttonColorClass() {
    if (color) {
      return `color-${color}`;
    }
    return "color-default";
  }

  function buttonTypeClass() {
    if (type) {
      return `type-${type}`;
    }
    return "type-default";
  }

  function isDisabled() {
    return disabled ? "disabled" : "";
  }

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    onClick();
  }
  return (
    <button
      disabled={disabled}
      className={`button ${isDisabled()} ${buttonTypeClass()} ${buttonColorClass()}`}
      onClick={(e) => handleClick(e)}
    >
      {text}
    </button>
  );
}
