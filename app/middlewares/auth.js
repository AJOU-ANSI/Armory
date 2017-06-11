const obj = {
  passport: require('passport')
};

// obj.getIpAddressMiddleware = function (req, res, next) {
//   req.remoteip = obj.authService.getIpAddressByReq(req);
//
//   next();
// };
//
// obj.checkRecaptchaMiddleware = async function (req, res, next) {
//   let e;
//
//   try {
//     const resp = await obj.authService.getRecaptchaResponseByReq(req);
//
//     if (!resp.success) {
//       e = new RecaptchaFailError();
//     }
//   }
//   catch(err) {
//     e = err;
//   }
//
//   return next(e);
// };

// obj.checkLoggedInMiddleware = function (req, res, next) {
//   if(req.isAuthenticated()) {
//     return next();
//   }
//
//   else {
//     let err = new UnauthorizedError('로그인이 필요합니다.');
//
//     if( req.baseUrl + req.path === '/auth/loggedin' ) {
//       err.status = 200;
//     }
//
//     return next(err);
//   }
// };

obj.loginMiddleware = function (req, res, next) {
  obj.passport.authenticate('local', function(err, user) {
    if (!user) {
      let e = new Error('로그인에 실패했습니다.');
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
