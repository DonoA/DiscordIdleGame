import { INCREMENT_BITS, SPEND_BITS } from '../actions/types';

const initialState = 0;

const bitsReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_BITS:
      return state + action.payload;
    case SPEND_BITS:
      return state - action.payload;
    default:
      return state;
  }
};

export default bitsReducer;