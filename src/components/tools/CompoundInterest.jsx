import React, { useState } from "react";

export default function CompoundInterest() {
  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const [t, setT] = useState("");
  const [n, setN] = useState("1"); // compounded annually by default
  const [result, setResult] = useState(null);

  const calculate = () => {
    const principal = parseFloat(p);
    const rate = parseFloat(r) / 100;
    const time = parseFloat(t);
    const compoundFrequency = parseFloat(n);
    if (!isNaN(principal) && !isNaN(rate) && !isNaN(time) && !isNaN(compoundFrequency)) {
      const amount = principal * Math.pow((1 + rate / compoundFrequency), compoundFrequency * time);
      setResult({ interest: amount - principal, total: amount });
    }
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg text-white max-w-lg mx-auto w-full">
      <h3 className="text-2xl font-semibold mb-4">Compound Interest</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Principal Amount</label>
          <input type="number" value={p} onChange={e => setP(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white min-h-[44px]" />
        </div>
        <div>
          <label className="block text-sm mb-1">Rate of Interest (%)</label>
          <input type="number" value={r} onChange={e => setR(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white min-h-[44px]" />
        </div>
        <div>
          <label className="block text-sm mb-1">Time (Years)</label>
          <input type="number" value={t} onChange={e => setT(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white min-h-[44px]" />
        </div>
        <div>
          <label className="block text-sm mb-1">Compounding Frequency</label>
          <select value={n} onChange={e => setN(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white min-h-[44px]">
            <option value="1">Annually</option>
            <option value="2">Semi-Annually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
          </select>
        </div>
        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded min-h-[44px]">Calculate</button>
        {result && (
          <div className="mt-4 p-4 bg-gray-700 rounded text-center">
            <p>Interest: <span className="font-bold">{result.interest.toFixed(2)}</span></p>
            <p>Total Amount: <span className="font-bold">{result.total.toFixed(2)}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
