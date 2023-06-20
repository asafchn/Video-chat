import "./button.css";

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
  return (
    <button
      disabled={disabled}
      className={`button ${secondary ? "secondary" : ""} ${
        disabled ? "disabled" : ""
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
