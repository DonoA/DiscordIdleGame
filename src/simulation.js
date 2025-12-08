import { userJoinVoice, userLeaveVoice, addRandomMessage, incrementBits } from './actions';

const MESSAGE_CHANCE_PER_TICK = 0.01;
const BITS_PER_TICK_PER_USER_IN_VOICE = 0.1;

export const runSimulation = (store, tick) => {
  const state = store.getState();
  const { users, servers, channels } = state;
  const serverNames = Object.keys(servers);

  if (serverNames.length === 0) return;

  // --- User Movement Simulation ---
  serverNames.forEach(serverName => {
    const serverUsers = users.usersByServer[serverName] || [];
    const usersInVoice = users.usersInVoiceByServer[serverName] || {};
    const voiceChannels = channels.voiceByServer[serverName] || {};
    const voiceChannelNames = Object.keys(voiceChannels);

    if (serverUsers.length > 0 && voiceChannelNames.length > 0) {
      voiceChannelNames.forEach(channelName => {
        const channel = voiceChannels[channelName];

        // Leave Logic
        const usersToLeave = channel.users.filter(() => Math.random() < 0.1);
        usersToLeave.forEach(userName => {
          store.dispatch(userLeaveVoice(serverName, channelName, userName));
        });

        // Join Logic
        const availableUsers = serverUsers.filter(u => !usersInVoice[u]);
        const numToJoin = Math.floor(availableUsers.length * 0.05);
        for (let i = 0; i < numToJoin; i++) {
          const userToJoin = availableUsers.splice(Math.floor(Math.random() * availableUsers.length), 1)[0];
          if(userToJoin) {
            store.dispatch(userJoinVoice(serverName, channelName, userToJoin));
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