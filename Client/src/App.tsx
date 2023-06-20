import { SocketProvider } from "./socket/SocketContext";
import MainPage from "./MainPage/MainPage";

function App() {
  return (
    <SocketProvider>
      <MainPage></MainPage>
    </SocketProvider>
  );
}

export default App;
