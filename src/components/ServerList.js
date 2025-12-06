import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectServer } from '../actions';

const ServerList = () => {
  const servers = useSelector(state => state.servers.allIds.map(id => state.servers.byId[id]));
  const selectedServerId = useSelector(state => state.ui.selectedServer);
  const dispatch = useDispatch();

  return (
    <div className="server-list">
      {servers.map(server => (
        <div
          key={server.id}
          className={`server-icon ${server.id === selectedServerId ? 'active' : ''}`}
          onClick={() => dispatch(selectServer(server.id))}
        >
          {server.name.charAt(0)}
        </div>
      ))}
    </div>
  );
};

export default ServerList;