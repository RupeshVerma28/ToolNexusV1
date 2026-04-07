// src/components/tools/VoltageConverter.jsx
import React, { useState } from "react";

const UNITS = [
  { key: "kv", label: "Kilovolt (kV)", factor: 1e3 },
  { key: "v", label: "Volt (V)", factor: 1 },
  { key: "mv", label: "Millivolt (mV)", factor: 1e-3 },
  { key: "uv", label: "Microvolt (µV)", factor: 1e-6 },
  { key: "nv", label: "Nanovolt (nV)", factor: 1e-9 },
];

const unitMap = UNITS.reduce((acc, u) => {
  acc[u.key] = u;
  return acc;
}, {});

const VoltageConverter = () => {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("v");
  const [precision, setPrecision] = useState(3);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  const toNumber = (v) => {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  };

  const formatNumber = (n, p) => {
    return n.toFixed(p);
  };

  const calculate = () => {
    const num = toNumber(value);
    if (num === 0) {
      setError("Please enter a valid number");
      setResults(null);
      return;
    }
    setError("");

    const baseValue = num * unitMap[unit].factor;
    const results = UNITS.map((u) => ({
      unit: u.label,
      value: baseValue / u.factor,
    }));

    setResults(results);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text));
      // brief visual feedback could be added; for now just small alert
      // but to avoid alert spam, do nothing
    } catch (e) {
      // fallback to prompt so user can copy manually
      // eslint-disable-next-line no-alert
      alert("Copy failed — here's the value:\n\n" + text);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-3">
        Voltage Converter
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Convert between kV, V, mV, µV and nV — supports scientific notation
        (e.g. 3.3e-3)
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Value
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter number (e.g. 12, 0.005, 3.3e-3)"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            From unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {UNITS.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Display precision (decimal places)
          </label>
          <input
            type="number"
            min="0"
            max="9"
            value={precision}
            onChange={(e) =>
              setPrecision(
                Math.max(0, Math.min(9, parseInt(e.target.value || "0", 10)))
              )
            }
            className="w-28 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Convert
          </button>

          <button
            onClick={() => {
              setValue("");
              setUnit("v");
              setPrecision(3);
              setResults(null);
              setError("");
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Reset
          </button>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {results && (
        <div className="mt-5 p-4 bg-gray-700 rounded-lg">
          <p className="text-white font-semibold mb-2">Input</p>
          <p className="text-gray-200 text-sm mb-3">
            {results.input.raw} {results.input.unit.label} ={" "}
            {formatNumber(results.volts, precision)} V
          </p>

          <div className="grid grid-cols-1 gap-2">
            {UNITS.map((u) => {
              const val = results.values[u.key];
              return (
                <div
                  key={u.key}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded-md border border-gray-600"
                >
                  <div>
                    <div className="text-sm text-gray-300">{u.label}</div>
                    <div className="text-lg font-medium text-white">
                      {formatNumber(val, precision)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(formatNumber(val, precision))
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Copy
                    </button>
                    <div className="text-xs text-gray-400">
                      {u.key.toUpperCase()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Note: Conversions are exact based on metric prefixes (1 kV = 1000 V,
            1 mV = 0.001 V, etc.). Very large or very small values may be shown
            in exponential notation.
          </p>
        </div>
      )}
    </div>
  );
};

export default VoltageConverter;
