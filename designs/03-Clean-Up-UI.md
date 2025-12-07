# Design Document: 03 - Clean Up UI

## 1. Overview

This document outlines the plan to clean up the user interface of the Discord-like application. The goal is to create a cleaner, more passive viewing experience by removing interactive elements from the chat panel and limiting the number of visible messages.

## 2. UI Changes

The following changes will be made to the `ChatPanel` component and its associated styles:

*   **Remove Message Input Box:** The message input box at the bottom of the chat panel will be completely removed.
*   **Remove Scrolling:** The vertical scrollbar in the message list will be removed, and the message list will no longer be scrollable.
*   **Limit Visible Messages:** The message list will be updated to only display the last few messages (e.g., the last 10 messages).

## 3. Implementation Plan

### 3.1. Redux State and Reducer Modifications

*   **`messagesReducer.js`:**
    *   The `messages` slice of the Redux state will be updated to store not only the messages but also the total message count for each channel. The new shape will be:
        ```json
        "messages": {
          "byChannel": {
            "channel1": {
              "messages": [...],
              "totalCount": 100
            }
          }
        }
        ```
    *   The `messagesReducer` will be updated to only store the last N messages (e.g., 10) for each channel in the `messages` array.
    *   When a new message is added, the reducer will increment the `totalCount` for that channel and update the `messages` array, removing the oldest message if the limit is exceeded.

### 3.2. Component Modifications

*   **`ChatPanel.js`:**
    *   The `MessageInput` component will be completely removed from the `ChatPanel`'s render method.
    *   The `MessageList` component will no longer need to slice the messages array, as the reducer will now be responsible for limiting the number of messages.
*   **`ChannelList.js`:**
    *   The component will be updated to display the `totalCount` from the `messages` slice for each channel.

### 3.2. CSS Modifications

*   **`App.css`:**
    *   The CSS for the `.message-list` will be updated to remove the `overflow-y: auto` property. This will prevent the scrollbar from appearing.

## 4. Next Steps

1.  **Modify `ChatPanel.js`:**
    *   Remove the `MessageInput` component.
2.  **Modify `messagesReducer.js`:**
    *   Implement the logic to limit the number of stored messages per channel and track the total count.
3.  **Modify `App.css`:**
    *   Remove the scrollbar from the message list.
3.  **Testing:** Manually verify that the message input box is gone, the scrollbar is no longer present, and only the last few messages are visible in the chat panel.