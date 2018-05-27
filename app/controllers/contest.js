const
  express = require('express'),
  router = express.Router({}),
  config = require('../../config/config'), // eslint-disable-line
  db = require('../models'),
  contestMws = require('../middlewares/contest'),
  adminMws = require('../middlewares/admin');

module.exports = function (app) {
  app.use('/api/contests', router);
};

router.get('/byDefault', function (req, res) {
  console.log(process.env.DEFAULT_CONTEST);

  res.status(200).send({
    result: {
      contestName: process.env.DEFAULT_CONTEST || ''
    }
  });
});

router.get('/',
  contestMws.selectAllContestsMw,
  contestMws.sendContestsMw
);

router.get('/byName/:contestName',
  contestMws.selectContestByNameParamMw,
  contestMws.sendContestMw
);

router.post('/',
  adminMws.checkSuperAdminTokenMw,
  async function createContest(req, res) {
    const {name, start, end, rankServer} = req.body;

    let startValue = new Date(start);
    let endValue = new Date(end);

    let createContest;
    try {
      createContest = await db.Contest.create({name, start: startValue, end: endValue, rankServer});
    }
    catch (e) {
      const err = new Error(e.message);
      err.status = 500;

      if (e.name && e.name === 'SequelizeUniqueConstraintError') {
        err.status = 400;
      }

      throw err;
    }

    return res.send({result: {contest: createContest}});
  }
);
