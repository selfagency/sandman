FROM node:20-bookworm-slim
RUN apt update -y
RUN apt install software-properties-common apt-transport-https ca-certificates curl sqlite3 -y
RUN curl -fSsL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor | sudo tee /usr/share/keyrings/google-chrome.gpg >>/dev/null
RUN echo deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main | tee /etc/apt/sources.list.d/google-chrome.list
RUN apt update -y
RUN apt install google-chrome-stable -y

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "--experimental-specifier-resolution=node", "dist/index.js"]
