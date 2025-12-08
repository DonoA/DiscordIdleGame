import { LOAD_INITIAL_DATA, ADD_RANDOM_MESSAGE } from '../actions/types';

const initialState = {
  byServer: {},
};

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        ...action.payload.messages,
      };
    case ADD_RANDOM_MESSAGE: {
      const { serverName, channelName, message } = action.payload;
      const serverMessages = state.byServer[serverName] || {};
      const channelMessages = serverMessages[channelName] || [];
      const newMessages = [...channelMessages, message].slice(-15); // Keep last 15
      return {
        ...state,
        byServer: {
          ...state.byServer,
          [serverName]: {
            ...serverMessages,
            [channelName]: newMessages,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default messagesReducer;