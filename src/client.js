(function() {
  "use strict";
  const WEBSOCKET_PORT = 10001;
  const SERVER_PORT = 10000;

  console.group(
    "%c 🧰 UserStyle File-Reloader for Development",
    "font-size:15px;"
  );

  console.log("Try injecting custom CSS");
  const newStyle = document.createElement("link");
  newStyle.rel = "stylesheet";
  newStyle.type = "text/css";
  newStyle.href = "http://127.0.0.1:" + SERVER_PORT + "/style.dev.css";
  document.head.appendChild(newStyle);

  console.log(
    "Connecting to WebSocket on Port %c" + WEBSOCKET_PORT,
    "color: #5684C2;"
  );
  const ws = new WebSocket("ws://localhost:" + WEBSOCKET_PORT);
  ws.onmessage = event => {
    console.log(
      "📩 Message received from WebSocket -> updating injected Stylesheet"
    );
    newStyle.href += "";
  };
  ws.onerror = event => {
    console.log("⛔ %c ... error occoured", "color: #FF4837;");
  };
  ws.onclose = event => {
    console.log("❌ %c ... closing connection", "color: #FF4837;");
    console.groupEnd();
  };
  ws.onopen = event => {
    console.log("%c ✔ connected successfully", "color: #52BF5B;");
    console.groupEnd();
  };
})();
