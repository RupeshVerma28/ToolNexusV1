// src/components/tools/TextToPDF.jsx
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

/**
 * TextToPDF
 * - Client-side text -> multi-page PDF
 * - Uses jsPDF (install with: npm i jspdf)
 */
const PAGE_OPTIONS = [
  { key: "a4", label: "A4 (210 × 297 mm)" },
  { key: "letter", label: "Letter (8.5 × 11 in)" },
];

const TextToPDF = () => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [filename, setFilename] = useState("document.pdf");
  const [marginMm, setMarginMm] = useState(15);
  const [pageFormat, setPageFormat] = useState("a4");
  const [status, setStatus] = useState("");
  const [pagesEstimate, setPagesEstimate] = useState(null);
  const textRef = useRef(null);

  const parseNumber = (v, fallback = 0) => {
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : fallback;
  };

  const buildPdf = (forPreview = false) => {
    setStatus("");
    const content = text.trim();
    if (!content) {
      setStatus("Please enter some text to convert.");
      return null;
    }

    const fs = Math.max(6, parseNumber(fontSize, 12)); // pt
    const margin = Math.max(0, parseNumber(marginMm, 15)); // mm

    // create doc
    const doc = new jsPDF({ unit: "mm", format: pageFormat });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const usableWidth = pageW - margin * 2;
    const usableHeight = pageH - margin * 2;

    doc.setFont("Times", "Normal");
    doc.setFontSize(fs);

    // jsPDF helper to split text into wrapped lines given width
    const lines = doc.splitTextToSize(content, usableWidth);

    // compute line height in mm (approx): 1pt = 0.3528 mm
    const lineHeight = fs * 0.3528 * 1.15; // 1.15 line spacing

    // paginate
    let y = margin;
    let pageCount = 1;
    for (let i = 0; i < lines.length; i++) {
      if (y + lineHeight > pageH - margin + 0.001) {
        doc.addPage();
        pageCount++;
        y = margin;
      }
      doc.text(lines[i], margin, y);
      y += lineHeight;
    }

    // page numbers (optional): add small footer
    // Add page numbers by iterating pages and writing footer on each
    const pageCountTotal = doc.getNumberOfPages();
    for (let p = 1; p <= pageCountTotal; p++) {
      doc.setPage(p);
      doc.setFontSize(Math.max(8, fs - 2));
      const footer = `Page ${p} / ${pageCountTotal}`;
      doc.text(footer, pageW - margin, pageH - margin / 2, { align: "right" });
    }

    setPagesEstimate(pageCountTotal);
    return doc;
  };

  const handleDownload = () => {
    const toastId = toast.loading("Download Started");
    const doc = buildPdf(false);
    if (!doc) {
      toast.error("Download Failed", { id: toastId });
      return;
    }
    try {
      doc.save(filename || "document.pdf");
      setStatus("Saved ✔");
      toast.success("Download Completed", { id: toastId });
    } catch (err) {
      console.error(err);
      setStatus("Error saving file.");
      toast.error("Download Failed", { id: toastId });
    }
  };

  const handlePreview = () => {
    const doc = buildPdf(true);
    if (!doc) return;
    try {
      const blobUrl = doc.output("bloburl");
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error(err);
      setStatus("Error generating preview.");
    }
  };

  const handleEstimate = () => {
    const doc = buildPdf(false);
    if (!doc) return;
    setStatus(`Estimated pages: ${pagesEstimate}`);
  };

  const handleReset = () => {
    setText("");
    setFontSize(12);
    setFilename("document.pdf");
    setMarginMm(15);
    setPageFormat("a4");
    setStatus("");
    setPagesEstimate(null);
    if (textRef.current) textRef.current.focus();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-3">Text → PDF</h3>
      <p className="text-gray-400 text-sm mb-4">
        Convert typed text into a downloadable multi-page PDF. Uses client-side
        jsPDF. (Install: <code>npm i jspdf</code>)
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Document text
          </label>
          <textarea
            ref={textRef}
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type the text you want in the PDF..."
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Page format
            </label>
            <select
              value={pageFormat}
              onChange={(e) => setPageFormat(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
            >
              {PAGE_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Font size (pt)
            </label>
            <input
              type="number"
              min="6"
              max="48"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Margin (mm)
            </label>
            <input
              type="number"
              min="0"
              max="40"
              value={marginMm}
              onChange={(e) => setMarginMm(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Estimate pages
            </label>
            <button
              onClick={handleEstimate}
              className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              Estimate
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
          >
            Preview (open)
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            Download PDF
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg"
          >
            Reset
          </button>
        </div>

        {status && <p className="text-sm text-gray-300 mt-2">{status}</p>}
        {pagesEstimate !== null && (
          <p className="text-sm text-gray-300">
            Estimated pages: {pagesEstimate}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextToPDF;
