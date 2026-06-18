import { Server } from "socket.io";

export let io;
export const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    //socket.on("register-user", (userId) => {
     // onlineUsers.set(userId, socket.id);
     // console.log("User registered:", userId);
    //});

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => io;

export const getReceiverSocket = (userId) =>
  onlineUsers.get(userId);
