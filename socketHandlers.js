const { userHandlers } = require("./userHandlers");

const socketHandlers = {
  handleJoin: async (socket, client) => {
    if (await userHandlers.exists(client)) {
      socket.emit("nameexists", `${client.chatName} exists!`);
    } else {
      userHandlers.addUser(client);
      socket.name = client.chatName;
      socket.roomName = client.roomName;

      socket.join(socket.roomName);
      console.log(`${socket.name} has joined ${socket.roomName}`);

      socket.emit("welcome", `Welcome ${socket.name}!`);

      socket
        .to(client.roomName)
        .emit("newclient", `${socket.name} has joined this room`);
    }
  },
  handleTyping: async (socket, client) => {
    //userHandlers.addUser(client);
    console.log(`${socket.name} is typing...${socket.roomName}`);
    socket.to(socket.roomName).emit("someoneistyping", { from: socket.name });
  },
  handleDisconnect: async (socket) => {
    userHandlers.removeUser(socket.name);
    console.log(socket.roomName);
    socket
      .to(socket.roomName)
      .emit("someoneleft", `${socket.name} has left this room`);
  },
  sendMessage: async (socket, client) => {
    console.log(socket.roomName);
    socket
      .to(socket.roomName)
      .emit("newmessage", { text: client.text, from: client.from });
  },
  getNumberOfUsersInRoom: (roomName) => {
    io.sockets.adapter.rooms.get(roomName).size;
  },
};
module.exports = { socketHandlers };
