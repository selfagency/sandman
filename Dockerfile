FROM node:20-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_INTEGRITY_KEYS="0"
RUN apk add --no-cache curl sqlite
COPY . /app
WORKDIR /app

RUN corepack enablee
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

CMD ["sh", "-c", "/app/entrypoint.sh"]
