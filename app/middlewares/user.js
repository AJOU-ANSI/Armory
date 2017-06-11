// const DuplicatedError = requireFrom('errors/duplicate');
// const InvalidValueError = requireFrom('errors/invalidValue');

const obj = {
  // userSvc: requireFrom('services/user')
};

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

obj.checkUserWithContestNameParamMw = async (req, res, next) => {
  if (req.user) {
    const {contestName} = req.params;

    try {
      const contest = await req.user.getContest();

      if (contest.name !== contestName) {
        delete req.user;
      }
    }
    catch (e) {
      return next(e);
    }


  }

  return next();
}

module.exports = obj;
