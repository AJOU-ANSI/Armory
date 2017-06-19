const
  request = require('supertest'),
  db = require('../../app/models');

describe('Submission Controller', function () {
  beforeEach(global.setup);
  afterEach(global.teardown);

  let agent;

  beforeEach(function () {
    agent = request.agent(require('../../app'));
  });

  context('when user submitted solutions and judges are finished', function () {
    let user, userInfo, contest, contestInfo, problemListInfo, submissionListInfo;

    beforeEach(async function () {
      this.timeout(10000);

      userInfo = Object.assign({}, global.defaultUserInfo);
      contestInfo = Object.assign({}, global.defaultContestInfo);
      problemListInfo = Object.assign({}, global.defaultProblemListInfo);

      ([user, contest] = await global.prepareUserAndContest(agent));
      const problemList = await global.insertProblemListToContest(agent);

      submissionListInfo = [
        {
          language: 0,
          code: '//This is compile error',
          result: 2,
          result_message: 'You have compile error in line 0',
          UserId: user.id,
          ContestId: contest.id,
          ProblemId: problemList[0].id
        },
        {
          language: 0,
          code: '//This is wrong',
          result: 6,
          memory_usage: 10000,
          time_usage: 100,
          UserId: user.id,
          ContestId: contest.id,
          ProblemId: problemList[0].id
        },
        {
          language: 0,
          code: '//This is right',
          result: 4,
          memory_usage: 10000,
          time_usage: 100,
          UserId: user.id,
          ContestId: contest.id,
          ProblemId: problemList[0].id
        },
        {
          language: 0,
          code: '//This is pending',
          result: 0,
          UserId: user.id,
          ContestId: contest.id,
          ProblemId: problemList[1].id
        }
      ];

      for (let i = 0; i < submissionListInfo.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await db.Submission.create(submissionListInfo[i]);
      }

      await global.loginHelper(agent, {
        userId: userInfo.strId,
        userPwd: userInfo.password,
        contestName: contestInfo.name
      });
    });

    it('should return submission list if user requests them.', async function () {
      const resp = await agent
        .get(global.urls.submission(contestInfo.name))
        .expect(200);

      const {result: {submission_list: newSubmissionList}} = resp.body;

      expect(newSubmissionList).to.have.length(submissionListInfo.length);
    });
  });
});
