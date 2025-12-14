import { userJoinVoice, userLeaveVoice, addRandomMessage, incrementBits, addMessageCount } from './actions';
import { Store } from 'redux';
import { RootState, TextChannel } from './types';

const MESSAGE_CHANCE_PER_TICK = 0.005;
const BITS_PER_TICK_PER_USER_IN_VOICE = 0.1;
const LEAVE_CHANNEL_CHANCE_PER_TICK = 0.005;
const JOIN_CHANNEL_CHANCE_PER_TICK = 0.001;

export const runSimulation = (store: Store<RootState> | any, tick: number) => {
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
        const usersToLeave = channel.users.filter(() => Math.random() < LEAVE_CHANNEL_CHANCE_PER_TICK);
        if (usersToLeave.length > 0) {
          store.dispatch(userLeaveVoice(serverName, channelName, usersToLeave) as any);
        }

        // Join Logic
        const availableUsers = serverUsers
          .filter((u: string) => !usersInVoice[u])
          .filter(() => Math.random() < JOIN_CHANNEL_CHANCE_PER_TICK);
        if (availableUsers.length > 0) {
          store.dispatch(userJoinVoice(serverName, channelName, availableUsers) as any);
        }
      });
    }
  });

  // --- Message Simulation ---
  serverNames.forEach(serverName => {
    const serverUsers = users.usersByServer[serverName];
    const textChannels = Object.values(channels.textByServer[serverName]) as TextChannel[];
    if (serverUsers && serverUsers.length > 0 && textChannels && textChannels.length > 0) {
      textChannels.forEach((channel) => {
        const messageCount = serverUsers.length * MESSAGE_CHANCE_PER_TICK * Math.random();
        const messagesToSend = Math.floor(channel.messageCount + messageCount) - Math.floor(channel.messageCount);
        for (let i = 0; i < Math.floor(messagesToSend); i++) {
          const randomUser = serverUsers[Math.floor(Math.random() * serverUsers.length)];
          store.dispatch(addRandomMessage(serverName, channel.name, randomUser));
        }

        // Store fractional message counts for more accurate simulation
        store.dispatch(addMessageCount(serverName, channel.name, messageCount));
      });
    }
  });


  // --- Bits Generation ---
  let usersInVoice = 0;
  serverNames.forEach(serverName => {
    const voiceChannels = channels.voiceByServer[serverName];
    if (voiceChannels) {
      Object.values(voiceChannels).forEach((vc: any) => {
        usersInVoice += vc.users.length;
      });
    }
  });

  if (usersInVoice > 0) {
    store.dispatch(incrementBits(usersInVoice * BITS_PER_TICK_PER_USER_IN_VOICE) as any);
  }
};