import {createAction} from 'redux-actions';
import io from 'socket.io-client';
import {toastr} from 'react-redux-toastr';
import {getUserContestInfo} from './contest';
import h5noti from '../helper/h5noti';

export const connectWebSocket = createAction('CONNECT_WEBSOCKET');
export const closeWebSocket = createAction('CLOSE_WEBSOCKET');

export const fetchCloseWebSocket = () => {
  return closeWebSocket();
};

function init(socket, dispatch) {
  // setInterval(function () {
  //   socket.emit('greeting', 'hello');
  // }, 10000);

  socket.on('connect', function () {
    console.log('connected!!!');
  })
  // socket.on('greeting_response', function (message) {
  //   console.log(message);
  // });

  socket.on('notification', function (message) {
    const msg = '새로운 공지가 등록되었습니다. 확인 부탁드립니다.';

    toastr.success('시스템 메세지', msg);
    h5noti.sendMessage(msg);
  });

  socket.on('answered', function (message) {
    const msg = '질문에 대한 답변이 등록되었습니다. 확인 부탁드립니다.';

    toastr.success('시스템 메세지', msg);
    h5noti.sendMessage(msg);
  });

  socket.on('problemChecked', function ({acceptedCnt, rank, accepted}) {
    dispatch(getUserContestInfo({acceptedCnt, rank}));

    // const msg = '문제 채점이 완료되었습니다. 확인 부탁드립니다.';

    let msg;
    if (accepted) {
      msg = '문제 채점이 완료되었습니다. 맞았습니다!!';
      toastr.success('시스템 메세지', msg);
    }
    else {
      msg = '문제 채점이 완료되었습니다. 틀렸습니다 :(';
      toastr.warning('시스템 메세지', msg);
    }

    h5noti.sendMessage(msg);
  });

  socket.on('admin_new_qna', function () {
    const msg = '새로운 qna가 도착했습니다. 확인 부탁드립니다.';

    toastr.success('시스템 메세지', msg);
    h5noti.sendMessage(msg);
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
