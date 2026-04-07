import React, { useState } from 'react';

const LengthConverter = () => {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [result, setResult] = useState('');

  const units = {
    mm: { name: 'Millimeter', factor: 0.001 },
    cm: { name: 'Centimeter', factor: 0.01 },
    m: { name: 'Meter', factor: 1 },
    km: { name: 'Kilometer', factor: 1000 },
    in: { name: 'Inch', factor: 0.0254 },
    ft: { name: 'Foot', factor: 0.3048 },
    yd: { name: 'Yard', factor: 0.9144 },
    mi: { name: 'Mile', factor: 1609.344 }
  };

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      alert('Please enter a valid number');
      return;
    }

    const meters = val * units[fromUnit].factor;
    const result = meters / units[toUnit].factor;
    setResult(result.toFixed(6));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Length Converter</h3>
      <p className="text-gray-400 text-sm mb-4">Convert between different length units</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter length"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {Object.entries(units).map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.name} ({key})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {Object.entries(units).map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.name} ({key})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <button
        onClick={convert}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Convert
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-white">{result} {units[toUnit].name}</p>
        </div>
      )}
    </div>
  );
};

export default LengthConverter;
