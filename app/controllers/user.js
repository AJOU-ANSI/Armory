const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  multer = require('multer'),
  authMws = require('../middlewares/auth'),
  contestMws = require('../middlewares/contest'),
  userMws = require('../middlewares/user'),
  adminMws = require('../middlewares/admin'),
  upload = multer(),
  db = require('../models'),
  request = require('request-promise-native');

module.exports = (app) => {
  app.use('/api/:contestName/users', router);
};

router.post('/',
  authMws.checkAdminMw,
  upload.single('user_file'),
  contestMws.selectContestByNameParamMw,
  userMws.saveUserWithContestAndCsvFile,
  userMws.sendUserListFromReqMw
);

router.get('/',
  authMws.checkAdminMw,
  contestMws.selectContestByNameParamMw,
  userMws.selectAllUsersExceptAdminByContestMw,
  userMws.sendUserListFromReqMw
);

const infoUrl = '/api/acceptedCnts';

router.post('/admin',
  adminMws.checkSuperAdminTokenMw,
  contestMws.selectContestByNameParamMw,
  async function(req, res) {
    const {strId, password} = req.body;
    const {contest} = req;

    if (contest === null) {
      const err = new Error('해당 컨테스트는 존재하지 않습니다.');
      err.status = 400;

      throw err;
    }

    const createAdminUser = await db.User.create({strId, password, isAdmin: true});
    await contest.addUser(createAdminUser);

    return res.status(200).send({result: {user: createAdminUser}});
  }
);

router.get('/:userId/contestInfo',
  async function (req, res) {
    const {userId} = req.params;

    if (process.env.NODE_ENV === 'development') {
      return res.send({
        "result": {
          "rank": 1,
          "acceptedCnt": 1,
        }
      })
    }

    const uri = `${global.config.rankServer}${infoUrl}/${userId}`;

    try {
      const ret = await request({
        uri,
        json: true,
      });

      return res.send({result: {
        rank: ret.rank,
        acceptedCnt: ret.acceptedCnt
      }});
    }
    catch (e) {
      return res.status(400).send({});
    }
  }
);
