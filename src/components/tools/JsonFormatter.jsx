import React, { useState } from "react";
import toast from "react-hot-toast";

export default function JsonFormatter() {
  const [json, setJson] = useState("");
  const [formatted, setFormatted] = useState("");

  const formatJson = () => {
    try {
      if (!json.trim()) return;
      const parsed = JSON.parse(json);
      setFormatted(JSON.stringify(parsed, null, 2));
      toast.success("Valid JSON");
    } catch (err) {
      toast.error("Invalid JSON");
      setFormatted(err.message);
    }
  };

  const clear = () => {
    setJson("");
    setFormatted("");
  };

  const copyToClipboard = () => {
    if (!formatted) return;
    navigator.clipboard.writeText(formatted);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg text-white w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4">JSON Formatter & Validator</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Input JSON</label>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="w-full h-96 p-3 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
            placeholder='{"key": "value"}'
          ></textarea>
        </div>
        <div>
          <label className="block text-sm mb-2">Output</label>
          <textarea
            readOnly
            value={formatted}
            className="w-full h-96 p-3 rounded bg-gray-900 border border-gray-700 text-green-400 focus:outline-none font-mono text-sm resize-none"
          ></textarea>
        </div>
      </div>
      <div className="flex gap-3 mt-4 flex-wrap">
        <button onClick={formatJson} className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold min-h-[44px]">Format / Validate</button>
        <button onClick={copyToClipboard} className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 py-3 rounded font-semibold min-h-[44px]">Copy Output</button>
        <button onClick={clear} className="flex-1 min-w-[120px] bg-gray-600 hover:bg-gray-500 py-3 rounded font-semibold min-h-[44px]">Clear</button>
      </div>
    </div>
  );
}
