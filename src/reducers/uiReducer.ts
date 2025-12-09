import { SELECT_SERVER, SELECT_CHANNEL, LOAD_INITIAL_DATA, TOGGLE_DEV_MODE, INCREMENT_TICK } from '../actions/types';

const initialState = {
  selectedServer: null,
  selectedChannel: null,
  devMode: false,
  tick: 0,
};

const uiReducer = (state = initialState, action: any) => {
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
    case INCREMENT_TICK:
      return {
        ...state,
        tick: state.tick + 1,
      };
    default:
      return state;
  }
};

export default uiReducer;