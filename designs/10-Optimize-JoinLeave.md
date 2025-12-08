# Design Doc 10: Optimize Join/Leave Simulation

## 1. Overview

This document outlines a refactoring of the user join/leave simulation logic for voice channels. The current implementation iterates through all users and gives each a random chance to move, which is inefficient for large user counts.

The new approach will iterate over each *voice channel* and calculate a random number of users to join or leave, making the simulation more performant and scalable. This requires a state change to more efficiently track which users are currently in a voice channel, preventing them from joining multiple channels simultaneously.

## 2. State Shape Changes

### 2.1. `users` Slice

To optimize checking if a user is already in a voice channel, we will add a new data structure to the `users` slice.

**Current State:**
```json
"users": {
  "usersByServer": {
    "ServerName": ["UserA", "UserB", "UserC"]
  }
}
```

**New State:**
A new key, `usersInVoiceByServer`, will be added. It will store a set of users who are currently in any voice channel on a given server, allowing for O(1) lookups.

```json
"users": {
  "usersByServer": {
    "ServerName": ["UserA", "UserB", "UserC"]
  },
  "usersInVoiceByServer": {
    "ServerName": {
      "UserA": true,
      "UserC": true
    }
  }
}
```

## 3. Reducer Changes

### 3.1. `usersReducer.js`

The `usersReducer` will be updated to manage the `usersInVoiceByServer` state.

-   **`USER_JOIN_VOICE` Action:**
    -   When a user joins a voice channel, add their `userName` to the `usersInVoiceByServer` map for the corresponding `serverName`.

-   **`USER_LEAVE_VOICE` Action:**
    -   When a user leaves a voice channel, remove their `userName` from the `usersInVoiceByServer` map.

-   **`ADD_USER` Action:**
    -   No change is required here. A new user is not in a voice channel by default.

## 4. Simulation Logic Changes

### 4.1. `simulation.js`

The user movement simulation logic within `runSimulation` will be completely rewritten.

**Old Logic:**
- Iterate over every user on every server.
- For each user, roll a random chance to move.
- If they move, find if they are in a channel, then decide whether to leave or join a new one.

**New Logic:**
- Iterate over each `serverName` in the state.
- For each server, iterate over each `voiceChannel`.
- For each channel:
    1.  **Leave Logic:**
        -   Calculate a random number of users to leave (e.g., 10% of users currently in the channel).
        -   Select that many random users from the channel's `users` array.
        -   For each selected user, dispatch a `userLeaveVoice` action.
    2.  **Join Logic:**
        -   Calculate a random number of users to join (e.g., 5% of the server's total users).
        -   Get a list of users on the server who are **not** currently in a voice channel. This can be done efficiently by filtering `users.usersByServer[serverName]` and checking against the `users.usersInVoiceByServer[serverName]` map.
        -   Select random users from this "available" list.
        -   For each selected user, dispatch a `userJoinVoice` action for the current channel.

## 5. Implementation Steps

1.  **State and Reducer:**
    -   Update `src/reducers/usersReducer.js` to add the `usersInVoiceByServer` to the initial state and handle the `USER_JOIN_VOICE` and `USER_LEAVE_VOICE` actions to manage its state.
    -   Files to update: `src/reducers/usersReducer.js`.

2.  **Simulation Logic:**
    -   Rewrite the user movement section in `src/simulation.js` to implement the new channel-centric iteration logic described above.
    -   Files to update: `src/simulation.js`.