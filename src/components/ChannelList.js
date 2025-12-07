import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectChannel } from '../actions';

const ChannelList = () => {
  const selectedServerId = useSelector(state => state.ui.selectedServer);
  const server = useSelector(state => state.servers.byId[selectedServerId]);
  const channels = useSelector(state => {
    if (!server) return [];
    return server.channels.map(id => state.channels.byId[id]);
  });
  const messages = useSelector(state => state.messages.byChannel);
  const users = useSelector(state => state.users.byId);
  const selectedChannelId = useSelector(state => state.ui.selectedChannel);
  const dispatch = useDispatch();

  if (!server) {
    return <div className="channel-list"></div>;
  }

  const textChannels = channels.filter(c => c.type === 'text');
  const voiceChannels = channels.filter(c => c.type === 'voice');

  return (
    <div className="channel-list">
      <h2>{server.name}</h2>
      <div>Users: {server.users?.length ?? 0}</div>
      <div className="channel-category">
        <h4>Text Channels</h4>
        {textChannels.map(channel => (
          <div
            key={channel.id}
            className={`channel ${channel.id === selectedChannelId ? 'active' : ''}`}
            onClick={() => dispatch(selectChannel(channel.id))}
          >
            # {channel.name} ({messages[channel.id] ? messages[channel.id].totalCount : 0})
          </div>
        ))}
      </div>
      <div className="channel-category">
        <h4>Voice Channels</h4>
        {voiceChannels.map(channel => (
          <div key={channel.id} className="channel-voice">
           <div className="channel-name">&#128266; {channel.name}</div>
           <div className="channel-users">
             {channel.users.map(userId => (
               <div key={userId} className="user-in-voice">
                 {users[userId]?.name}
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