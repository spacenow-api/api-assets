# The instructions for the first stage
FROM node:10.16.0-alpine as first-stage

WORKDIR /app

COPY yarn.lock ./
COPY package.json ./

ENV PATH ./node_modules/.bin:$PATH

RUN apk add --no-cache --virtual .gyp \
  python \
  make \
  g++

RUN apk add vips-dev fftw-dev build-base --update-cache \
  --repository https://alpine.global.ssl.fastly.net/alpine/edge/community \
  --repository https://alpine.global.ssl.fastly.net/alpine/edge/main

RUN yarn

RUN apk del .gyp

COPY . .

RUN yarn build

# The instructions for the second stage
FROM node:10.16.0-jessie-slim

WORKDIR /app

COPY --from=first-stage /app ./

EXPOSE 6007

CMD ["yarn", "prod"]
