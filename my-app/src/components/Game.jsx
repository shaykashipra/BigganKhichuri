import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const Game = () => {
    // const [username, setUsername] = useState(null);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     window.location.href = 'http://localhost:3000';
    // }, []);

    return <h1>goto <a href='http://localhost:3000' target="_blank" rel="noopener noreferrer">Play The Game Here</a></h1>
};

export default Game;

