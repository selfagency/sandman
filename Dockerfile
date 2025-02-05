FROM node:20-alpine

WORKDIR /app
COPY * .
RUN pnpm i --frozen-lockfile
RUN pnpm build

CMD ["node", "dist/index.js"]
