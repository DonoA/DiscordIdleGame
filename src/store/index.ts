import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducers';
import { useDispatch } from 'react-redux';

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware)
  )
);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;

export default store;