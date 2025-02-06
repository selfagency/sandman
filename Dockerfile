FROM node:20-bookworm-slim
RUN apt update -y
RUN apt install curl sqlite3 -y

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

CMD ["sh", "-c", "/app/entrypoint.sh"]
