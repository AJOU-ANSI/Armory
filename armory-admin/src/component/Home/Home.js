import React, {Component} from 'react';
import {Link} from "react-router-dom";

export class Home extends Component {
  render () {
    const {match: {path}} = this.props;
    return (
      <div className="Home">
        <div className="container">

          <ul className="list-group">
            <li className="list-group-item">
              <Link to={`${path}/contests`}> 콘테스트 관리 </Link>
            </li>

            <li className="list-group-item">
              <Link to={`${path}/problems`}> 문제 관리 </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
