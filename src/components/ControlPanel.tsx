import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { addServer, addTextChannel, addVoiceChannel, addUser, toggleDevMode, addRandomMessage, spendBits, addMessageCount } from '../actions';
import { formatNumber } from '../utils/formatting';
import { getData } from '../utils/dataCache';
import { RootState, ServerData, UserData } from '../types';
import { useAppDispatch } from '../store';

const SERVER_COST = {
  base: 10000,
  growth: 1.5,
}

const TEXT_CHANNEL_COST = {
  base: 10,
  growth: 1.2,
}

const VOICE_CHANNEL_COST = {
  base: 500,
  growth: 1.2,
}

const USER_COST = {
  base: 5,
  growth: 1.2,
}

const ControlPanel = () => {
  const dispatch = useAppDispatch();
  const { servers, channels, users, bits, ui } = useSelector((state: RootState) => state);
  const { selectedServer, selectedChannel, devMode } = ui;
  const { currentBits, totalBits } = bits;
  const [serverThemes, setServerThemes] = useState<ServerData[]>([]);
  const [userNames, setUserNames] = useState<UserData>([]);


  useEffect(() => {
    const fetchData = async () => {
      const { servers, users } = await getData();
      setServerThemes(servers);
      setUserNames(users);
    };
    fetchData();
  }, []);

  const getServerCost = (num = 1) => {
    const numServers = Object.keys(servers).length + num - 1;
    return Math.floor(SERVER_COST.base * (SERVER_COST.growth ** numServers));
  }
  const getUserCost = (num = 1) => {
    if (!selectedServer) return 0;
    const numUsers = (users.usersByServer[selectedServer] || []).length + num - 1
    return Math.floor(USER_COST.base * (USER_COST.growth ** numUsers));
  }
  const getChannelCost = (type: string, num = 1) => {
    if (!selectedServer) return 0;
    const numChannels = type === 'text'
      ? Object.keys(channels.textByServer[selectedServer] || {}).length
      : Object.keys(channels.voiceByServer[selectedServer] || {}).length;
    const channelCost = type === 'text' ? TEXT_CHANNEL_COST : VOICE_CHANNEL_COST;
    const adjustedCount = Math.max(0, numChannels + num - 2);
    return Math.floor(channelCost.base * (channelCost.growth ** (adjustedCount)));
  }

  const serverCost = getServerCost();
  const textChannelCost = getChannelCost('text');
  const voiceChannelCost = getChannelCost('voice');
  const userCost = getUserCost();

  const getUniqueName = (baseName: string, existingNames: string[]) => {
    if (!existingNames.includes(baseName)) {
      return baseName;
    }
    let i = 2;
    while (existingNames.includes(`${baseName}-${i}`)) {
      i++;
    }
    return `${baseName}-${i}`;
  };

  const handleAddMessage = () => {
    if (selectedServer && selectedChannel) {
      dispatch(addMessageCount(selectedServer, selectedChannel, 1));
      dispatch(addRandomMessage(selectedServer, selectedChannel, 'admin') as any);
    } else {
      alert('Please select a server and channel first.');
    }
  };

  const addRandomChannels = (count: number, type: string) => {
    if (!selectedServer) {
      alert('Please select a server first.');
      return;
    }

    const serverTheme = serverThemes.find(s => s.name === selectedServer);
    if (serverTheme) {
      const possibleChannels = serverTheme.channels.filter(c => c.type === type);
      const existingChannelNames = type === 'text' ? 
        Object.keys(channels.textByServer[selectedServer] || {}) : 
        Object.keys(channels.voiceByServer[selectedServer] || {});
      let cost = 0;
      for (let i = 0; i < count; i++) {
        cost += getChannelCost(type, i + 1);
      }

      if (!devMode) {
        if (currentBits < cost) {
          return;
        }
        dispatch(spendBits(cost));
      }

      for (let i = 0; i < count; i++) {
        const randomChannelName = possibleChannels[Math.floor(Math.random() * possibleChannels.length)].name;
        const channelName = getUniqueName(randomChannelName, existingChannelNames);
        if (type === 'voice') {
          console.log('Adding voice channel', channelName);
          dispatch(addVoiceChannel(selectedServer, channelName) as any);
        } else if (type === 'text') {
          dispatch(addTextChannel(selectedServer, channelName) as any);
        } else {
          console.error('Unknown channel type', type);
        }
        existingChannelNames.push(channelName);
      }
    }
  }

  const handleAddServer = (count: number) => {
    const existingServerNames = Object.keys(servers);
    let cost = 0;
    for (let i = 0; i < count; i++) {
      cost += getServerCost(i + 1);
    }

    if (!devMode) {
      if (currentBits < cost) {
        return;
      }
      dispatch(spendBits(cost));
    }

    for (let i = 0; i < count; i++) {
      const randomServer = serverThemes[Math.floor(Math.random() * serverThemes.length)];
      const allowedName = getUniqueName(randomServer.name, existingServerNames);
      dispatch(addServer(allowedName) as any);
    }
  };

  const handleAddTextChannel = (count: number) => {
    if (selectedServer) {
      addRandomChannels(count, 'text');
    } else {
      alert('Please select a server first.');
    }
  };

  const handleAddVoiceChannel = (count: number) => {
    if (selectedServer) {
      addRandomChannels(count, 'voice');
    } else {
      alert('Please select a server first.');
    }
  };

  const handleAddUser = (count: number) => {
    if (selectedServer) {
      let cost = 0;
      for (let i = 0; i < count; i++) {
        cost += getUserCost(i + 1);
      }
      
      if (!devMode) {
        if (currentBits < cost) {
          return;
        }
        dispatch(spendBits(cost));
      }

      for (let i = 0; i < count; i++) {
        const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
        const allowedName = `${randomUser}${Date.now() + i}`; // Ensure uniqueness
        if (selectedServer) dispatch(addUser(selectedServer, allowedName) as any);
      }
    } else {
      alert('Please select a server first.');
    }
  };

  return (
    <div className="control-panel">
      <div>
        <label>
          <input type="checkbox" checked={devMode} onChange={() => dispatch(toggleDevMode() as any)} />
          Dev Mode
        </label>
      </div>
      <div>
        <div>Current Bits: {formatNumber(Math.floor(currentBits))}</div>
        <div>Total Bits: {formatNumber(Math.floor(totalBits))}</div>
        <br />
      </div>
      <div>
        <button
          onClick={handleAddMessage}
        >Send Message</button>
      </div>
      <div>
        <span>Add User (Cost: {formatNumber(userCost)})</span>
        <br />
        <button onClick={() => handleAddUser(1)} disabled={!selectedServer || (!devMode && bits.currentBits < userCost)}>+1</button>
        <button onClick={() => handleAddUser(10)} disabled={!selectedServer || (!devMode && bits.currentBits < userCost * 10)}>+10</button>
        <button onClick={() => handleAddUser(100)} disabled={!selectedServer || (!devMode && bits.currentBits < userCost * 100)}>+100</button>
      </div>
      <div>
        <span>Add Text Channel (Cost: {formatNumber(textChannelCost)})</span>
        <br />
        <button onClick={() => handleAddTextChannel(1)} disabled={!selectedServer || (!devMode && bits.currentBits < textChannelCost)}>+1</button>
        <button onClick={() => handleAddTextChannel(10)} disabled={!selectedServer || (!devMode && bits.currentBits < textChannelCost * 10)}>+10</button>
        <button onClick={() => handleAddTextChannel(100)} disabled={!selectedServer || (!devMode && bits.currentBits < textChannelCost * 100)}>+100</button>
      </div>
      <div>
        <span>Add Voice Channel (Cost: {formatNumber(voiceChannelCost)})</span>
        <br />
        <button onClick={() => handleAddVoiceChannel(1)} disabled={!selectedServer || (!devMode && bits.currentBits < voiceChannelCost)}>+1</button>
        <button onClick={() => handleAddVoiceChannel(10)} disabled={!selectedServer || (!devMode && bits.currentBits < voiceChannelCost * 10)}>+10</button>
        <button onClick={() => handleAddVoiceChannel(100)} disabled={!selectedServer || (!devMode && bits.currentBits < voiceChannelCost * 100)}>+100</button>
      </div>

      <div>
        <span>Add Server (Cost: {formatNumber(serverCost)})</span>
        <br />
        <button onClick={() => handleAddServer(1)} disabled={!devMode && bits.currentBits < serverCost}>+1</button>
        <button onClick={() => handleAddServer(10)} disabled={!devMode && bits.currentBits < serverCost * 10}>+10</button>
        <button onClick={() => handleAddServer(100)} disabled={!devMode && bits.currentBits < serverCost * 100}>+100</button>
      </div>
    </div>
  );
};

export default ControlPanel;