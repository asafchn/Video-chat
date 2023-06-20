import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { SocketConst, type Users, type User } from "../consts";

const app = express();
const server = http.createServer(app);

app.use(cors());

const users: Users = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on(SocketConst.connection, (socket) => {
  emitCurrentUser(socket);
  saveUser(socket);

  socket.on(SocketConst.updateUser, ({ id, name }: User) => {
    updateUserName({ id, name });
    emitClientsList(io);
  });

  socket.on(SocketConst.disconnect, () => {
    deleteUser(socket);
    emitClientsList(io);
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});

function emitCurrentUser(socket: Socket) {
  socket.emit(SocketConst.me, socket.id);
}

function emitClientsList(io: Server) {
  io.sockets.emit(SocketConst.clientsList, users);
}

function saveUser(socket: Socket) {
  users[socket.id] = { id: socket.id, name: "" };
}

function deleteUser(socket: Socket) {
  delete users[socket.id];
}

function updateUserName({ id, name }: User) {
  if (users[id]) {
    users[id].name = name;
  } else {
    users[id] = { id, name };
  }
}
