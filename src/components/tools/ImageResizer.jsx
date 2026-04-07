// src/components/tools/ImageResizer.jsx
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

/**
 * ImageResizer.jsx
 * - Client-side resizing using canvas (no deps)
 * - Supports multiple files, drag/drop, keep aspect ratio, percentage resize, and output format/quality
 */

const FORMAT_OPTIONS = [
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

const ImageResizer = () => {
  const fileRef = useRef(null);
  const [items, setItems] = useState([]); // {id, file, url, name, origSize, resizedBlob, resizedUrl, resizedSize}
  const [mode, setMode] = useState("dimensions"); // 'dimensions' | 'percent'
  const [targetWidth, setTargetWidth] = useState(""); // px
  const [targetHeight, setTargetHeight] = useState(""); // px
  const [percent, setPercent] = useState(50); // %
  const [keepAspect, setKeepAspect] = useState(true);
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.8);
  const [status, setStatus] = useState("");

  const uid = () => Math.random().toString(36).slice(2, 9);

  const addFiles = (fileList) => {
    const arr = Array.from(fileList).map((f) => ({
      id: uid(),
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
      origSize: f.size,
      resizedBlob: null,
      resizedUrl: null,
      resizedSize: null,
      error: null,
    }));
    setItems((s) => [...s, ...arr]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = null;
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };
  const onDragOver = (e) => e.preventDefault();

  const removeItem = (id) => {
    setItems((s) => {
      const next = s.filter((x) => x.id !== id);
      // revoke URLs for cleaned ones if needed
      return next;
    });
  };

  const resetAll = () => {
    items.forEach((it) => {
      if (it.url) URL.revokeObjectURL(it.url);
      if (it.resizedUrl) URL.revokeObjectURL(it.resizedUrl);
    });
    setItems([]);
    setStatus("");
  };

  const loadImage = (file) =>
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

  // returns { blob, width, height }
  const resizeOne = async (file, requested) => {
    const img = await loadImage(file);
    const origW = img.width;
    const origH = img.height;

    let outW = requested.width;
    let outH = requested.height;

    // If percent mode requested, compute from original
    if (requested.mode === "percent") {
      const p = Math.max(1, Math.min(1000, requested.percent)); // clamp
      outW = Math.max(1, Math.round((origW * p) / 100));
      outH = Math.max(1, Math.round((origH * p) / 100));
    }

    // If keepAspect is true but both width and height provided, we prioritize width and compute height
    if (requested.keepAspect) {
      if (requested.width && !requested.height) {
        outH = Math.round((origH * outW) / origW);
      } else if (!requested.width && requested.height) {
        outW = Math.round((origW * outH) / origH);
      } else if (requested.width && requested.height) {
        // compute fitted size that preserves aspect and fits inside the box
        const ratio = Math.min(outW / origW, outH / origH);
        outW = Math.max(1, Math.round(origW * ratio));
        outH = Math.max(1, Math.round(origH * ratio));
      } // else both missing -> keep original
    } else {
      // if not keeping aspect and either dim is missing, fill with original
      if (!outW) outW = origW;
      if (!outH) outH = origH;
    }

    // fallback to original if nothing changed
    if (!outW && !outH) {
      outW = origW;
      outH = origH;
    }

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");

    // if output is jpeg, fill white background to avoid black for png alpha
    if (requested.format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);
    }
    // draw scaled image
    ctx.drawImage(img, 0, 0, outW, outH);

    const mime = requested.format;
    const q = Math.max(0.01, Math.min(1, Number(requested.quality) || 0.8));
    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else {
            // fallback convert dataURL -> blob
            const dataUrl = canvas.toDataURL(mime);
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

    return { blob, width: outW, height: outH };
  };

  const runResize = async () => {
    if (!items.length) {
      setStatus("Please add images first.");
      return;
    }
    setStatus("Resizing...");
    const updated = [...items];
    for (let i = 0; i < updated.length; i++) {
      try {
        const it = updated[i];
        // prepare requested dims
        const req = {
          mode,
          width:
            mode === "dimensions" && targetWidth ? Number(targetWidth) : null,
          height:
            mode === "dimensions" && targetHeight ? Number(targetHeight) : null,
          percent: mode === "percent" ? Number(percent) : null,
          keepAspect,
          format,
          quality,
        };

        const res = await resizeOne(it.file, req);
        const resizedUrl = URL.createObjectURL(res.blob);
        updated[i] = {
          ...it,
          resizedBlob: res.blob,
          resizedUrl,
          resizedSize: res.blob.size,
          width: res.width,
          height: res.height,
          error: null,
        };
      } catch (err) {
        updated[i] = { ...updated[i], error: err.message || "Resize failed" };
      }
      setItems([...updated]); // update UI progressively
    }
    setStatus("Resize complete");
  };

  const downloadOne = (it, useResized = true) => {
    const toastId = toast.loading("Download Started");
    try {
      const blob = useResized && it.resizedBlob ? it.resizedBlob : it.file;
    const url = useResized && it.resizedUrl ? it.resizedUrl : it.url;
    const ext =
      format === "image/png"
        ? ".png"
        : format === "image/webp"
        ? ".webp"
        : ".jpg";
    const base = it.name.replace(/\.[^/.]+$/, "");
    const name = useResized ? `${base}-resized${ext}` : it.name;
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Download Completed", { id: toastId });
    } catch(err) {
      toast.error("Download Failed", { id: toastId });
    }
  };

  const downloadAll = (useResized = true) => {
    items.forEach((it) => downloadOne(it, useResized));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-3">Image Resizer</h3>
      <p className="text-gray-400 text-sm mb-4">
        Resize images client-side. Drag & drop or choose files. Choose
        dimensions or percent and preserve aspect ratio if needed.
      </p>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-600 rounded p-4 mb-4"
      >
        <p className="text-gray-300 text-sm mb-2">Drop images here or</p>
        <div className="flex gap-3">
          <button
            onClick={() => fileRef.current?.click()}
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
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="dimensions">Target dimensions (px)</option>
            <option value="percent">Scale by percent (%)</option>
          </select>
        </div>

        {mode === "dimensions" ? (
          <>
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Width (px)
              </label>
              <input
                type="number"
                min="1"
                value={targetWidth}
                onChange={(e) => setTargetWidth(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Height (px)
              </label>
              <input
                type="number"
                min="1"
                value={targetHeight}
                onChange={(e) => setTargetHeight(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Percent (%)
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="inline-flex items-center text-gray-300">
          <input
            type="checkbox"
            checked={keepAspect}
            onChange={(e) => setKeepAspect(e.target.checked)}
            className="mr-2"
          />
          Keep aspect ratio
        </label>

        <div className="ml-auto flex gap-3">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            {FORMAT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            step="0.05"
            min="0.01"
            max="1"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-28 p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={runResize}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Resize
        </button>
        <button
          onClick={() => downloadAll(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Download resized
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
        {items.length === 0 && (
          <p className="text-sm text-gray-400">No images added yet.</p>
        )}
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between gap-3 bg-gray-900 p-2 rounded-md border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <img
                src={it.resizedUrl || it.url}
                alt={it.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <div className="text-white font-medium">{it.name}</div>
                <div className="text-xs text-gray-400">
                  Original: {prettyBytes(it.origSize)}
                </div>
                <div className="text-xs text-gray-400">
                  Resized: {it.resizedSize ? prettyBytes(it.resizedSize) : "—"}
                </div>
                {it.width && it.height && (
                  <div className="text-xs text-gray-400">
                    Size: {it.width}px × {it.height}px
                  </div>
                )}
                {it.error && (
                  <div className="text-xs text-red-400">{it.error}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadOne(it, true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Download
              </button>
              <button
                onClick={() => removeItem(it.id)}
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

export default ImageResizer;
