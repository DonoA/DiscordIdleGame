import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadInitialData } from './actions';
import { initialData } from './data';
import ServerList from './components/ServerList';
import ChannelList from './components/ChannelList';
import ChatPanel from './components/ChatPanel';
import ControlPanel from './components/ControlPanel';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadInitialData(initialData));
  }, [dispatch]);

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