FROM node:20-bookworm-slim
RUN apt update -y
RUN apt install curl sqlite3 -y

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_KEY=''
ENV OUTDIR=''

CMD ["node", "--experimental-specifier-resolution=node", "dist/index.js"]
