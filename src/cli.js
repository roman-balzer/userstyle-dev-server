#!/usr/bin/env node

const spawn = require("cross-spawn");
const path = require("path");
const chalk = require("chalk");
const meow = require("meow");
const fs = require("fs");

const LiveServer = require("./live-server");
const WsServer = require("./websocket-server");
const SassWatcher = require("./sass-watcher");

const CLI_TAG = chalk.redBright("[    CLI   ]:");
const DEFAULT_PORT = 10000;

const cli = meow(
  `
	Usage
	  $ userstyle-dev-server <srcfile>

	Options
	  --help, -h      Print help
    --port, -p      Provide port for server, given port and port+1 will be used
                    Default: ${DEFAULT_PORT} and ${DEFAULT_PORT + 1}
    --build, -b     Build a finished style file and write to /dist

	Examples
	  $ userstyle-dev-server ./src/index.scss -p 8080
	  $ userstyle-dev-server ./src/userStyle.definition.scss -b
`,
  {
    flags: {
      help: {
        type: "boolean",
        alias: "h"
      },
      port: {
        type: "number",
        alias: "p"
      },
      build: {
        type: "boolean",
        alias: "b"
      }
    }
  }
);

const [srcFile, ...rest] = cli.input;
const { port = DEFAULT_PORT } = cli.flags;
let srcFilePath = path.join(process.cwd(), srcFile);

if (cli.flags.help || cli.input.length === 0) {
  console.log(cli.help);
} else if (cli.flags.build) {
  if (fs.existsSync(srcFilePath)) {
    console.info(chalk`${CLI_TAG} Started for building output`);
    SassWatcher.build(srcFilePath);
  } else {
    console.info(
      chalk`${CLI_TAG} {redBright Could not find file:} {gray ${srcFilePath}}`
    );
  }
} else {
  if (fs.existsSync(srcFilePath)) {
    console.info(
      chalk`${CLI_TAG} SourceFile for SASS compilation: {gray ${srcFilePath}}`
    );

    LiveServer.start(port);
    WsServer.start(port + 1);
    SassWatcher.start(srcFilePath);

    process.once("SIGINT", function(code) {
      console.log(chalk`${CLI_TAG} ❌  {redBright SIGINT received...}`);
      LiveServer.close();
      WsServer.close();
      SassWatcher.stop();
    });
  } else {
    console.info(
      chalk`${CLI_TAG} {redBright Could not find file:} {gray ${srcFilePath}}`
    );
  }
}
