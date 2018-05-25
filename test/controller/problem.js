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
              memory_limit: info.memoryLimit,
              time_limit: info.timeLimit
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

    context('when user is loggedin and requests problemList', function () {
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

    context('when admin is loggedin and requests problemList', function () {
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
              memory_limit: info.memoryLimit,
              time_limit: info.timeLimit
            }
          });
        });
      });
    });
  });

  context('when admin account is prepared and contest is not yen open,', function () {
    context('if admin creates a problem,', function () {
      let contestInfo, adminInfo, problemListInfo;

      beforeEach(async function() {
        contestInfo = {
          name: 'not yet open contest',
          start: global.getContestTime(2, false),
          end: global.getContestTime(7, false)
        };

        adminInfo = {...global.defaultAdminInfo};

        problemListInfo = [...global.defaultProblemListInfo];

        await global.prepareUserAndContest(agent, contestInfo, adminInfo);

        await global.loginHelper(agent, {
          userId: adminInfo.strId,
          userPwd: adminInfo.password,
          contestName: contestInfo.name
        });
      });

      it('should create a problem and return the created problem.', async function () {
        // return obj.db.Problem.create({
        //   title: problemInfo.title,
        //   code: problemInfo.code,
        //   description: problemInfo.description,
        //   ProblemInfo: {
        //     time_limit: problemInfo.timeLimit,
        //     memory_limit: problemInfo.memoryLimit,
        //     spj: problemInfo.spj
        //   },
        //   ContestId: contest.id
        // }, {
        //   include: [obj.db.ProblemInfo]
        // });

        const createdProblemsList = [];

        for(let i = 0; i < problemListInfo.length; i++) {
          const problemInfo = problemListInfo[i];

          const {body: {result: {problem: createdProblem}}} = await agent.post(`${global.urls.problem(contestInfo.name)}`)
            .send(problemInfo)
            .expect(200);

          createdProblemsList[i] = createdProblem;
        }

        createdProblemsList.sort((a, b) => (a.code.charAt(0) - b.code.charAt(0)));

        createdProblemsList.forEach((createdProblem, idx) => {
          const problemInfo = problemListInfo[idx];

          expect(createdProblem).to.deep.match({
            title: problemInfo.title,
            code: problemInfo.code,
            description: problemInfo.description,
            score: problemInfo.score,
            ProblemInfo: {
              memory_limit: problemInfo.memoryLimit,
              time_limit: problemInfo.timeLimit,
            }
          })
        })
      });
    })
  });
});
