const
  passportSocketIo = require('passport.socketio');

let io;

const obj = {};

module.exports = obj;

function Log (msg) {
  console.info(`[websocket] ${msg}`);
}

obj.init = function (memoryStore, server) {
  io = require('socket.io')(server);

  io.use(passportSocketIo.authorize({
    secret:       config.secret,
    store:        memoryStore
  }));

  io.on('connection', function(socket) {
    const strId = socket.request.user.strId;
    const contestId = socket.request.user.ContestId;

    Log(`${strId}이 접속!`);

    socket.join(contestId, function () {
      Log(`${strId}가 ${contestId}번 방 접속!` )
    });

    socket.on('logout', function () {
      Log(`${strId}이 로그아웃!`);

      socket.disconnect();
    });

    socket.on('disconnect', function () {
      Log(`${strId}가 접속종료!`);
    });

    // socket.on('greeting', function (greeting) {
      // Log(greeting);
    // });

    setInterval(function () {
      socket.emit('greeting_response', 'annyeong');
    }, 10000);
  });

  io.on('error', function(err) {
    console.error(err);
  });
};

obj.sendNotification = function (message) {
  io.sockets.emit('notification', message);
};

obj.closeServer = function () {
  io.close();
};
