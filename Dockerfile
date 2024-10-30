FROM node:20.9.0-buster as builder

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn cache clean
RUN yarn install

RUN yarn upgrade upp

RUN yarn upgrade shared

COPY . .
RUN yarn run build

FROM node:20.9.0-buster as release

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY  --from=builder /usr/src/app/package.json ./package.json
COPY  --from=builder /usr/src/app/node_modules ./node_modules
COPY  --from=builder /usr/src/app/dist ./dist
#COPY  --from=builder /usr/src/app/templates ./templates

EXPOSE 3000

CMD [ "node", "dist/main.js"]