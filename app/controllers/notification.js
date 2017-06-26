const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  websocket = require('../websocket'),
  db = require('../models'),
  authMws = require('../middlewares/auth'),
  contestMws = require('../middlewares/contest');

module.exports = function (app) {
  app.use('/api/:contestName/notifications', router);
};

router.post('/',
  authMws.checkAdminMw,
  contestMws.selectContestByNameParamMw,
  async function (req, res, next) {
    const {content} = req.body;
    const {contest} = req;

    try {
      const noti = await db.Notification.create({
        content,
        ContestId: contest.id
      });

      websocket.sendNotification(contest.id, noti.content);

      return res.send({});
    }
    catch(e) {
      return next(e);
    }
  }
);

router.get('/',
  contestMws.selectContestByNameParamMw,
  async function (req, res) {
    const {contest} = req;

    const notiList = await contest.getNotifications();

    res.send({
      result: {
        notiList: notiList
      }
    })
  }
);
