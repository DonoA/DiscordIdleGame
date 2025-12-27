import { userJoinVoice, userLeaveVoice, addRandomMessage, incrementBits, addMessageCount, removeUser } from './actions';
import { createNewUser } from './utils/userHelpers';
import { Store } from 'redux';
import { RootState, TextChannel } from './types';
import {
  MESSAGE_CHANCE_PER_TICK,
  LEAVE_CHANNEL_CHANCE_PER_TICK,
  JOIN_CHANNEL_CHANCE_PER_TICK,
  BITS_PER_MESSAGE,
  VOICE_CHANNEL_MULTIPLIER,
  USER_LEAVE_CHANCE_PER_TICK,
  MODERATOR_LEAVE_PREVENTION,
  INFLUENCER_JOIN_CHANCE_PER_TICK
} from './constants';

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
    const voiceChannels = channels.voiceByServer[serverName] || {};
    const voiceChannelCount = Object.keys(voiceChannels).length;
    if (serverUsers && serverUsers.length > 0 && textChannels && textChannels.length > 0) {
      textChannels.forEach((channel) => {
        // Calculate number of messages to send based on users and voice channel multiplier
        const multiplier = voiceChannelCount > 0 ? (VOICE_CHANNEL_MULTIPLIER * voiceChannelCount) : 1;

        const messageCount = serverUsers.length * MESSAGE_CHANCE_PER_TICK * Math.random() * multiplier;
        const messagesToSend = Math.floor(channel.messageCount + messageCount) - Math.floor(channel.messageCount);
        for (let i = 0; i < Math.floor(messagesToSend); i++) {
          const randomUser = serverUsers[Math.floor(Math.random() * serverUsers.length)];
          store.dispatch(addRandomMessage(serverName, channel.name, randomUser));
          store.dispatch(incrementBits(BITS_PER_MESSAGE) as any);
        }

        // Store fractional message counts for more accurate simulation
        store.dispatch(addMessageCount(serverName, channel.name, messageCount));
      });
    }
  });

  // --- User Churn and Influencer Simulation ---
  serverNames.forEach(serverName => {
    const server = servers[serverName];
    const serverUsers = users.usersByServer[serverName] || [];
    
    // User churn
    if (serverUsers.length > 0) {
      const leaveChance = USER_LEAVE_CHANCE_PER_TICK - (server.moderators * MODERATOR_LEAVE_PREVENTION);
      serverUsers.forEach((userName: string) => {
        if (Math.random() < leaveChance) {
          store.dispatch(removeUser(serverName, userName) as any);
        }
      });
    }

    // Influencer logic
    if (server.influencers > 0) {
      const joinChance = INFLUENCER_JOIN_CHANCE_PER_TICK * server.influencers;
      if (Math.random() < joinChance) {
        const existingUserNames = users.usersByServer[serverName] || [];
        createNewUser(serverName, store.dispatch, existingUserNames);
      }
    }
  });
};