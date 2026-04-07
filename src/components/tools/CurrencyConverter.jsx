import React, { useState } from 'react';

const CurrencyConverter = () => {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState('');

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' }
  ];

  const ratios = {
    USD: 1,
    EUR: 1.08,
    INR: 0.012,
    GBP: 1.27,
    JPY: 0.0067
  };

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) {
      alert('Please enter a valid number');
      return;
    }
    
    const base = v * ratios[from];
    const output = base / ratios[to];
    setResult(output.toFixed(6));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Currency Converter</h3>
      <p className="text-gray-400 text-sm mb-4">Client-side tool with demo rates</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">From</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
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
          <p className="text-2xl font-bold text-white">{result} {to}</p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
