const express = require("express");
const app = express();
const http = require("http");
const port = 5000;
const socketIO = require("socket.io");
const { socketHandlers } = require("./socketHandlers");

let server = http.createServer(app);
let io = socketIO(server);

app.get("/", (req, res) => res.send("<h1>Hello World From Express</h1>"));
// will pass 404 to error handler
// main socket routine
io.on("connection", (socket) => {
  console.log("new connection established");
  // client has joined
  socket.on("join", (clientData) => {
    socketHandlers.handleJoin(socket, clientData);
  });
  socket.on("disconnect", () => {
    socketHandlers.handleDisconnect(socket);
  });
  socket.on("typing", (clientData) => {
    socketHandlers.handleTyping(socket, clientData);
  });
  socket.on("message", (clientData) => {
    socketHandlers.sendMessage(socket, clientData);
  });
});
const getNumberOfUsersInRoom = (roomName) =>
  io.sockets.adapter.rooms.get(roomName).size;
// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});
server.listen(port, () => console.log(`starting on port ${port}`));
