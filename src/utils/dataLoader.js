import { v4 as uuidv4 } from 'uuid';

export const loadInitialData = async () => {
  const serversRes = await fetch('/servers_and_channels.json');
  const serversData = await serversRes.json();

  const users = {
    byId: {},
    allIds: [],
  };

  const servers = {
    byId: {},
    allIds: [],
  };

  const channels = {
    byId: {},
    allIds: [],
  };

  const messages = {
    byChannel: {},
  };

  // Pick a random server theme from the data
  const randomServerInfo = serversData[Math.floor(Math.random() * serversData.length)];
  const textChannelInfo = randomServerInfo.channels.find(c => c.type === 'text');
  const voiceChannelInfo = randomServerInfo.channels.find(c => c.type === 'voice');

  // Create one server
  const serverId = uuidv4();
  servers.byId[serverId] = {
    id: serverId,
    name: randomServerInfo.name,
    channels: [],
    users: [],
  };
  servers.allIds.push(serverId);

  // Create one text channel
  const textChannelId = uuidv4();
  channels.byId[textChannelId] = {
    id: textChannelId,
    name: textChannelInfo ? textChannelInfo.name : 'general',
    type: 'text',
    users: [],
  };
  channels.allIds.push(textChannelId);
  servers.byId[serverId].channels.push(textChannelId);
  messages.byChannel[textChannelId] = [];

  // Create one voice channel
  const voiceChannelId = uuidv4();
  channels.byId[voiceChannelId] = {
    id: voiceChannelId,
    name: voiceChannelInfo ? voiceChannelInfo.name : 'Lobby',
    type: 'voice',
    users: [],
  };
  channels.allIds.push(voiceChannelId);
  servers.byId[serverId].channels.push(voiceChannelId);

  const selectedServer = serverId;
  const selectedChannel = textChannelId;

  return {
    servers,
    channels,
    messages,
    users,
    ui: {
      selectedServer,
      selectedChannel,
    },
  };
};