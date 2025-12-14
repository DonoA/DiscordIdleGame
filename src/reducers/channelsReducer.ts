import { LOAD_INITIAL_DATA, ADD_RANDOM_CHANNEL, USER_JOIN_VOICE, USER_LEAVE_VOICE, ADD_TEXT_CHANNEL, ADD_VOICE_CHANNEL, ADD_MESSAGE_COUNT, ADD_SERVER } from '../actions/types';
import { ChannelsState, PayloadAction } from '../types';

const initialState: ChannelsState = {
  textByServer: {},
  voiceByServer: {},
};

const channelsReducer = (state = initialState, action: PayloadAction<any>): ChannelsState => {
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
      const { serverName, channelName, userNames } = action.payload;
      const voiceChannels = state.voiceByServer[serverName];
      const channel = voiceChannels[channelName];
      const updatedChannel = { ...channel, users: [...channel.users, ...userNames] };
      return {
        ...state,
        voiceByServer: {
          ...state.voiceByServer,
          [serverName]: { ...voiceChannels, [channelName]: updatedChannel },
        },
      };
    }
    case USER_LEAVE_VOICE: {
      const { serverName, channelName, userNames } = action.payload;
      const voiceChannels = state.voiceByServer[serverName];
      const channel = voiceChannels[channelName];
      const usersToLeaveSet = new Set(userNames);
      const updatedChannel = { ...channel, users: channel.users.filter(u => !usersToLeaveSet.has(u)) };
      return {
        ...state,
        voiceByServer: {
          ...state.voiceByServer,
          [serverName]: { ...voiceChannels, [channelName]: updatedChannel },
        },
      };
    }
    case ADD_MESSAGE_COUNT: {
      const { serverName, channelName, messageCount } = action.payload;
      const textChannels = state.textByServer[serverName];
      const channel = textChannels[channelName];
      const updatedChannel = { ...channel, messageCount: channel.messageCount + messageCount };
      return {
        ...state,
        textByServer: {
          ...state.textByServer,
          [serverName]: { ...textChannels, [channelName]: updatedChannel },
        },
      };
    }
    case ADD_SERVER: {
      const { server } = action.payload;
      return {
        ...state,
        textByServer: { ...state.textByServer, [server.name]: {} },
        voiceByServer: { ...state.voiceByServer, [server.name]: {} },
      };
    }
    default:
      return state;
  }
};

export default channelsReducer;