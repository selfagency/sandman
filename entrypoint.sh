#!/bin/sh
corepack enable
cd "/app/scripts" || exit
if [ -f "package.json" ]; then
  pnpm i
fi

cd "/app" || exit
node --experimental-specifier-resolution=node "dist/index.js"
