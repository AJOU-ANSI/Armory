import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

export default function configureStore() {

  let middlewares = [thunk];

  if( process.env.NODE_ENV !== 'production' ) {
    middlewares.push(logger);
  }

  return createStore(
    rootReducer,
    compose(
      applyMiddleware(...middlewares)
    )
  );
}
