
#!/bin/sh
set +x
#. $HOME/.profile
cd $HOME/outline
#yarn start

## Update
yarn cache clean
# cd rich-markdown-editor
# yarn install
# yarn build
# npm pack
# cd ..
## double check pkg name matches package.json

## Uncomment to rebuild
if [ ! -e build ]; then
yarn install
yarn build
yarn db:migrate
fi

# https://github.com/outline/outline/pull/1686/files
#NODE_ENV=production pm2 start ./build/server/index.js --name outline -i max

#pm2 install pm2-logrotate
#pm2 set pm2-logrotate:max_size 10M

#pm2-runtime start pm2.json
NODE_ENV=production yarn start