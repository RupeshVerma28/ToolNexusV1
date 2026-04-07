import React, { useState } from "react";

const BMRCalculator = () => {
  const [weight, setWeight] = useState(""); // kg
  const [height, setHeight] = useState(""); // cm
  const [age, setAge] = useState(""); // years
  const [gender, setGender] = useState("male"); // male | female | other
  const [bodyFat, setBodyFat] = useState(""); // optional %, e.g. 18.5
  const [result, setResult] = useState(null);

  const toNumber = (v) => {
    const n = parseFloat(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };

  const calculateBMR = () => {
    const w = toNumber(weight);
    const h = toNumber(height);
    const a = toNumber(age);
    const bf = toNumber(bodyFat); // percent

    if (!w || w <= 0 || !h || h <= 0 || !a || a <= 0) {
      alert(
        "Please enter valid positive numbers for weight (kg), height (cm) and age (years)."
      );
      return;
    }
    if (bodyFat !== "" && (isNaN(bf) || bf <= 0 || bf >= 100)) {
      alert("If provided, body fat % must be a number between 0 and 100.");
      return;
    }

    // 1) Mifflin-St Jeor (commonly used; population-level good accuracy)
    // Men: 10*w + 6.25*h - 5*a + 5
    // Women: 10*w + 6.25*h - 5*a - 161
    // For 'other', take average of male & female equations (neutral compromise).
    const bmrMale = 10 * w + 6.25 * h - 5 * a + 5;
    const bmrFemale = 10 * w + 6.25 * h - 5 * a - 161;
    let bmrMifflin;
    if (gender === "male") bmrMifflin = bmrMale;
    else if (gender === "female") bmrMifflin = bmrFemale;
    else bmrMifflin = (bmrMale + bmrFemale) / 2;

    // 2) If body fat provided, compute lean body mass and use Katch-McArdle and Cunningham
    // Katch-McArdle: BMR = 370 + 21.6 * leanMass(kg)
    // Cunningham (alternative): BMR = 500 + 22 * leanMass(kg)  (some literature uses 500 + 22*LBM)
    // Lean mass = weight * (1 - bodyFat%)
    let bmrKatch = null;
    let bmrCunningham = null;
    let leanMassKg = null;
    if (!isNaN(bf)) {
      leanMassKg = w * (1 - bf / 100);
      // Safety clamp: leanMass can't be < 30% of weight or > 100% — but allow user input to stand while avoiding obvious nonsense
      if (leanMassKg <= 0) {
        alert("Computed lean mass invalid — check body fat %.");
        return;
      }
      bmrKatch = 370 + 21.6 * leanMassKg;
      bmrCunningham = 500 + 22 * leanMassKg;
    }

    // Round results
    const round = (v) => Math.round(v);

    const output = {
      mifflin: round(bmrMifflin),
      katch: bmrKatch ? round(bmrKatch) : null,
      cunningham: bmrCunningham ? round(bmrCunningham) : null,
      leanMassKg: leanMassKg ? Number(leanMassKg.toFixed(2)) : null,
      methodUsed: bmrKatch
        ? "Katch-McArdle (uses body fat %)"
        : "Mifflin–St Jeor (default)",
      notes:
        "Katch-McArdle (uses body composition) is often more accurate for individuals when you have a reliable body fat %. Mifflin–St Jeor is a solid population estimate. For absolute accuracy use indirect calorimetry (lab measurement).",
    };

    setResult(output);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">BMR Calculator</h3>
      <p className="text-gray-400 text-sm mb-4">
        Estimates basal metabolic rate using multiple validated equations
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
            placeholder="Enter weight (kg)"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter height (cm)"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Age (years)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            min="0"
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

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Body fat % (optional, improves accuracy)
          </label>
          <input
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="Enter body fat percentage (e.g. 18.5)"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            min="0"
            max="100"
            step="0.1"
          />
          <p className="text-xs text-gray-400 mt-1">
            If you provide a reliable body fat %, the calculator will use lean
            mass equations (Katch-McArdle / Cunningham) which are generally more
            accurate for individuals.
          </p>
        </div>
      </div>

      <button
        onClick={calculateBMR}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Calculate BMR
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg text-gray-300">
          <p className="text-2xl font-bold text-white">{result.methodUsed}</p>

          <div className="mt-2">
            <p className="text-lg">
              <strong>Mifflin–St Jeor:</strong> {result.mifflin} kcal/day
            </p>
            {result.katch && (
              <p className="text-lg mt-1">
                <strong>Katch-McArdle:</strong> {result.katch} kcal/day
              </p>
            )}
            {result.cunningham && (
              <p className="text-lg mt-1">
                <strong>Cunningham:</strong> {result.cunningham} kcal/day
              </p>
            )}
            {result.leanMassKg !== null && (
              <p className="text-sm mt-1">
                Estimated lean mass: {result.leanMassKg} kg (from provided body
                fat %)
              </p>
            )}
          </div>

          <p className="text-xs text-yellow-300 mt-3">{result.notes}</p>

          <div className="mt-3 text-xs text-gray-400">
            <p>
              <strong>Important:</strong> None of the formulas equal a lab
              measurement. For clinical or high-precision needs use indirect
              calorimetry. These equations are appropriate for diet/workout
              planning when used with common-sense adjustments and tracking
              (weight changes, energy, recovery).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMRCalculator;
