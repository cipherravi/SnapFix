document.addEventListener("DOMContentLoaded", () => {
  console.log("Welcome to sockets!!");

  const socket = io(); // this connects to the server automatically

  const parent = document.getElementById("parent");
  const input = document.getElementById("msg_input_box");
  const send_btn = document.getElementById("send_message");
  const msg_box = document.getElementById("msg_box");

  function sendMessage() {
    if (input.value) {
      let msg = input.value;
      socket.emit("sendMessage", msg);
      const li = document.createElement("li");
      li.classList.add("chat-sent", "chat-message");

      li.textContent = msg;
      msg_box.appendChild(li);
      input.value = "";
    }
  }
  input.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      sendMessage();
    }
  });
  send_btn.addEventListener("click", sendMessage);

  socket.on("receiveMessage", (msg) => {
    const li = document.createElement("li");
    li.classList.add("chat-received", "chat-message");

    li.textContent = msg;
    msg_box.appendChild(li);
  });
});
