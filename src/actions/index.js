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
  SPEND_BITS,
  TOGGLE_DEV_MODE,
  ADD_SERVER,
  ADD_TEXT_CHANNEL,
  ADD_VOICE_CHANNEL,
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

export const addServer = (serverName) => (dispatch, getState) => {
  const { servers, bits, ui } = getState();
  const numServers = Object.keys(servers).length;
  const cost = 10000 * (1.5 ** numServers);

  if (ui.devMode || bits >= cost) {
    if (!ui.devMode) {
      dispatch(spendBits(cost));
    }
    dispatch({
      type: ADD_SERVER,
      payload: { server: { name: serverName } },
    });
  }
};

export const addTextChannel = (serverName, channelName) => (dispatch, getState) => {
  const { channels, bits, ui } = getState();
  const numChannels = Object.keys(channels.textByServer[serverName] || {}).length + Object.keys(channels.voiceByServer[serverName] || {}).length;
  const cost = 1000 * (1.2 ** numChannels);

  if (ui.devMode || bits >= cost) {
    if (!ui.devMode) {
      dispatch(spendBits(cost));
    }
    dispatch({
      type: ADD_TEXT_CHANNEL,
      payload: { serverName, channel: { name: channelName, type: 'text', messageCount: 0 } },
    });
  }
};

export const addVoiceChannel = (serverName, channelName) => (dispatch, getState) => {
  const { channels, bits, ui } = getState();
  const numChannels = Object.keys(channels.textByServer[serverName] || {}).length + Object.keys(channels.voiceByServer[serverName] || {}).length;
  const cost = 1000 * (1.2 ** numChannels);

  if (ui.devMode || bits >= cost) {
    if (!ui.devMode) {
      dispatch(spendBits(cost));
    }
    dispatch({
      type: ADD_VOICE_CHANNEL,
      payload: { serverName, channel: { name: channelName, type: 'voice', users: [] } },
    });
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

export const addUser = (serverName, userName) => (dispatch, getState) => {
  const { users, bits, ui } = getState();
  const numUsers = (users.usersByServer[serverName] || []).length;
  const cost = 100 * (1.1 ** numUsers);

  if (ui.devMode || bits >= cost) {
    if (!ui.devMode) {
      dispatch(spendBits(cost));
    }
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

export const spendBits = (amount) => ({
  type: SPEND_BITS,
  payload: amount,
});

export const toggleDevMode = () => ({
  type: TOGGLE_DEV_MODE,
});
