export interface RootState {
  servers: ServersState;
  channels: ChannelsState;
  messages: MessagesState;
  ui: UIState;
  users: UsersState;
  bits: BitsState;
}

export interface Server {
  name: string;
  moderators: number;
  influencers: number;
}

export interface ServersState {
  [serverName: string]: Server;
}

export interface TextChannel {
  name: string;
  messageCount: number;
}

export interface VoiceChannel {
  name: string;
  users: string[];
}

export interface ChannelsState {
  textByServer: {
    [serverName: string]: {
      [channelName: string]: TextChannel;
    };
  };
  voiceByServer: {
    [serverName: string]: {
      [channelName: string]: VoiceChannel;
    };
  };
}

export interface Message {
  author: string;
  content: string;
}

export interface MessagesState {
  byServer: {
    [serverName: string]: {
      [channelName: string]: Message[];
    };
  };
}

export interface UIState {
  selectedServer: string | null;
  selectedChannel: string | null;
  devMode: boolean;
  tick: number;
}

export interface UsersState {
  usersByServer: {
    [serverName: string]: string[];
  };
  usersInVoiceByServer: {
    [serverName: string]: {
      [userName: string]: boolean;
    };
  };
}

export interface BitsState {
  totalBits: number;
  currentBits: number;
}

export interface ServerData {
  name: string;
  channels: {
    name: string;
    type: 'text' | 'voice';
  }[];
}

export interface UserData extends Array<string> {}

export interface MessageData extends Array<string> {}

export interface DataCache {
  servers: ServerData[];
  users: UserData;
  messages: MessageData;
}

export interface PayloadAction<T> {
  type: string;
  payload: T;
}