import React, { useState } from "react";

const WEIGHT_RATES = {
  kg: 1,
  g: 1000,
  mg: 1000000,
  lb: 2.20462,
  oz: 35.274,
};

export default function WeightConverter() {
  const [val1, setVal1] = useState("");
  const [unit1, setUnit1] = useState("kg");
  const [val2, setVal2] = useState("");
  const [unit2, setUnit2] = useState("lb");

  const convert = (value, from, to) => {
    if (value === "") return "";
    const inKg = parseFloat(value) / WEIGHT_RATES[from];
    return (inKg * WEIGHT_RATES[to]).toFixed(4).replace(/\.0000$/, "");
  };

  const handle1Change = (e) => {
    setVal1(e.target.value);
    setVal2(convert(e.target.value, unit1, unit2));
  };
  const handle2Change = (e) => {
    setVal2(e.target.value);
    setVal1(convert(e.target.value, unit2, unit1));
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg text-white max-w-lg mx-auto w-full">
      <h3 className="text-2xl font-semibold mb-4">Weight Converter</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex flex-col w-full">
          <input type="number" value={val1} onChange={handle1Change} className="p-3 rounded bg-gray-700 text-white min-h-[44px] mb-2" />
          <select value={unit1} onChange={(e) => { setUnit1(e.target.value); setVal2(convert(val1, e.target.value, unit2)); }} className="p-3 rounded bg-gray-700 text-white min-h-[44px]">
            {Object.keys(WEIGHT_RATES).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="text-2xl">=</div>
        <div className="flex flex-col w-full">
          <input type="number" value={val2} onChange={handle2Change} className="p-3 rounded bg-gray-700 text-white min-h-[44px] mb-2" />
          <select value={unit2} onChange={(e) => { setUnit2(e.target.value); setVal1(convert(val2, e.target.value, unit1)); }} className="p-3 rounded bg-gray-700 text-white min-h-[44px]">
            {Object.keys(WEIGHT_RATES).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
