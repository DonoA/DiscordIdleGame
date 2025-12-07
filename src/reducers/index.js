import { combineReducers } from 'redux';
import serversReducer from './serversReducer';
import channelsReducer from './channelsReducer';
import messagesReducer from './messagesReducer';
import uiReducer from './uiReducer';
import usersReducer from './usersReducer';
import bitsReducer from './bitsReducer';

export default combineReducers({
  servers: serversReducer,
  channels: channelsReducer,
  messages: messagesReducer,
  ui: uiReducer,
  users: usersReducer,
  bits: bitsReducer,
});