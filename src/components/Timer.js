import React, { useState, useEffect } from 'react';
import './Timer.css'; // Ensure this imports your CSS styles
import alarmSound from '../assets/alarm.mp3'; // Add your sound file in the appropriate location

const Timer = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds if necessary
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
  
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      const alarm = new Audio(alarmSound);
      alarm.play(); // Play the alarm sound
    }
  
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);


  const startTimer = () => setIsActive(true);
  const stopTimer = () => setIsActive(false);
  const resetTimer = () => {
    setTimeLeft(duration * 60);
    setIsActive(false);
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <p>
          {Math.floor(timeLeft / 60)}:
          {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
        </p>
      </div>
      <div className="timer-controls">
        <button className="timer-button start" onClick={startTimer}>
          Start
        </button>
        <button className="timer-button stop" onClick={stopTimer}>
          Stop
        </button>
        <button className="timer-button reset" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
