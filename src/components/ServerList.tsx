import React from 'react';
import { useSelector } from 'react-redux';
import { selectServer } from '../actions';
import { RootState } from '../types';
import { useAppDispatch } from '../store';

const ServerList = () => {
  const servers = useSelector((state: RootState) => Object.values(state.servers));
  const selectedServerName = useSelector((state: RootState) => state.ui.selectedServer);
  const dispatch = useAppDispatch();

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