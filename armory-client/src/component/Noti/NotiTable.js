import React, {Component} from 'react';
import moment from 'moment';

export class NotiTable extends Component {
  render() {
    const {notiList} = this.props;

    return (
      <table className="table-custom table-announcement">
        <thead>
        <tr>
          <th style={{minWidth: '80px'}}>번호</th>
          <th>공지시간</th>
          <th>내용</th>
        </tr>
        </thead>

        <tbody>
        {
          notiList.map((noti, index) => (
            <tr key={index}>
              <td className="index"> {index+1} </td>
              <td>{moment(noti.createdAt).format('HH:mm:ss')}</td>
              <td>
                <pre style={{whiteSpace: 'pre-line'}}>{noti.content}</pre>
              </td>
            </tr>
          ))
        }
        </tbody>
      </table>
    )
  }
}

export default NotiTable
