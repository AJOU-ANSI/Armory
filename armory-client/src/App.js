import React, { Component } from 'react';
import {BrowserRouter, Link, Redirect, Route, Switch} from 'react-router-dom';

import './App.css';

import NotFound from './component/NotFound/NotFound';
import Contest from './component/Contest/Contest';
import ContestList from './component/ContestList/ContestList';

import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';

class App extends Component {
  state = {
    contestName: null
  };
  async componentWillMount() {
    // Remove main component
    // const resp = await fetch('/api/contests/byDefault', {
    //   method: 'GET',
    //   credentials: 'include'
    // });
    //
    // if (resp.ok) {
    //   const {result: {contestName}} = await resp.json();
    //
    //   this.setState({contestName});
    // }
  }
  render() {
    const contests = [
      {title: 'shake! 2018 final', code: 'shake2018_final'},
    ];

    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            {/*{this.state.contestName.length > 0 && <Redirect exact from="/" to={`/${this.state.contestName}`}/>}*/}
            {/*<Route path="/contests" component={ContestList} />*/}
            <Route path="/" exact render={() => (
              <div className={"container"}>
                <h1>
                  SHAKE 컨테스트 안내
                </h1>
                <ul>
                  {
                    contests.map((contest, idx) => (
                      <li key={idx}>
                        <Link to={`/${contest.code}`}> {contest.title} </Link>
                      </li>
                    ))
                  }
                </ul>
              </div>)} />
            <Route path="/:contestName" component={Contest} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
