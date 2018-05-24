FROM node:10.1

ENV APP_DIR /root/app/Armory
ENV CLIENT_DIR armory-client

RUN npm i -g pm2
RUN mkdir -p ${APP_DIR}

WORKDIR ${APP_DIR}

COPY package.json package-lock.json ${APP_DIR}/
RUN npm install

COPY ${CLIENT_DIR}/package.json ${CLIENT_DIR}/package-lock.json ${APP_DIR}/${CLIENT_DIR}/
RUN cd ${CLIENT_DIR} && npm install

COPY . ${APP_DIR}/
RUN npm run build:client

COPY config/config_sample.js config/config.js

EXPOSE 8000

CMD ["pm2-docker", "process.json"]
