import { userJoinVoice, userLeaveVoice, addRandomMessage, incrementBits } from './actions';

let simulationInterval = null;

const startSimulation = async (store) => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  simulationInterval = setInterval(() => {
    const state = store.getState();
    const { users, servers, channels } = state;

    if (users.allIds.length === 0 || servers.allIds.length === 0) {
      return;
    }

    // Simulate user joining/leaving voice channels
    const randomUserId = users.allIds[Math.floor(Math.random() * users.allIds.length)];
    const user = users.byId[randomUserId];
    const server = servers.byId[Object.keys(servers.byId).find(serverId => servers.byId[serverId].users.includes(randomUserId))];

    if (server) {
      const voiceChannels = server.channels.map(id => channels.byId[id]).filter(c => c && c.type === 'voice');
      if (user.currentVoiceChannel) {
        if (Math.random() < 0.3) { // 30% chance to leave
          store.dispatch(userLeaveVoice(user.id, user.currentVoiceChannel));
        }
      } else {
        if (Math.random() < 0.2 && voiceChannels.length > 0) { // 20% chance to join
          const randomChannel = voiceChannels[Math.floor(Math.random() * voiceChannels.length)];
          store.dispatch(userJoinVoice(user.id, randomChannel.id));
        }
      }
    }


    // Simulate random messages
    if (Math.random() < 0.5) { // 50% chance to send a message
      const randomServerId = servers.allIds[Math.floor(Math.random() * servers.allIds.length)];
      const randomServer = servers.byId[randomServerId];
      const textChannels = randomServer.channels.map(id => channels.byId[id]).filter(c => c && c.type === 'text');

      if (textChannels.length > 0 && randomServer.users.length > 0) {
        const randomChannelId = textChannels[Math.floor(Math.random() * textChannels.length)].id;
        const randomUserId = randomServer.users[Math.floor(Math.random() * randomServer.users.length)];
        const randomUser = users.byId[randomUserId];
        store.dispatch(addRandomMessage(randomChannelId, randomUser.name));
      }
    }

    // Grant bits for users in voice channels
    const usersInVoice = Object.values(users.byId).filter(u => u.currentVoiceChannel).length;
    if (usersInVoice > 0) {
      store.dispatch(incrementBits(usersInVoice * 2)); // 2 bits per user every 2 seconds
    }

  }, 2000); // Run simulation every 2 seconds
};

export default startSimulation;