# Design Doc: 13-More-Mechanics

This document outlines the addition of new game mechanics to introduce more depth and challenge to the user retention and growth aspects of the simulation.

## 1. User Churn

### Concept
Users will now have a chance to leave the server over time. This introduces a natural churn that players must manage, making user acquisition and retention an ongoing process rather than a one-time cost.

### Mechanics
- A new simulation event will be added that gives each user a small probability of leaving the server on each game tick.
- The cost to add new users will **not** decrease when a user leaves. The cost is based on the total number of users ever added to the server, reflecting the server's overall growth milestone.

## 2. Moderators

### Concept
To counteract user churn, players can purchase Moderators. Moderators are a server upgrade that reduces the probability of users leaving.

### Mechanics
- A new purchasable item, "Moderator," will be added to the control panel.
- Each Moderator purchased will decrease the global user leave chance by a certain percentage.
- The effect of multiple moderators will stack, potentially with diminishing returns.
- The cost of Moderators will increase with each one purchased, similar to other server upgrades.

## 3. Influencers

### Concept
To provide a passive user acquisition method, players can purchase Influencers. Influencers will periodically attract new users to the server without direct cost per user.

### Mechanics
- A new purchasable item, "Influencer," will be added to the control panel.
- Each Influencer will have a chance on each game tick to attract a new user to the server.
- The cost of Influencers will increase with each one purchased.
- This provides a long-term, passive growth strategy as an alternative to the active, costly "Add User" button.