FROM oven/bun:latest AS base

FROM base as install

WORKDIR /app

COPY . .

RUN rm -rf **/node_modules

RUN find . -type f -name 'bun.lockb' -exec rm -f {} +

RUN bun install

FROM base as build

WORKDIR /app

COPY --from=install /app/node_modules ./node_modules

COPY --from=install /app/packages /app/ ./

RUN bun run build:FE

RUN bun run build:BE

RUN bun run migrate

FROM base AS final

WORKDIR /app

COPY --from=build /app/packages/ui-dist ./ui-dist

COPY --from=build /app/packages/bun-server/build/index.js ./bun-server/build

COPY --from=build /app/packages/bun-server/sqlite.db ./bun-server

EXPOSE 3000

CMD ["sh", "-c", " bun run start:BE"]