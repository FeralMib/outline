#!/bin/bash
. $HOME/.profile
cd $HOME/outline
#yarn start

# https://github.com/outline/outline/pull/1686/files
NODE_ENV=production pm2 start ./build/server/index.js --name outline -i max
