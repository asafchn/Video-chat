import { useSelector } from "react-redux";
import { StoreState } from "../stores/store";
import AddUser from "../AddUser/AddUser";
import MainPageAuthed from "./MainPageAuthed";

export default function MainPage() {
  const { userName } = useSelector((state: StoreState) => state.userStore);

  function RenderMainPage() {
    if (userName) {
      return <MainPageAuthed></MainPageAuthed>;
    } else {
      return <AddUser></AddUser>;
    }
  }
  return <RenderMainPage></RenderMainPage>;
}
