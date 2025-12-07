# Exploratory Design: Discord Idle Game

## 1. Concept Overview

This document explores the transformation of the current Discord simulator into a full-fledged idle game. The core concept is to build and manage a thriving online community, using "bits" as the primary currency. Players will start with a small, basic server and spend bits to expand it, attract users, and unlock new features, creating a self-sustaining and ever-growing community.

## 2. Core Gameplay Loop

1.  **Generate Bits:** Bits are generated automatically through user activity (messages, voice chat).
2.  **Spend Bits:** Players spend bits on upgrades to increase bit generation.
3.  **Unlock New Features:** Upgrades unlock new gameplay mechanics and further avenues for growth.
4.  **Prestige:** Eventually, players can "archive" a server to gain permanent bonuses for their next one, forming the core prestige loop of the game.

## 3. Game Mechanics

### 3.1. Bits (Primary Currency)

*   **Generation:**
    *   **Base Rate:** 1 bit per message sent.
    *   **Voice Chat:** 1 bit per user per second in a voice channel.
    *   **Active Events:** Bonus bits from successful community events.
    *   **Moderators:** Auto-generate bits over time.
*   **Spending:**
    *   Creating new servers and channels.
    *   Recruiting users and moderators.
    *   Purchasing upgrades.
    *   Hosting events.

### 3.2. Server and Channel Management

*   **Creating Servers:** Instead of starting with a random server, the player will create their first server for a cost. New servers can be created later, possibly as a prestige mechanic.
*   **Creating Channels:**
    *   Each new channel (text or voice) will have a bit cost.
    *   Channels can be upgraded to increase the bit generation rate from activities within them (e.g., "Upgraded Chat" channels generate more bits per message).

### 3.3. User and Moderator Recruitment

*   **Recruiting Users:**
    *   Players can spend bits on "recruitment campaigns" (e.g., "Post on Social Media," "Run an Ad Campaign").
    *   Each campaign adds a set number of new users to the server.
    *   More users lead to more activity and higher bit generation.
*   **Hiring Moderators:**
    *   Moderators are special "staff" units that provide passive bonuses.
    *   **Cost:** Moderators have a hiring cost and an ongoing "salary" in bits per second.
    *   **Abilities:**
        *   **Auto-Bit Generation:** Generate a steady stream of bits.
        *   **Event Management:** Required to run certain automated events.
        *   **Spam Control:** A future mechanic where moderators prevent "bit loss" events.

### 3.4. Activities and Events

*   Players can spend bits to host events, which provide a temporary boost in bit generation.
*   **Examples:**
    *   **Game Night:** Costs bits, but significantly increases the number of users in voice channels for a short period.
    *   **Giveaway:** Costs a large sum of bits, but attracts a wave of new users to the server.
    *   **Movie Marathon:** Increases voice channel occupancy and generates a lump sum of bits at the end.

### 3.5. Upgrades

*   A dedicated "Upgrades" tab will be available in the control panel.
*   Upgrades provide permanent bonuses to bit generation.
*   **Upgrade Tiers:**
    *   **Message Upgrades:** "Better Emojis" (increase bits per message), "Image Embeds" (further increase).
    *   **Voice Upgrades:** "Higher Bitrate Audio" (increase bits per second from voice), "Video Streaming."
    *   **Moderator Upgrades:** "Moderator Training" (increase moderator efficiency), "Auto-Mod Bots."

### 3.6. Prestige System ("Archiving a Server")

*   Once a player reaches a certain milestone (e.g., 1 million bits), they can "archive" their server.
*   **Reward:** Archiving grants "Community Cred," a permanent currency.
*   **Spending Community Cred:** This currency can be spent on powerful global upgrades that persist across all future servers, such as:
    *   "Starting server costs are reduced."
    *   "All bits generated are increased by 10%."
    *   "Start with a free moderator."
*   This creates the core long-term gameplay loop, encouraging multiple playthroughs.

## 4. UI/UX Vision

*   **Control Panel Overhaul:** The right-side control panel will become the main game interface, with tabs for:
    *   **Server & Channels:** Creating and managing servers/channels.
    *   **Users & Staff:** Recruiting users and hiring moderators.
    *   **Events:** Hosting community events.
    *   **Upgrades:** Purchasing permanent upgrades.
*   **Visual Feedback:** Clear visual indicators for bit generation, with numbers popping up from channels where activity is happening.
*   **Progress Bars:** Progress bars for events and recruitment campaigns.

## 5. Next Steps (Hypothetical)

1.  Implement the basic "bits" system as per `05-Add-Bits.md`.
2.  Overhaul the `ControlPanel` to be the primary game UI.
3.  Replace the random creation actions with player-driven, cost-based actions.
4.  Introduce the concept of upgrades.
5.  Develop the moderator and event systems.
6.  Finally, implement the prestige mechanic.