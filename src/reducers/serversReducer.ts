import { LOAD_INITIAL_DATA, ADD_RANDOM_SERVER, ADD_SERVER, ADD_MODERATOR, ADD_INFLUENCER } from '../actions/types';
import { ServersState, PayloadAction, Server } from '../types';

const initialState: ServersState = {};

const serversReducer = (state = initialState, action: PayloadAction<{ server: Server } | any>): ServersState => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return action.payload.servers;
    case ADD_RANDOM_SERVER:
    case ADD_SERVER: {
      const { server } = action.payload;
      return {
        ...state,
        [server.name]: { ...server, moderators: 0, influencers: 0 },
      };
    }
    case ADD_MODERATOR: {
      const { serverName } = action.payload;
      return {
        ...state,
        [serverName]: {
          ...state[serverName],
          moderators: state[serverName].moderators + 1,
        },
      };
    }
    case ADD_INFLUENCER: {
      const { serverName } = action.payload;
      return {
        ...state,
        [serverName]: {
          ...state[serverName],
          influencers: state[serverName].influencers + 1,
        },
      };
    }
    default:
      return state;
  }
};

export default serversReducer;