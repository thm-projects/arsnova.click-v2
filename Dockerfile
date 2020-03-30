FROM node:12.14-alpine AS build
ARG buildCmd
ARG targetUrl
ARG themes
ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
ARG CHROMIUM_PATH
ARG CHROME_BIN
RUN set -e \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    chromium \
    ttf-freefont
WORKDIR /usr/src/app
COPY . .
RUN chmod +x build.sh && sh build.sh ${buildCmd} ${targetUrl}

FROM node:12.14-alpine
WORKDIR /usr/src/app/dist/frontend/browser
COPY --from=build /usr/src/app/dist/frontend/browser .
WORKDIR /usr/src/app/dist/frontend/server
COPY --from=build /usr/src/app/dist/frontend/server .
WORKDIR /usr/src/app
CMD ["node", "dist/frontend/server/main.js"]
