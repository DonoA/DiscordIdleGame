import { v4 as uuidv4 } from 'uuid';
import {
  SELECT_SERVER,
  SELECT_CHANNEL,
  LOAD_INITIAL_DATA,
  ADD_RANDOM_SERVER,
  ADD_RANDOM_CHANNEL,
  ADD_RANDOM_MESSAGE,
} from './types';

export const selectServer = (serverId) => ({
  type: SELECT_SERVER,
  payload: serverId,
});

export const selectChannel = (channelId) => ({
  type: SELECT_CHANNEL,
  payload: channelId,
});

export const loadInitialData = (data) => ({
  type: LOAD_INITIAL_DATA,
  payload: data,
});

export const addRandomServer = () => ({
  type: ADD_RANDOM_SERVER,
  payload: {
    id: uuidv4(),
    name: `Server ${Math.floor(Math.random() * 1000)}`,
    channels: [],
  },
});

export const addRandomChannel = (serverId) => ({
  type: ADD_RANDOM_CHANNEL,
  payload: {
    serverId,
    channel: {
      id: uuidv4(),
      name: `channel-${Math.floor(Math.random() * 1000)}`,
      type: 'text',
    },
  },
});

export const addRandomMessage = (channelId) => ({
  type: ADD_RANDOM_MESSAGE,
  payload: {
    channelId,
    message: {
      id: uuidv4(),
      author: 'Roo',
      content: `Random message: ${uuidv4()}`,
    },
  },
});
