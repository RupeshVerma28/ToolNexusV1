import React, { useState } from 'react';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    try {
      if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        alert('Invalid characters');
        return;
      }
      const res = Function('return ' + expression)();
      setResult(res.toString());
    } catch (e) {
      alert('Error in calculation');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Calculator</h3>
      <p className="text-gray-400 text-sm mb-4">Client-side tool</p>
      
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="e.g., (12+3)*4/5"
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
      />
      
      <button
        onClick={calculate}
        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Calculate
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-white">= {result}</p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
