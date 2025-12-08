import { userJoinVoice, userLeaveVoice, addRandomMessage, incrementBits } from './actions';

const MESSAGE_CHANCE_PER_TICK = 0.01;
const USER_MOVE_CHANCE_PER_TICK = 0.005;
const BITS_PER_TICK_PER_USER_IN_VOICE = 0.1;

export const runSimulation = (store, tick) => {
  const state = store.getState();
  const { users, servers, channels } = state;
  const serverNames = Object.keys(servers);

  if (serverNames.length === 0) return;

  // --- User Movement Simulation ---
  serverNames.forEach(serverName => {
    const serverUsers = users.usersByServer[serverName];
    const voiceChannels = channels.voiceByServer[serverName];
    if (serverUsers && serverUsers.length > 0 && voiceChannels && Object.keys(voiceChannels).length > 0) {
      serverUsers.forEach(userName => {
        if (Math.random() < USER_MOVE_CHANCE_PER_TICK) {
          const currentlyInChannel = Object.values(voiceChannels).find(vc => vc.users.includes(userName));
          if (currentlyInChannel) {
            store.dispatch(userLeaveVoice(serverName, currentlyInChannel.name, userName));
          } else {
            const randomChannelName = Object.keys(voiceChannels)[Math.floor(Math.random() * Object.keys(voiceChannels).length)];
            store.dispatch(userJoinVoice(serverName, randomChannelName, userName));
          }
        }
      });
    }
  });

  // --- Message Simulation ---
  serverNames.forEach(serverName => {
    const serverUsers = users.usersByServer[serverName];
    const textChannels = channels.textByServer[serverName];
    if (serverUsers && serverUsers.length > 0 && textChannels && Object.keys(textChannels).length > 0) {
      serverUsers.forEach(userName => {
        if (Math.random() < MESSAGE_CHANCE_PER_TICK) {
          const channelName = Object.keys(textChannels)[Math.floor(Math.random() * Object.keys(textChannels).length)];
          store.dispatch(addRandomMessage(serverName, channelName, userName));
        }
      });
    }
  });


  // --- Bits Generation ---
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
    store.dispatch(incrementBits(usersInVoice * BITS_PER_TICK_PER_USER_IN_VOICE));
  }
};