const
  // db = require('../../app/models'),
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
    let userInfo, contestInfo;

    beforeEach(async function () {
      userInfo = Object.assign({}, global.defaultUserInfo);
      contestInfo = Object.assign({}, global.defaultContestInfo);

      await global.prepareUserAndContest(agent);
    });

    context('when user tries to log in,', function () {
      it('should save user session and return user info.', async function () {
        const resp = await global.loginHelper(agent, {
          userId: userInfo.strId,
          userPwd: userInfo.password,
          contestName: contestInfo.name
        }, 200);

        const {body: {result: {user: newUser}}} = resp;

        expect(newUser).to.deep.match({
          strId: userInfo.strId,
          groupName: userInfo.groupName
        });

      });
    });

    context('when user tries to log in with invalid contest name,', function () {
      it('should return error message.', async function () {
        const resp = await global.loginHelper(agent, {
          userId: userInfo.strId,
          userPwd: userInfo.password,
          contestName: contestInfo.name + '2'
        }, 401);

        expect(resp.body.message).to.equal('존재하지 않는 대회입니다.');
      });
    });

    context('when user tries to log in contest with invalid user name,', function () {
      it('should return error message.', async function () {
        const resp = await global.loginHelper(agent, {
          userId: userInfo.strId + '2',
          userPwd: userInfo.password,
          contestName: contestInfo.name
        }, 401);

        expect(resp.body.message).to.equal('아이디 혹은 비밀번호가 잘못되었습니다.');
      });
    });

    context('when user tries to log in contest with invalid user password,', function () {
      it('should return error message.', async function () {
        const resp = await global.loginHelper(agent, {
          userId: userInfo.strId,
          userPwd: userInfo.password + '2',
          contestName: contestInfo.name
        }, 401);

        expect(resp.body.message).to.equal('아이디 혹은 비밀번호가 잘못되었습니다.');
      });
    });

    context('when user tries to log out,', function () {
      it('should log out the user and remove the session.', async function () {
        await global.loginHelper(agent, {
          userId: userInfo.strId,
          userPwd: userInfo.password,
          contestName: contestInfo.name
        });

        await global.logoutHelper(agent, {contestName: contestInfo.name});

        const resp = await global.checkLoggedInHelper(agent, {contestName: contestInfo.name}, 401);

        expect(resp.body.message).to.equal('로그인이 필요합니다.');
      });
    })
  });
});
