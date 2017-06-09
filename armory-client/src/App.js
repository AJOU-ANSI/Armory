import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {Switch} from 'react-router';

import './App.css';

import Header from './include/Header/Header';
import Footer from './include/Footer/Footer';
import Home from './component/Home/Home';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header />

          <div>
            <Switch>
              <Route path="/" component={Home} />
            </Switch>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
