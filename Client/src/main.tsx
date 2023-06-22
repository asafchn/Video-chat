import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./stores/store.ts";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
