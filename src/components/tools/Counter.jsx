import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Counter</h3>
      <p className="text-gray-400 text-sm mb-4">Simple increment / decrement counter</p>
      
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-6">{count}</div>
        
        <div className="flex space-x-4 justify-center">
          <button
            onClick={decrement}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            -1
          </button>
          
          <button
            onClick={reset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Reset
          </button>
          
          <button
            onClick={increment}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            +1
          </button>
        </div>
      </div>
    </div>
  );
};

export default Counter;
