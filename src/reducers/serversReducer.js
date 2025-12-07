import { LOAD_INITIAL_DATA, ADD_RANDOM_SERVER, ADD_RANDOM_CHANNEL, ADD_USER } from '../actions/types';

const initialState = {
  byId: {},
  allIds: [],
};

const serversReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        byId: action.payload.servers.byId,
        allIds: action.payload.servers.allIds,
      };
    case ADD_RANDOM_SERVER:
      const { id } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: action.payload,
        },
        allIds: [...state.allIds, id],
      };
    case ADD_RANDOM_CHANNEL:
      const { serverId, channel } = action.payload;
      const server = state.byId[serverId];
      return {
        ...state,
        byId: {
          ...state.byId,
          [serverId]: {
            ...server,
            channels: [...server.channels, channel.id],
          },
        },
      };
    case ADD_USER:
      const { serverId: newServerId, user } = action.payload;
      const serverToUpdate = state.byId[newServerId];
      return {
        ...state,
        byId: {
          ...state.byId,
          [newServerId]: {
            ...serverToUpdate,
            users: [...(serverToUpdate.users ?? []), user.id],
          },
        },
      };
    default:
      return state;
  }
};

export default serversReducer;