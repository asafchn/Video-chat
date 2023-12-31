import { SocketProvider } from "./socket/SocketContext";
import MainPage from "./Components/MainPage/MainPage.tsx";
import { Provider } from "react-redux";
import { store } from "./stores/store.ts";

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <MainPage></MainPage>
      </SocketProvider>
    </Provider>
  );
}

export default App;
