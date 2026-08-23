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

# No runtime package install (avoid installing packages in runtime image)
# Use sed at container start to replace ${PORT} placeholder in the nginx template

# Copy nginx template and render runtime config at build time
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
RUN sed 's/\${PORT}/8080/g' /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf \
  && rm /etc/nginx/conf.d/default.conf.template
COPY --from=build --chown=101:101 /app/dist/ /usr/share/nginx/html/

EXPOSE 8080

# Healthcheck uses localhost inside container; keep port 8080 (SDD expects 0.0.0.0:$PORT -> 8080 default)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1

# Run nginx in foreground
CMD ["nginx","-g","daemon off;"]

USER 101:101
