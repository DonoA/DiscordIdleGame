import { combineReducers } from 'redux';
import serversReducer from './serversReducer';
import channelsReducer from './channelsReducer';
import messagesReducer from './messagesReducer';
import uiReducer from './uiReducer';
import usersReducer from './usersReducer';
import bitsReducer from './bitsReducer';
import { HYDRATE_STATE } from '../actions/types';
import { RootState } from '../types';

const appReducer = combineReducers({
  servers: serversReducer,
  channels: channelsReducer,
  messages: messagesReducer,
  ui: uiReducer,
  users: usersReducer,
  bits: bitsReducer,
});

const rootReducer = (state: RootState | undefined, action: any): RootState => {
  if (action.type === HYDRATE_STATE) {
    state = { ...state, ...action.payload };
  }
  return appReducer(state, action);
};

export default rootReducer;