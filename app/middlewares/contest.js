const obj = {
  contestSvc: require('../services/contest')
};

module.exports = obj;

obj.selectAllContestsMw = async (req, res, next) => {
  let e;

  try {
    req.contestList = await obj.contestSvc.selectAllContests();
  }
  catch (err) {
    e = err;
  }

  return next(e);
};

obj.selectContestByNameParamMw = async (req, res, next) => {
  let e;

  try {
    req.contest = await obj.contestSvc.selectContestByName(req.params.contestName);
  }
  catch (err) {
    e = err;
  }

  return next(e);
};

obj.sendContestsMw = async (req, res) => {
  return res.send({
    result: {
      contest_list: req.contestList
    }
  });
};

obj.sendContestMw = async (req, res) => {
  return res.send({
    result: {
      contest: req.contest
    }
  })
};
