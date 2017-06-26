import React, {Component} from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';

import AdminProblem from '../AdminProblem/AdminProblem';
import AdminUser from '../AdminUser/AdminUser';
import AdminNoti from "../AdminNoti/AdminNoti";
import AdminQnA from '../AdminQnA/AdminQnA';

export class AdminHome extends Component {
  render () {
    const {match: {url, path, params: {contestName}}, user} = this.props;
    const {location: {pathname}} = this.props;

    if (!user) return null;

    if (!user.isAdmin) {
      return <Redirect to={`/${contestName}`} />;
    }

    const menuList = [
      {to: `${url}/problems`, title: '문제 관리'},
      {to: `${url}/contest`, title: '콘테스트 관리'},
      {to: `${url}/users`, title: '유저 관리'},
      {to: `${url}/notifications`, title: '공지 관리'},
      {to: `${url}/qnas`, title: 'QnA 관리'}
    ];

    const subTitle = {
      [`${url}/problems`]: '문제 관리',
      [`${url}/users`]: '유저 관리',
      [`${url}/notifications`]: '공지 관리',
      [`${url}/qnas`]: 'QnA 관리'
    };

    return (
      <div className="AdminHome my-5">
        <div className="container">
          <div>
            <h2>
              Admin Page
              <small className="text-muted"> {subTitle[pathname]} </small>
            </h2>
            <Link to={`${url}`}> 홈으로 </Link>
          </div>

          <Switch>
            <Route exact path={`${path}`} render={() => (
              <div>
                <ul className="list-group">
                  {
                    menuList.map((menu, index) => (
                      <li className="list-group-item" key={index}>
                        <Link to={menu.to}> {menu.title} </Link>
                      </li>
                    ))
                  }
                </ul>
              </div>
            )} />

            <Route path={`${path}/problems`} component={AdminProblem} />
            <Route path={`${path}/users`} component={AdminUser} />
            <Route path={`${path}/notifications`} component={AdminNoti} />
            <Route path={`${path}/qnas`} component={AdminQnA} />
          </Switch>
        </div>
      </div>

    );
  }
}

const stateToProps = ({user}) => ({user});

export default connect(stateToProps)(AdminHome);
