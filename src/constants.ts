// Simulation Constants
export const MESSAGE_CHANCE_PER_TICK = 0.005;
export const LEAVE_CHANNEL_CHANCE_PER_TICK = 0.005;
export const JOIN_CHANNEL_CHANCE_PER_TICK = 0.001;
export const BITS_PER_MESSAGE = 1;
export const VOICE_CHANNEL_MULTIPLIER = 1.1;

// Control Panel Constants
export const SERVER_COST = {
  base: 1000,
  growth: 1.75,
};

export const TEXT_CHANNEL_COST = {
  base: 10,
  growth: 1.4,
};

export const VOICE_CHANNEL_COST = {
  base: 10,
  growth: 1.4,
};

export const USER_COST = {
  base: 5,
  growth: 1.2,
};

export const MODERATOR_COST = {
  base: 100,
  growth: 2.0,
};

export const INFLUENCER_COST = {
  base: 250,
  growth: 2.25,
};

export const USER_LEAVE_CHANCE_PER_TICK = 0.0001;
export const MODERATOR_LEAVE_PREVENTION = 0.00005;
export const INFLUENCER_JOIN_CHANCE_PER_TICK = 0.00025;