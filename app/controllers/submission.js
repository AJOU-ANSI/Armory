const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  authMws = require('../middlewares/auth'),
  contestMws = require('../middlewares/contest'),
  problemMws = require('../middlewares/problem'),
  submissionMws = require('../middlewares/submission'),
  websocket = require('../websocket'),
  db = require('../models');

module.exports = function (app) {
  app.use('/api/:contestName/submissions', router);
};

router.post('/checked',
  contestMws.selectContestByNameParamMw,
  async function (req, res) {
    const {results: checkedSubmissions} = req.body;

    for (let i = 0; i < checkedSubmissions.length ; i++) {
      const {userId, acceptedCnt, rank, lastSubId} = checkedSubmissions[i];

      const lastSub = await db.Submission.findById(lastSubId);

      let accepted = null;
      if (lastSub !== null) {
        accepted = lastSub.result === 4;
      }

      websocket.sendProblemChecked(userId, {acceptedCnt, rank, accepted});
    }

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
  contestMws.selectContestByNameParamMw,
  submissionMws.selectSubmissionListByContestMw,
  submissionMws.sendSubmissionListMw
);
