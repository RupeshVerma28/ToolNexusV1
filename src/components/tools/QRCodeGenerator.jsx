import React, { useState } from 'react';
import toast from "react-hot-toast";

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const generateQR = () => {
    if (!text.trim()) {
      alert('Please enter some text');
      return;
    }
    
    const encodedText = encodeURIComponent(text);
    const fg = fgColor.replace('#', '');
    const bg = bgColor.replace('#', '');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}&color=${fg}&bgcolor=${bg}`;
    setQrCodeUrl(qrUrl);
  };

  const downloadQR = async () => {
    if (!qrCodeUrl) return;
    
    const toastId = toast.loading("Download Started");
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
      toast.success("Download Completed", { id: toastId });
    } catch(err) {
      toast.error("Download Failed", { id: toastId });
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">QR Code Generator</h3>
      <p className="text-gray-400 text-sm mb-4">Generate and download QR codes</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Text or URL</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL to encode..."
            rows={3}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-vertical"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">QR Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-gray-700 border border-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-gray-700 border border-gray-600"
              />
            </div>
          </div>
        </div>

        <button
          onClick={generateQR}
          disabled={!text.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Generate QR Code
        </button>
        
        {qrCodeUrl && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-center">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="border border-gray-600 rounded-lg"
              />
            </div>
            
            <button
              onClick={downloadQR}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
