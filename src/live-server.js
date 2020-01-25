const wss = require("./websocket-server.js");
const LiveServer = require("live-server");
const chalk = require("chalk");
const fs = require("fs");
const util = require("util");

const fs_access = util.promisify(fs.access);

const LS_TAG = chalk.yellowBright("[ Live-Srv ]:");
let server;

async function startServer(port) {
  // Detect for client.js in out folder
  const assumedClientFile = "out/client.js";
  try {
    await fs_access(assumedClientFile);
    console.log(chalk`${LS_TAG} {redBright ${assumedClientFile} exists}`);
  } catch (e) {
    console.log(
      chalk`${LS_TAG} {redBright ${assumedClientFile} does not exist} ... Creating`
    );
    fs.copyFileSync(__dirname + "/client.js", assumedClientFile);
  }

  server = LiveServer.start({
    port,
    root: "out",
    logLevel: 2,
    middleware: [
      function(req, res, next) {
        next();
      }
    ],
    noBrowser: true
  });

  LiveServer.watcher.on("change", () => {
    console.log(chalk`${LS_TAG} {blueBright Change detected} - Reload Files`);
    wss.sendCssUpdateSignal();
  });
}

function closeServer() {
  if (server) {
    console.log(chalk`${LS_TAG} ❌  {redBright Stopping} Live Server`);

    LiveServer.shutdown();
  } else {
    console.log(LS_TAG + "Cant stop Server, none started");
  }
}

exports.start = startServer;
exports.close = closeServer;
