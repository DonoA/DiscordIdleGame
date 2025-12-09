# 11: Add Types

This document outlines the TypeScript interfaces for the key data structures in the application, including the Redux store and the data cache.

## Redux Store

The Redux store is the single source of truth for the application's state. The following interfaces define the shape of the store.

### Root State

The root state is the combination of all the individual reducers.

```typescript
interface RootState {
  servers: ServersState;
  channels: ChannelsState;
  messages: MessagesState;
  ui: UIState;
  users: UsersState;
  bits: BitsState;
}
```

### Servers State

The `servers` slice of the state stores information about the servers.

```typescript
interface Server {
  name: string;
}

interface ServersState {
  [serverName: string]: Server;
}
```

### Channels State

The `channels` slice of the state stores information about the text and voice channels for each server.

```typescript
interface TextChannel {
  name: string;
  messageCount: number;
}

interface VoiceChannel {
  name: string;
  users: string[];
}

interface ChannelsState {
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
```

### Messages State

The `messages` slice of the state stores the messages for each text channel.

```typescript
interface Message {
  author: string;
  content: string;
}

interface MessagesState {
  byServer: {
    [serverName: string]: {
      [channelName: string]: Message[];
    };
  };
}
```

### UI State

The `ui` slice of the state stores information about the UI, such as the selected server and channel.

```typescript
interface UIState {
  selectedServer: string | null;
  selectedChannel: string | null;
  devMode: boolean;
  tick: number;
}
```

### Users State

The `users` slice of the state stores information about the users in each server.

```typescript
interface UsersState {
  usersByServer: {
    [serverName: string]: string[];
  };
  usersInVoiceByServer: {
    [serverName: string]: {
      [userName: string]: boolean;
    };
  };
}
```

### Bits State

The `bits` slice of the state stores the user's bits.

```typescript
interface BitsState {
  totalBits: number;
  currentBits: number;
}
```

## Data Cache

The data cache stores the data fetched from the server to avoid re-fetching it on every render.

```typescript
interface ServerData {
  name: string;
  channels: {
    name: string;
    type: 'text' | 'voice';
  }[];
}

interface UserData extends Array<string> {}

interface MessageData extends Array<string> {}

interface DataCache {
  servers: ServerData[];
  users: UserData;
  messages: MessageData;
}