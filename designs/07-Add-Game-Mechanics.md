# Design Doc 07: Add Game Mechanics

## 1. Overview

This document outlines the implementation of a currency system ("bits") to govern the creation of in-app resources: servers, channels, and users. This introduces a game-like progression system where resource creation is constrained by the player's accumulated bits.

A "dev mode" will be included to allow for unrestricted resource creation for testing and development. The UI will also be updated to support bulk purchasing of resources.

## 2. State Shape Changes

### 2.1. `ui` Slice

The `ui` slice will be extended to manage the dev mode status.

```json
"ui": {
  "selectedServer": "...",
  "selectedChannel": "...",
  "devMode": false
}
```

### 2.2. Cost Calculation (No State Change)

Costs will be calculated dynamically within the UI and action thunks, not stored in the state. This removes the need for a `game` slice.

The cost for a new resource will be based on the number of existing resources of that type, using the following formulas:

-   **Server Cost**: `10000 * (1.5 ^ numServers)`
-   **Channel Cost (Text/Voice)**: `1000 * (1.2 ^ numChannelsInServer)`
-   **User Cost**: `100 * (1.1 ^ numUsersInServer)`

## 3. Reducer Changes

### 3.1. `uiReducer`

- **Action:** `TOGGLE_DEV_MODE`
- **Functionality:** Toggles the `devMode` boolean in the `ui` slice.

### 3.2. `bitsReducer`

- **Action:** `SPEND_BITS`
- **Functionality:** Decrements the bit count by the specified amount. This action will be dispatched by the thunks that create resources.

### 3.3. `serversReducer`, `channelsReducer`, `usersReducer`

- These reducers will be modified to handle bulk creation actions (e.g., `ADD_SERVERS`, `ADD_CHANNELS`, `ADD_USERS`).

## 4. Action Changes

The existing actions for adding a server, channel, or user will be converted into Redux Thunks.

### 4.1. `addServer(serverName)` Thunk

1.  Get current state using `getState()`.
2.  Calculate the current cost to add a server using the formula `10000 * (1.5 ^ numServers)`.
3.  Check if `ui.devMode` is `false`.
4.  If not in dev mode, check if `bits.count` is sufficient to cover the calculated cost.
5.  If bits are insufficient, `return` without dispatching anything.
6.  If bits are sufficient (or in dev mode), dispatch a `SPEND_BITS` action with the calculated cost.
7.  Dispatch the original `ADD_SERVER` action.

*Similar logic will be applied to `addTextChannel`, `addVoiceChannel`, and `addUser` thunks.*

## 5. UI Changes (`ControlPanel.js`)

The `ControlPanel` will be updated to include:

1.  **Dev Mode Toggle:** A checkbox to dispatch the `TOGGLE_DEV_MODE` action.
2.  **Bulk Purchase Buttons:** For each resource type (server, channel, user), add buttons for "Buy 10" and "Buy 100".
3.  **Cost Display:** Display the dynamically calculated bit cost next to each creation button. The component will need to read the number of existing items from the state to perform the calculation.
4.  **Conditional Disabling:** Buttons will be disabled if the user does not have enough bits (unless dev mode is on).

### Example: Server Creation UI

```
- [ ] Dev Mode

- Add Server (Cost: [calculated]) [Buy] [Buy 10] [Buy 100]
- Add Text Channel (Cost: [calculated]) [Buy] [Buy 10] [Buy 100]
- Add Voice Channel (Cost: [calculated]) [Buy] [Buy 10] [Buy 100]
- Add User (Cost: [calculated]) [Buy] [Buy 10] [Buy 100]
```

## 6. Implementation Steps

1.  **State & Reducers:**
    -   Update `uiReducer` with `TOGGLE_DEV_MODE`.
    -   Add `SPEND_BITS` case to `bitsReducer`.
    -   Update resource reducers to handle bulk additions.
2.  **Actions:**
    -   Convert `addServer`, `addTextChannel`, `addVoiceChannel`, `addUser` to thunks with cost-checking logic.
3.  **UI:**
    -   Update `ControlPanel.js` with the new toggle and buttons.
    -   Connect UI to dispatch new actions and calculate costs based on the current state.
    -   Implement conditional disabling based on bit balance and dev mode status.