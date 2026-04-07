// src/components/tools/ImageToPDF.jsx
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

/**
 * ImageToPDF
 * - Accepts multiple image files (drag/drop or file input)
 * - Allows reorder/remove
 * - Options: page format (A4/Letter), orientation, margin (mm), JPEG quality
 * - Produces multi-page PDF with each image fitted to page while preserving aspect ratio
 *
 * NOTE: install dependency: npm i jspdf
 */

const PAGE_OPTIONS = [
  { key: "a4", label: "A4 (210 × 297 mm)" },
  { key: "letter", label: "Letter (8.5 × 11 in)" },
];

const ImageToPDF = () => {
  const [files, setFiles] = useState([]); // { file, url, name, id }
  const [pageFormat, setPageFormat] = useState("a4");
  const [orientation, setOrientation] = useState("portrait"); // portrait | landscape
  const [marginMm, setMarginMm] = useState(10);
  const [quality, setQuality] = useState(0.9); // 0-1 for JPEG compression
  const [status, setStatus] = useState("");
  const fileInputRef = useRef(null);

  // Helpers
  const uid = () => Math.random().toString(36).slice(2, 9);

  const addFiles = (fileList) => {
    const arr = Array.from(fileList).map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
      id: uid(),
    }));
    setFiles((s) => [...s, ...arr]);
  };

  const handleFileSelect = (e) => {
    addFiles(e.target.files);
    e.target.value = null;
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };
  const onDragOver = (e) => e.preventDefault();

  const removeAt = (index) => {
    setFiles((s) => {
      const copy = [...s];
      // revoke url
      if (copy[index]?.url) URL.revokeObjectURL(copy[index].url);
      copy.splice(index, 1);
      return copy;
    });
  };

  const move = (from, to) => {
    if (to < 0 || to >= files.length) return;
    setFiles((s) => {
      const copy = [...s];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  // Load image into HTMLImageElement from file
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

  // Compress/convert image to JPEG dataURL using canvas (reduces file size)
  const imageToDataUrl = async (
    img,
    mime = "image/jpeg",
    qualityParam = 0.9,
    maxPixel = 2500
  ) => {
    // scale down if the image is huge to avoid massive memory usage
    let { width, height } = img;
    const scale = Math.min(1, maxPixel / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    // draw background white for PNG transparency -> white pages
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const dataUrl = canvas.toDataURL(mime, qualityParam);
    return { dataUrl, pxWidth: w, pxHeight: h };
  };

  const buildPdf = async () => {
    setStatus("");
    if (!files.length) {
      setStatus("Please add at least one image.");
      return null;
    }

    try {
      const doc = new jsPDF({
        unit: "mm",
        format: pageFormat,
        orientation: orientation,
      });

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const usableW = pageW - marginMm * 2;
      const usableH = pageH - marginMm * 2;

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        // load image element
        const imgElement = await loadImage(f.file);
        // compress/resize to reasonable pixel size (helps reduce PDF size)
        const { dataUrl } = await imageToDataUrl(
          imgElement,
          "image/jpeg",
          quality,
          2500
        );

        // compute image display size in mm to fit in usable area preserving aspect ratio
        // We can't get image pixel-to-mm conversion easily, but jsPDF takes width/height in mm.
        // We'll compute ratio from image px aspect ratio and fit into usable mm box.
        const imgAspect = imgElement.width / imgElement.height;
        let drawW = usableW;
        let drawH = usableW / imgAspect;
        if (drawH > usableH) {
          drawH = usableH;
          drawW = usableH * imgAspect;
        }

        const x = (pageW - drawW) / 2; // center horizontally
        const y = marginMm + (usableH - drawH) / 2; // center vertically within usable area

        // For subsequent images add new page first
        if (i > 0) doc.addPage();

        // Insert image (jsPDF will decode dataURL)
        doc.addImage(dataUrl, "JPEG", x, y, drawW, drawH);
      }

      return doc;
    } catch (err) {
      console.error(err);
      setStatus("Error building PDF: " + (err.message || err));
      return null;
    }
  };

  const handleDownload = async () => {
    setStatus("Generating PDF...");
    const toastId = toast.loading("Download Started");
    const doc = await buildPdf();
    if (!doc) {
      if (!status) setStatus("Failed to generate PDF.");
      toast.error("Download Failed", { id: toastId });
      return;
    }
    try {
      doc.save("images.pdf");
      setStatus("Downloaded ✔");
      toast.success("Download Completed", { id: toastId });
    } catch (err) {
      console.error(err);
      setStatus("Error saving file.");
      toast.error("Download Failed", { id: toastId });
    }
  };

  const handlePreview = async () => {
    setStatus("Generating preview...");
    const doc = await buildPdf();
    if (!doc) return;
    try {
      const blobUrl = doc.output("bloburl");
      window.open(blobUrl, "_blank");
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("Preview failed.");
    }
  };

  const handleReset = () => {
    // revoke urls
    files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
    setFiles([]);
    setStatus("");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-3">Image → PDF</h3>
      <p className="text-gray-400 text-sm mb-4">
        Convert one or more images into a multi-page PDF. Drag & drop or choose
        files.
      </p>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-600 rounded p-4 mb-4"
      >
        <p className="text-gray-300 text-sm mb-2">Drop images here or</p>
        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Choose images
          </button>
          <button
            onClick={() => setFiles([])}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Clear
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-1 gap-2">
            {files.map((f, idx) => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-3 bg-gray-900 p-2 rounded-md border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={f.url}
                    alt={f.name}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="text-white font-medium">{f.name}</div>
                    <div className="text-xs text-gray-400">
                      {Math.round(f.file.size / 1024)} KB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => move(idx, idx - 1)}
                    disabled={idx === 0}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(idx, idx + 1)}
                    disabled={idx === files.length - 1}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeAt(idx)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Page format
          </label>
          <select
            value={pageFormat}
            onChange={(e) => setPageFormat(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            {PAGE_OPTIONS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Orientation
          </label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Margin (mm)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={marginMm}
            onChange={(e) => setMarginMm(Number(e.target.value))}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            JPEG quality (0.1 - 1)
          </label>
          <input
            type="number"
            min="0.1"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div className="flex items-end">
          <div className="text-xs text-gray-400">
            Tip: Lower quality reduces PDF size.
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePreview}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded"
        >
          Preview
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
        >
          Download PDF
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded"
        >
          Reset
        </button>
      </div>

      {status && <p className="text-sm text-gray-300 mt-3">{status}</p>}
    </div>
  );
};

export default ImageToPDF;
