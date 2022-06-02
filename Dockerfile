FROM node:18-alpine3.15 as builder

WORKDIR /app

COPY ./ /app

RUN npm install --global pnpm@7.1.7

RUN pnpm install --frozen-lockfile && \
    pnpm build

FROM nginx:1.21.6-alpine

LABEL org.opencontainers.image.source="https://github.com/nitwhiz/sane-scan-web"

COPY --from=builder /app/dist /usr/share/nginx/html

COPY docker/scripts/wrapper.sh /wrapper.sh

CMD [ "/wrapper.sh" ]
