import React, { Component } from 'react';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import './App.css';
import Home from "./component/Home/Home";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <h1 className="my-5"> 관리자 페이지 </h1>

          <Redirect from="/" to="/admin" />
          <Switch>
            <Route path="/admin" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
