import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { incrementTick } from './actions';
import { runSimulation } from './simulation';
import ServerList from './components/ServerList';
import ChannelList from './components/ChannelList';
import ChatPanel from './components/ChatPanel';
import ControlPanel from './components/ControlPanel';
import './App.css';
import { RootState } from './types';
import { useAppDispatch } from './store';
import store from './store';

function App() {
  const dispatch = useAppDispatch();
  const tick = useSelector((state: RootState) => state.ui.tick);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      dispatch(incrementTick() as any);
    }, 1000 / 30); // 30 FPS
    return () => clearInterval(tickInterval);
  }, [dispatch]);

  useEffect(() => {
    runSimulation(store, tick);
  }, [tick]);

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