import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import './LobbyList.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function LobbyList() {
  const playerName = localStorage.getItem("playerName") || "Player";
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('public');
  const [joinCode, setJoinCode] = useState('');


  useEffect(() => {
    socket.emit('get_rooms');

    socket.on('room_list', (data) => {
      setRooms(data.rooms || []);
    });

    return () => {
      socket.off('room_list');
    };
  }, []);

  const handleCreateGame = () => {
    const roomId = `${playerName}-room`;
    localStorage.setItem('roomCode', roomId);

    socket.emit('create_room', { room: roomId, username: playerName });
    navigate('/room');
  };

const handleJoin = (room) => {
  localStorage.setItem('roomCode', room);
  socket.emit('join_room', { room, username: playerName });

  socket.once('error', (data) => {
    toast.error(data.message || "Room not found.");
  });

  socket.once('player_joined', () => {
    navigate('/room');
  });
};


  const handleCreatePrivateGame = () => {
  const roomId = `${playerName}-${Math.floor(Math.random() * 10000)}`;
  localStorage.setItem('roomCode', roomId);
  socket.emit('create_room', { room: roomId, username: playerName });
  toast.success(`Room created: ${roomId}`);

  navigate('/room');
  
};


  return (
    <div className="lobby-list-container">
      <h1>Multiplayer Lobby</h1>

      <div className="lobby-actions">
        <button className="play-now-btn">PLAY NOW</button>
        <button className="create-btn" onClick={handleCreateGame}>CREATE GAME</button>
        <button className="create-btn" onClick={handleCreatePrivateGame}>
  CREATE PRIVATE GAME
</button>

      </div>

      <div className="join-code-section">
  <input
    type="text"
    placeholder="Enter room code"
    value={joinCode}
    onChange={(e) => setJoinCode(e.target.value)}
    className="join-code-input"
  />
  <button className="join-btn" onClick={() => handleJoin(joinCode)}>
    JOIN BY CODE
  </button>
</div>


      <div className="lobby-tabs">
        <button
          className={activeTab === 'public' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('public')}
        >
          Public ({rooms.length})
        </button>
        <button
          className={activeTab === 'private' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('private')}
        >
          Private (6)
        </button>
      </div>

      <div className="room-table">
        <div className="table-header">
          <div>Game Name</div>
          <div># of Players</div>
          <div></div>
        </div>

        {rooms.map((room) => (
          <div key={room.name} className="room-row">
            <div>{room.name}</div>
            <div>({room.players})</div>
            <button
              className="join-btn"
              disabled={room.players >= 4}
              onClick={() => handleJoin(room.name)}
            >
              JOIN
            </button>
          </div>
        ))}
      </div>

      <ToastContainer position="top-center" />

    </div>
    
  );
}

export default LobbyList;
