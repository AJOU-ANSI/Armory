const
  request = require('supertest'),
  websocket = require('../../app/websocket'),
  // db = require('../../app/models'),
  io = require('socket.io-client');

describe('Notification websocket', function () {
  beforeEach(global.setup);
  beforeEach(global.teardown);

  let agent, app, server;

  beforeEach(function () {
    app = require('../../app');
    server = app.listen(config.port);
    agent = request.agent(server);

    websocket.init(app.memoryStore, server);
  });

  afterEach(function () {
    websocket.closeServer();
    server.close();
  });

  context('if user is created,', function () {
    let userInfo, contestInfo;

    beforeEach(async function () {
      userInfo = Object.assign({}, global.defaultUserInfo);
      contestInfo = Object.assign({}, global.defaultContestInfo);

      await global.prepareUserAndContest(agent);
    });

    it('should connect websocket if user is logined.', async function () {
      let resp = await global.loginHelper(agent, {
        contestName: contestInfo.name,
        userId: userInfo.strId,
        userPwd: userInfo.password
      });

      const socket = io('http://localhost:' + config.port, {
        transportOptions: {
          polling: {
            extraHeaders: {
              'Cookie': resp.headers['set-cookie']
            }
          }
        }
      });

      return new Promise(resolve => {
        socket.on('connect', function () {
          resolve();
        });
      });
    });
  });
});
