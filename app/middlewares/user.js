// const DuplicatedError = requireFrom('errors/duplicate');
// const InvalidValueError = requireFrom('errors/invalidValue');
const UnauthorizedError = require('../errors/unauthorized');

const obj = {
  // userSvc: requireFrom('services/user')
};

const aWrap = fn => (...args) => fn(...args).catch(args[args.length - 1])

// obj.saveUserFromBodyMiddleware = async function (req, res, next) {
//   const {email, pwd, pwdCfm, name} = req.body;
//
//   if( pwd !== pwdCfm ) {
//     let e = new Error('SIGNUP.PWD.CFM_NOT_MATCHED');
//     e.status = 400;
//
//     return next(e);
//   }
//
//   try {
//     req.user = await obj.userService.saveUser({email, password: pwd, name});
//
//     return next();
//   }
//   catch (error) {
//     let e;
//
//     if( error.code === 11000 ) {
//       e = new DuplicatedError(error);
//     }
//     else if ( error.errors ) {
//       e = new InvalidValueError(error);
//     }
//     else {
//       e = new Error(error.message);
//       e.status = 500;
//     }
//
//     return next(e);
//   }
// };

obj.sendUserFromReqMw = function (req, res) {
  const {user} = req;

  res.send({
    result: {user}
  });
};

obj.checkUserWithContestNameParamMw = aWrap(async (req, res, next) => {
  const {contestName} = req.params;
  let e;

  try {
    const contest = await req.user.getContest();

    if (contest.name !== contestName) {
      throw new UnauthorizedError('해당 대회 소속이 아닙니다.');
    }
  }
  catch (err) {
    e = err;
  }

  return next(e);
});

module.exports = obj;
