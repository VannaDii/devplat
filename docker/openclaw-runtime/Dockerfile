ARG ALPINE_VERSION=3.23.3
FROM alpine:${ALPINE_VERSION} AS node-base

ARG NODE_VERSION=24.14.1

RUN apk add --no-cache \
    bash \
    ca-certificates \
    curl \
    git \
    libstdc++ \
    tar \
    xz

RUN arch="$(apk --print-arch)" \
    && case "${arch}" in \
      x86_64) node_arch='x64' ;; \
      aarch64) node_arch='arm64' ;; \
      *) echo "Unsupported Alpine architecture: ${arch}" >&2; exit 1 ;; \
    esac \
    && curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${node_arch}.tar.xz" -o /tmp/node.tar.xz \
    && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
    && rm /tmp/node.tar.xz \
    && node --version \
    && npm --version

FROM node-base AS build

WORKDIR /workspace

COPY . .

RUN npm ci --ignore-scripts \
    && npm run prepare:generated \
    && npm run build:workspace \
    && npm prune --omit=dev --ignore-scripts

FROM node-base AS runtime

ENV NODE_ENV=production
ENV OPENCLAW_HOME=/var/lib/devplat/openclaw

WORKDIR /app

RUN addgroup -S devplat && adduser -S -G devplat devplat \
    && mkdir -p /var/lib/devplat /config \
    && chown -R devplat:devplat /var/lib/devplat /config /app

COPY --from=build /workspace/package.json /workspace/package-lock.json ./
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages ./packages
COPY /docker/openclaw-runtime/entrypoint.sh /usr/local/bin/devplat-openclaw-entrypoint

RUN chmod +x /usr/local/bin/devplat-openclaw-entrypoint \
    && chown -R devplat:devplat /app

USER devplat

EXPOSE 18789

ENTRYPOINT ["devplat-openclaw-entrypoint"]
CMD []
