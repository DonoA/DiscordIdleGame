import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addServer, addTextChannel, addVoiceChannel, addUser, toggleDevMode, addRandomMessage, spendBits } from '../actions';
import { formatNumber } from '../utils/formatting';
import { getData } from '../utils/dataCache';

const SERVER_COST = {
  base: 10000,
  growth: 1.5,
}

const CHANNEL_COST = {
  base: 100,
  growth: 1.1,
}

const USER_COST = {
  base: 10,
  growth: 1.1,
}

const ControlPanel = () => {
  const dispatch = useDispatch();
  const { servers, channels, users, bits, ui } = useSelector(state => state);
  const { selectedServer, selectedChannel, devMode } = ui;
  const { currentBits, totalBits } = bits;
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

  const getServerCost = (num = 1) => {
    const numServers = Object.keys(servers).length + num - 1;
    return Math.floor(SERVER_COST.base * (SERVER_COST.growth ** numServers));
  }
  const getUserCost = (num = 1) => {
    if (!selectedServer) return 0;
    const numUsers = (users.usersByServer[selectedServer] || []).length + num - 1
    return Math.floor(USER_COST.base * (USER_COST.growth ** numUsers));
  }
  const getChannelCost = (type, num = 1) => {
    if (!selectedServer) return 0;
    const numChannels = type === 'text'
      ? Object.keys(channels.textByServer[selectedServer] || {}).length
      : Object.keys(channels.voiceByServer[selectedServer] || {}).length;
    return Math.floor(CHANNEL_COST.base * (CHANNEL_COST.growth ** (numChannels + num - 1)));
  }

  const serverCost = getServerCost();
  const textChannelCost = getChannelCost('text');
  const voiceChannelCost = getChannelCost('voice');
  const userCost = getUserCost();

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

  const handleAddMessage = () => {
    if (selectedServer && selectedChannel) {
      dispatch(addRandomMessage(selectedServer, selectedChannel, 'admin'));
    } else {
      alert('Please select a server and channel first.');
    }
  };

  const addRandomChannels = (count, type) => {
    const serverTheme = serverThemes.find(s => s.name === selectedServer);
    if (serverTheme) {
      const possibleChannels = serverTheme.channels.filter(c => c.type === type);
      const existingChannelNames = Object.keys(channels.textByServer[selectedServer] || {});
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
        <button onClick={() => handleAddUser(1)} disabled={!selectedServer || (!devMode && bits < userCost)}>+1</button>
        <button onClick={() => handleAddUser(10)} disabled={!selectedServer || (!devMode && bits < userCost * 10)}>+10</button>
        <button onClick={() => handleAddUser(100)} disabled={!selectedServer || (!devMode && bits < userCost * 100)}>+100</button>
      </div>
      <div>
        <span>Add Text Channel (Cost: {formatNumber(textChannelCost)})</span>
        <br />
        <button onClick={() => handleAddTextChannel(1)} disabled={!selectedServer || (!devMode && bits < textChannelCost)}>+1</button>
        <button onClick={() => handleAddTextChannel(10)} disabled={!selectedServer || (!devMode && bits < textChannelCost * 10)}>+10</button>
        <button onClick={() => handleAddTextChannel(100)} disabled={!selectedServer || (!devMode && bits < textChannelCost * 100)}>+100</button>
      </div>
      <div>
        <span>Add Voice Channel (Cost: {formatNumber(voiceChannelCost)})</span>
        <br />
        <button onClick={() => handleAddVoiceChannel(1)} disabled={!selectedServer || (!devMode && bits < voiceChannelCost)}>+1</button>
        <button onClick={() => handleAddVoiceChannel(10)} disabled={!selectedServer || (!devMode && bits < voiceChannelCost * 10)}>+10</button>
        <button onClick={() => handleAddVoiceChannel(100)} disabled={!selectedServer || (!devMode && bits < voiceChannelCost * 100)}>+100</button>
      </div>

      <div>
        <span>Add Server (Cost: {formatNumber(serverCost)})</span>
        <br />
        <button onClick={() => handleAddServer(1)} disabled={!devMode && bits < serverCost}>+1</button>
        <button onClick={() => handleAddServer(10)} disabled={!devMode && bits < serverCost * 10}>+10</button>
        <button onClick={() => handleAddServer(100)} disabled={!devMode && bits < serverCost * 100}>+100</button>
      </div>
    </div>
  );
};

export default ControlPanel;