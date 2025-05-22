import React, { useEffect, useState } from 'react';
import socket from '../socket';

function Game() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Request first question on load
    socket.emit('request_question');

    // Listen for question
    socket.on('new_question', (data) => {
      setQuestion(data);
      setAnswer('');
      setFeedback('');
    });

    // Listen for answer result
    socket.on('answer_result', (data) => {
      setScore(data.score);
      setFeedback(data.correct ? '✅ Correct!' : '❌ Wrong!');
      setTimeout(() => {
        socket.emit('request_question');
      }, 1000);
    });

    return () => {
      socket.off('new_question');
      socket.off('answer_result');
    };
  }, []);

  const submitAnswer = () => {
    socket.emit('submit_answer', { answer });
  };

  return (
    <div>
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

export default Game;
