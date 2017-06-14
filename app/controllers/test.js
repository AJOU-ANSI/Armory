const
  express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/api/test', router);
};

router.get('/init_db', async function (req, res) {
  const start = new Date(), end = new Date();
  start.setHours(start.getHours()-2);
  start.setMinutes(0);
  start.setSeconds(0);

  end.setHours(end.getHours()+3);
  end.setMinutes(0);
  end.setSeconds(0);

  const [contest, created] = await db.Contest.findOrCreate({where: {name: 'shake17'}, defaults: {
    name: 'shake17',
    start,
    end
  }});

  await db.Contest.findOrCreate({where: {name: 'shake17test'}, defaults: {
    name: 'shake17test',
    start,
    end
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

  res.send({});
});
