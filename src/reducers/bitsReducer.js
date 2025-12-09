import { INCREMENT_BITS, SPEND_BITS } from '../actions/types';

const initialState = {
  totalBits: 0,
  currentBits: 0,
};

const bitsReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_BITS:
      return {
        ...state,
        totalBits: state.totalBits + action.payload,
        currentBits: state.currentBits + action.payload
      };
    case SPEND_BITS:
      return {
        ...state,
        currentBits: state.currentBits - action.payload
      };
    default:
      return state;
  }
};

export default bitsReducer;