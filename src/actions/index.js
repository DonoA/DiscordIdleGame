import { v4 as uuidv4 } from 'uuid';
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
} from './types';

export const selectServer = (serverId) => ({
  type: SELECT_SERVER,
  payload: serverId,
});

export const selectChannel = (channelId) => ({
  type: SELECT_CHANNEL,
  payload: channelId,
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
  const existingServerNames = Object.values(servers.byId).map(s => s.name);
  const availableServers = serversData.filter(s => !existingServerNames.includes(s.name));

  if (availableServers.length > 0) {
    const serverName = availableServers[Math.floor(Math.random() * availableServers.length)].name;
    dispatch({
      type: ADD_RANDOM_SERVER,
      payload: {
        id: uuidv4(),
        name: serverName,
        channels: [],
        users: [], // Initialize with no users
      },
    });
  }
};

export const addRandomChannel = (serverId) => async (dispatch, getState) => {
  const { servers, channels } = getState();
  const server = servers.byId[serverId];
  if (!server) return;

  const serversRes = await fetch('/servers_and_channels.json');
  const serversData = await serversRes.json();
  const serverTheme = serversData.find(s => s.name === server.name);

  if (serverTheme) {
    const existingChannelNames = server.channels.map(cId => channels.byId[cId].name);
    const availableChannels = serverTheme.channels.filter(c => !existingChannelNames.includes(c.name));

    if (availableChannels.length > 0) {
      const randomChannelInfo = availableChannels[Math.floor(Math.random() * availableChannels.length)];
      dispatch({
        type: ADD_RANDOM_CHANNEL,
        payload: {
          serverId,
          channel: {
            id: uuidv4(),
            name: randomChannelInfo.name,
            type: randomChannelInfo.type,
            users: [],
          },
        },
      });
    }
  }
};

export const userJoinVoice = (userId, channelId) => ({
  type: USER_JOIN_VOICE,
  payload: { userId, channelId },
});

export const userLeaveVoice = (userId, channelId) => ({
  type: USER_LEAVE_VOICE,
  payload: { userId, channelId },
});

export const addRandomMessage = (channelId, message) => ({
  type: ADD_RANDOM_MESSAGE,
  payload: {
    channelId,
    message,
  },
});

export const addUser = (serverId) => async (dispatch, getState) => {
  const { users } = getState();
  const usersRes = await fetch('/users.json');
  const usersList = await usersRes.json();
  const existingUserNames = Object.values(users.byId).map(u => u.name);
  const availableUsers = usersList.filter(name => !existingUserNames.includes(name));

  if (availableUsers.length > 0) {
    const userName = availableUsers[Math.floor(Math.random() * availableUsers.length)];
    dispatch({
      type: ADD_USER,
      payload: {
        serverId,
        user: {
          id: uuidv4(),
          name: userName,
          serverId,
        },
      },
    });
  }
};
