import React, { useState } from "react";

const WaterIntake = () => {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState("");

  const calculateWater = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) {
      alert("Please enter a valid weight");
      return;
    }

    const baseWater = w * 35; // 35ml per kg base

    const activityMultipliers = {
      sedentary: 1.0,
      light: 1.2,
      moderate: 1.4,
      high: 1.6,
      extreme: 1.8,
    };

    const dailyWater = Math.round(baseWater * activityMultipliers[activity]);
    const glasses = Math.round(dailyWater / 250); // Assuming 250ml per glass

    setResult(`${dailyWater}ml (${glasses} glasses)`);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">
        Water Intake Calculator
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Calculate daily water needs based on weight and activity
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Activity Level
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="sedentary">Sedentary (little/no exercise)</option>
            <option value="light">Light (light exercise 1-3 days/week)</option>
            <option value="moderate">
              Moderate (moderate exercise 3-5 days/week)
            </option>
            <option value="high">High (hard exercise 6-7 days/week)</option>
            <option value="extreme">
              Extreme (very hard exercise, physical job)
            </option>
          </select>
        </div>
      </div>

      <button
        onClick={calculateWater}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Calculate Water Needs
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-white">
            Daily Water Intake: {result}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            💡 Tip: Spread this throughout the day and increase intake in hot
            weather or during illness.
          </p>
        </div>
      )}
    </div>
  );
};

export default WaterIntake;
