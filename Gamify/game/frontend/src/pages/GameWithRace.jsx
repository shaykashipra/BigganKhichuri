import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import RaceGame from '../phaser/RaceGame';
import socket from '../socket';

function GameWithRace() {
  const gameRef = useRef(null);
  const sceneRef = useRef(null);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    socket.emit('request_question');

    socket.on('new_question', (data) => {
      setQuestion(data);
      setAnswer('');
      setFeedback('');
    });

    socket.on('answer_result', (data) => {
      setScore(data.score);
      setFeedback(data.correct ? '✅ Correct!' : '❌ Wrong!');

      if (sceneRef.current) {
        data.correct ? sceneRef.current.boost() : sceneRef.current.slowDown();
      }

      setTimeout(() => {
        socket.emit('request_question');
      }, 1000);
    });

    return () => {
      socket.off('new_question');
      socket.off('answer_result');
    };
  }, []);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 900,
      height: 600,
      physics: { default: 'arcade' },
      scene: new RaceGame(),
      parent: 'phaser-container'
    };

    gameRef.current = new Phaser.Game(config);

    setTimeout(() => {
      sceneRef.current = gameRef.current.scene.keys.RaceGame;
    }, 500);

    return () => {
      gameRef.current.destroy(true);
    };
  }, []);

  const submitAnswer = () => {
    socket.emit('submit_answer', { answer });
  };

  return (
    <div>
      <div id="phaser-container" />
      <h2>Your Score: {score}</h2>
      {question && (
        <div>
          <h3>{question.question}</h3>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button onClick={submitAnswer}>Submit</button>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default GameWithRace;
