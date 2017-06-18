const express = require('express'),
  router = express.Router({mergeParams: true}),
  authMws = require('../middlewares/auth'),
  userMws = require('../middlewares/user');

// const autoLogin = true;

module.exports = function (app) {
  app.use('/auth/:contestName', router);
};

router.post('/login',
  authMws.loginMw,
  userMws.sendUserFromReqMw
);

router.post('/logout',
  authMws.checkLoggedInMw,
  userMws.checkUserWithContestNameParamMw,
  (req, res) => {
    req.logout();
    res.send({});
  }
);

if (process.env.NODE_ENV === 'development') {
  router.get('/loggedin',
    (req, res, next) => {
      req.body = {userId: 'admin03', userPwd: 'q1w2e3r4!'};

      next();
    },
    authMws.loginMw,
    userMws.sendUserFromReqMw
  );
}
else {
  router.get('/loggedin',
    authMws.checkLoggedInMw,
    userMws.checkUserWithContestNameParamMw,
    userMws.sendUserFromReqMw
  );
}

