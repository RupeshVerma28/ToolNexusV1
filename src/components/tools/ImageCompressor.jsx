// src/components/tools/ImageCompressor.jsx
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

/**
 * ImageCompressor.jsx
 * - Client-side image compression using canvas
 * - No external dependency required
 * - Supports JPEG / PNG / WEBP (webp only if browser supports it)
 */

const formatOptions = [
  { key: "image/jpeg", label: "JPEG (.jpg/.jpeg)" },
  { key: "image/png", label: "PNG (.png)" },
  { key: "image/webp", label: "WebP (.webp)" },
];

const prettyBytes = (n) => {
  if (!Number.isFinite(n)) return "—";
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / (1024 * 1024)).toFixed(2) + " MB";
};

const ImageCompressor = () => {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]); // {id, file, url, name, origSize, compressedBlob, compressedUrl, compressedSize}
  const [quality, setQuality] = useState(0.8); // 0..1
  const [format, setFormat] = useState("image/jpeg");
  const [maxWidth, setMaxWidth] = useState(1600);
  const [maxHeight, setMaxHeight] = useState(1600);
  const [status, setStatus] = useState("");

  const uid = () => Math.random().toString(36).slice(2, 9);

  const addFiles = (fileList) => {
    const arr = Array.from(fileList).map((f) => ({
      id: uid(),
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
      origSize: f.size,
      compressedBlob: null,
      compressedUrl: null,
      compressedSize: null,
      error: null,
    }));
    setImages((s) => [...s, ...arr]);
  };

  const handleFiles = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = null;
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };
  const onDragOver = (e) => e.preventDefault();

  const removeImage = (id) => {
    setImages((s) => {
      const next = s.filter((x) => x.id !== id);
      return next;
    });
  };

  const resetAll = () => {
    images.forEach((img) => {
      if (img.url) URL.revokeObjectURL(img.url);
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
    setStatus("");
  };

  // load file into Image element
  const loadImageElement = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });

  // compress single image -> returns Blob
  const compressImage = async (file) => {
    // if image is GIF or other, fallback to returning original
    const img = await loadImageElement(file);
    // compute target size keeping aspect ratio
    const ratio = Math.min(
      1,
      Math.min(maxWidth / img.width, maxHeight / img.height)
    );
    const targetW = Math.max(1, Math.round(img.width * ratio));
    const targetH = Math.max(1, Math.round(img.height * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");

    // Fill white background for formats without alpha (so PNG with alpha will retain it; for JPEG we need white)
    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(img, 0, 0, targetW, targetH);

    // canvas.toBlob uses callback; wrap in Promise
    const mime = format;
    const q = Math.max(0.01, Math.min(1, Number(quality) || 0.8));
    return await new Promise((resolve) => {
      // For PNG the quality parameter is ignored by some browsers; PNG is lossless unless you manipulate pixels.
      canvas.toBlob(
        (blob) => {
          // If browser couldn't create blob (older Safari) fallback to dataURL conversion
          if (blob) resolve(blob);
          else {
            const dataUrl = canvas.toDataURL(mime);
            // convert dataURL to blob
            const arr = dataUrl.split(",");
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8 = new Uint8Array(n);
            while (n--) u8[n] = bstr.charCodeAt(n);
            resolve(new Blob([u8], { type: mime }));
          }
        },
        mime,
        q
      );
    });
  };

  const compressAll = async () => {
    if (!images.length) {
      setStatus("Add images first.");
      return;
    }
    setStatus("Compressing...");
    const updated = [...images];
    for (let i = 0; i < updated.length; i++) {
      try {
        const origFile = updated[i].file;
        const blob = await compressImage(origFile);
        const compressedUrl = URL.createObjectURL(blob);
        updated[i] = {
          ...updated[i],
          compressedBlob: blob,
          compressedUrl,
          compressedSize: blob.size,
          error: null,
        };
      } catch (err) {
        updated[i] = { ...updated[i], error: err.message || "Compress failed" };
      }
      // update state progressively so UI updates
      setImages([...updated]);
    }
    setStatus("Compression complete");
  };

  const downloadFile = (imgObj, useCompressed = true) => {
    const toastId = toast.loading("Download Started");
    try {
      const blob =
      useCompressed && imgObj.compressedBlob
        ? imgObj.compressedBlob
        : imgObj.file;
    const url =
      useCompressed && imgObj.compressedUrl ? imgObj.compressedUrl : imgObj.url;
    const ext =
      format === "image/png"
        ? ".png"
        : format === "image/webp"
        ? ".webp"
        : ".jpg";
    const filenameBase = imgObj.name.replace(/\.[^/.]+$/, "");
    const downloadName = useCompressed
      ? `${filenameBase}-compressed${ext}`
      : imgObj.name;
    // create anchor
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Download Completed", { id: toastId });
    } catch(err) {
      toast.error("Download Failed", { id: toastId });
    }
  };

  const downloadAll = (useCompressed = true) => {
    // Download each file sequentially (browser will prompt or save depending on settings)
    images.forEach((img) => {
      downloadFile(img, useCompressed);
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-3">
        Image Compressor
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Compress images client-side. Supports JPEG / PNG / WebP (browser support
        required). Drag & drop or choose files.
      </p>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-600 rounded p-4 mb-4"
      >
        <p className="text-gray-300 text-sm mb-2">Drop images here or</p>
        <div className="flex gap-3">
          <button
            onClick={() => inputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Choose images
          </button>
          <button
            onClick={resetAll}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Clear
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Output format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            {formatOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Quality (0.1 - 1)
          </label>
          <input
            type="number"
            step="0.05"
            min="0.1"
            max="1"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Max width (px)
          </label>
          <input
            type="number"
            min="1"
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Max height (px)
          </label>
          <input
            type="number"
            min="1"
            value={maxHeight}
            onChange={(e) => setMaxHeight(Number(e.target.value))}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={compressAll}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Compress
        </button>
        <button
          onClick={() => downloadAll(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Download all compressed
        </button>
        <button
          onClick={() => downloadAll(false)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
        >
          Download originals
        </button>
      </div>

      {status && <p className="text-sm text-gray-300 mb-3">{status}</p>}

      <div className="space-y-2">
        {images.length === 0 && (
          <p className="text-sm text-gray-400">No images added yet.</p>
        )}
        {images.map((img) => (
          <div
            key={img.id}
            className="flex items-center justify-between gap-3 bg-gray-900 p-2 rounded-md border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <img
                src={img.url}
                alt={img.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <div className="text-white font-medium">{img.name}</div>
                <div className="text-xs text-gray-400">
                  Original: {prettyBytes(img.origSize)}
                </div>
                <div className="text-xs text-gray-400">
                  Compressed:{" "}
                  {img.compressedSize ? prettyBytes(img.compressedSize) : "—"}
                </div>
                {img.error && (
                  <div className="text-xs text-red-400">{img.error}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile(img, true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Download
              </button>
              <button
                onClick={() => removeImage(img.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCompressor;
