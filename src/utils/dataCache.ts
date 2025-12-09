let cache: any = null;

export const getData = async () => {
  if (cache) {
    return cache;
  }

  const [serversRes, usersRes, messagesRes] = await Promise.all([
    fetch('/servers_and_channels.json'),
    fetch('/users.json'),
    fetch('/messages.json'),
  ]);

  const servers = await serversRes.json();
  const users = await usersRes.json();
  const messages = await messagesRes.json();

  cache = { servers, users, messages };
  return cache;
};