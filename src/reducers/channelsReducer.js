import { LOAD_INITIAL_DATA, ADD_RANDOM_CHANNEL, USER_JOIN_VOICE, USER_LEAVE_VOICE, ADD_RANDOM_MESSAGE, ADD_TEXT_CHANNEL, ADD_VOICE_CHANNEL } from '../actions/types';

const initialState = {
  textByServer: {},
  voiceByServer: {},
};

const channelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INITIAL_DATA:
      return {
        ...state,
        ...action.payload.channels
      };
    case ADD_RANDOM_CHANNEL:
    case ADD_TEXT_CHANNEL:
    case ADD_VOICE_CHANNEL:
    {
      const { serverName, channel } = action.payload;
      const { type, name } = channel;
      const serverChannels = type === 'text' ? state.textByServer[serverName] : state.voiceByServer[serverName];
      const updatedChannels = { ...serverChannels, [name]: channel };

      if (type === 'text') {
        return { ...state, textByServer: { ...state.textByServer, [serverName]: updatedChannels } };
      } else {
        return { ...state, voiceByServer: { ...state.voiceByServer, [serverName]: updatedChannels } };
      }
    }
    case USER_JOIN_VOICE: {
      const { serverName, channelName, userName } = action.payload;
      const voiceChannels = state.voiceByServer[serverName];
      const channel = voiceChannels[channelName];
      const updatedChannel = { ...channel, users: [...channel.users, userName] };
      return {
        ...state,
        voiceByServer: {
          ...state.voiceByServer,
          [serverName]: { ...voiceChannels, [channelName]: updatedChannel },
        },
      };
    }
    case USER_LEAVE_VOICE: {
      const { serverName, channelName, userName } = action.payload;
      const voiceChannels = state.voiceByServer[serverName];
      const channel = voiceChannels[channelName];
      const updatedChannel = { ...channel, users: channel.users.filter(u => u !== userName) };
      return {
        ...state,
        voiceByServer: {
          ...state.voiceByServer,
          [serverName]: { ...voiceChannels, [channelName]: updatedChannel },
        },
      };
    }
    case ADD_RANDOM_MESSAGE: {
      const { serverName, channelName } = action.payload;
      const textChannels = state.textByServer[serverName];
      const channel = textChannels[channelName];
      const updatedChannel = { ...channel, messageCount: channel.messageCount + 1 };
      return {
        ...state,
        textByServer: {
          ...state.textByServer,
          [serverName]: { ...textChannels, [channelName]: updatedChannel },
        },
      };
    }
    default:
      return state;
  }
};

export default channelsReducer;