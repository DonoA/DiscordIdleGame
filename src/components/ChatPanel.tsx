import React from 'react';
import { useSelector } from 'react-redux';

const MessageList = () => {
  const selectedServerName = useSelector((state: any) => state.ui.selectedServer);
  const selectedChannelName = useSelector((state: any) => state.ui.selectedChannel);
  const messages = useSelector((state: any) => {
    if (!selectedServerName || !selectedChannelName) return [];
    return state.messages.byServer[selectedServerName]?.[selectedChannelName] || [];
  });

  return (
    <div className="message-list">
      {messages.map((message: any, index: number) => (
        <div key={index} className="message">
          <div className="message-author">{message.author}</div>
          <div className="message-content">{message.content}</div>
        </div>
      ))}
    </div>
  );
};

const ChatPanel = () => {
  const selectedChannelName = useSelector((state: any) => state.ui.selectedChannel);

  if (!selectedChannelName) {
    return <div className="chat-panel"></div>;
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3># {selectedChannelName}</h3>
      </div>
      <MessageList />
    </div>
  );
};

export default ChatPanel;