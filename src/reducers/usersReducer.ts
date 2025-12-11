import { LOAD_INITIAL_DATA, ADD_USER, USER_JOIN_VOICE, USER_LEAVE_VOICE } from '../actions/types';
import { UsersState, PayloadAction } from '../types';

const initialState: UsersState = {
  usersByServer: {},
  usersInVoiceByServer: {},
};

const usersReducer = (state = initialState, action: PayloadAction<any>): UsersState => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        ...action.payload.users
      };
    case ADD_USER: {
      const { serverName, userName } = action.payload;
      const serverUsers = state.usersByServer[serverName] || [];
      return {
        ...state,
        usersByServer: {
          ...state.usersByServer,
          [serverName]: [...serverUsers, userName],
        },
      };
    }
    case USER_JOIN_VOICE: {
      const { serverName, userNames } = action.payload;
      const serverUsersInVoice = { ...(state.usersInVoiceByServer[serverName] || {}) };
      userNames.forEach((userName: string) => {
        serverUsersInVoice[userName] = true;
      });
      return {
        ...state,
        usersInVoiceByServer: {
          ...state.usersInVoiceByServer,
          [serverName]: serverUsersInVoice,
        },
      };
    }
    case USER_LEAVE_VOICE: {
      const { serverName, userNames } = action.payload;
      const serverUsersInVoice = { ...(state.usersInVoiceByServer[serverName] || {}) };
      userNames.forEach((userName: string) => {
        delete serverUsersInVoice[userName];
      });
      return {
        ...state,
        usersInVoiceByServer: {
          ...state.usersInVoiceByServer,
          [serverName]: serverUsersInVoice,
        },
      };
    }
    default:
      return state;
  }
};

export default usersReducer;