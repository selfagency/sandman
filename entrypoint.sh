#!/bin/sh
cd "/app/scripts" || exit
if [ -f "package.json" ]; then
  npm i
fi

cd "/app" || exit
node --experimental-specifier-resolution=node "dist/index.js"
