import React, { useState } from "react";

export default function EMICalculator() {
  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const [t, setT] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const principal = parseFloat(p);
    let rate = parseFloat(r);
    let time = parseFloat(t);
    if (!isNaN(principal) && !isNaN(rate) && !isNaN(time)) {
      rate = rate / (12 * 100); // monthly interest rate
      time = time * 12; // periods in months
      const emi = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
      const totalAmount = emi * time;
      setResult({ emi, totalInterest: totalAmount - principal, totalAmount });
    }
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg text-white max-w-lg mx-auto w-full">
      <h3 className="text-2xl font-semibold mb-4">EMI Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Loan Amount</label>
          <input type="number" value={p} onChange={e => setP(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white min-h-[44px]" />
        </div>
        <div>
          <label className="block text-sm mb-1">Interest Rate (% per annum)</label>
          <input type="number" value={r} onChange={e => setR(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white min-h-[44px]" />
        </div>
        <div>
          <label className="block text-sm mb-1">Loan Tenure (Years)</label>
          <input type="number" value={t} onChange={e => setT(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white min-h-[44px]" />
        </div>
        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded min-h-[44px]">Calculate EMI</button>
        {result && (
          <div className="mt-4 p-4 bg-gray-700 rounded text-center">
            <p>Monthly EMI: <span className="font-bold text-lg">{result.emi.toFixed(2)}</span></p>
            <p>Total Interest: <span className="font-bold">{result.totalInterest.toFixed(2)}</span></p>
            <p>Total Payment: <span className="font-bold">{result.totalAmount.toFixed(2)}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
