// frontend/src/components/Lobby.jsx
import React, { useState } from 'react';
import socket from '../socket';

function Lobby({ onJoin }) {
  const [username, setUsername] = useState('');

  const handleJoin = () => {
    if (username.trim()) {
      socket.emit("join", { username });
      onJoin(username);
    }
  };

  return (
    <div>
      <h2>Enter Your Name to Join</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your name"
      />
      <button onClick={handleJoin}>Join Game</button>
    </div>
  );
}

export default Lobby;
