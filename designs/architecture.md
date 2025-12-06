# Design Document: Discord-like Chat Application

## 1. Overview

This document outlines the design for a frontend-only chat application interface similar to Discord. The application will be built with React and Redux. It will be a view-only demonstration and will not communicate with a real server. All data (servers, channels, messages) will be hardcoded into the application.

## 2. System Architecture

The application will be a standalone frontend application.

*   **Frontend (Client):** A single-page application (SPA) built with React and Redux for state management. All data will be loaded from a hardcoded initial state within the Redux store. There will be no backend communication.

## 3. Frontend Design (React & Redux)

The UI will be composed of four main vertical panels.

### 3.1. Component Breakdown

*   **`App` (Root Component):**
    *   Manages the overall layout.
    *   Initializes the Redux store with hardcoded data.

*   **`ServerList` (Left Panel):**
    *   Displays a vertical list of server icons.
    *   On click, it dispatches an action to change the `selectedServer` in the Redux store.
    *   Receives the list of servers from the Redux store.

*   **`ChannelList` (Middle-Left Panel):**
    *   Displays voice and text channels for the `selectedServer`.
    *   Separates channels into "Text Channels" and "Voice Channels" categories.
    *   On click of a text channel, it dispatches an action to change the `selectedChannel` in the Redux store.
    *   Receives the channel list for the current server from the Redux store.

*   **`ChatPanel` (Main Panel):**
    *   The primary view for displaying messages.
    *   Contains a `MessageList` component to display messages.
    *   The `MessageInput` component will be a static, non-functional visual element.

*   **`MessageList`:**
    *   Displays a scrollable list of hardcoded messages for the `selectedChannel`.
    *   Receives messages directly from the Redux store.

*   **`MessageInput`:**
    *   A static visual component that does not send messages.

*   **`ControlPanel` (Right Panel):**
    *   Displays buttons to add random data.
    *   Contains buttons: "Add Random Server", "Add Random Channel", "Add Random Message".
    *   On click, each button will dispatch a corresponding action to update the Redux store.

### 3.2. Redux State Management

The Redux store will manage the application's global state.

**State Shape:**

```json
{
  "currentUser": {
    "id": "user1",
    "username": "Roo"
  },
  "servers": {
    "byId": {
      "server1": { "id": "server1", "name": "General", "channels": ["channel1", "channel2"] }
    },
    "allIds": ["server1"]
  },
  "channels": {
    "byId": {
      "channel1": { "id": "channel1", "name": "general-text", "type": "text" },
      "channel2": { "id": "channel2", "name": "General Voice", "type": "voice" }
    },
    "allIds": ["channel1", "channel2"]
  },
  "messages": {
    "byChannel": {
      "channel1": [
        { "id": "msg1", "author": "Roo", "content": "Hello!" }
      ]
    }
  },
  "ui": {
    "selectedServer": "server1",
    "selectedChannel": "channel1"
  }
}
```

**Actions:**
*   `SELECT_SERVER`
*   `SELECT_CHANNEL`
*   `LOAD_INITIAL_DATA`
*   `ADD_RANDOM_SERVER`
*   `ADD_RANDOM_CHANNEL`
*   `ADD_RANDOM_MESSAGE`

## 4. Next Steps

1.  **Project Setup:** Initialize a new project using Create React App.
2.  **Redux Store:** Set up the Redux store with the initial hardcoded state.
3.  **Component Development:** Build out the React components (`ServerList`, `ChannelList`, `ChatPanel`, `ControlPanel`).
4.  **State Connection:** Connect components to the Redux store to display the data.
5.  **Styling:** Apply CSS to match the Discord-like interface.