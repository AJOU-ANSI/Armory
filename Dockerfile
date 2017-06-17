FROM node

ENV APP_DIR /root/app/Armory
ENV CLIENT_DIR armory-client

RUN yarn global add pm2
RUN mkdir -p ${APP_DIR}

WORKDIR ${APP_DIR}

COPY package.json yarn.lock ${APP_DIR}/
RUN yarn install

COPY ${CLIENT_DIR}/package.json ${CLIENT_DIR}/yarn.lock ${APP_DIR}/${CLIENT_DIR}/
RUN cd ${CLIENT_DIR} && yarn install

COPY . ${APP_DIR}/
RUN yarn build:client

EXPOSE 8000

CMD ["pm2-docker", "process.json"]
