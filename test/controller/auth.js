const
  db = require('../../app/models'),
  request = require('supertest');

describe('auth controller', function () {
  beforeEach(global.setup);
  afterEach(global.teardown);

  let agent, app;

  beforeEach(function () {
    app = require('../../app');
    agent = request.agent(app);
  });

  context('if user and contest are created,', function () {
    let userInfo, user, contestInfo, contest;

    beforeEach(async function () {
      userInfo = {
        strId: 'test01',
        password: 'q1w2e3r4!',
        groupName: '아주대학교'
      };

      contestInfo = {
        name: 'shake17',
        start: global.getContestTime(-2, false),
        end: global.getContestTime(3, false)
      };


      user = await db.User.create(userInfo);
      contest = await db.Contest.create(contestInfo);

      await user.setContest(contest);

      expect(user).to.have.property('strId', userInfo.strId);
    });

    context('when user tries to log in,', function () {
      it('should save user session and return user info.', async function () {
        const resp = await agent
          .post(urls.login(contestInfo.name))
          .send({userId: userInfo.strId, userPwd: userInfo.password})
          .expect(200);

        const {body: {result: {user: newUser}}} = resp;

        expect(newUser).to.deep.match({
          strId: userInfo.strId,
          groupName: userInfo.groupName
        });

      });
    });

    context('when user tries to log in with invalid contest name,', function () {
      it('should return error message.', async function () {
        const resp = await agent
          .post(urls.login(contestInfo.name + '2'))
          .send({userId: userInfo.strId, userPwd: userInfo.password})
          .expect(401);

        console.log(resp);
      });
    })
  });
});
