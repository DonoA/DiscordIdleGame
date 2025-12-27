import { RootState, Server, UsersState, ChannelsState } from '../types';
import { generateUsers, generateTextChannelNames, generateVoiceChannelNames } from '../utils/nameHelpers';

const COOKIE_NAME = 'discordIdleGameState';

// The state to be saved in the cookie.
export interface SerializableState {
  servers: { [serverName: string]: Server & { userCount: number; textChannelCount: number; voiceChannelCount: number } };
  bits: RootState['bits'];
}

export const saveState = (state: RootState) => {
  try {
    const serializableServers: SerializableState['servers'] = {};
    for (const serverName in state.servers) {
      serializableServers[serverName] = {
        ...state.servers[serverName],
        userCount: (state.users.usersByServer[serverName] || []).length,
        textChannelCount: Object.keys(state.channels.textByServer[serverName] || {}).length,
        voiceChannelCount: Object.keys(state.channels.voiceByServer[serverName] || {}).length,
      };
    }

    const simplifiedState: SerializableState = {
      servers: serializableServers,
      bits: state.bits,
    };
    const serializedState = JSON.stringify(simplifiedState);
    document.cookie = `${COOKIE_NAME}=${serializedState};path=/;max-age=31536000`;
    console.log("State saved to cookie.");
  } catch (err) {
    console.error("Failed to save state to cookie:", err);
  }
};

export const loadState = async (): Promise<Partial<RootState> | undefined> => {
  try {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_NAME}=`));
    if (!cookieValue) {
      return undefined;
    }

    const serializedState = cookieValue.split('=')[1];
    if (serializedState === null || serializedState === 'undefined') {
      return undefined;
    }

    const parsedState: SerializableState = JSON.parse(serializedState);

    const servers: { [key: string]: Server } = {};
    const users: UsersState = { usersByServer: {}, usersInVoiceByServer: {} };
    const channels: ChannelsState = { textByServer: {}, voiceByServer: {} };

    for (const serverName in parsedState.servers) {
      const { userCount, textChannelCount, voiceChannelCount, ...serverData } = parsedState.servers[serverName];
      servers[serverName] = serverData;

      // Rehydrate users
      const userNames = await generateUsers(userCount);
      users.usersByServer[serverName] = userNames.map(u => u.name);

      // Rehydrate channels
      const textChannelNames = await generateTextChannelNames(serverName, textChannelCount);
      channels.textByServer[serverName] = {};
      for (const name of textChannelNames) {
        channels.textByServer[serverName][name] = { name, messageCount: 0 };
      }
      const voiceChannelNames = await generateVoiceChannelNames(serverName, voiceChannelCount);
      channels.voiceByServer[serverName] = {};
      for (const name of voiceChannelNames) {
        channels.voiceByServer[serverName][name] = { name, users: [] };
      }
    }

    const selectedServer = Object.keys(servers)[0];
    const selectedChannel = selectedServer
      ? Object.keys(channels.textByServer[selectedServer])[0]
      : null;

    // The loaded state is partial and will be merged with the initial state
    return {
      servers,
      users,
      channels,
      bits: parsedState.bits,
      ui: {
        selectedServer: Object.keys(servers)[0],
        selectedChannel: selectedChannel,
        devMode: false,
        tick: 0,
      },
    };
  } catch (err) {
    console.error("Failed to load state from cookie:", err);
    return undefined;
  }
};