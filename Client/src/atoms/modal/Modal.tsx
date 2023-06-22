import "./modal.css";

export default function Modal(props: any) {
  console.log(props);

  return <div className="modal-container">{props.children}</div>;
}
