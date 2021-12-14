docker run --rm -it -v $(pwd):/root/outline -w /root/outline keymetrics/pm2:16-alpine sh -c 'yarn install; yarn build'
