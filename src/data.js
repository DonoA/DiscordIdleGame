export const initialData = {
  servers: {
    byId: {
      server1: { id: 'server1', name: 'General', channels: ['channel1', 'channel2'] },
      server2: { id: 'server2', name: 'Gaming', channels: ['channel3'] },
    },
    allIds: ['server1', 'server2'],
  },
  channels: {
    byId: {
      channel1: { id: 'channel1', name: 'general-text', type: 'text' },
      channel2: { id: 'channel2', name: 'General Voice', type: 'voice' },
      channel3: { id: 'channel3', name: 'rocket-league', type: 'text' },
    },
    allIds: ['channel1', 'channel2', 'channel3'],
  },
  messages: {
    byChannel: {
      channel1: [
        { id: 'msg1', author: 'Roo', content: 'Hello!' },
        { id: 'msg2', author: 'Dallen', content: 'Hi there!' },
      ],
      channel3: [
        { id: 'msg3', author: 'Roo', content: 'Anyone want to play?' },
      ],
    },
  },
  ui: {
    selectedServer: 'server1',
    selectedChannel: 'channel1',
  },
};