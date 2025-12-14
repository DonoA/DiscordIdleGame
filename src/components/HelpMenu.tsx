import React, { useState } from 'react';

const HelpMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="help-menu">
      <button className="" onClick={toggleMenu}>
        ?
      </button>
      {isOpen && (
        <div className="help-popup">
          <div className="help-popup-content">
            <h3>How to Earn Bits</h3>
            <ul>
            <li>
                <strong>Users:</strong> Each user periodically sends messages and joins voice channels.
              </li>
              <li>
                <strong>Text Channels:</strong> Users earn bits by sending messages in text channels. The more messages sent, the more bits earned.
              </li>
              <li>
                <strong>Voice Channels:</strong> Each voice channel increases how quickly users send messages.
              </li>
              <li>
                <strong>Upgrades:</strong> Invest in server and channel upgrades to increase the number of bits earned per message.
              </li>
            </ul>
            <button onClick={toggleMenu}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpMenu;