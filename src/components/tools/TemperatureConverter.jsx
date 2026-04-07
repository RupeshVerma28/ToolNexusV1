import React, { useState } from "react";

export default function TemperatureConverter() {
  const [val1, setVal1] = useState("");
  const [unit1, setUnit1] = useState("C");
  const [val2, setVal2] = useState("");
  const [unit2, setUnit2] = useState("F");

  const convert = (value, from, to) => {
    if (value === "") return "";
    let c = parseFloat(value);
    if (from === "F") c = (c - 32) * 5/9;
    if (from === "K") c = c - 273.15;
    
    let res = c;
    if (to === "F") res = c * 9/5 + 32;
    if (to === "K") res = c + 273.15;
    return res.toFixed(4).replace(/\.0000$/, "");
  };

  const handle1Change = (e) => {
    setVal1(e.target.value);
    setVal2(convert(e.target.value, unit1, unit2));
  };
  const handle2Change = (e) => {
    setVal2(e.target.value);
    setVal1(convert(e.target.value, unit2, unit1));
  };

  const updateUnits = (u1, u2) => {
    setUnit1(u1);
    setUnit2(u2);
    setVal2(convert(val1, u1, u2));
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg text-white max-w-lg mx-auto w-full">
      <h3 className="text-2xl font-semibold mb-4">Temperature Converter</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex flex-col w-full">
          <input type="number" value={val1} onChange={handle1Change} className="p-3 rounded bg-gray-700 text-white min-h-[44px] mb-2" />
          <select value={unit1} onChange={(e) => updateUnits(e.target.value, unit2)} className="p-3 rounded bg-gray-700 text-white min-h-[44px]">
            <option value="C">Celsius (°C)</option>
            <option value="F">Fahrenheit (°F)</option>
            <option value="K">Kelvin (K)</option>
          </select>
        </div>
        <div className="text-2xl">=</div>
        <div className="flex flex-col w-full">
          <input type="number" value={val2} onChange={handle2Change} className="p-3 rounded bg-gray-700 text-white min-h-[44px] mb-2" />
          <select value={unit2} onChange={(e) => updateUnits(unit1, e.target.value)} className="p-3 rounded bg-gray-700 text-white min-h-[44px]">
            <option value="C">Celsius (°C)</option>
            <option value="F">Fahrenheit (°F)</option>
            <option value="K">Kelvin (K)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
