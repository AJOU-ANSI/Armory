const obj = {
  contestSvc: require('../services/contest')
};

module.exports = obj;

const aWrap = fn => (...args) => fn(...args).catch(args[args.length - 1])

obj.selectAllContestsMw = aWrap(async (req, res, next) => {
  let e;

  try {
    req.contestList = await obj.contestSvc.selectAllContests();
  }
  catch (err) /* istanbul ignore next */ {
    console.error(err);
    e = err;
  }

  return next(e);
});

obj.selectContestByNameParamMw = aWrap(async (req, res, next) => {
  let e;

  try {
    req.contest = await obj.contestSvc.selectContestByName(req.params.contestName);
  }
  catch (err) /* istanbul ignore next */ {
    console.error(err);
    e = err;
  }

  return next(e);
});

obj.sendContestsMw = (req, res) => {
  res.send({
    result: {
      contest_list: req.contestList
    }
  });
};

obj.sendContestMw = (req, res) => {
  res.send({
    result: {
      contest: req.contest
    }
  })
};

obj.checkContestOpenedOrAdminMw = aWrap(async (req, res, next) => {
  const {contest, user} = req;
  const now = (new Date()).getTime();

  if (user.isAdmin) return next();

  let e;

  try {
    if (contest.start > now ) { // contest not opened
      const error = new Error('대회가 아직 열리지 않았습니다.');
      error.status = 400;

      throw error;
    }
  }
  catch(err) {
    e = err;
  }

  return next(e);
});
