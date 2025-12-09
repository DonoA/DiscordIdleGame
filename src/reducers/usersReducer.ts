import { LOAD_INITIAL_DATA, ADD_USER, USER_JOIN_VOICE, USER_LEAVE_VOICE } from '../actions/types';

const initialState = {
  usersByServer: {},
  usersInVoiceByServer: {},
};

const usersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        ...action.payload.users
      };
    case ADD_USER: {
      const { serverName, userName } = action.payload;
      const serverUsers = (state as any).usersByServer[serverName] || [];
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
      const serverUsersInVoice = { ...((state as any).usersInVoiceByServer[serverName] || {}) };
      userNames.forEach((userName: any) => {
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
      const serverUsersInVoice = { ...((state as any).usersInVoiceByServer[serverName] || {}) };
      userNames.forEach((userName: any) => {
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