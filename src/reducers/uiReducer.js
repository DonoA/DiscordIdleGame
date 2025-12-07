import { SELECT_SERVER, SELECT_CHANNEL, LOAD_INITIAL_DATA, TOGGLE_DEV_MODE } from '../actions/types';

const initialState = {
  selectedServer: null,
  selectedChannel: null,
  devMode: false,
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        selectedServer: action.payload.ui.selectedServer,
        selectedChannel: action.payload.ui.selectedChannel,
      };
    case SELECT_SERVER:
      return {
        ...state,
        selectedServer: action.payload,
        selectedChannel: null, // Reset channel when server changes
      };
    case SELECT_CHANNEL:
      return {
        ...state,
        selectedChannel: action.payload,
      };
    case TOGGLE_DEV_MODE:
      return {
        ...state,
        devMode: !state.devMode,
      };
    default:
      return state;
  }
};

export default uiReducer;