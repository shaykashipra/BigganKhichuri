import React, { useState } from 'react';
import Lobby from './pages/Lobby';
import GameWithRace from './pages/GameWithRace';

function App() {
  const [username, setUsername] = useState(null);

  return (
    <div className="App">
      {username ? <GameWithRace /> : <Lobby onJoin={setUsername} />}
    </div>
  );
}

export default App;
