import "./button.css";
import { MouseEvent, ReactNode } from "react";

export enum ButtonColors {
  red = "red",
}

export enum ButtonType {
  extended = "extended",
  small = "small",
}

export default function Button({
  onClick,
  disabled,
  color,
  type,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  text?: string;
  color?: ButtonColors;
  type?: ButtonType;
  children?: ReactNode;
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
      {children ? children : null}
    </button>
  );
}
