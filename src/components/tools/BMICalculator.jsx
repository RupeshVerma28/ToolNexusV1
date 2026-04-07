import React, { useState } from "react";

const BMICalculator = () => {
  const [weight, setWeight] = useState(""); // kg
  const [height, setHeight] = useState(""); // cm
  const [age, setAge] = useState(""); // years
  const [gender, setGender] = useState("male"); // 'male' | 'female' | 'other'
  const [result, setResult] = useState(null);

  const toNumber = (v) => {
    const n = parseFloat(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };

  const getBMICategory = (bmi) => {
    // Standard WHO adult categories
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal (Healthy weight)";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  };

  const calculateBMI = () => {
    const w = toNumber(weight);
    const hCm = toNumber(height);
    const a = toNumber(age);

    if (
      !w ||
      !hCm ||
      !a ||
      !(gender === "male" || gender === "female" || gender === "other")
    ) {
      alert("Please enter age, gender, weight (kg) and height (cm) correctly.");
      return;
    }

    if (w <= 0 || hCm <= 0 || a <= 0) {
      alert("Age, weight and height must be positive numbers.");
      return;
    }

    const h = hCm / 100; // meters
    const rawBmi = w / (h * h);
    const bmi = Number(rawBmi.toFixed(2));

    // BMI category
    const category = getBMICategory(bmi);

    // Body fat % estimate using Deurenberg formula:
    // bodyFat% = 1.2 * BMI + 0.23 * age - 10.8 * sex - 5.4
    // sex = 1 for men, 0 for women. For 'other' we'll use 0.5 as compromise.
    const sexValue = gender === "male" ? 1 : gender === "female" ? 0 : 0.5;
    let bodyFat = 1.2 * bmi + 0.23 * a - 10.8 * sexValue - 5.4;
    bodyFat = Number(bodyFat.toFixed(2));
    if (bodyFat < 0) bodyFat = 0;
    if (bodyFat > 100) bodyFat = Number(bodyFat.toFixed(2));

    // Ideal weight range (kg) for BMI 18.5 - 24.9
    const minIdealWeight = Number((18.5 * h * h).toFixed(2));
    const maxIdealWeight = Number((24.9 * h * h).toFixed(2));
    const midIdealWeight = Number(
      ((minIdealWeight + maxIdealWeight) / 2).toFixed(2)
    );

    // Mifflin-St Jeor BMR estimate (kcal/day)
    // Men: BMR = 10*W + 6.25*H - 5*A + 5
    // Women: BMR = 10*W + 6.25*H - 5*A - 161
    // For 'other' we average the two formulas
    const bmrMale = 10 * w + 6.25 * hCm - 5 * a + 5;
    const bmrFemale = 10 * w + 6.25 * hCm - 5 * a - 161;
    let bmr;
    if (gender === "male") bmr = bmrMale;
    else if (gender === "female") bmr = bmrFemale;
    else bmr = (bmrMale + bmrFemale) / 2;
    bmr = Math.round(bmr);

    // Additional note for older adults
    let ageNote = "";
    if (a >= 65) {
      ageNote =
        "Note: BMI interpretation for people 65+ may differ; consider body composition and clinical context.";
    }

    // Prepare results object (all digits are precise)
    const output = {
      bmi,
      category,
      bodyFatPercent: bodyFat,
      idealWeightRangeKg: {
        min: minIdealWeight,
        mid: midIdealWeight,
        max: maxIdealWeight,
      },
      bmrKcalPerDay: bmr,
      ageNote,
    };

    setResult(output);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">BMI Calculator</h3>
      <p className="text-gray-400 text-sm mb-4">Client-side tool</p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Age (years)
          </label>
          <input
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age in years"
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

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kg"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            min="0"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter height in cm"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onClick={calculateBMI}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Calculate BMI
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-white">
            BMI: {result.bmi.toFixed(2)}
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Category: {result.category}
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Estimated body fat: {result.bodyFatPercent}%
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Ideal weight range (BMI 18.5–24.9): {result.idealWeightRangeKg.min}{" "}
            kg — {result.idealWeightRangeKg.max} kg (mid ≈{" "}
            {result.idealWeightRangeKg.mid} kg)
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Estimated BMR: {result.bmrKcalPerDay} kcal/day
          </p>
          {result.ageNote && (
            <p className="text-xs text-yellow-300 mt-2">{result.ageNote}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
