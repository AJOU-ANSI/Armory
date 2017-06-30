const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  authMws = require('../middlewares/auth'),
  contestMws = require('../middlewares/contest'),
  problemMws = require('../middlewares/problem'),
  submissionMws = require('../middlewares/submission'),
  websocket = require('../websocket');

module.exports = function (app) {
  app.use('/api/:contestName/submissions', router);
};

router.post('/checked',
  contestMws.selectContestByNameParamMw,
  async function (req, res) {
    const {results: checkedSubmissions} = req.body;

    checkedSubmissions.forEach(({userId, acceptedCnt, rank}) => {
      websocket.sendProblemChecked(userId, {acceptedCnt, rank});
    });

    return res.send({});
  }
);

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
  submissionMws.sendSubmissionListWithoutResultMessageMw
);

router.get('/admin',
  authMws.checkAdminMw,
  submissionMws.selectContestByNameParamMw,
  submissionMws.selectSubmissionListByContestMw,
  submissionMws.sendSubmissionListMw
);
