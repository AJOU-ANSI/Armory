const UnauthorizedError = require('../errors/unauthorized');

const obj = {
  passport: require('passport')
};

obj.checkLoggedInMw = function (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  else {
    let err = new UnauthorizedError('로그인이 필요합니다.');

    // const {contestName} = req.params;

    // if( req.baseUrl + req.path === `/auth/${contestName}/loggedin` ) {
    //   err.status = 200;
    // }

    return next(err);
  }
};

obj.checkAdminMw = function (req, res, next) {
  if(req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }

  else {
    let err = new UnauthorizedError('어드민 로그인이 필요합니다.');

    return next(err);
  }
};

obj.loginMw = function (req, res, next) {
  obj.passport.authenticate('local', function(err, user) {
    if (!user) {
      let e = new Error(err.message);
      e.status = 401;

      return next(e);
    }

    else {
      req.login(user, (err) => {
        if (err) return next(err);

        req.user = user;
        return next();
      });
    }

  })(req, res, next);

};

module.exports = obj;
