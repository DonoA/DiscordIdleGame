import { getData } from './dataCache';
import { ServersState, UsersState, ChannelsState, MessagesState } from '../types';

export const loadInitialData = async () => {
  const { servers: serversData } = await getData();

  const servers: ServersState = {};
  const users: UsersState = { usersByServer: {}, usersInVoiceByServer: {} };
  const channels: ChannelsState = { textByServer: {}, voiceByServer: {} };
  const messages: MessagesState = { byServer: {} };

  // Pick a random server theme from the data
  const randomServerInfo = serversData[Math.floor(Math.random() * serversData.length)];
  const serverName = randomServerInfo.name;

  // Create server
  servers[serverName] = { name: serverName, moderators: 0, influencers: 0 };
  users.usersByServer[serverName] = [];
  messages.byServer[serverName] = {};
  channels.textByServer[serverName] = {};
  channels.voiceByServer[serverName] = {};

  // Create channels for the server
  const textChannelInfo = randomServerInfo.channels.find(c => c.type === 'text');
  if (textChannelInfo) {
    channels.textByServer[serverName][textChannelInfo.name] = {
      name: textChannelInfo.name,
      messageCount: 0,
    };
    messages.byServer[serverName][textChannelInfo.name] = [];
  }

  return {
    servers,
    channels,
    messages,
    users,
    ui: {
      selectedServer: serverName,
      selectedChannel: textChannelInfo ? textChannelInfo.name : null,
    },
  };
};