FROM node:20-bookworm-slim
RUN apt update -y
RUN apt install curl sqlite3 -y

ENV COREPACK_INTEGRITY_KEYS="0"

COPY . /app
WORKDIR /app

RUN corepack enable
RUN npm install
RUN npm run build

CMD ["sh", "-c", "/app/entrypoint.sh"]
