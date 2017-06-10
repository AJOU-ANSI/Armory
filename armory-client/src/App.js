import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './App.css';

import Header from './include/Header/Header';
import Footer from './include/Footer/Footer';
import Home from './component/Home/Home';
import ProblemList from './component/ProblemList/ProblemList';
import NotFound from './component/NotFound/NotFound';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header />

          <div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/problems" component={ProblemList} />
              <Route component={NotFound} />
            </Switch>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
