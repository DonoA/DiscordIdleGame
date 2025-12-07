# Design Document: 02 - Add Users and Periodic Messaging

## 1. Overview

This document details the plan to introduce a user system into the Discord-like application. This will involve adding functionality to create new users, associate them with servers, and have them periodically send messages to channels within their server. The UI will also be updated to display the number of users in a server and the number of messages in each channel.

## 2. System Architecture Changes

The application will remain a frontend-only experience. The new user functionality will be managed entirely within the client-side Redux store and component logic.

*   **User Management:** A new Redux state slice will be added to manage users. Each user will be associated with a single server.
*   **Periodic Messaging:** A `setInterval` loop will be used to trigger users to send messages to random channels within their server at a regular cadence.
*   **UI Updates:** The `ChannelList` component will be updated to display user and message counts. The `ControlPanel` will get a new button for adding users.

## 3. Implementation Plan

### 3.1. Redux State and Actions

The Redux store will be expanded to include a `users` slice.

**New State Slice (`users`):**

```json
{
  "users": {
    "byId": {
      "user1": { "id": "user1", "name": "Bot Alice", "serverId": "server1" }
    },
    "allIds": ["user1"]
  }
}
```

**State Modifications:**

*   The `servers` slice will be updated to include a `users` array:
    ```json
    "server1": { "id": "server1", "name": "General", "channels": ["channel1"], "users": ["user1"] }
    ```

**New Actions:**

*   `ADD_USER`: Dispatched to add a new user to a specific server.

### 3.2. Component Modifications

*   **`ControlPanel.js`:**
    *   A new "Add User" button will be added.
    *   Clicking this button will dispatch the `ADD_USER` action, requiring the `selectedServer` ID as a payload. An alert will be shown if no server is selected.

*   **`ChannelList.js`:**
    *   The component will be updated to display the total number of users in the selected server. The `server` object from the Redux store will contain the `users` array, so `server.users.length` can be used.
    *   It will also display the total number of messages for each channel. The `messages.byChannel[channel.id].length` can be used for this count.

### 3.3. Periodic Messaging Logic

A new service or a hook within the `App.js` component will be created to manage the periodic messaging.

*   **`useEffect` with `setInterval`:** Inside the main `App` component, a `useEffect` hook will set up a `setInterval` that runs every few seconds (e.g., 5 seconds).
*   **Message Dispatching:** On each interval, the logic will:
    1.  Get the list of all users from the Redux store.
    2.  Select a random user.
    3.  Get the server associated with that user.
    4.  Select a random text channel from that server.
    5.  Dispatch an `addRandomMessage` action for that user in that channel. The message content can be a simple, randomly generated string.

## 4. Next Steps

1.  **Update Redux State:** Add the `users` slice to the root reducer and modify the `servers` slice to include a `users` array.
2.  **Implement `ADD_USER` Action:** Create the action creator and update the `usersReducer` and `serversReducer` to handle adding a new user.
3.  **Update `ControlPanel`:** Add the "Add User" button and its corresponding `onClick` handler.
4.  **Update `ChannelList`:** Modify the component to display the user and message counts.
5.  **Implement Periodic Messaging:** Add the `setInterval` logic to the `App.js` component to have users send messages periodically.
6.  **Testing:** Manually verify that adding users, seeing the updated counts, and the periodic messaging all work as expected.