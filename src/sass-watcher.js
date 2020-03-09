const spawn = require("cross-spawn");
const chalk = require("chalk");

const WATCHER_TAG = chalk.yellowBright("[Sass-Watch]:");
const NODE_SASS_PATH = "node_modules/.bin/node-sass";

let sass_watcher;

function buildOutput(path) {
  let outputPath = "./dist/style.userstyle.css";
  let buildCSS = spawn(NODE_SASS_PATH, [path, outputPath]);

  console.info(chalk`${WATCHER_TAG} Building UserStyle from {gray ${path}}`);
  buildCSS.stdout.on("data", data => {
    console.log(
      chalk`${WATCHER_TAG} Build UserStyle and wrote to {gray ${outputPath}}`
    );
  });
}

function startWatcher(path) {
  let outputPath = "./out/style.dev.css";
  let buildCSS = spawn(NODE_SASS_PATH, [path, outputPath]);
  sass_watcher = spawn(NODE_SASS_PATH, [path, outputPath, "-rw"]);

  buildCSS.stdout.on("data", data => {
    let msg = data.toString().replace(/\r?\n/, "");
    let msg2 = msg.replace("Wrote CSS", chalk`{blueBright Wrote CSS}`);
    console.log(`${WATCHER_TAG} ${msg2}`);
  });
  sass_watcher.stdout.on("data", data => {
    let msg = data.toString().replace(/\r?\n/, "");
    console.log(`${WATCHER_TAG} ${msg}`);
  });

  sass_watcher.on("error", code => {
    console.log(`${WATCHER_TAG} Errored with code ${code}`);
  });
}

function stopWatcher() {
  if (sass_watcher) {
    console.log(chalk`${WATCHER_TAG} ❌  {redBright Stopping} SASS Watcher`);
    sass_watcher.kill();
  } else {
    console.log(
      `${WATCHER_TAG} Couldn't stop SASS Watcher, as watcher was not started`
    );
  }
}

exports.build = buildOutput;
exports.start = startWatcher;
exports.stop = stopWatcher;
