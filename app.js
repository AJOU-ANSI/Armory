var express = require('express'),
  config = require('./config/config'),
  db = require('./app/models'),
  websocket = require('./app/websocket');

const app = express();
const session = require('express-session');

const memoryStore = new session.MemoryStore();

require('./config/express')(app, config, {memoryStore});
module.exports = app;
app.memoryStore = memoryStore;

db.sequelize
  .sync()
  .then(function () {
    let server;

    /* istanbul ignore if */
    if (!module.parent) {
      server = app.listen(config.port, function () {
        console.log('Express server listening on port ' + config.port);
      });

      websocket.init(memoryStore, server);
    }
  }).catch(function (e) {
    throw new Error(e);
  });

