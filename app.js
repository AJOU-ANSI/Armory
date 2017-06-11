

var express = require('express'),
  config = require('./config/config'),
  db = require('./app/models');

var app = express();

module.exports = require('./config/express')(app, config);

db.sequelize
  .sync()
  .then(function () {
    return async function () {
      const start = new Date(), end = new Date();
      start.setHours(start.getHours()-2);
      start.setMinutes(0);
      start.setSeconds(0);

      end.setHours(end.getHours()+3);
      end.setMinutes(0);
      end.setSeconds(0);

      const [contest, created] = await db.Contest.findOrCreate({where: {name: 'shake17'}, defaults: {
        name: 'shake17',
        start,
        end
      }});

      await db.Contest.findOrCreate({where: {name: 'shake17test'}, defaults: {
        name: 'shake17test',
        start,
        end
      }});

      const [user] = await db.User.findOrCreate({where: {strId: 'test01'}, defaults: {
        strId: 'test01',
        password: 'q1w2e3r4!',
      }});

      if (created) {
        await user.setContest(contest);
      }

    }()
  })
  .then(function () {
    if (!module.parent) {
      app.listen(config.port, function () {
        console.log('Express server listening on port ' + config.port);
      });
    }
  }).catch(function (e) {
    throw new Error(e);
  });

