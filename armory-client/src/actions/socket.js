import {createAction} from 'redux-actions';
import io from 'socket.io-client';
import {toastr} from 'react-redux-toastr';
import {getUserContestInfo} from './contest';

export const connectWebSocket = createAction('CONNECT_WEBSOCKET');
export const closeWebSocket = createAction('CLOSE_WEBSOCKET');

export const fetchCloseWebSocket = () => {
  return closeWebSocket();
};

function init(socket, dispatch) {
  setInterval(function () {
    socket.emit('greeting', 'hello');
  }, 10000);

  socket.on('connect', function () {
    console.log('connected!!!');
  })
  socket.on('greeting_response', function (message) {
    console.log(message);
  });

  socket.on('notification', function (message) {
    toastr.success('시스템 메세지', '새로운 공지가 등록되었습니다. 확인 부탁드립니다.');
  });

  socket.on('answered', function (message) {
    toastr.success('시스템 메세지', '질문에 대한 답변이 등록되었습니다. 확인 부탁드립니다.');
  });

  socket.on('problemChecked', function ({acceptedCnt, rank}) {
    dispatch(getUserContestInfo({acceptedCnt, rank}));

    toastr.success('시스템 메세지', '문제 채점이 완료되었습니다. 확인 부탁드립니다.');
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
