# Design Doc 09: General Improvements (Detailed)

This document provides a detailed implementation plan for a series of improvements to the UI, game systems, and simulation logic, expanding upon the ideas in `08-General-Improvements.md`.

## 1. UI Enhancements

### 1.1. Scrolling for Server/Channel Lists
-   **Goal:** Add vertical scrolling to the server and channel lists while hiding the scrollbar.
-   **Files to Update:**
    -   `src/App.css`: Add the following CSS:
        ```css
        .server-list, .channel-list {
          overflow-y: auto;
          scrollbar-width: none; /* Firefox */
        }
        .server-list::-webkit-scrollbar, .channel-list::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
        ```

### 1.2. Expand Control Panel Width
-   **Goal:** Increase the width of the `ControlPanel`.
-   **Files to Update:**
    -   `src/App.css`: Update the `.control-panel` class:
        ```css
        .control-panel {
          flex: 0 0 300px; /* Or a suitable width */
        }
        ```

### 1.3. Number Formatting
-   **Goal:** Format large numbers to be more readable (e.g., 1.2k, 3.5M).
-   **Files to Update:**
    -   `src/utils/formatting.js` (New File): Create a function `formatNumber(num)`.
    -   `src/components/ControlPanel.js`: Import and use `formatNumber` for costs and bit display.
    -   `src/components/ChannelList.js`: Use `formatNumber` for `messageCount`.

## 2. Simulation and Game Logic

### 2.1. Global Tick Counter
-   **Goal:** Drive the simulation with a global tick counter in the Redux state.
-   **Files to Update:**
    -   `src/actions/types.js`: Add `export const INCREMENT_TICK = 'INCREMENT_TICK';`.
    -   `src/reducers/uiReducer.js`: Add `tick: 0` to `initialState` and a case for `INCREMENT_TICK`.
    -   `src/actions/index.js`: Create `export const incrementTick = () => ({ type: INCREMENT_TICK });`.
    -   `src/App.js`:
        -   Import `useSelector` and `incrementTick`.
        -   In `App` component: `const tick = useSelector(state => state.ui.tick);`
        -   Add a `useEffect` to dispatch `incrementTick` on an interval.
        -   Import `runSimulation` from `simulation.js`.
        -   Add another `useEffect` that calls `runSimulation(store)` whenever `tick` changes.
    -   `src/simulation.js`:
        -   Remove the existing `setInterval` and `simulationLoop`.
        -   Rename `startSimulation` to `runSimulation` and have it accept the `store` as an argument.
        -   All logic from the old `simulationLoop` will be placed inside `runSimulation`.

### 2.2. Per-User Message Simulation
-   **Goal:** Each user has a chance to post a message each tick.
-   **Files to Update:**
    -   `src/simulation.js`: In `runSimulation`, replace the current message logic with a loop checks each channel and multiplies the number of users per server by a small chance value to see how many messages are posted to that channel

### 2.3. Floating Point Bits
-   **Goal:** Track bits as a float, display as an integer.
-   **Files to Update:**
    -   `src/components/ControlPanel.js`: When displaying bits, use `Math.floor(bits)`.

## 3. Data Management

### 3.1. Centralized JSON Data Cache
-   **Goal:** Load JSON files once and cache them.
-   **Files to Update:**
    -   `src/utils/dataCache.js` (New File):
        -   Create a `let cache = null;`
        -   Export an async function `getData()` that checks if `cache` is null. If so, it fetches all JSON files, stores them in `cache`, and returns it. Otherwise, it returns the existing `cache`.
    -   `src/utils/dataLoader.js`: Update `loadInitialData` to use `getData()` from the cache.
    -   `src/components/ControlPanel.js`: Modify the `useEffect` to use `getData()`.