import {createAction} from 'redux-actions';
import io from 'socket.io-client';

export const connectWebSocket = createAction('CONNECT_WEBSOCKET');

function init(socket) {
  setInterval(function () {
    socket.emit('greeting', 'hello');
  }, 10000);
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

      init(socket);

      return dispatch(connectWebSocket(socket));
    }
    catch(e) {
      return dispatch(connectWebSocket(e));
    }
  };
};
