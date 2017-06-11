const
  express = require('express'),
  glob = require('glob'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  passport= require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  db = require('../app/models');

module.exports = function(app, config) {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  app.set('x-powered-by', false);

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  /** -------------- session config ----------------- **/
  const sess = {
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {},
    // store: new MongoStore({
    //   mongooseConnection: mongoose.connection
    // })
  };

  // if (env === 'production') {
  //   app.set('trust proxy', 1); // trust first proxy
  //   sess.cookie.secure = true; // serve secure cookies
  // }

  app.use(session(sess));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    {
      usernameField : 'userId',
      passwordField : 'userPwd',
      passReqToCallback: true
    },
    function(req, userId, userPwd, done) {
      const {contestName} = req.params;

      db.Contest.findOne({where: {name: contestName}})
        .then(contest => {
          if (contest === null) {
            throw new Error('No such contest');
          }

          return contest.getUsers({where: {strId: userId}});
        })
        .then(users => {
          const user = users[0];

          if (!user) {
            throw new Error('No such user');
          }

          const valid = user.validatePassword(userPwd);

          if (!valid) {
            throw new Error('No valid password');
          }

          return done(null, user);
        })
        .catch(err => {
          console.error(err);
          return done(err);
        });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.User.findOne({where: {id}})
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        console.error(err);
        done(err);
      })
  });
  /** -------------- session end ------------------ **/

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use('/api', function (req, res) {
    if (!res.headerSent) {
      res.status(404).send({message: 'Not Found'});
    }
  });

  app.use(function (req, res) {
    res.sendFile(config.root + '/public/index.html');
  });

  // app.use(function (req, res, next) {
  //   var err = new Error('Not Found');
  //   err.status = 404;
  //   next(err);
  // });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  return app;
};
