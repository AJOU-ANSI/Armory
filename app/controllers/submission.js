const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  authMws = require('../middlewares/auth'),
  contestMws = require('../middlewares/contest'),
  problemMws = require('../middlewares/problem'),
  submissionMws = require('../middlewares/submission');

module.exports = function (app) {
  app.use('/api/:contestName/submissions', router);
};

router.post('/:problemCode',
  authMws.checkLoggedInMw,
  contestMws.selectContestByNameParamMw,
  contestMws.checkContestOpenedOrAdminMw,
  problemMws.selectProblemByContestAndProblemCodeParamMw,
  submissionMws.saveSubmissionWithContestAndProblemMw,
  submissionMws.sendSubmissionMw
);

router.get('/',
  authMws.checkLoggedInMw,
  submissionMws.selectSubmissionListByUserMw,
  submissionMws.sendSubmissionListMw
);

