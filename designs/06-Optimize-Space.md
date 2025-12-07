# Design Doc 06: State Compression via Server-Centric Maps

## 1. Overview

This document outlines a new, aggressive state compression strategy. The goal is to fundamentally restructure the Redux state to be server-centric, minimizing data duplication and eliminating redundant identifiers. The current object-based state will be refactored into a series of maps keyed by server name, holding only the essential primitive data (strings) required by the simulation and UI. This will significantly reduce the memory footprint.

## 2. Goals

1.  **Eliminate All IDs:** Remove unique identifiers (`uuidv4`) for servers, channels, and messages.
2.  **Server-Centric State:** Restructure the `users`, `channels`, and `messages` state slices to be maps keyed by server name.
3.  **Remove `allIds`:** Eradicate the `allIds` arrays from all state slices, relying on `Object.keys()` or `Object.values()` for iteration.
4.  **Maximize Primitive Storage:** Store data as arrays of strings wherever possible, avoiding nested objects for users within the new maps.

## 3. Proposed State Structure

The entire Redux state will be reshaped to conform to the following structure.

```json
{
  "servers": {
    "Cool Server": {
      "name": "Cool Server"
    },
    "Gaming Zone": {
      "name": "Gaming Zone"
    }
  },
  "users": {
    "usersByServer": {
      "Cool Server": ["Alice", "Bob"],
      "Gaming Zone": ["Charlie"]
    }
  },
  "channels": {
    "textByServer": {
      "Cool Server": {
        "general": { "name": "general", "messageCount": 15 },
        "random": { "name": "random", "messageCount": 3 }
      },
      "Gaming Zone": {
        "memes": { "name": "memes", "messageCount": 101 }
      }
    },
    "voiceByServer": {
      "Cool Server": {
        "Lobby": { "name": "Lobby", "users": ["Alice"] },
        "AFK": { "name": "AFK", "users": [] }
      },
      "Gaming Zone": {
        "Squad A": { "name": "Squad A", "users": ["Charlie"] }
      }
    }
  },
  "messages": {
    "byServer": {
      "Cool Server": {
        "general": [
          { "author": "Alice", "content": "Hello!" },
          { "author": "Bob", "content": "Hi there." }
        ],
        "random": []
      },
      "Gaming Zone": {
        "memes": [
          { "author": "Charlie", "content": "Let's play." }
        ]
      }
    }
  },
  "ui": {
    "selectedServer": "Cool Server",
    "selectedChannel": "general"
  }
}
```

## 4. Detailed Action Plan

### 4.1. `src/utils/dataLoader.js`

-   **Task:** Rewrite `loadInitialData` to build the new state shape from `servers_and_channels.json`.
-   **Details:** The function will create a single server and its associated channels, populating the `servers`, `users.usersByServer`, `channels.textByServer`, and `channels.voiceByServer` maps.

### 4.2. Reducers (`src/reducers/`)

-   **Task:** Overhaul all reducers to manage the new state structure.
-   **`serversReducer.js`:**
    -   State shape: `{}` (a simple map of server objects).
    -   `ADD_RANDOM_SERVER`: Adds a new key `[server.name]` to the map.
-   **`usersReducer.js`:**
    -   State shape: `{ usersByServer: {} }`.
    -   `ADD_USER`: Finds the correct array in `state.usersByServer[serverName]` and pushes the new `userName`.
    -   `USER_JOIN_VOICE`/`USER_LEAVE_VOICE`: These actions will likely need to be re-thought, as user state (like `currentVoiceChannel`) is no longer stored. The logic may need to live entirely within the `channelsReducer`.
-   **`channelsReducer.js`:**
    -   State shape: `{ textByServer: {}, voiceByServer: {} }`.
    -   `ADD_RANDOM_CHANNEL`: Appends the new channel name to the correct array in either `textByServer` or `voiceByServer` based on channel type.
    -   This reducer will likely need to manage which users are in which voice channels, perhaps with a new state slice like `voiceChannelOccupants: { "[channelName]": ["user1", "user2"] }`.
-   **`messagesReducer.js`:**
    -   State shape: `{ byServer: {} }`.
    -   `ADD_RANDOM_MESSAGE`: Appends a `{ author, content }` object to the `state.byServer[serverName][channelName]` array.

### 4.3. Actions (`src/actions/index.js`)

-   **Task:** Update all action creators to support the new state and payloads.
-   **Details:** Payloads will now carry `serverName` instead of `serverId`, `channelName` instead of `channelId`, etc. The logic within thunks for creating new entities will need to be substantially rewritten.

### 4.4. Simulation (`src/simulation.js`)

-   **Task:** Rewrite the simulation logic to be compatible with the new state shape.
-   **Details:**
    -   Selecting a random server will involve `Object.keys(servers)`.
    -   Selecting users/channels will involve accessing the maps: `users.usersByServer[serverName]`.
    -   The logic for user voice movement needs a complete redesign based on the new channel state.

### 4.5. UI Components (`src/components/`)

-   **Task:** Update all selectors and rendering logic in the UI components.
-   **`ServerList.js`:** Will iterate over `Object.keys(state.servers)`.
-   **`ChannelList.js`:** Will get channel arrays from `state.channels.textByServer[selectedServer]` and `state.channels.voiceByServer[selectedServer]`.
-   **`ChatPanel.js`:** Will get messages from `state.messages.byServer[selectedServer][selectedChannel]`.

This is a significant and breaking refactor. The implementation will proceed step-by-step, starting with the `dataLoader` and reducers.