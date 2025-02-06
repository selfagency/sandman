FROM node:20-alpine
RUN apk add --no-cache curl python3 make g++

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_INTEGRITY_KEYS="0"

COPY . /app
WORKDIR /app

RUN corepack enable
RUN pnpm install --frozen-lockfile
RUN pnpm run build

CMD ["sh", "-c", "/app/entrypoint.sh"]
