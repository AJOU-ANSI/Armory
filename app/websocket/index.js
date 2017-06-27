const
  passportSocketIo = require('passport.socketio'),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  redis = require('redis'),
  client = redis.createClient({host: config.redisHost, port: config.redisPort});

let io;

const obj = {};

module.exports = obj;

function Log (msg) {
  console.info(`[websocket] ${msg}`);
}

const userSocketMap = {};

function addSocketToMap (userId, socketId) {
  if (userSocketMap[userId]) {
    userSocketMap[userId].push(socketId);
  }
  else {
    userSocketMap[userId] = [socketId];
  }
}

function removeSocketFromMap (userId, socketId) {
  if (!userSocketMap[userId]) {
    return;
  }

  const index = userSocketMap[userId].indexOf(socketId);

  if (index !== -1) userSocketMap[userId].splice(index, 1);
}

obj.init = function (server) {
  io = require('socket.io')(server);

  io.use(passportSocketIo.authorize({
    secret:       config.secret,
    store:        new RedisStore({client})
  }));

  io.on('connection', function(socket) {
    const {strId, ContestId: contestId, id: userId} = socket.request.user;

    addSocketToMap(userId, socket.id);

    Log(`${strId}이 접속!`);

    socket.join(contestId, function () {
      Log(`${strId}가 ${contestId}번 방 접속!` )
    });

    socket.on('logout', function () {
      Log(`${strId}이 로그아웃!`);

      socket.disconnect();
    });

    socket.on('disconnect', function () {
      removeSocketFromMap(userId, socket.id);

      Log(`${strId}가 접속종료!`);
    });

    setInterval(function () {
      socket.emit('greeting_response', 'annyeong');
    }, 10000);
  });

  io.on('error', function(err) {
    console.error(err);
  });

  setTimeout(function () {
    obj.sendNotification(3, 'Hello World');

  }, 5000);
};

obj.sendNotification = function (contestId, message) {
  io.to(contestId).emit('notification', message);
};

obj.closeServer = function () {
  io.close();
};

obj.sendQnaAnswered = function (userId) {
  if (userSocketMap[userId]) {
    userSocketMap[userId].forEach(socketId => {
      io.sockets.connected[socketId].emit('answered', 'hello');
    });
  }
};

obj.sendProblemChecked = function (userId, {acceptedCnt, rank}) {
  if (userSocketMap[userId]) {
    userSocketMap[userId].forEach(socketId => {
      io.sockets.connected[socketId].emit('problemChecked', {acceptedCnt, rank});
    });
  }
}
