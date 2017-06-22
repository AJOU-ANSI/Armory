const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  multer = require('multer'),
  authMws = require('../middlewares/auth'),
  contestMws = require('../middlewares/contest'),
  userMws = require('../middlewares/user'),
  upload = multer();

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
)
