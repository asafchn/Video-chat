import { SocketProvider } from "./socket/SocketContext";

function App() {
  return (
    <SocketProvider>
      <div>hello world</div>
    </SocketProvider>
  );
}

export default App;
