FROM node:24.19.0-alpine@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43 AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.29-alpine@sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6 AS runtime

# Ensure PORT env is defined for Cloud Run and SDD compliance
ENV PORT 8080

# Temporarily switch to root to install envsubst (gettext), then drop back to unprivileged user
USER root
RUN apk add --no-cache gettext && rm -rf /var/cache/apk/*

# Back to unprivileged default user will be set at the end of the Dockerfile


# Copy nginx template and serve built SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY --from=build --chown=101:101 /app/dist/ /usr/share/nginx/html/

EXPOSE 8080

# Healthcheck uses localhost inside container; respect $PORT for runtime binding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1

# Replace PORT in nginx config at container start and run nginx in foreground
CMD ["/bin/sh","-c","envsubst '\${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

USER 101:101
