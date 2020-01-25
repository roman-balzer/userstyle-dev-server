const WebSocket = require("ws");
const chalk = require("chalk");

const WSS_TAG = chalk.yellowBright("[  WS-Srv  ]:");
const SOCKET_AMOUNT = amount => `${chalk.bold.blue(amount)} connected sockets`;

let openSockets = [];
let ws_server;

function startServer(port) {
  ws_server = new WebSocket.Server({
    port
  });

  ws_server.on("connection", (ws, request, client) => {
    let arrIndex = openSockets.length;
    openSockets.push(ws);
    console.log(
      chalk`${WSS_TAG} {green New connection} ${SOCKET_AMOUNT(
        openSockets.length
      )}`
    );

    ws.on("close", () => {
      openSockets.splice(arrIndex, 1);
      console.log(
        chalk`${WSS_TAG} {red Connection closed} ${SOCKET_AMOUNT(
          openSockets.length
        )}`
      );
    });
  });
}

function closeServer() {
  if (ws_server) {
    console.log(chalk`${WSS_TAG} ❌  {redBright Stopping} Websocket Server`);
    ws_server.close();
  } else {
    console.log(WSS_TAG + "Cant stop Server, none started");
  }
}

function sendCssUpdateSignal() {
  console.log(chalk`${WSS_TAG} {blueBright ✉  Send message} to update CSS`);
  openSockets.forEach(ws => ws.send("test"));
}

exports.start = startServer;
exports.close = closeServer;
exports.sendCssUpdateSignal = sendCssUpdateSignal;
