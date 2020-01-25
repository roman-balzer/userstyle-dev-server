## Prerequisite

- Tampermonkey
  - [Chrome Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
  - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- Stylus
  - [Chrome Extension](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=en)
  - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/styl-us/)

Or similiar Extension, which can run javascript code. (Setting up a websocket to notify about style changes)

### Install

`npm i -D userstyle-dev-server`

## Usage (Development)

1. Create a index-File for instance style.scss, where you import all your partial scss-files.
2. Create a npm script `userstyle-dev-server ./your/index/file.scss`
3. Copy client code into a Tampermonkey userscript, so that websocket can be notified about changes in the scss code (if wanted change match-pattern)
   ```
       // ==UserScript==
       // @name         UserStyle File-Reloader for Development
       // @match        https://*/*
       // @require      http://127.0.0.1:10000/client.js
       // ==/UserScript==
   ```
4. Run your npm script and enjoy hot reloading of your userstyles

## Usage (Build Output)

1. Create a build-File (for instance userStyle.definition.scss), which contains your userstyle declaration comment and import styles (see example below)
2. Create a npm script `userstyle-dev-server --build ./src/userStyle.definition.scss`
3. Run build script
4. (Optional) Create a Link to your built file in your Readme, so you can install your styles from the repo.

### Example

```
    /* ==UserStyle==
    @name           UserStyleName
    @author         Author
    @version        1.0.0
    ==/UserStyle== */

    @-moz-document regexp("https://google.com") {
        @import 'style';
    }
```

## Options

    --help, -h      Print help
    --port, -p      Provide port for server, given port and port+1 will be used
                    Default: 10000 and 10001
