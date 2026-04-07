import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) {
      alert('Please set a valid time');
      return;
    }
    setTimeLeft(totalSeconds);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Countdown Timer</h3>
      <p className="text-gray-400 text-sm mb-4">Set a countdown timer</p>
      
      <div className="space-y-6">
        {!isRunning && timeLeft === 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                max="23"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                min="0"
                max="59"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Seconds</label>
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                min="0"
                max="59"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-4xl font-mono text-white mb-4">
            {formatTime(timeLeft)}
          </div>
          
          {timeLeft === 0 && isRunning && (
            <div className="text-2xl text-red-500 font-bold mb-4">
              Time's Up! ⏰
            </div>
          )}
          
          <div className="flex space-x-3 justify-center">
            {!isRunning && timeLeft === 0 && (
              <button
                onClick={startTimer}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Start
              </button>
            )}
            
            {isRunning && (
              <button
                onClick={stopTimer}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Stop
              </button>
            )}
            
            <button
              onClick={resetTimer}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
