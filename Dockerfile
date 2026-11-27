FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS api
WORKDIR /app
ENV NODE_ENV=production GANTT_HOST=0.0.0.0 GANTT_PORT=4318 GANTT_FILE_DIRECTORY=/data/attachments
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && mkdir -p /data/attachments && chown -R node:node /data
COPY server ./server
COPY packages ./packages
COPY src/domain.ts ./src/domain.ts
USER node
EXPOSE 4318
CMD ["node","node_modules/tsx/dist/cli.mjs","server/index.ts"]

FROM caddy:2-alpine AS web
COPY --from=build /app/dist /srv/Ghannt/app
COPY --from=build /app/public/Ghannt/index.html /srv/Ghannt/index.html
COPY deploy/Caddyfile.docker /etc/caddy/Caddyfile
