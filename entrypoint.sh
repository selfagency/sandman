#!/bin/sh
cd "/app" || exit
node --experimental-specifier-resolution=node "dist/index.js"
