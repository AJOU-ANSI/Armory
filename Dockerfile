FROM node:10.1-alpine

ENV APP_DIR /root/app/Armory
ENV CLIENT_DIR armory-client

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install \
        [ your npm dependencies here ] \
    && apk del .gyp


RUN npm i -g pm2
RUN mkdir -p ${APP_DIR}

WORKDIR ${APP_DIR}

COPY package.json yarn.lock ${APP_DIR}/
RUN npm install

COPY ${CLIENT_DIR}/package.json ${CLIENT_DIR}/yarn.lock ${APP_DIR}/${CLIENT_DIR}/
RUN cd ${CLIENT_DIR} && npm install

COPY . ${APP_DIR}/
RUN npm run build:client

COPY config/config_sample.js config/config.js

EXPOSE 8000

CMD ["pm2-docker", "process.json"]
