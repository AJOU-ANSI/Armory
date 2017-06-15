const
  request = require('supertest');

describe('Problem controller', function () {
  beforeEach(global.setup);
  afterEach(global.teardown);

  let agent;
  beforeEach(async function () {
    agent = request.agent(require('../../app'));
  });

  context('when user account is ready and contest is on,', function () {
    let userInfo, contestInfo, problemListInfo;

    beforeEach(async function () {
      userInfo = Object.assign({}, global.defaultUserInfo);
      contestInfo = Object.assign({}, global.defaultContestInfo);
      problemListInfo = global.defaultProblemListInfo.slice();

      await global.prepareUserAndContest(agent);
      await global.insertProblemListToContest(agent, contestInfo, problemListInfo);
    });

    context('when user is loggedin and requests problemList', function () {
      beforeEach(async function () {
        await global.loginHelper(agent, {
          userId: userInfo.strId,
          userPwd: userInfo.password,
          contestName: contestInfo.name
        });
      });

      it('should return problem list resided in the contest.', async function () {
        const result = await agent
          .get(global.urls.problem(contestInfo.name))
          .expect(200);

        let {body: {result: {problem_list: problemList}}} = result;

        expect(problemList).to.have.length(problemListInfo.length);

        problemList = problemList.sort((a, b) => (a.code.charCodeAt(0) - b.code.charCodeAt(0)));
        problemList.forEach((problem, index) => {
          const info = problemListInfo[index];

          expect(problem).to.deep.match({
            title: info.title,
            description: info.description,
            code: info.code,
            ProblemInfo: {
              memory_limit: info.memory_limit,
              time_limit: info.time_limit
            }
          });
        });
      });
    });

    context('when user is not loggedin and requests problemList,', function () {
      it('should return error message with 401 status.', async function () {
        await agent
          .get(global.urls.problem(contestInfo.name))
          .expect(401);
      })
    });
  });

  context('when user account is prepared but contest is not yet open,', function () {
    let userInfo, contestInfo, problemListInfo;

    beforeEach(async function () {
      userInfo = Object.assign({}, global.defaultUserInfo);
      contestInfo = {
        name: 'not yet open contest',
        start: global.getContestTime(2, false),
        end: global.getContestTime(7, false)
      };

      problemListInfo = global.defaultProblemListInfo.slice();

      await global.prepareUserAndContest(agent, contestInfo, userInfo);
      await global.insertProblemListToContest(agent, contestInfo, problemListInfo);
    });

    context.only('when user is loggedin and requests problemList', function () {
      beforeEach(async function () {
        await global.loginHelper(agent, {
          userId: userInfo.strId,
          userPwd: userInfo.password,
          contestName: contestInfo.name
        });
      });

      it('should return error message and 400 status.', async function () {
        const result = await agent
          .get(global.urls.problem(contestInfo.name))
          .expect(400);

        const {body: {message}} = result;

        expect(message).to.equal('대회가 아직 열리지 않았습니다.');
      });
    });
  });

  context('when admin account is prepared but contest is not yet open,', function () {
    let userInfo, contestInfo, problemListInfo;

    beforeEach(async function () {
      userInfo = {
        strId: 'admin01',
        password: 'q1w2e3r4!',
        isAdmin: true
      };

      contestInfo = {
        name: 'not yet open contest',
        start: global.getContestTime(2, false),
        end: global.getContestTime(7, false)
      };

      problemListInfo = global.defaultProblemListInfo.slice();

      await global.prepareUserAndContest(agent, contestInfo, userInfo);
      await global.insertProblemListToContest(agent, contestInfo, problemListInfo);
    });

    context.only('when admin is loggedin and requests problemList', function () {
      beforeEach(async function () {
        await global.loginHelper(agent, {
          userId: userInfo.strId,
          userPwd: userInfo.password,
          contestName: contestInfo.name
        });
      });

      it('should return problemlist although it\'s not open.', async function () {
        const result = await agent
          .get(global.urls.problem(contestInfo.name))
          .expect(200);

        let {body: {result: {problem_list: problemList}}} = result;

        expect(problemList).to.have.length(problemListInfo.length);

        problemList = problemList.sort((a, b) => (a.code.charCodeAt(0) - b.code.charCodeAt(0)));
        problemList.forEach((problem, index) => {
          const info = problemListInfo[index];

          expect(problem).to.deep.match({
            title: info.title,
            description: info.description,
            code: info.code,
            ProblemInfo: {
              memory_limit: info.memory_limit,
              time_limit: info.time_limit
            }
          });
        });
      });
    });
  });
});
