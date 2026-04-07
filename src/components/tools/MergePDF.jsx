// src/components/tools/MergePDF.jsx
import React, { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import toast from "react-hot-toast";

const uid = () => Math.random().toString(36).slice(2, 9);

const MergePDF = () => {
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [mergedUrl, setMergedUrl] = useState(null);
  const [mergedName, setMergedName] = useState("merged.pdf");
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(null);

  const addFiles = (fileList) => {
    const arr = Array.from(fileList)
      .filter(
        (f) => f && (f.type === "application/pdf" || /\.pdf$/i.test(f.name))
      )
      .map((f) => ({
        id: uid(),
        file: f,
        name: f.name,
        url: URL.createObjectURL(f),
        pages: null,
      }));
    if (arr.length === 0) {
      setStatus("No valid PDF files found.");
      return;
    }
    setItems((s) => [...s, ...arr]);
    setStatus("");
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

  const removeAt = (index) => {
    setItems((s) => {
      const copy = [...s];
      if (copy[index]?.url) URL.revokeObjectURL(copy[index].url);
      copy.splice(index, 1);
      return copy;
    });
  };

  const move = (from, to) => {
    setItems((s) => {
      const copy = [...s];
      if (to < 0 || to >= copy.length) return copy;
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const clearAll = () => {
    items.forEach((it) => it.url && URL.revokeObjectURL(it.url));
    if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    setItems([]);
    setMergedUrl(null);
    setMergedName("merged.pdf");
    setStatus("");
    setProgress(0);
    setTotalPages(null);
  };

  const mergePdfs = async () => {
    if (!items.length) {
      setStatus("Add PDFs first.");
      return;
    }
    setStatus("Merging PDFs...");
    setProgress(0);
    setMergedUrl(null);
    const toastId = toast.loading("Download Started");

    try {
      const mergedPdf = await PDFDocument.create();
      let pagesSoFar = 0;
      let total = 0;

      // estimate total pages if possible
      for (let i = 0; i < items.length; i++) {
        try {
          const buf = await items[i].file.arrayBuffer();
          const doc = await PDFDocument.load(buf);
          total += doc.getPageCount();
        } catch {
          // ignore
        }
      }

      // merge in the order of items[]
      for (let i = 0; i < items.length; i++) {
        const buffer = await items[i].file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const count = pdf.getPageCount();
        const indices = Array.from({ length: count }, (_, k) => k);
        const copied = await mergedPdf.copyPages(pdf, indices);
        copied.forEach((p) => mergedPdf.addPage(p));
        pagesSoFar += count;
        if (total > 0) setProgress(Math.round((pagesSoFar / total) * 100));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      if (mergedUrl) URL.revokeObjectURL(mergedUrl);

      setMergedUrl(url);
      setStatus("Merged successfully.");
      setTotalPages(pagesSoFar);
      setProgress(100);
      toast.success("Download Completed", { id: toastId });
    } catch (err) {
      console.error(err);
      setStatus("Merging failed: " + (err?.message || err));
      setProgress(0);
      toast.error("Download Failed", { id: toastId });
    }
  };

  const previewMerged = () => mergedUrl && window.open(mergedUrl, "_blank");

  const downloadMerged = () => {
    if (!mergedUrl) return;
    const a = document.createElement("a");
    a.href = mergedUrl;
    a.download = mergedName || "merged.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full">
      <h3 className="text-2xl font-semibold text-white mb-3">Merge PDF</h3>
      <p className="text-gray-400 text-sm mb-4">
        Combine multiple PDF files client-side and download a single merged PDF.
      </p>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-600 rounded p-4 mb-4"
      >
        <p className="text-gray-300 text-sm mb-2">Drop PDF files here or</p>
        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Choose PDFs
          </button>
          <button
            onClick={clearAll}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Clear
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {items.length > 0 && (
        <div className="mb-4">
          <div className="grid gap-2">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="flex items-center justify-between gap-3 bg-gray-900 p-2 rounded-md border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 text-xs rounded">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{it.name}</div>
                    <div className="text-xs text-gray-400">
                      {it.pages ? `${it.pages} pages` : "pages unknown"}
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
                    disabled={idx === items.length - 1}
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

          <div className="flex gap-3 mt-3">
            <button
              onClick={mergePdfs}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Merge PDFs
            </button>
            <input
              type="text"
              value={mergedName}
              onChange={(e) => setMergedName(e.target.value)}
              className="p-2 bg-gray-700 rounded text-white flex-1"
            />
          </div>

          <div className="mt-3 text-sm text-gray-300">
            {status && <div className="mb-1">{status}</div>}
            {totalPages !== null && (
              <div className="mb-1">Total pages: {totalPages}</div>
            )}
            {progress > 0 && (
              <div className="w-full bg-gray-800 h-2 rounded overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="bg-green-500 h-2"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {mergedUrl && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-white font-semibold mb-2">Merged PDF ready</p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={previewMerged}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Preview
            </button>
            <button
              onClick={downloadMerged}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Download
            </button>
            <button
              onClick={() => {
                URL.revokeObjectURL(mergedUrl);
                setMergedUrl(null);
                setStatus("");
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Clear merged
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MergePDF;
