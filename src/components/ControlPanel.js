import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addServer, addTextChannel, addVoiceChannel, addUser, toggleDevMode } from '../actions';
import { formatNumber } from '../utils/formatting';
import { getData } from '../utils/dataCache';

const ControlPanel = () => {
  const dispatch = useDispatch();
  const { servers, channels, users, bits, ui } = useSelector(state => state);
  const { selectedServer, devMode } = ui;
  const [serverThemes, setServerThemes] = useState([]);
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { servers, users } = await getData();
      setServerThemes(servers);
      setUserNames(users);
    };
    fetchData();
  }, []);

  const serverCost = Math.floor(10000 * (1.5 ** Object.keys(servers).length));
  const channelCost = selectedServer ? Math.floor(1000 * (1.2 ** (Object.keys(channels.textByServer[selectedServer] || {}).length + Object.keys(channels.voiceByServer[selectedServer] || {}).length))) : 0;
  const userCost = selectedServer ? Math.floor(100 * (1.1 ** (users.usersByServer[selectedServer] || []).length)) : 0;

  const getUniqueName = (baseName, existingNames) => {
    if (!existingNames.includes(baseName)) {
      return baseName;
    }
    let i = 2;
    while (existingNames.includes(`${baseName}-${i}`)) {
      i++;
    }
    return `${baseName}-${i}`;
  };

  const addRandomChannels = (count, type) => {
    const serverTheme = serverThemes.find(s => s.name === selectedServer);
    if (serverTheme) {
      const possibleChannels = serverTheme.channels.filter(c => c.type === type);
      const existingChannelNames = Object.keys(channels.textByServer[selectedServer] || {});
      for (let i = 0; i < count; i++) {
        const randomChannelName = possibleChannels[Math.floor(Math.random() * possibleChannels.length)].name;
        const channelName = getUniqueName(randomChannelName, existingChannelNames);
        if (type === 'voice') {
          dispatch(addVoiceChannel(selectedServer, channelName));
        } else if (type === 'text') {
          dispatch(addTextChannel(selectedServer, channelName));
        } else {
          console.error('Unknown channel type', type);
        }
        existingChannelNames.push(channelName);
      }
    }
  }

  const handleAddServer = (count) => {
    const existingServerNames = Object.keys(servers);
    for (let i = 0; i < count; i++) {
      const randomServer = serverThemes[Math.floor(Math.random() * serverThemes.length)];
      const allowedName = getUniqueName(randomServer.name, existingServerNames);
      dispatch(addServer(allowedName));
    }
  };

  const handleAddTextChannel = (count) => {
    if (selectedServer) {
      addRandomChannels(count, 'text');
    } else {
      alert('Please select a server first.');
    }
  };

  const handleAddVoiceChannel = (count) => {
    if (selectedServer) {
      addRandomChannels(count, 'voice');
    } else {
      alert('Please select a server first.');
    }
  };

  const handleAddUser = (count) => {
    if (selectedServer) {
      for (let i = 0; i < count; i++) {
        const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
        const allowedName = `${randomUser}${Date.now() + i}`; // Ensure uniqueness
        dispatch(addUser(selectedServer, allowedName));
      }
    } else {
      alert('Please select a server first.');
    }
  };

  return (
    <div className="control-panel">
      <div>
        <label>
          <input type="checkbox" checked={devMode} onChange={() => dispatch(toggleDevMode())} />
          Dev Mode
        </label>
      </div>
      <div>
        <span>Bits: {formatNumber(Math.floor(bits))}</span>
      </div>
      <div>
        <span>Add Server (Cost: {formatNumber(serverCost)})</span>
        <button onClick={() => handleAddServer(1)} disabled={!devMode && bits < serverCost}>+1</button>
        <button onClick={() => handleAddServer(10)} disabled={!devMode && bits < serverCost * 10}>+10</button>
        <button onClick={() => handleAddServer(100)} disabled={!devMode && bits < serverCost * 100}>+100</button>
      </div>
      <div>
        <span>Add Text Channel (Cost: {formatNumber(channelCost)})</span>
        <button onClick={() => handleAddTextChannel(1)} disabled={!selectedServer || (!devMode && bits < channelCost)}>+1</button>
        <button onClick={() => handleAddTextChannel(10)} disabled={!selectedServer || (!devMode && bits < channelCost * 10)}>+10</button>
        <button onClick={() => handleAddTextChannel(100)} disabled={!selectedServer || (!devMode && bits < channelCost * 100)}>+100</button>
      </div>
      <div>
        <span>Add Voice Channel (Cost: {formatNumber(channelCost)})</span>
        <button onClick={() => handleAddVoiceChannel(1)} disabled={!selectedServer || (!devMode && bits < channelCost)}>+1</button>
        <button onClick={() => handleAddVoiceChannel(10)} disabled={!selectedServer || (!devMode && bits < channelCost * 10)}>+10</button>
        <button onClick={() => handleAddVoiceChannel(100)} disabled={!selectedServer || (!devMode && bits < channelCost * 100)}>+100</button>
      </div>
      <div>
        <span>Add User (Cost: {formatNumber(userCost)})</span>
        <button onClick={() => handleAddUser(1)} disabled={!selectedServer || (!devMode && bits < userCost)}>+1</button>
        <button onClick={() => handleAddUser(10)} disabled={!selectedServer || (!devMode && bits < userCost * 10)}>+10</button>
        <button onClick={() => handleAddUser(100)} disabled={!selectedServer || (!devMode && bits < userCost * 100)}>+100</button>
      </div>
    </div>
  );
};

export default ControlPanel;