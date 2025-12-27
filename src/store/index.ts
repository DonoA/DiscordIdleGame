import { createStore, applyMiddleware, compose, Store } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducers';
import { useDispatch } from 'react-redux';
import { loadState, saveState } from './persistence';
import throttle from 'lodash/throttle';
import { RootState } from '../types';
import { hydrateState, loadInitialData } from '../actions';

const middleware = [thunk];

const store: Store<RootState> = createStore(
  rootReducer,
  undefined,
  compose(
    applyMiddleware(...middleware)
  )
);

(async () => {
  const persistedState = await loadState();
  if (persistedState) {
    store.dispatch(hydrateState(persistedState));
  } else {
    store.dispatch(loadInitialData() as any);
  }
})();

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 1000));

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;