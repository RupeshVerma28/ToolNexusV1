import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function ImageFormatConverter() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageName, setImageName] = useState("");
  const [targetFormat, setTargetFormat] = useState("image/png");
  const fileRef = useRef();

  const handleFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageSrc(URL.createObjectURL(file));
      setImageName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const convertAndDownload = () => {
    if (!imageSrc) return;
    const toastId = toast.loading("Converting...");
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        // Fill white if jpeg to avoid black background internally
        if (targetFormat === "image/jpeg") {
          ctx.fillStyle = "#FFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            toast.error("Format not supported by browser", { id: toastId });
            return;
          }
          const url = URL.createObjectURL(blob);
          const ext = targetFormat.split("/")[1];
          const a = document.createElement("a");
          a.href = url;
          a.download = `${imageName}-converted.${ext}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          toast.success("Download Completed", { id: toastId });
        }, targetFormat, 0.9);
      };
      img.onerror = () => toast.error("Failed to process image", { id: toastId });
      img.src = imageSrc;
    } catch (e) {
      toast.error("Download Failed", { id: toastId });
    }
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg text-white max-w-lg mx-auto w-full">
      <h3 className="text-2xl font-semibold mb-4">Image Format Converter</h3>
      <p className="text-gray-400 text-sm mb-4">Convert images instantly between JPG, PNG, and WebP.</p>
      
      <input type="file" accept="image/*" onChange={handleFile} ref={fileRef} className="mb-4 text-sm" />
      
      {imageSrc && (
        <div className="space-y-4">
          <img src={imageSrc} alt="Preview" className="w-full h-auto max-h-64 object-contain bg-gray-900 rounded" />
          
          <div>
            <label className="block text-sm mb-2">Convert to Format</label>
            <select value={targetFormat} onChange={e => setTargetFormat(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white min-h-[44px]">
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG / JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>
          
          <button onClick={convertAndDownload} className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded min-h-[44px]">
            Convert & Download
          </button>
        </div>
      )}
    </div>
  );
}
