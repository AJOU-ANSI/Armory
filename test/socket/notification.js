const
  // db = require('../../app/models'),
  request = require('supertest'),
  websocket = require('../../app/websocket'),
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

    context('if send a notification,', function () {
      it('should receive message in client listener.', async function () {
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

        const message = 'this_is_notification_message';

        setTimeout(async () => {
            await agent.post('/api/notifications')
              .send({message})
              .expect(200);
          }, 100);

        return new Promise(resolve => {
          socket.on('notification', function (msg) {
            expect(msg).to.equal(message);
            resolve(true);
          });
        });
      });
    });
  });
});
