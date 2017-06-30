const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  db = require('../models'),
  authMws = require('../middlewares/auth'),
  contestMws = require('../middlewares/contest'),
  websocket = require('../websocket');

module.exports = function (app) {
  app.use('/api/:contestName/qnas', router);
};

router.post('/',
  authMws.checkLoggedInMw,
  contestMws.selectContestByNameParamMw,
  contestMws.checkContestOpenedOrAdminMw,
  async function (req, res, next) {
    const {contest, user} = req;
    const {question, problemCode} = req.body;

    try {
      req.qna = await db.Qna.create({
        question,
        problemCode,
        ContestId: contest.id,
        UserId: user.id
      });

      websocket.sendNewQna();

      return next();
    }
    catch(e) {
      return next(e);
    }
  },
  async function (req, res) {
    const {qna} = req;

    res.send({
      result: {
        qna
      }
    });
  }
);

router.put('/:qnaId',
  authMws.checkAdminMw,
  async function (req, res, next) {
    const {qnaId} = req.params;

    try {
      req.qna = await db.Qna.findById(qnaId);

      return next();
    }
    catch(e) {
      return next(e);
    }
  },
  async function (req, res, next) {
    const {qna} = req;
    const {answer} = req.body;

    try {
      await qna.update({
        answer
      });

      websocket.sendQnaAnswered(qna.UserId);

      res.send({});
    }
    catch(e) {
      return next(e);
    }
  }
);

router.get('/admin',
  authMws.checkAdminMw,
  contestMws.selectContestByNameParamMw,
  async function (req, res, next) {
    const {contest} = req;

    try {
      req.qnaList = await contest.getQnas({include: db.User});

      return next();
    }
    catch(e) {
      return next(e);
    }
  },
  function (req, res) {
    const {qnaList} = req;

    res.send({
      result: {
        qna_list: qnaList
      }
    });
  }
);

router.get('/',
  authMws.checkLoggedInMw,
  async function (req, res, next) {
    const {user} = req;

    try {
      req.qnaList = await user.getQnas();

      return next();
    }
    catch(err) {
      return next(err);
    }
  },
  function (req, res) {
    const {qnaList} = req;

    res.send({
      result: {
        qna_list: qnaList
      }
    });
  }
);
