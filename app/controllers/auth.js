const express = require('express'),
  router = express.Router();
  authMws = require('../middlewares/auth');
  userMws = require('../middlewares/user');

const autoLogin = true;

// const {
//   getIpAddressMiddleware,
//   checkRecaptchaMiddleware,
//   checkLoggedInMiddleware,
//   loginMiddleware
// } = authMiddleware;
//
// const {
//   saveUserFromBodyMiddleware,
//   sendUserFromReqMiddleware
// } = userMiddleware;

module.exports = function (app) {
  app.use('/auth', router);
};

router.post('/:contestName/login',
  authMws.loginMiddleware,
  userMws.sendUserFromReqMw
);

router.post('/:contestName/logout',
  (req, res) => {
    req.logout();
    res.send({});
  }
);
//
// if (process.env.NODE_ENV === 'development') {
//   router.get('/loggedin',
//     (req, res, next) => {
//       const {user} = req;
//
//       if( !user && autoLogin ) {
//         return next();
//       }
//
//       res.send({
//         result: {user}
//       });
//     },
//     async function saveIfNotExist (req, res, next) {
//       const email = 'xodn4195@gmail.com';
//       const pwd = 'q1w2e3r4!';
//       const name = 'gaaon';
//
//       req.body = {email, pwd, name};
//
//       try {
//         await requireFrom('services/user').saveUser({email, password: pwd, name});
//         // judges = await require('mongoose').model('Judge').create({
//         //   lavida: 'xodn4195',
//         //   boj: 'wooooo',
//         //   user: user._id
//         // });
//         //
//         // await user.update({
//         //   judges: judges._id
//         // });
//       }
//       catch(e) {
//         console.error(e);
//       }
//
//       next();
//     },
//     loginMiddleware,
//     sendUserFromReqMiddleware
//   );
// }
// else {
  router.get('/:contestName/loggedin',
    userMws.checkUserWithContestNameParamMw,
    userMws.sendUserFromReqMw
  );
// }

