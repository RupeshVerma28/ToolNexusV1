import React, { useState } from 'react';

const RomanConverter = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState('');

  const toRoman = (num) => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    
    let result = '';
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i];
        num -= values[i];
      }
    }
    return result;
  };

  const convert = () => {
    const num = parseInt(number);
    if (isNaN(num) || num < 1 || num > 3999) {
      alert('Please enter a number between 1 and 3999');
      return;
    }
    setResult(toRoman(num));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Number → Roman</h3>
      <p className="text-gray-400 text-sm mb-4">Convert numbers to Roman numerals</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Number (1-3999)</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter a number"
            min="1"
            max="3999"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      
      <button
        onClick={convert}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Convert to Roman
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-white">{result}</p>
        </div>
      )}
    </div>
  );
};

export default RomanConverter;
