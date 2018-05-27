const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  request = require('request'),
  contestMws = require('../middlewares/contest');

module.exports = (app) => {
  app.use('/api/:contestName/ranking', router);
};

router.get('/',
  contestMws.selectContestRankServerByNameParamMw,
  function (req, res) {
    const {contestName} = req.params;
    const {contestRankServer} = req;

    request({
      uri: `${contestRankServer}/api/${contestName}/ranking`,
      json: true,
    }, function (err, r, rankData) {
      if (err) {
        return res.status(400).send({});
      }

      res.send({
        result: {rankData}
      });
    });
});
