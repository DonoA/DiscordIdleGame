import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRandomServer, addRandomChannel, addRandomMessage } from '../actions';

const ControlPanel = () => {
  const dispatch = useDispatch();
  const selectedServerId = useSelector(state => state.ui.selectedServer);
  const selectedChannelId = useSelector(state => state.ui.selectedChannel);

  const handleAddServer = () => {
    dispatch(addRandomServer());
  };

  const handleAddChannel = () => {
    if (selectedServerId) {
      dispatch(addRandomChannel(selectedServerId));
    } else {
      alert('Please select a server first.');
    }
  };

  const handleAddMessage = () => {
    if (selectedChannelId) {
      dispatch(addRandomMessage(selectedChannelId));
    } else {
      alert('Please select a channel first.');
    }
  };

  return (
    <div className="control-panel">
      <button onClick={handleAddServer}>Add Random Server</button>
      <button onClick={handleAddChannel}>Add Random Channel</button>
      <button onClick={handleAddMessage}>Add Random Message</button>
    </div>
  );
};

export default ControlPanel;