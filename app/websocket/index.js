const
  config = require('../../config/config'),
  passportSocketIo = require('passport.socketio');

let io;

exports.init = function (memoryStore, server) {
  io = require('socket.io')(server);

  io.use(passportSocketIo.authorize({
    secret:       config.secret,
    store:        memoryStore
  }));

  io.on('connection', function(socket) {
    const strId = socket.request.user.strId;
    const contestId = socket.request.user.ContestId;

    console.log(`[user] ${strId}이 접속!`);

    socket.join(contestId, function () {
      console.log(`[user] ${strId}가 ${contestId}번 방 접속!` )
    });

    socket.on('logout', function () {
      console.log(`[user] ${strId}이 로그아웃!`);

      socket.disconnect();
    });

    socket.on('disconnect', function () {
      console.log(`[user] ${strId}가 접속종료!`);
    });

    socket.on('greeting', function (greeting) {
      console.log(greeting);
    });
  });

  io.on('error', function(err) {
    console.error(err);
  });
};

exports.sendNotification = function (message) {
  io.sockets.emit('notification', message);
};

exports.closeServer = function () {
  io.close();
};
