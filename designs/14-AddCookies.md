# Design Doc: 14-AddCookies

This document outlines the design for persisting the game state using browser cookies. This will allow users to refresh the page and resume their game where they left off.

## 1. Core Concept

The entire Redux state tree, which represents the complete game state, will be periodically serialized and saved to a browser cookie. When the application first loads, it will check for the presence of this cookie. If found, the state will be deserialized and used to hydrate the Redux store, restoring the user's previous session.

## 2. State Serialization and Storage

### 2.1. Saving the State
- **Trigger:** The game state will be saved to the cookie automatically on a regular interval (e.g., every 5-10 seconds) and potentially whenever a significant action is taken (like a purchase).
- **Mechanism:** A middleware will be added to the Redux store. This middleware will listen for store updates. On a throttled basis, it will get the current state using `store.getState()`, serialize the entire state object into a JSON string, and save it to a cookie named `discordIdleGameState`.
- **Data Compression:** To avoid exceeding cookie size limits (typically around 4KB), the JSON string will only store information about sever object and will repopulate the user and channel names at load time.

## 3. State Deserialization and Hydration

### 3.1. Loading the State
- **Trigger:** This will occur once when the application first initializes.
- **Mechanism:** Before the Redux store is created, a utility function will attempt to read the `discordIdleGameState` cookie.
- **Process:**
    1.  Read the raw value from the cookie.
    2.  If the value exists, parse the resulting JSON string back into a JavaScript object.
    3.  Generate user names, text channel names, and voice channel name
    4.  This object will then be passed as the `preloadedState` when creating the Redux store.
- **Error Handling:** If the cookie is malformed, corrupted, or fails to parse, the application should gracefully handle the error by ignoring the saved state and starting a fresh game with a warning printed to the user.

## 4. Game Reset Functionality

### 4.1. User Action
- **UI:** A "Reset Game" or "Start Over" button will be added to the `ControlPanel`.
- **Confirmation:** To prevent accidental data loss, clicking this button will trigger a confirmation dialog (e.g., `window.confirm()`) asking the user if they are sure they want to erase their progress.

### 4.2. Mechanism
- Upon confirmation, the application will perform two actions:
    1.  Delete the `discordIdleGameState` cookie from the browser.
    2.  Force a full page refresh (`window.location.reload()`).
- This will cause the application to reload without any `preloadedState`, effectively starting the game from the beginning.