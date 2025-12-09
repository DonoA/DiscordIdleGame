import { getData } from '../utils/dataCache';
import { loadInitialData as fetchData } from '../utils/dataLoader';
import {
  SELECT_SERVER,
  SELECT_CHANNEL,
  LOAD_INITIAL_DATA,
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
  INCREMENT_TICK,
} from './types';

export const selectServer = (serverName: string) => ({
  type: SELECT_SERVER,
  payload: serverName,
});

export const selectChannel = (channelName: string) => ({
  type: SELECT_CHANNEL,
  payload: channelName,
});

export const loadInitialData = () => async (dispatch: any) => {
  console.log('Loading initial server data:', new Error().stack);
  const data = await fetchData();
  dispatch({
    type: LOAD_INITIAL_DATA,
    payload: data,
  });
};

export const addServer = (serverName: string) => (dispatch: any, getState: any) => {
  dispatch({
    type: ADD_SERVER,
    payload: { server: { name: serverName } },
  });
};

export const addTextChannel = (serverName: string, channelName: string) => (dispatch: any, getState: any) => {
  dispatch({
    type: ADD_TEXT_CHANNEL,
    payload: { serverName, channel: { name: channelName, type: 'text', messageCount: 0 } },
  });
};

export const addVoiceChannel = (serverName: string, channelName: string) => (dispatch: any, getState: any) => {
  dispatch({
    type: ADD_VOICE_CHANNEL,
    payload: { serverName, channel: { name: channelName, type: 'voice', users: [] } },
  });
};

export const userJoinVoice = (serverName: string, channelName: string, userNames: string[]) => ({
  type: USER_JOIN_VOICE,
  payload: { serverName, channelName, userNames },
});

export const userLeaveVoice = (serverName: string, channelName: string, userNames: string[]) => ({
  type: USER_LEAVE_VOICE,
  payload: { serverName, channelName, userNames },
});

export const addRandomMessage = (serverName: string, channelName: string, userName: string) => async (dispatch: any, getState: any) => {
  const { users } = getState();
  const serverUsers = users.usersByServer[serverName];

  if (serverUsers) {
    const { messages: messageList } = await getData();

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

export const addUser = (serverName: string, userName: string) => (dispatch: any, getState: any) => {
  dispatch({
    type: ADD_USER,
    payload: { serverName, userName },
  });
};

export const incrementBits = (amount: number) => ({
  type: INCREMENT_BITS,
  payload: amount,
});

export const spendBits = (amount: number) => ({
  type: SPEND_BITS,
  payload: amount,
});

export const toggleDevMode = () => ({
  type: TOGGLE_DEV_MODE,
});

export const incrementTick = () => ({
  type: INCREMENT_TICK,
});

