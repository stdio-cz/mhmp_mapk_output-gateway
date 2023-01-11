FROM node:16.17.0-alpine AS build
WORKDIR /app

# JS BUILD
COPY package.json yarn.lock tsconfig.json ./
COPY src src
RUN mkdir -p docs/generated
RUN yarn --ignore-scripts && \
    yarn build-apidocs && \
    yarn build-minimal

FROM node:16.17.0-alpine
WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/docs/generated /app/docs/generated
COPY package.json yarn.lock  ./
RUN yarn --ignore-scripts --production --cache-folder .yarn-cache && \
    rm -rf .yarn-cache yarn.lock

# FAKETIME
# USER root
RUN apk add --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing/ libfaketime && \
    rm -rf /var/cache/apk/*

# Remove busybox links
RUN busybox --list-full | \
    grep -E "bin/ifconfig$|bin/ip$|bin/netstat$|bin/nc$|bin/poweroff$|bin/reboot$" | \
    sed 's/^/\//' | xargs rm -f

# Create a non-root user
RUN addgroup -S nonroot && \
    adduser -S nonroot -G nonroot -h /app -u 1001 -D && \
    chown -R nonroot /app

# Disable persistent history
RUN touch /app/.ash_history && \
    chmod a=-rwx /app/.ash_history && \
    chown root:root /app/.ash_history

USER nonroot

EXPOSE 3000
CMD ["node", "-r",  "dotenv/config", "dist/index.js"]

# For FAKETIME use prefix like:
# LD_PRELOAD=/usr/local/lib/libfaketime.so.1 FAKETIME="@2022-02-22 20:22:00" date
