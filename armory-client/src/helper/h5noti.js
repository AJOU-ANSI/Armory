let activate = false;

const obj = {};

export default obj;

obj.init = () => {
  Notification.requestPermission(function (result) {
    if (result !== 'denied') {
      activate = true;
    }
  });
};

obj.sendMessage = (message) => {
  if (activate) {
    const options = {
      body: message
    };

    //데스크탑 알림 요청
    const notification = new Notification("shake17 서비스 메세지", options);

    //알림 후 5초 뒤,
    setTimeout(function () {
      //얼람 메시지 닫기
      notification.close();
    }, 5000);
  }
};
