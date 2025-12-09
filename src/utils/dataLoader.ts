import { getData } from './dataCache';

export const loadInitialData = async () => {
  const { servers: serversData } = await getData();

  const servers: any = {};
  const users: any = { usersByServer: {} };
  const channels: any = { textByServer: {}, voiceByServer: {} };
  const messages: any = { byServer: {} };

  // Pick a random server theme from the data
  const randomServerInfo = serversData[Math.floor(Math.random() * serversData.length)];
  const serverName = randomServerInfo.name;

  // Create server
  servers[serverName] = { name: serverName };
  users.usersByServer[serverName] = [];
  messages.byServer[serverName] = {};
  channels.textByServer[serverName] = {};
  channels.voiceByServer[serverName] = {};

  // Create channels for the server
  const textChannelInfo = randomServerInfo.channels.find((c: any) => c.type === 'text');
  if (textChannelInfo) {
    channels.textByServer[serverName][textChannelInfo.name] = {
      name: textChannelInfo.name,
      messageCount: 0,
    };
    messages.byServer[serverName][textChannelInfo.name] = [];
  }

  const voiceChannelInfo = randomServerInfo.channels.find((c: any) => c.type === 'voice');
  if (voiceChannelInfo) {
    channels.voiceByServer[serverName][voiceChannelInfo.name] = {
      name: voiceChannelInfo.name,
      users: [],
    };
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