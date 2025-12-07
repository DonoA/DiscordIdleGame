import { ADD_USER } from '../actions/types';

const initialState = {
  byId: {},
  allIds: [],
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default usersReducer;