# Design Doc: Expanded Game Mechanics

This document expands upon the initial concepts for new game mechanics, providing a more detailed framework for implementation.

## 1. Core Gameplay Loop: Message-Based Economy & User Churn

### 1.1. Bit Generation from Posts
- **Concept:** The primary source of the in-game currency, "bits," will be user activity in text channels. This shifts the core gameplay from a passive model to one that rewards fostering an active community.
- **Mechanic:** Each message posted by a user in a text channel will generate a fixed number of bits.

### 1.2. User Attrition (Churn)
- **Concept:** To create a dynamic challenge, users will naturally leave the server over time. This introduces a "leaky bucket" mechanic that players must actively manage.
- **Mechanic:** Each user will have a small, constant probability of leaving the server during each game tick.

## 2. User Retention Mechanics

### 2.1. Voice Channels as Retention Tools
- **Concept:** Voice channels will serve as a primary way to keep users engaged and prevent them from leaving.
- **Mechanic:** The presence of active users in voice channels will decrease the overall probability of any user leaving the server. The more users in voice, the lower the churn rate.

### 2.2. Moderators
- **Concept:** Players can invest in moderators to actively combat user churn.
- **Mechanic:** Moderators will be a purchasable server upgrade. Each moderator will provide a significant, flat reduction to the user churn probability.

## 3. Server Progression and Growth

### 3.1. Server Leveling
- **Concept:** Servers will have a leveling system that provides tangible benefits and unlocks new features, creating a long-term progression path.
- **Mechanic:** Servers will gain experience points (XP) from user messages and other activities. Reaching new levels could unlock:
    - Higher-tier channels that generate more bits per message.
    - New Discord features like streaming or server boosts, which could provide global bonuses.
    - Increased user capacity.

### 3.2. Channel Upgrades
- **Concept:** Individual channels can be upgraded to become more effective at generating bits.
- **Mechanic:** Players can spend bits to level up a text channel. Each level increases the number of bits generated per message in that channel.

## 4. Events and Advanced Mechanics

### 4.1. Special Events
- **Concept:** Random events will occur that provide opportunities for rapid growth but come with associated risks.
- **Mechanic:** An event might, for example, attract a large number of new users to the server instantly. However, this influx will also introduce "trolls" into the potential user pool.

### 4.2. Trolls (Bad Users)
- **Concept:** Trolls are a negative user type that actively harms the server's productivity.
- **Mechanic:** Trolls will occasionally post messages that generate negative bits or temporarily reduce the bit generation rate in a channel. They may also increase the churn rate of regular users. Moderators would be essential to counteract the effects of trolls.

## 5. Meta Progression

### 5.1. Discord Updates
- **Concept:** A meta-progression system outside of individual server management.
- **Mechanic:** Players can spend a large number of bits to "update Discord," unlocking permanent global upgrades that apply to all servers, such as:
    - A permanent reduction in user churn.
    - A global boost to bit generation.
    - New types of channels or user roles with unique benefits.