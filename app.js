global.config = require('./config/config');

const express = require('express'),
  db = require('./app/models'),
  websocket = require('./app/websocket');

const app = express();
const session = require('express-session');

module.exports = require('./config/express')(app, global.config);

db.sequelize
  .sync()
  .then(function () {
    let server;

    /* istanbul ignore if */
    if (!module.parent) {
      server = app.listen(config.port, function () {
        console.log('Express server listening on port ' + config.port);
      });

      websocket.init(server);
    }
  }).catch(function (e) {
    throw new Error(e);
  });

