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

FROM nginx:1.15.8-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html
RUN echo "nginx -g 'daemon off;'" > run.sh
ENTRYPOINT ["sh", "run.sh"]
