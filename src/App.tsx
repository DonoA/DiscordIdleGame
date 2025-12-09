import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadInitialData, incrementTick } from './actions';
import { runSimulation } from './simulation';
import ServerList from './components/ServerList';
import ChannelList from './components/ChannelList';
import ChatPanel from './components/ChatPanel';
import ControlPanel from './components/ControlPanel';
import './App.css';

function App({ store }: { store: any }) {
  const dispatch = useDispatch();
  const tick = useSelector((state: any) => state.ui.tick);

  useEffect(() => {
    console.log('Dispatching loadInitialData from App component');
    (dispatch as any)(loadInitialData());
  }, [dispatch]);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      dispatch(incrementTick());
    }, 1000 / 30); // 30 FPS
    return () => clearInterval(tickInterval);
  }, [dispatch]);

  useEffect(() => {
    runSimulation(store, tick);
  }, [store, tick]);

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