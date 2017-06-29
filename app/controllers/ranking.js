const
  express = require('express'),
  router = express.Router({mergeParams: true}),
  request = require('request');

module.exports = (app) => {
  app.use('/api/:contestName/ranking', router);
}

let rankServer = 'http://localhost:8080';

if (process.env.NODE_ENV === 'production') {
  rankServer = 'http://rank1:8080';
}

const rankUrl = (c) => `${rankServer}/api/${c}/ranking`;

router.get('/', function (req, res) {
  const {contestName} = req.params;

  request({
    uri: rankUrl(contestName),
    json: true,
  }, function (err, r, rankData) {
    if (err) {
      return res.status(400).send({});
    }

    res.send({
      result: {rankData}
    });
  });
})
