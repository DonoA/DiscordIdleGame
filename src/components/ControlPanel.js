import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRandomServer, addRandomChannel, addRandomMessage, addUser } from '../actions';

const ControlPanel = () => {
  const dispatch = useDispatch();
  const selectedServerName = useSelector(state => state.ui.selectedServer);
  const selectedChannelName = useSelector(state => state.ui.selectedChannel);
  const state = useSelector(state => state);
  console.log('State:', state);

  const handleAddServer = () => {
    dispatch(addRandomServer());
  };

  const handleAddChannel = () => {
    if (selectedServerName) {
      dispatch(addRandomChannel(selectedServerName));
    } else {
      alert('Please select a server first.');
    }
  };

  const handleAddMessage = () => {
    if (selectedServerName && selectedChannelName) {
      dispatch(addRandomMessage(selectedServerName, selectedChannelName, 'admin'));
    } else {
      alert('Please select a server and channel first.');
    }
  };

  const handleAddUser = () => {
    if (selectedServerName) {
      dispatch(addUser(selectedServerName));
    } else {
      alert('Please select a server first.');
    }
  };

  return (
    <div className="control-panel">
      <button onClick={handleAddServer}>Add Random Server</button>
      <button onClick={handleAddChannel}>Add Random Channel</button>
      <button onClick={handleAddMessage}>Add Random Message</button>
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
};

export default ControlPanel;