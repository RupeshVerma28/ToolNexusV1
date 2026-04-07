import React, { useState, useEffect } from 'react';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 10);
      }, 10);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Stopwatch</h3>
      <p className="text-gray-400 text-sm mb-4">Start/stop/reset stopwatch</p>
      
      <div className="text-center">
        <div className="text-4xl font-mono text-white mb-6">{formatTime(time)}</div>
        
        <div className="flex space-x-4 justify-center">
          {!isRunning ? (
            <button
              onClick={start}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Stop
            </button>
          )}
          
          <button
            onClick={reset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;
