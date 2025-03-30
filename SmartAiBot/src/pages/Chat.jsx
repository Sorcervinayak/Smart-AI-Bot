import React, { useContext } from 'react';
import { DataContext, prevUser } from '../context/UserContext';

function Chat() {
  const { prevInput, response } = useContext(DataContext);

  return (
    <div className='chat-page'>
      {/* User input message */}
      <div className="user">
        <span>{prevInput}</span>
      </div>

      {/* AI response message */}
      <div className="ai">
        <span>{response || "Generating response..."}</span>
      </div>
    </div>
  );
}

export default Chat;
