import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadInitialData, addRandomMessage } from './actions';
import { initialData } from './data';
import ServerList from './components/ServerList';
import ChannelList from './components/ChannelList';
import ChatPanel from './components/ChatPanel';
import ControlPanel from './components/ControlPanel';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const users = useSelector(state => Object.values(state.users.byId));
  const servers = useSelector(state => state.servers.byId);

  useEffect(() => {
    dispatch(loadInitialData(initialData));
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (users.length > 0) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const server = servers[randomUser.serverId];
        if (server && server.channels.length > 0) {
          const randomChannelId = server.channels[Math.floor(Math.random() * server.channels.length)];
          dispatch(addRandomMessage(randomChannelId));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [users, servers, dispatch]);

  return (
    <div className="app">
      <ServerList />
      <ChannelList />
      <ChatPanel />
      <ControlPanel />
    </div>
  );
}

export default App;