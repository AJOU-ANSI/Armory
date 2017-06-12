const
  db = require('../app/models/index'),
  chai = require('chai'),
  chaiDeepMatch = require('chai-deep-match'),
  chaiArrays = require('chai-arrays');

chai.use(chaiDeepMatch);
chai.use(chaiArrays);

global.expect = chai.expect;

global.setup = async function () {
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
  login: (contestName) => (`/auth/${contestName}/login`)
};
