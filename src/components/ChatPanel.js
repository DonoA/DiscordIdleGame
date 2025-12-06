import React from 'react';
import { useSelector } from 'react-redux';

const MessageList = () => {
  const selectedChannelId = useSelector(state => state.ui.selectedChannel);
  const messages = useSelector(state => state.messages.byChannel[selectedChannelId] || []);
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

const MessageInput = () => {
  return (
    <div className="message-input">
      <input type="text" placeholder="Message..." disabled />
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
      <MessageInput />
    </div>
  );
};

export default ChatPanel;