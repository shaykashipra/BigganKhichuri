import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import './LobbyRoom.css';

function LobbyRoom() {
    
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  const playerName = localStorage.getItem("playerName") || "Player";
  const roomCode = localStorage.getItem("roomCode") || "default-room";

  useEffect(() => {
    // Emit join_room when component mounts
    socket.emit('join_room', {
      username: playerName,
      room: roomCode
    });

    // Listen for lobby updates
    socket.on('update_lobby', (playersInRoom) => {
      const coloredPlayers = playersInRoom.map((name, index) => ({
        name,
        carColor: ['blue', 'yellow', 'red', 'orange'][index % 4]
      }));
      setPlayers(coloredPlayers);
    });

  const handleStart = () => {
    // Broadcast to all clients to start game
    socket.emit('start_game', { room: roomCode });
    // navigate('/game');
  };
  
    socket.on('go_to_game', () => {
    navigate('/game');
    });


    return () => {
      socket.off('update_lobby');
    };
  }, [playerName, roomCode]);



  const handleLeave = () => {
    navigate('/');
  };

  return (
    <div className="lobby-room-container">
      <h1 className="lobby-title">{playerName}'s Game</h1>

      <div className="car-lineup">
        {players.map((p, index) => (
          <div key={index} className="car-slot">
            <img
              src={`/car-${p.carColor}.png`}
              alt={`${p.name} Car`}
              className="lobby-car"
            />
            <div className="player-label">{p.name}</div>
          </div>
        ))}
      </div>

      <div className="lobby-controls">
        <span>{players.length} / 4 players ready</span>
        <button className="start-btn" onClick={handleStart}>START</button>
        <button className="leave-btn" onClick={handleLeave}>LEAVE</button>
      </div>
    </div>
  );
}

export default LobbyRoom;
