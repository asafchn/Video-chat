import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  emitCurrentUser(socket);

  socket.on("disconnect", () => {
    console.log("userDisconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});

function emitCurrentUser(socket: Socket) {
  socket.emit("me", socket.id);
}
