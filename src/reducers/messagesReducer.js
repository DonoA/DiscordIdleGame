import { LOAD_INITIAL_DATA, ADD_RANDOM_MESSAGE } from '../actions/types';

const initialState = {
  byChannel: {},
};

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        byChannel: action.payload.messages.byChannel,
      };
    case ADD_RANDOM_MESSAGE:
      const { channelId, message } = action.payload;
      const existingMessages = state.byChannel[channelId] || [];
      return {
        ...state,
        byChannel: {
          ...state.byChannel,
          [channelId]: [...existingMessages, message],
        },
      };
    default:
      return state;
  }
};

export default messagesReducer;