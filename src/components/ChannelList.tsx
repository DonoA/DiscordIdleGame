import React from 'react';
import { useSelector } from 'react-redux';
import { selectChannel } from '../actions';
import { formatNumber } from '../utils/formatting';
import { RootState } from '../types';
import { useAppDispatch } from '../store';

const ChannelList = () => {
  const dispatch = useAppDispatch();
  const selectedServerName = useSelector((state: RootState) => state.ui.selectedServer);
  const selectedChannelName = useSelector((state: RootState) => state.ui.selectedChannel);

  const server = useSelector((state: RootState) => selectedServerName ? state.servers[selectedServerName] : null);
  const users = useSelector((state: RootState) => selectedServerName ? state.users.usersByServer[selectedServerName] || [] : []);
  const textChannels = useSelector((state: RootState) => selectedServerName ? Object.values(state.channels.textByServer[selectedServerName] || {}) : []);
  const voiceChannels = useSelector((state: RootState) => selectedServerName ? Object.values(state.channels.voiceByServer[selectedServerName] || {}) : []);

  if (!server) {
    return <div className="channel-list"></div>;
  }

  return (
    <div className="channel-list">
      <h2>{server.name}</h2>
      <div>Users: {users.length}</div>
      <div className="channel-category">
        <h4>Text Channels</h4>
        {textChannels.map(channel => (
          <div
            key={channel.name}
            className={`channel ${channel.name === selectedChannelName ? 'active' : ''}`}
            onClick={() => dispatch(selectChannel(channel.name))}
          >
            # {channel.name} ({formatNumber(channel.messageCount)})
          </div>
        ))}
      </div>
      <div className="channel-category">
        <h4>Voice Channels</h4>
        {voiceChannels.map(channel => (
          <div key={channel.name} className="channel-voice">
           <div className="channel-name">&#128266; {channel.name}</div>
           <div className="channel-users">
             {channel.users.map(userName => (
               <div key={userName} className="user-in-voice">
                 {userName}
               </div>
             ))}
           </div>
         </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelList;