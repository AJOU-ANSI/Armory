const
  express = require('express'),
  router = express.Router(),
  websocket = require('../websocket');

module.exports = function (app) {
  app.use('/api/notifications', router);
};

router.post('/',
  function (req, res) {
    const {message} = req.body;

    websocket.sendNotification(message);

    res.send({});
  }
);
