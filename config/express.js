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
  // RedisStore = require('connect-redis')(session),
  // redis = require('redis'),
  // client = redis.createClient({host: config.redisHost, port: config.redisPort});


module.exports = function(app, config) {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.use(function (req, res, next) {
    const originSchemeFromLB = req.header('X-Forwarded-Proto');
    if (originSchemeFromLB && originSchemeFromLB === 'http') {
      return res.redirect("https://" + req.headers.host + req.url);
    }

    next();
  });

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
    cookie: {
      maxAge: 1000 * 60 * 60 * 7
    },
    store: app.memoryStore,
    // store: new RedisStore({
    //   client
    // })
    // store: new MongoStore({
    //   mongooseConnection: mongoose.connection
    // })
  };

  if (env === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

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

      return db.Contest.findOne({where: {name: contestName}})
        .then(contest => {
          if (contest === null) {
            throw new Error('존재하지 않는 대회입니다.');
          }

          return contest.getUsers({where: {strId: userId}});
        })
        .then(users => {
          const user = users[0];

          if (!user) {
            throw new Error('아이디 혹은 비밀번호가 잘못되었습니다.');
          }

          const valid = user.validatePassword(userPwd);

          if (!valid) {
            throw new Error('아이디 혹은 비밀번호가 잘못되었습니다.');
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


  /** -------------- websocket.io start -------------- **/
  // const server = require('http').Server(app);
  // const io = require('websocket.io')(server);

  // io.use(passportSocketIo.authorize({
  //   cookieParser: cookieParser,       // the same middleware you registrer in express
  //   key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
  //   secret:       config.secret,    // the session_secret to parse the cookie
  //   store:        memoryStore
  // }));

  // io.set('origins', 'http://localhost:3000');
  // //
  // io.on('connection', function(websocket) {
  //   console.log(websocket.request.user);
  //
  //   setInterval(function () {
  //     console.log('hi');
  //     websocket.emit('news', {hello: 'hi'});
  //   }, 5000);
  // });
  /** -------------- websocket.io end -------------- **/

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use('/hello', function (req, res) {
    res.status(200).end();
  });

  app.use('/api', function (req, res) {
    if (!res.headerSent) {
      res.status(404).send({message: 'Not Found'});
    }
  });

  app.use('/auth', function (req, res) {
    if (!res.headerSent) {
      res.status(404).send({message: 'Not Found'});
    }
  });

  app.use(function (req, res) {
    if (req.accepts('html')) {
      res.sendFile(config.root + '/public/index.html');
    }
  });

  // app.use(function (req, res, next) {
  //   var err = new Error('Not Found');
  //   err.status = 404;
  //   next(err);
  // });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      console.log(err);

      res.status(err.status || 500);
      res.send({
        message: err.message
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    console.error(err);
    res.send({
      message: err.message
    });
  });

  return app;
};
