// const DuplicatedError = requireFrom('errors/duplicate');
// const InvalidValueError = requireFrom('errors/invalidValue');
const UnauthorizedError = require('../errors/unauthorized');

const obj = {
  // userSvc: requireFrom('services/user')
};

obj.sendUserFromReqMw = function (req, res) {
  const {user} = req;

  res.send({
    result: {user}
  });
};

obj.checkUserWithContestNameParamMw = async (req, res, next) => {
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
};

module.exports = obj;
