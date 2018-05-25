global.config = require('./config/config');
require('express-async-errors');

const express = require('express'),
  db = require('./app/models'),
  websocket = require('./app/websocket');

const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const memoryStore = new session.MemoryStore();

// app.memoryStore = memoryStore;

if (process.env.MONGO) {
  app.sessionStore = new MongoStore({url: process.env.MONGO})
}
else {
  app.sessionStore = memoryStore;
}

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

      websocket.init(server, app.sessionStore);
    }
  }).catch(function (e) {
    throw new Error(e);
  });
