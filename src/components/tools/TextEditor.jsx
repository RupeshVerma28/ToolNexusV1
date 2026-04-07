import React, { useState } from 'react';
import toast from "react-hot-toast";

const TextEditor = () => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('document.txt');

  const downloadText = () => {
    const toastId = toast.loading("Download Started");
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download Completed", { id: toastId });
    } catch(err) {
      toast.error("Download Failed", { id: toastId });
    }
  };

  const clearText = () => {
    setText('');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Text Editor</h3>
      <p className="text-gray-400 text-sm mb-4">Simple text editor with download</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Text Content</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            rows={10}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-vertical"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadText}
            disabled={!text.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Download Text
          </button>
          
          <button
            onClick={clearText}
            disabled={!text.trim()}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Clear Text
          </button>
        </div>
        
        {text && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm">
              Characters: {text.length} | Words: {text.trim() ? text.trim().split(/\s+/).length : 0} | Lines: {text.split('\n').length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
