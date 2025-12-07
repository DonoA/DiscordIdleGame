import { LOAD_INITIAL_DATA, ADD_RANDOM_MESSAGE } from '../actions/types';

const initialState = {
  byChannel: {},
};

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA: {
      const newByChannel = {};
      for (const channelId in action.payload.messages.byChannel) {
        const messages = action.payload.messages.byChannel[channelId];
        newByChannel[channelId] = {
          messages: messages,
          totalCount: messages.length,
        };
      }
      return {
        ...state,
        byChannel: newByChannel,
      };
    }
    case ADD_RANDOM_MESSAGE: {
      const { channelId, message } = action.payload;
      const channelData = state.byChannel[channelId] || { messages: [], totalCount: 0 };
      const newMessages = [...channelData.messages, message].slice(-10); // Keep last 10
      return {
        ...state,
        byChannel: {
          ...state.byChannel,
          [channelId]: {
            messages: newMessages,
            totalCount: channelData.totalCount + 1,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default messagesReducer;