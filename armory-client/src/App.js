import React, { Component } from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import './App.css';

import NotFound from './component/NotFound/NotFound';
import Contest from './component/Contest/Contest';
import ContestList from './component/ContestList/ContestList';

import 'codemirror/mode/clike/clike';

class App extends Component {
  state = {
    contestName: null
  };
  async componentWillMount() {
    const resp = await fetch('/api/contests/byDefault', {
      method: 'GET',
      credentials: 'include'
    });

    if (resp.ok) {
      const {result: {contestName}} = await resp.json();

      this.setState({contestName});
    }
  }
  render() {
    if (this.state.contestName === null) {
      return (
        <div> 메인 콘테스트 탐색중... </div>
      );
    }

    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            {this.state.contestName.length > 0 && <Redirect from="/" to={`/${this.state.contestName}`}/>}
            <Route path="/contests" component={ContestList} />
            <Route path="/:contestName" component={Contest} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
