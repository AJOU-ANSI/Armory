import {createAction} from 'redux-actions';
import io from 'socket.io-client';

export const connectWebSocket = createAction('CONNECT_WEBSOCKET');
export const closeWebSocket = createAction('CLOSE_WEBSOCKET');

export const fetchCloseWebSocket = () => {
  return closeWebSocket();
};

function init(socket, dispatch) {
  console.log('connect init');

  setInterval(function () {
    socket.emit('greeting', 'hello');
  }, 10000);

  socket.on('connect', function () {
    console.log('connected!!!');
  })
  socket.on('greeting_response', function (message) {
    console.log(message);
  });

  socket.on('disconnect', function () {
    console.log('disconnected!!!');
    dispatch(fetchCloseWebSocket());
  });
}

export const fetchConnectWebSocket = () => {
  return async (dispatch) => {
    const socket = io();

    try {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(function () {
          reject(new Error('WebSocket Timeout'));
        }, 5000);

        socket.on('connect', function () {
          clearTimeout(timer);
          resolve();
        });
      });

      init(socket, dispatch);

      return dispatch(connectWebSocket(socket));
    }
    catch(e) {
      return dispatch(connectWebSocket(e));
    }
  };
};
