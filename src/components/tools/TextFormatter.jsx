import React, { useState } from "react";
import toast from "react-hot-toast";

export default function TextFormatter() {
  const [text, setText] = useState("");

  const applyFormat = (type) => {
    let result = text;
    switch (type) {
      case "upper": result = text.toUpperCase(); break;
      case "lower": result = text.toLowerCase(); break;
      case "capitalize": result = text.replace(/\b\w/g, l => l.toUpperCase()); break;
      case "nospace": result = text.replace(/\s+/g, ""); break;
      case "singleSpace": result = text.replace(/\s+/g, " ").trim(); break;
      default: break;
    }
    setText(result);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg text-white max-w-2xl mx-auto w-full">
      <h3 className="text-2xl font-semibold mb-4">Text Formatter</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-48 p-3 rounded bg-gray-700 text-white min-h-[44px] focus:outline-none focus:border-blue-500 mb-4"
        placeholder="Type or paste your text here..."
      ></textarea>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        <button onClick={() => applyFormat('upper')} className="bg-gray-600 hover:bg-gray-500 py-2 rounded min-h-[44px]">UPPERCASE</button>
        <button onClick={() => applyFormat('lower')} className="bg-gray-600 hover:bg-gray-500 py-2 rounded min-h-[44px]">lowercase</button>
        <button onClick={() => applyFormat('capitalize')} className="bg-gray-600 hover:bg-gray-500 py-2 rounded min-h-[44px]">Capitalize Each Word</button>
        <button onClick={() => applyFormat('nospace')} className="bg-gray-600 hover:bg-gray-500 py-2 rounded min-h-[44px]">Remove Spaces</button>
        <button onClick={() => applyFormat('singleSpace')} className="bg-gray-600 hover:bg-gray-500 py-2 rounded min-h-[44px]">Fix Extra Spaces</button>
        <button onClick={() => setText("")} className="bg-red-600 hover:bg-red-500 py-2 rounded min-h-[44px]">Clear</button>
      </div>
      
      <button onClick={copyText} className="w-full bg-blue-600 hover:bg-blue-700 py-3 font-semibold rounded min-h-[44px]">Copy Text</button>
    </div>
  );
}
