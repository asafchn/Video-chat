import { User } from "../../../consts";
import "../ClientItem/clientItem.css";
export default function ClientItem({
  user,
  onClick,
}: {
  user: User;
  onClick: (id: string) => void;
}) {
  return (
    <div className="client-item-container" onClick={() => onClick(user.id)}>
      {user.name}
    </div>
  );
}
