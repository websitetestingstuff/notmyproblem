import React, { useState, useEffect, useRef } from 'react';
import './StopwatchPage.css';

const StopwatchPage = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10); // Update every 10 milliseconds
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      let lapDifference;
      if (laps.length === 0) {
        lapDifference = time; // First lap's difference is from time 0
      } else {
        // Ensure the previous lap's time is accessed correctly from the object
        const previousLapTime = laps[laps.length - 1].lapTime;
        lapDifference = time - previousLapTime;
      }
      const newLap = { lapTime: time, lapDifference: lapDifference };
      setLaps(prevLaps => [...prevLaps, newLap]);
    }
  };

  const formatTime = (time) => {
    const milliseconds = `0${(time % 1000) / 10}`.slice(-2);
    const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
    const minutes = `0${Math.floor((time / 60000) % 60)}`.slice(-2);
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div className="stopwatch-container">
      <h1>Stopwatch</h1>
      <div className="time-display">{formatTime(time)}</div>
      <div className="buttons">
        <button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleLap} disabled={!isRunning}>Lap</button>
      </div>
      <div className="laps">
        <h2>Laps</h2>
        <ul>
          {laps.map((lap, index) => (
            <li key={index}>
              Lap {index + 1}: {formatTime(lap.lapTime)} (+{formatTime(lap.lapDifference)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StopwatchPage;
