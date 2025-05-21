import React, { useState, useEffect } from 'react';
import './ClockPage.css';

function ClockPage() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="clock-container">
      <div className="clock-display">{time}</div>
    </div>
  );
}

export default ClockPage;
