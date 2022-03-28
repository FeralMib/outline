#!/bin/bash
. $HOME/.profile
cd $HOME/outline
#yarn start

## Update
# yarn cache clean
# cd rich-markdown-editor
# yarn install
# yarn build
# npm pack
# cd ..
## double check pkg name matches package.json
# yarn install
# yarn build

# https://github.com/outline/outline/pull/1686/files
NODE_ENV=production pm2 start ./build/server/index.js --name outline -i max
