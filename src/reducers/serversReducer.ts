import { LOAD_INITIAL_DATA, ADD_RANDOM_SERVER, ADD_SERVER } from '../actions/types';

const initialState = {};

const serversReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        ...action.payload.servers
      };
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