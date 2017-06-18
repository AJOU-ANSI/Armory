const
  express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/hook', router);
}

router.get('/',
  function(req, res, next) {
    const {token} = req.query;

    if (token !== config.token) {
      return res.status(401).send({message: 'Unauthorized token'});
    }

    return next();
  },
  function(req, res) {
    const {submission_id} = req.query;

    res.send({
      message: `서브미션 ${submission_id}에 변화를 감지`
    });
  }
)
