# Design Document: Integrating Web-LLM for Bot Messages

## 1. Overview

This document outlines the plan to integrate the `web-llm` library into the Discord-like frontend application. The goal is to replace the current static "random message" generation with dynamically generated messages from a local, in-browser Large Language Model. This will provide more engaging and realistic chat content when the user clicks the "Add Random Message" button.

## 2. System Architecture Changes

The core architecture will remain a frontend-only React and Redux application. The key change will be the introduction of a new service responsible for managing the Web-LLM engine.

*   **`LLMService`:** A new module will be created to encapsulate all interactions with the `web-llm` library. This service will be responsible for initializing the chat engine, managing its state (e.g., loading, ready, error), and handling message generation requests.
*   **React Components:** The `ControlPanel` component will trigger the message generation, and the `ChatPanel` will display the results.
*   **Redux State:** The Redux store will be updated to manage the state of the LLM, including its initialization status and the content of generated messages.

## 3. Implementation Plan

### 3.1. Installation

The first step is to install the `web-llm` dependency into the project.

```bash
npm install @mlc-ai/web-llm
```

### 3.2. LLM Service (`src/llmService.js`)

A new service file will be created to handle the Web-LLM integration.

*   **Initialization:** The service will expose an `init()` function that creates a new `WebLLM.ChatModule` instance. This function will handle the asynchronous loading of the model and will update the Redux store to reflect the loading progress.
*   **Message Generation:** The service will have a `generateMessage(prompt)` function. This function will take a prompt string, interact with the loaded LLM engine to get a response, and return the generated message.
*   **Singleton Instance:** The service will manage a single instance of the chat engine to avoid re-initializing the model on every request.

### 3.3. Redux State and Actions

The Redux store will be updated to track the LLM's state and to handle asynchronous message generation.

**New State Slice (`llm`):**

```json
{
  "llm": {
    "isLoading": false,
    "isReady": false,
    "error": null
  }
}
```

**New Actions:**
*   `LLM_INIT_START`: Dispatched when model loading begins.
*   `LLM_INIT_SUCCESS`: Dispatched when the model is ready.
*   `LLM_INIT_ERROR`: Dispatched if model loading fails.
*   `ADD_BOT_MESSAGE_START`: Dispatched when a message generation is requested.
*   `ADD_BOT_MESSAGE_SUCCESS`: Dispatched when a message is successfully generated, containing the new message as a payload (similar to `ADD_RANDOM_MESSAGE`).

An asynchronous action creator (thunk) will be created to manage the entire process of generating a message, from dispatching the start action to interacting with the `LLMService` and finally dispatching the success or error action.

### 3.4. Component Modifications

*   **`LoadingIndicator.js`:** A new component will be created to display a loading message (e.g., "Loading LLM Model...") that will be displayed as an overlay on the entire application.
*   **`App.js`:** The root component will be responsible for initializing the `LLMService` on application load using a `useEffect` hook. It will also be updated to conditionally render the `LoadingIndicator` component when the `llm.isLoading` state is true.
*   **`ControlPanel.js`:** The `handleAddMessage` function will be modified to dispatch the new asynchronous thunk for generating a bot message instead of the static `addRandomMessage` action. The button's text will be updated, and it will be disabled while the LLM model is loading or a message is being generated.
*   **`ChatPanel.js`:** The `MessageList` will be updated to show a "Bot is typing..." indicator when a message is being generated.

## 4. Next Steps

1.  **Install `web-llm`:** Add the library to the project's dependencies.
2.  **Create `llmService.js`:** Implement the service to manage the Web-LLM engine.
3.  **Update Redux:** Add the new `llm` state slice, actions, and thunks.
4.  **Modify Components:** Update `App.js`, `ControlPanel.js`, and `ChatPanel.js` to integrate the new functionality.
5.  **Testing:** Manually test the message generation and the loading/ready states in the browser.