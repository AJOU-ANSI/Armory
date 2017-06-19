import React, {Component} from 'react';
import moment from 'moment';

import './QnA.css';

export class QnA extends Component {
  render() {
    return (
      <div className="page QnA">
        <div className="page-title">
          <div className="container">
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <h1> QnA / Announcement </h1>
                <p> 질문 및 답변, 공지사항 내역 페이지입니다. </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <h5> 공지사항 </h5>

              <div className="card paper">
                <table className="table-custom table-announcement">
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>공지시간</th>
                      <th>내용</th>
                    </tr>
                  </thead>

                  <tbody>
                  <tr>
                    <td className="index">1</td>
                    <td>{moment(new Date()).format('HH:mm:ss')}</td>
                    <td>
                      따뜻한 간에 뭇 것은 무한한 때문이다. 쓸쓸한 이것이야말로 행복스럽고 운다. 군영과 되는 설레는 얼마나 칼이다. 인생에 천자만홍이 소담스러운 투명하되 불어 천하를 인간은 갑 있으랴? 얼마나 설레는 간에 풀이 하여도 뛰노는 부패뿐이다. 있는 예가 되는 모래뿐일 뭇 것은 쓸쓸하랴? 하는 그것은 천하를 것은 속에 붙잡아 그들은 바로 위하여서. 있으며, 주는 놀이 청춘을 가진 설산에서 힘차게 이 힘있다. 천하를 붙잡아 아름답고 철환하였는가 끓는 대중을 심장은 것은 피다. 예수는 찾아 우리 아니다. 이것은 광야에서 얼마나 뜨고, 아니다. 얼음 그들에게 그림자는 봄날의 동산에는 장식하는 곳이 시들어 것이다.
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <h5 className="mt-5"> 질문 및 답변 </h5>
              <div className="card paper">
                <table className="table-custom table-qna">
                  <thead>
                  <tr>
                    <th>번호</th>
                    <th>문제</th>
                    <th>답변시간</th>
                    <th>질문내용</th>
                    <th>답변내용</th>
                  </tr>
                  </thead>

                  <tbody>
                  <tr>
                    <td className="index"> 10 </td>
                    <td className="code"> A </td>
                    <td> {moment(new Date()).format('HH:mm:ss')}</td>
                    <td className="question">
                      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin
                      commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum
                      nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                    </td>
                    <td className="answer">
                      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin
                      commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum
                      nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                    </td>

                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QnA;
