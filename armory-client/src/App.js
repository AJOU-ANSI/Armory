import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

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
            <Route exact path="/contests" component={ContestList} />
            <Route exact path="/:contestName" component={Contest} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
