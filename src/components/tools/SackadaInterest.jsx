import React, { useState } from "react";

export default function SackadaInterest() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [days, setDays] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const p = parseFloat(amount);
    const r = parseFloat(rate);
    const m = parseFloat(months);
    const d = parseFloat(days) || 0; // Days are optional, default to 0

    if (!isNaN(p) && !isNaN(r) && !isNaN(m)) {
      // Logic for Sackada Interest
      const monthlyInterest = (p * r / 100) * m;
      const dailyInterest = (p * r / 100) * (d / 30);
      const totalInterest = monthlyInterest + dailyInterest;
      const totalAmount = p + totalInterest;

      setResult({
        monthlyInterest,
        dailyInterest,
        totalInterest,
        totalAmount
      });
    }
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg text-white max-w-lg mx-auto w-full">
      <h3 className="text-2xl font-semibold mb-4">Sackada Interest Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Amount (₹)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white" placeholder="Enter principal amount" />
        </div>
        <div>
          <label className="block text-sm mb-1">Rate (₹ per hundred per month)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white" placeholder="Enter interest rate" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Months</label>
            <input type="number" value={months} onChange={e => setMonths(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white" placeholder="Months" />
          </div>
          <div>
            <label className="block text-sm mb-1">Days (Optional)</label>
            <input type="number" value={days} onChange={e => setDays(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white" placeholder="Days" />
          </div>
        </div>
        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded min-h-[44px] transition-colors duration-200">Calculate</button>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-700 rounded space-y-2">
            <div className="flex justify-between">
              <span>Monthly Interest:</span>
              <span className="font-semibold">₹{result.monthlyInterest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Interest:</span>
              <span className="font-semibold">₹{result.dailyInterest.toFixed(2)}</span>
            </div>
            <hr className="border-gray-600 my-2" />
            <div className="flex justify-between">
              <span>Total Interest:</span>
              <span className="font-semibold">₹{result.totalInterest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg text-blue-400">
              <span className="font-bold">Total Amount:</span>
              <span className="font-bold">₹{result.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
