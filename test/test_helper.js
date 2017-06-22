if (!global.config) {
  global.config = require('../config/config.js');
}

const
  db = require('../app/models/index'),
  chai = require('chai'),
  chaiDeepMatch = require('chai-deep-match'),
  chaiArrays = require('chai-arrays');

chai.use(chaiDeepMatch);
chai.use(chaiArrays);

global.expect = chai.expect;

global.setup = async function () {
  this.timeout(5000);

  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await db.sequelize.sync({force: true});
  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
};

global.teardown = async function () {
};

global.getContestTime = function (offset, isUTC) {
  const now = new Date();

  now.setHours(now.getHours()+offset);
  now.setMinutes(0);
  now.setSeconds(0);

  if (isUTC) return now.getTime();
  return now;
}

global.urls = {
  contest: '/api/contests',
  login: (contestName) => (`/auth/${contestName}/login`),
  loggedin: (contestName) => (`/auth/${contestName}/loggedin`),
  logout: (contestName) => (`/auth/${contestName}/logout`),
  problem: (contestName) => (`/api/${contestName}/problems`),
  submission: (contestName) => (`/api/${contestName}/submissions`),
  user: (contestName) => (`/api/${contestName}/users`)
};

global.loginHelper = (agent, {userId, userPwd, contestName}, status = 200) => {
  return agent
    .post(global.urls.login(contestName))
    .send({userId, userPwd})
    .expect(status);
};

global.logoutHelper = (agent, {contestName}, status = 200) => {
  return agent
    .post(global.urls.logout(contestName))
    .expect(status);
};

global.checkLoggedInHelper = (agent, {contestName}, status = 200) => {
  return agent
    .get(global.urls.loggedin(contestName))
    .expect(status);
};

global.defaultContestInfo = {
  name: 'shake17',
  start: global.getContestTime(-2, false),
  end: global.getContestTime(3, false)
};

global.defaultUserInfo = {
  strId: 'test01',
  password: 'q1w2e3r4!',
  groupName: '아주대학교'
};

global.defaultAdminInfo = {
  strId: 'admin01',
  password: 'q1w2e3r4!',
  isAdmin: true
};

global.defaultProblemListInfo = [
  {title: 'Problem A', code: 'A', description: 'problem a', memory_limit: 256, time_limit: 1},
  {title: 'Problem B', code: 'B', description: 'problem b', memory_limit: 256, time_limit: 1},
  {title: 'Problem C', code: 'C', description: 'problem c', memory_limit: 256, time_limit: 1},
  {title: 'Problem D', code: 'D', description: 'problem d', memory_limit: 256, time_limit: 1},
];

global.prepareUserAndContest = async (
    agent,
    contestInfo = global.defaultContestInfo,
    userInfo = global.defaultUserInfo
  ) => {

  let user = await db.User.create(userInfo);
  let contest = await db.Contest.create(contestInfo);

  await user.setContest(contest);

  expect(user).to.have.property('strId', userInfo.strId);

  return [user, contest];
}

global.insertProblemListToContest = async (
    agent,
    contestInfo = global.defaultContestInfo,
    problemListInfo = global.defaultProblemListInfo
  ) => {

  const contest = await db.Contest.findOne({where: {name: contestInfo.name}});

  const problemList = await Promise.all(problemListInfo.map(pInfo => {
    return db.Problem.create({
      title: pInfo.title,
      description: pInfo.description,
      code: pInfo.code,
      ProblemInfo: {
        memory_limit: pInfo.memory_limit,
        time_limit: pInfo.time_limit
      },
      ContestId: contest.id
    }, {
      include: [db.ProblemInfo]
    })
  }));

  return problemList;
}
