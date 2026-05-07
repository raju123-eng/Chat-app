const socket = io();

// username input
let username = prompt("Enter your name:");

if (!username || username.trim() === "") {
  username = "Anonymous";
}

// send username to server
socket.emit("join", username);

// send message
function sendMessage() {
  let input = document.getElementById("message");

  if (!input.value.trim()) return;

  socket.emit("send-message", {
    text: input.value,
    user: username
  });

  input.value = "";
}

// receive message
socket.on("receive-message", (data) => {
  let box = document.getElementById("chat-box");

  if (!data || !data.text) return;

  let div = document.createElement("div");

  // time
  let time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  if (data.user === username) {
    div.className = "message my-msg";
    div.innerHTML = `
      <span>You</span>
      <p>${data.text}</p>
      <small>${time}</small>
    `;
  } else {
    div.className = "message other-msg";
    div.innerHTML = `
      <span>${data.user}</span>
      <p>${data.text}</p>
      <small>${time}</small>
    `;
  }

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
});

// update user list
socket.on("user-list", (users) => {
  let userBox = document.getElementById("users");

  userBox.innerHTML = "";

  users.forEach((user) => {
    let li = document.createElement("li");
    li.innerText = user;
    userBox.appendChild(li);
  });
});