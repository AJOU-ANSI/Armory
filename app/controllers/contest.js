const
  express = require('express'),
  router = express.Router(),
  contestMws = require('../middlewares/contest');

module.exports = function (app) {
  app.use('/api/contests', router);
};

router.get('/',
  contestMws.selectAllContestsMw,
  contestMws.sendContestsMw
);

router.get('/byName/:contestName',
  contestMws.selectContestByNameParamMw,
  contestMws.sendContestMw
);

