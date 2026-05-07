const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user joins
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("user-list", Object.values(users));
  });

  // message send
  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });

  // user disconnect
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("user-list", Object.values(users));
  });
});

http.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});