import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectChannel } from '../actions';
import { formatNumber } from '../utils/formatting';

const ChannelList = () => {
  const dispatch = useDispatch();
  const { currentBits, totalBits } = useSelector((state: any) => state.bits);
  const selectedServerName = useSelector((state: any) => state.ui.selectedServer);
  const selectedChannelName = useSelector((state: any) => state.ui.selectedChannel);

  const server = useSelector((state: any) => state.servers[selectedServerName]);
  const users = useSelector((state: any) => state.users.usersByServer[selectedServerName] || []);
  const textChannels = useSelector((state: any) => Object.values(state.channels.textByServer[selectedServerName] || {}));
  const voiceChannels = useSelector((state: any) => Object.values(state.channels.voiceByServer[selectedServerName] || {}));

  if (!server) {
    return <div className="channel-list"></div>;
  }

  return (
    <div className="channel-list">
      <div className="bit-counter">Current Bits: {formatNumber(currentBits)}</div>
      <div className="bit-counter">Total Bits: {formatNumber(totalBits)}</div>
      <h2>{server.name}</h2>
      <div>Users: {users.length}</div>
      <div className="channel-category">
        <h4>Text Channels</h4>
        {textChannels.map((channel: any) => (
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
        {voiceChannels.map((channel: any) => (
          <div key={channel.name} className="channel-voice">
           <div className="channel-name">&#128266; {channel.name}</div>
           <div className="channel-users">
             {channel.users.map((userName: any) => (
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