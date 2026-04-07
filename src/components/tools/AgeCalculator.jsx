import React, { useState } from 'react';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState('');

  const calculateAge = () => {
    if (!birthDate) {
      alert('Please select your birth date');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    
    if (birth > today) {
      alert('Birth date cannot be in the future');
      return;
    }

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    const daysDiff = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());

    setResult({
      years: age,
      months: monthsDiff,
      weeks: weeksDiff,
      days: daysDiff
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Age Calculator</h3>
      <p className="text-gray-400 text-sm mb-4">Calculate your exact age from birth date</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Birth Date</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      
      <button
        onClick={calculateAge}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Calculate Age
      </button>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-white">{result.years}</p>
              <p className="text-gray-400 text-sm">Years</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{result.months}</p>
              <p className="text-gray-400 text-sm">Months</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{result.weeks}</p>
              <p className="text-gray-400 text-sm">Weeks</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{result.days}</p>
              <p className="text-gray-400 text-sm">Days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
