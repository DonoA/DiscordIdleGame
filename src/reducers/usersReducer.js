import { LOAD_INITIAL_DATA, ADD_USER } from '../actions/types';

const initialState = {
  usersByServer: {},
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return action.payload.users;
    case ADD_USER:
      const { serverName, userName } = action.payload;
      const serverUsers = state.usersByServer[serverName] || [];
      return {
        ...state,
        usersByServer: {
          ...state.usersByServer,
          [serverName]: [...serverUsers, userName],
        },
      };
    default:
      return state;
  }
};

export default usersReducer;