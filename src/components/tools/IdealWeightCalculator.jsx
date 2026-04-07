// src/components/tools/IdealWeightCalculator.jsx
import React, { useState } from "react";

const IdealWeightCalculator = () => {
  const [heightCm, setHeightCm] = useState("");
  const [gender, setGender] = useState("male"); // 'male' | 'female' | 'other'
  const [result, setResult] = useState(null);

  const toNumber = (v) => {
    const n = parseFloat(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };

  const cmToInches = (cm) => cm / 2.54;
  const inchesOver5ft = (inches) => Math.max(0, inches - 60); // 5 ft = 60 inches

  const calculate = () => {
    const h = toNumber(heightCm);
    if (!h || h <= 0) {
      alert("Please enter a valid height in centimeters.");
      return;
    }

    const inches = cmToInches(h);
    const over5ft = inchesOver5ft(inches);

    // BMI-based healthy range (WHO adult): BMI 18.5 - 24.9
    const minKgBMI = 18.5 * (h / 100) ** 2;
    const maxKgBMI = 24.9 * (h / 100) ** 2;
    const midKgBMI = (minKgBMI + maxKgBMI) / 2;

    // Devine
    const devineMale = 50 + 2.3 * over5ft;
    const devineFemale = 45.5 + 2.3 * over5ft;
    const devine =
      gender === "male"
        ? devineMale
        : gender === "female"
        ? devineFemale
        : (devineMale + devineFemale) / 2;

    // Robinson
    const robinsonMale = 52 + 1.9 * over5ft;
    const robinsonFemale = 49 + 1.7 * over5ft;
    const robinson =
      gender === "male"
        ? robinsonMale
        : gender === "female"
        ? robinsonFemale
        : (robinsonMale + robinsonFemale) / 2;

    // Miller
    const millerMale = 56.2 + 1.41 * over5ft;
    const millerFemale = 53.1 + 1.36 * over5ft;
    const miller =
      gender === "male"
        ? millerMale
        : gender === "female"
        ? millerFemale
        : (millerMale + millerFemale) / 2;

    // Hamwi
    const hamwiMale = 48 + 2.7 * over5ft;
    const hamwiFemale = 45.5 + 2.2 * over5ft;
    const hamwi =
      gender === "male"
        ? hamwiMale
        : gender === "female"
        ? hamwiFemale
        : (hamwiMale + hamwiFemale) / 2;

    const round = (v) => Number(v.toFixed(2));

    setResult({
      heightCm: round(h),
      inches: Number(inches.toFixed(2)),
      bmiRangeKg: {
        min: round(minKgBMI),
        mid: round(midKgBMI),
        max: round(maxKgBMI),
      },
      devine: round(devine),
      robinson: round(robinson),
      miller: round(miller),
      hamwi: round(hamwi),
      notes:
        "BMI-based range (WHO 18.5–24.9). Devine/Robinson/Miller/Hamwi are inch-based clinical formulas.",
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">
        Ideal Weight Calculator
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Estimates using BMI & common clinical formulas
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            min="0"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="Enter height in cm"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Calculate Ideal Weight
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg text-gray-300">
          <p className="text-2xl font-bold text-white">
            Results for height: {result.heightCm} cm ({result.inches} in)
          </p>

          <div className="mt-3">
            <p className="text-sm">
              <strong>BMI-based healthy range (18.5–24.9):</strong>
            </p>
            <p className="text-sm ml-2">
              • Minimum: {result.bmiRangeKg.min} kg
            </p>
            <p className="text-sm ml-2">
              • Midpoint: {result.bmiRangeKg.mid} kg
            </p>
            <p className="text-sm ml-2">
              • Maximum: {result.bmiRangeKg.max} kg
            </p>
          </div>

          <div className="mt-3">
            <p className="text-sm">
              <strong>Clinical formulas:</strong>
            </p>
            <p className="text-sm ml-2">• Devine: {result.devine} kg</p>
            <p className="text-sm ml-2">• Robinson: {result.robinson} kg</p>
            <p className="text-sm ml-2">• Miller: {result.miller} kg</p>
            <p className="text-sm ml-2">• Hamwi: {result.hamwi} kg</p>
          </div>

          <p className="text-xs text-yellow-300 mt-3">{result.notes}</p>
        </div>
      )}
    </div>
  );
};

export default IdealWeightCalculator;
