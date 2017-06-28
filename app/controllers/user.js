const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  multer = require('multer'),
  authMws = require('../middlewares/auth'),
  contestMws = require('../middlewares/contest'),
  userMws = require('../middlewares/user'),
  upload = multer(),
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


let rankServer = 'http://localhost:8080';
if (process.env.NODE_ENV === 'production') {
  rankServer = 'http://rank1:8080';
}

const infoUrl = '/api/acceptedCnts';

router.get('/:userId/contestInfo',
  async function (req, res, next) {
    const {userId} = req.params;

    const uri = `${rankServer}${infoUrl}/${userId}`;

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
      return next(e);
    }
  }
);
