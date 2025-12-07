# Design Doc 04: Improved User Simulation

## 1. Overview

This document outlines the plan to enhance the user simulation in the application. The goal is to make the user activity feel more dynamic and realistic. This will involve simulating users joining and leaving voice channels, attributing chat messages to specific users on the server, and expanding the seed data for servers, channels, users, and messages.

## 2. Key Features

*   **Dynamic Voice Channels:** Users will randomly join and leave voice channels over time.
*   **Attributed Messages:** New chat messages will be authored by users who are currently members of that server.
*   **Expanded Seed Data:** New, structured seed data will be generated to support a more varied and thematic environment.

## 3. Data Generation

As a preliminary step, we will generate the following data files and place them in the `public/` directory so they can be fetched by the application.

*   **`public/servers_and_channels.json`:**
    *   A JSON file containing a list of 10 unique, thematic server names (e.g., "Gaming Central," "Music Production Hub").
    *   Each server object will have a list of 10 thematically relevant channel names (both text and voice).
*   **`public/users.json`:**
    *   A JSON file containing a list of 25 random, realistic usernames.
*   **`public/messages.json`:**
    *   A JSON file containing a list of 100 random, generic chat messages.

## 4. Redux State and Reducer Modifications

*   **`usersReducer.js`:**
    *   The `users` slice will now store user information, including which voice channel they are currently in (if any).
    *   A new reducer will be created to manage the state of users, including their current location (server and voice channel).
    *   State shape example:
        ```json
        "users": {
          "byId": { "user1": { "id": "user1", "name": "Gamer123", "currentVoiceChannel": "channel5" } },
          "allIds": ["user1"]
        }
        ```
*   **`serversReducer.js`:**
    *   The `servers` slice will be updated to include a list of user IDs for each server, representing the server's member list.
*   **`channelsReducer.js`:**
    *   The `channels` slice (specifically for voice channels) will be updated to include a list of user IDs for users currently in that channel.

## 5. New Actions

*   **`SIMULATE_USER_ACTIVITY`:** A new thunk action will be created to simulate user activity. This action will be dispatched periodically (e.g., every few seconds).
*   **`USER_JOIN_VOICE`:** An action to move a user into a voice channel.
*   **`USER_LEAVE_VOICE`:** An action to remove a user from a voice channel.

## 6. Action Modifications

*   **`addRandomServer`:** This action creator will be converted to a thunk. It will fetch the `/servers_and_channels.json` file, pick a random server name that is not already in use, and then dispatch the `ADD_RANDOM_SERVER` action with the new server name.
*   **`addRandomChannel`:** This action creator will also be converted to a thunk. Given a `serverId`, it will fetch the `/servers_and_channels.json` file, find the corresponding server theme, and pick a random channel name from that theme's channel list that is not already in use on that server. It will then dispatch the `ADD_RANDOM_CHANNEL` action.
*   **`addUser`:** This action will be updated to a thunk that fetches the `/users.json` file, picks a random username that is not already in use on the specified server, and dispatches the `ADD_USER` action.

## 7. Simulation Logic

*   A new simulation engine will be implemented, likely in a file like `src/simulation.js`.
*   On a set interval (`setInterval`), the simulation will trigger:
    1.  **User Movement:** Randomly decide if a user should join or leave a voice channel.
        *   If joining, pick a random user and a random voice channel on their current server.
        *   If leaving, pick a user who is currently in a voice channel.
    2.  **New Message:** Randomly decide if a new message should be generated.
        *   If so, pick a random server and a random text channel.
        *   Pick a random user from that server's member list to be the author.
        *   Pick a random message from the generated `messages.json` file.
        *   Dispatch the `ADD_RANDOM_MESSAGE` action with the new message, author, and channel.

## 8. Component Modifications

*   **`VoiceChannelList` (within `ChannelList.js`):**
    *   The component will be updated to render the list of users currently inside each voice channel, below the channel name.
*   **`Message` (within `ChatPanel.js`):**
    *   The `Message` component will now display the username of the message author.

## 9. Implementation Plan

1.  Generate the three new data files: `servers_and_channels.json`, `users.json`, and `messages.json`, and place them in `public/`.
2.  Update the initial data loading logic to fetch and process these new JSON files.
3.  Implement the new reducers (`usersReducer`) and update existing ones (`serversReducer`, `channelsReducer`, `messagesReducer`).
4.  Create the new user activity actions (`USER_JOIN_VOICE`, `USER_LEAVE_VOICE`).
5.  Implement the `simulation.js` logic with a `setInterval` dispatcher.
6.  Update the `ChannelList.js` and `ChatPanel.js` components to display the new user and message attribution data.
7.  Verify all changes with `npm run build`.