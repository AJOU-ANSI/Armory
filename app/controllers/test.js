const
  express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/api/test', router);
};

function getContestDate(offset) {
  const date = new Date();

  date.setHours(date.getHours() + offset);
  date.setMinutes(0);
  date.setSeconds(0);

  return date;
}

router.get('/init_db', async function (req, res) {

  /** ------------------ contest 1 ----------------- **/
  const [contest, created] = await db.Contest.findOrCreate({where: {name: 'shake17'}, defaults: {
    name: 'shake17',
    start: getContestDate(-2),
    end: getContestDate(3)
  }});

  const users = [];

  for(let i = 1 ; i <= 9 ; i++) {
    const strId = 'test0' + i;


    let [user] = await db.User.findOrCreate({where: {strId}, defaults: {
      strId,
      password: 'q1w2e3r4!',
    }});

    users.push(user);
  }

  const [admin] = await db.User.findOrCreate({where: {strId: 'admin01'}, defaults: {
    strId: 'admin01',
    password: 'q1w2e3r4!',
    isAdmin: true
  }});

  if (created) {
    for(let i = 0; i < 9; i++) {
      await users[i].setContest(contest);
    }

    await admin.setContest(contest);
  }

  /** ------------------- contest 2 ------------------- **/
  const [contest2, created2] = await db.Contest.findOrCreate({where: {name: 'shake16'}, defaults: {
    name: 'shake16not',
    start: getContestDate(10),
    end: getContestDate(15)
  }});

  const [admin2] = await db.User.findOrCreate({where: {strId: 'admin02'}, defaults: {
    strId: 'admin02',
    password: 'q1w2e3r4!',
    isAdmin: true
  }});


  const [user2] = await db.User.findOrCreate({where: {'test20'}, defaults: {
    strId: 'test20',
    password: 'q1w2e3r4!',
  }});

  if (created2) {
    await user2.setContent(contest2);
    await admin2.setContest(contest2);
  }

  res.send({});
});
