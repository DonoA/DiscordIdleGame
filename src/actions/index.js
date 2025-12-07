import { loadInitialData as fetchData } from '../utils/dataLoader';
import {
  SELECT_SERVER,
  SELECT_CHANNEL,
  LOAD_INITIAL_DATA,
  ADD_RANDOM_SERVER,
  ADD_RANDOM_CHANNEL,
  ADD_RANDOM_MESSAGE,
  ADD_USER,
  USER_JOIN_VOICE,
  USER_LEAVE_VOICE,
  INCREMENT_BITS,
} from './types';

export const selectServer = (serverName) => ({
  type: SELECT_SERVER,
  payload: serverName,
});

export const selectChannel = (channelName) => ({
  type: SELECT_CHANNEL,
  payload: channelName,
});

export const loadInitialData = () => async (dispatch) => {
  const data = await fetchData();
  dispatch({
    type: LOAD_INITIAL_DATA,
    payload: data,
  });
};

export const addRandomServer = () => async (dispatch, getState) => {
  const { servers } = getState();
  const serversRes = await fetch('/servers_and_channels.json');
  const serversData = await serversRes.json();
  const existingServerNames = Object.keys(servers);
  const availableServers = serversData.filter(s => !existingServerNames.includes(s.name));

  if (availableServers.length > 0) {
    const serverInfo = availableServers[Math.floor(Math.random() * availableServers.length)];
    dispatch({
      type: ADD_RANDOM_SERVER,
      payload: { server: { name: serverInfo.name } },
    });
  }
};

export const addRandomChannel = (serverName) => async (dispatch, getState) => {
  const { channels } = getState();
  const serversRes = await fetch('/servers_and_channels.json');
  const serversData = await serversRes.json();
  const serverTheme = serversData.find(s => s.name === serverName);

  if (serverTheme) {
    const existingTextChannels = Object.keys(channels.textByServer[serverName] || {});
    const existingVoiceChannels = Object.keys(channels.voiceByServer[serverName] || {});
    const existingChannelNames = [...existingTextChannels, ...existingVoiceChannels];
    const availableChannels = serverTheme.channels.filter(c => !existingChannelNames.includes(c.name));

    if (availableChannels.length > 0) {
      const randomChannelInfo = availableChannels[Math.floor(Math.random() * availableChannels.length)];
      const channel = {
        name: randomChannelInfo.name,
        type: randomChannelInfo.type,
      };
      if (channel.type === 'text') {
        channel.messageCount = 0;
      } else {
        channel.users = [];
      }
      dispatch({
        type: ADD_RANDOM_CHANNEL,
        payload: { serverName, channel },
      });
    }
  }
};

export const userJoinVoice = (serverName, channelName, userName) => ({
  type: USER_JOIN_VOICE,
  payload: { serverName, channelName, userName },
});

export const userLeaveVoice = (serverName, channelName, userName) => ({
  type: USER_LEAVE_VOICE,
  payload: { serverName, channelName, userName },
});

export const addRandomMessage = (serverName, channelName, userName) => async (dispatch, getState) => {
  const { users } = getState();
  const serverUsers = users.usersByServer[serverName];

  if (serverUsers) {
    const messagesRes = await fetch('/messages.json');
    const messageList = await messagesRes.json();

    const message = {
      author: userName,
      content: messageList[Math.floor(Math.random() * messageList.length)],
    };

    dispatch({
      type: ADD_RANDOM_MESSAGE,
      payload: { serverName, channelName, message },
    });
    dispatch(incrementBits(1));
  }
};

export const addUser = (serverName) => async (dispatch, getState) => {
  const { users } = getState();
  const usersRes = await fetch('/users.json');
  const usersList = await usersRes.json();
  const serverUsers = users.usersByServer[serverName] || [];
  const availableUsers = usersList.filter(name => !serverUsers.includes(name));

  if (availableUsers.length > 0) {
    const userName = availableUsers[Math.floor(Math.random() * availableUsers.length)];
    dispatch({
      type: ADD_USER,
      payload: { serverName, userName },
    });
  }
};

export const incrementBits = (amount) => ({
  type: INCREMENT_BITS,
  payload: amount,
});
