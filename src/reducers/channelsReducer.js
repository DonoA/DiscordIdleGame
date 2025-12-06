import { LOAD_INITIAL_DATA, ADD_RANDOM_CHANNEL } from '../actions/types';

const initialState = {
  byId: {},
  allIds: [],
};

const channelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        byId: action.payload.channels.byId,
        allIds: action.payload.channels.allIds,
      };
    case ADD_RANDOM_CHANNEL:
      const { channel } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [channel.id]: channel,
        },
        allIds: [...state.allIds, channel.id],
      };
    default:
      return state;
  }
};

export default channelsReducer;