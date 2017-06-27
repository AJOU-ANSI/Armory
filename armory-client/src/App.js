import React, { Component } from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import './App.css';

import NotFound from './component/NotFound/NotFound';
import Contest from './component/Contest/Contest';
import ContestList from './component/ContestList/ContestList';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Redirect exact from="/" to="/2017final" />
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
