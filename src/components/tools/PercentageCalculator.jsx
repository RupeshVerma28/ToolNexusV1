import React, { useState } from 'react';

const PercentageCalculator = () => {
  const [value, setValue] = useState('');
  const [percentage, setPercentage] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const v = parseFloat(value);
    const p = parseFloat(percentage);
    
    if (isNaN(v) || isNaN(p)) {
      alert('Please enter valid numbers');
      return;
    }
    
    const calculated = (v * p) / 100;
    setResult(calculated.toString());
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Percentage Calculator</h3>
      <p className="text-gray-400 text-sm mb-4">Find percent, increase/decrease</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter the value"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Percentage (%)</label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="Enter the percentage"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      
      <button
        onClick={calculate}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Calculate
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-white">{result}</p>
          <p className="text-gray-400 text-sm mt-1">{percentage}% of {value} = {result}</p>
        </div>
      )}
    </div>
  );
};

export default PercentageCalculator;
