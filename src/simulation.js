import { userJoinVoice, userLeaveVoice, addRandomMessage, incrementBits } from './actions';

let simulationHandle = null;

const TICK_RATE = 30; // Ticks per second
const TICK_INTERVAL = 1000 / TICK_RATE;

let lastMessageTime = 0;
let lastUserMoveTime = 0;
let lastBitsGenerationTime = 0;

const startSimulation = (store) => {
  if (simulationHandle) {
    clearInterval(simulationHandle);
  }

  const simulationLoop = () => {
    const now = Date.now();
    const state = store.getState();
    const { users, servers, channels } = state;
    const serverNames = Object.keys(servers);

    if (serverNames.length === 0) return;

    // --- User Movement Simulation (every 2 seconds) ---
    if (now - lastUserMoveTime > 2000) {
      const serverName = serverNames[Math.floor(Math.random() * serverNames.length)];
      const serverUsers = users.usersByServer[serverName];
      const voiceChannels = channels.voiceByServer[serverName];

      if (serverUsers && serverUsers.length > 0 && voiceChannels && Object.keys(voiceChannels).length > 0) {
        const userName = serverUsers[Math.floor(Math.random() * serverUsers.length)];
        const currentlyInChannel = Object.values(voiceChannels).find(vc => vc.users.includes(userName));

        if (currentlyInChannel) {
          if (Math.random() < 0.3) { // 30% chance to leave
            store.dispatch(userLeaveVoice(serverName, currentlyInChannel.name, userName));
          }
        } else {
          if (Math.random() < 0.2) { // 20% chance to join
            const randomChannelName = Object.keys(voiceChannels)[Math.floor(Math.random() * Object.keys(voiceChannels).length)];
            store.dispatch(userJoinVoice(serverName, randomChannelName, userName));
          }
        }
      }
      lastUserMoveTime = now;
    }

    // --- Message Simulation (every 1 second) ---
    if (now - lastMessageTime > 1000) {
      const serverName = serverNames[Math.floor(Math.random() * serverNames.length)];
      const serverUsers = users.usersByServer[serverName];
      const textChannels = channels.textByServer[serverName];

      if (serverUsers && serverUsers.length > 0 && textChannels && Object.keys(textChannels).length > 0) {
        const channelName = Object.keys(textChannels)[Math.floor(Math.random() * Object.keys(textChannels).length)];
        const userName = serverUsers[Math.floor(Math.random() * serverUsers.length)];
        store.dispatch(addRandomMessage(serverName, channelName, userName));
      }
      lastMessageTime = now;
    }

    // --- Bits Generation (every 2 seconds) ---
    if (now - lastBitsGenerationTime > 2000) {
      let usersInVoice = 0;
      serverNames.forEach(serverName => {
        const voiceChannels = channels.voiceByServer[serverName];
        if (voiceChannels) {
          Object.values(voiceChannels).forEach(vc => {
            usersInVoice += vc.users.length;
          });
        }
      });

      if (usersInVoice > 0) {
        store.dispatch(incrementBits(usersInVoice));
      }
      lastBitsGenerationTime = now;
    }
  };

  simulationHandle = setInterval(simulationLoop, TICK_INTERVAL);
};

export default startSimulation;