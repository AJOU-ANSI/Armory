import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

// import registerServiceWorker from './registerServiceWorker';
import App from './App';
import './index.css';
import './themify-icons.css';
import configureStore from './store/configureStore';

let store = configureStore();

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root')
);
// registerServiceWorker();
