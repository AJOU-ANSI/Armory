const
  db = require('../../app/models'),
  request = require('supertest'),
  websocket = require('../../app/websocket'),
  config = require('../../config/config');
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
      userInfo = {
        strId: 'test01',
        password: 'q1w2e3r4!'
      };

      contestInfo = {
        name: 'shake17',
        start: global.getContestTime(-2, false),
        end: global.getContestTime(3, false)
      };


      let user = await db.User.create(userInfo);
      let contest = await db.Contest.create(contestInfo);

      await user.setContest(contest);

      expect(user).to.have.property('strId', userInfo.strId);
    });

    it('should connect websocket if user is logined.', async function () {
      let resp = await agent
        .post(global.urls.login(contestInfo.name))
        .send({
          userId: userInfo.strId,
          userPwd: userInfo.password
        })
        .expect(200);

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

    context('if send a notification,', function () {
      it('should receive message in client listener.', async function () {
        let resp = await agent
          .post(global.urls.login(contestInfo.name))
          .send({
            userId: userInfo.strId,
            userPwd: userInfo.password
          })
          .expect(200);

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
