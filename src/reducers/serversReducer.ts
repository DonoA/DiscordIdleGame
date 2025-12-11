import { LOAD_INITIAL_DATA, ADD_RANDOM_SERVER, ADD_SERVER } from '../actions/types';
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
        [server.name]: server,
      };
    }
    default:
      return state;
  }
};

export default serversReducer;