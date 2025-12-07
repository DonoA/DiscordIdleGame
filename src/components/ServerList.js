import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectServer } from '../actions';

const ServerList = () => {
  const servers = useSelector(state => Object.values(state.servers));
  const selectedServerName = useSelector(state => state.ui.selectedServer);
  const dispatch = useDispatch();

  return (
    <div className="server-list">
      {servers.map(server => (
        <div
          key={server.name}
          className={`server-icon ${server.name === selectedServerName ? 'active' : ''}`}
          onClick={() => dispatch(selectServer(server.name))}
        >
          {server.name.charAt(0)}
        </div>
      ))}
    </div>
  );
};

export default ServerList;