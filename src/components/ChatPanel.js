import React from 'react';
import { useSelector } from 'react-redux';

const MessageList = () => {
  const selectedChannelId = useSelector(state => state.ui.selectedChannel);
  const messages = useSelector(state => state.messages.byChannel[selectedChannelId]?.messages || []);
  return (
    <div className="message-list">
      {messages.map(message => (
        <div key={message.id} className="message">
          <div className="message-author">{message.author}</div>
          <div className="message-content">{message.content}</div>
        </div>
      ))}
    </div>
  );
};


const ChatPanel = () => {
  const selectedChannelId = useSelector(state => state.ui.selectedChannel);
  const channel = useSelector(state => state.channels.byId[selectedChannelId]);

  if (!channel) {
    return <div className="chat-panel"></div>;
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3># {channel.name}</h3>
      </div>
      <MessageList />
    </div>
  );
};

export default ChatPanel;