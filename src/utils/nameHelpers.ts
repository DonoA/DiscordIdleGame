import { getData } from './dataCache';

export const getUniqueName = (baseName: string, existingNames: string[]): string => {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let i = 2;
  while (existingNames.includes(`${baseName}-${i}`)) {
    i++;
  }
  return `${baseName}-${i}`;
};

export const generateUser = async (existingNames: string[] = []): Promise<{ name: string }> => {
  const { users } = await getData();
  const baseName = users[Math.floor(Math.random() * users.length)];
  const name = getUniqueName(baseName, existingNames);
  return { name };
};

export const generateUsers = async (count: number, existingNames: string[] = []): Promise<{ name: string }[]> => {
  const { users } = await getData();
  const generatedUsers: { name: string }[] = [];
  const currentNames = [...existingNames];

  for (let i = 0; i < count; i++) {
    const baseName = users[Math.floor(Math.random() * users.length)];
    const name = getUniqueName(baseName, currentNames);
    generatedUsers.push({ name });
    currentNames.push(name);
  }

  return generatedUsers;
};


export const generateTextChannelName = async (serverName: string, existingNames: string[] = []): Promise<string> => {
  const { servers } = await getData();
  const serverTheme = servers.find(s => s.name === serverName) || servers[0];
  const channelNames = serverTheme.channels.filter(c => c.type === 'text').map(c => c.name);
  const baseName = channelNames[Math.floor(Math.random() * channelNames.length)];
  return getUniqueName(baseName, existingNames);
};

export const generateTextChannelNames = async (serverName: string, count: number, existingNames: string[] = []): Promise<string[]> => {
  const { servers } = await getData();
  const serverTheme = servers.find(s => s.name === serverName) || servers[0];
  const channelNames = serverTheme.channels.filter(c => c.type === 'text').map(c => c.name);
  const generatedNames: string[] = [];
  const currentNames = [...existingNames];

  for (let i = 0; i < count; i++) {
    const baseName = channelNames[Math.floor(Math.random() * channelNames.length)];
    const name = getUniqueName(baseName, currentNames);
    generatedNames.push(name);
    currentNames.push(name);
  }
  return generatedNames;
}

export const generateVoiceChannelName = async (serverName: string, existingNames: string[] = []): Promise<string> => {
  const { servers } = await getData();
  const serverTheme = servers.find(s => s.name === serverName) || servers[0];
  const channelNames = serverTheme.channels.filter(c => c.type === 'voice').map(c => c.name);
  const baseName = channelNames[Math.floor(Math.random() * channelNames.length)];
  return getUniqueName(baseName, existingNames);
};

export const generateVoiceChannelNames = async (serverName: string, count: number, existingNames: string[] = []): Promise<string[]> => {
  const { servers } = await getData();
  const serverTheme = servers.find(s => s.name === serverName) || servers[0];
  const channelNames = serverTheme.channels.filter(c => c.type === 'voice').map(c => c.name);
  const generatedNames: string[] = [];
  const currentNames = [...existingNames];

  for (let i = 0; i < count; i++) {
    const baseName = channelNames[Math.floor(Math.random() * channelNames.length)];
    const name = getUniqueName(baseName, currentNames);
    generatedNames.push(name);
    currentNames.push(name);
  }
  return generatedNames;
}