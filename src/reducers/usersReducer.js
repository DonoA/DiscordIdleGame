import { ADD_USER, LOAD_INITIAL_DATA, USER_JOIN_VOICE, USER_LEAVE_VOICE } from '../actions/types';

const initialState = {
  byId: {},
  allIds: [],
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        byId: action.payload.users.byId,
        allIds: action.payload.users.allIds,
      };
    case ADD_USER:
      const { user } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [user.id]: user,
        },
        allIds: [...state.allIds, user.id],
      };
    case USER_JOIN_VOICE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.userId]: {
            ...state.byId[action.payload.userId],
            currentVoiceChannel: action.payload.channelId,
          },
        },
      };
    case USER_LEAVE_VOICE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.userId]: {
            ...state.byId[action.payload.userId],
            currentVoiceChannel: null,
          },
        },
      };
    default:
      return state;
  }
};

export default usersReducer;