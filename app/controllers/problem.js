const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  authMws = require('../middlewares/auth'),
  problemMws = require('../middlewares/problem'),
  contestMws = require('../middlewares/contest');

module.exports = (app) => {
  app.use('/api/:contestName/problems', router);
};

router.get('/',
  authMws.checkLoggedInMw,
  contestMws.selectContestByNameParamMw,
  contestMws.checkContestOpenedOrAdminMw,
  problemMws.selectProblemListByContestMw,
  problemMws.sendProblemListMw
);

router.get('/:problemCode',
  authMws.checkLoggedInMw,
  contestMws.selectContestByNameParamMw,
  contestMws.checkContestOpenedOrAdminMw,
  problemMws.selectProblemByContestAndProblemCodeParamMw,
  problemMws.sendProblemMw
);

router.post('/',
  authMws.checkAdminMw,
  contestMws.selectContestByNameParamMw,
  problemMws.saveProblemFromBodyWithContestMw,
  problemMws.sendProblemMw
);
