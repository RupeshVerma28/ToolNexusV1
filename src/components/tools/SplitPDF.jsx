import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

export default function SplitPDF() {
  const [pdfFile, setPdfFile] = useState(null);
  const [ranges, setRanges] = useState(""); // e.g. "1-2,3,4-5"

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPdfFile(file);
  };

  // Parse ranges like "1-3,5,7-8"
  const parseRanges = (str, totalPages) => {
    const parts = str.split(",").map((s) => s.trim());
    let pages = [];
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) pages.push(i);
        }
      } else {
        const num = Number(part);
        if (num >= 1 && num <= totalPages) pages.push(num);
      }
    }
    return pages;
  };

  const splitPDF = async () => {
    if (!pdfFile || !ranges) {
      alert("Please select a PDF and enter page ranges.");
      return;
    }

    const toastId = toast.loading("Download Started");
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const existingPdfBytes = reader.result;
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const totalPages = pdfDoc.getPageCount();

      const pagesToExtract = parseRanges(ranges, totalPages);

      if (pagesToExtract.length === 0) {
        alert("No valid pages found in range.");
        return;
      }

      // Create new PDF
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(
        pdfDoc,
        pagesToExtract.map((p) => p - 1)
      );
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      saveAs(new Blob([newPdfBytes], { type: "application/pdf" }), "split.pdf");
      toast.success("Download Completed", { id: toastId });
      } catch (err) {
        console.error(err);
        toast.error("Download Failed", { id: toastId });
      }
    };
    reader.onerror = () => toast.error("Download Failed", { id: toastId });
    reader.readAsArrayBuffer(pdfFile);
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl w-full max-w-lg mx-auto shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Split PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-3 block w-full text-sm text-gray-300
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-500"
      />

      <input
        type="text"
        placeholder="Enter page ranges e.g. 1-2,4,5-7"
        value={ranges}
        onChange={(e) => setRanges(e.target.value)}
        className="w-full p-2 mb-3 rounded text-black"
      />

      <button
        onClick={splitPDF}
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
      >
        Split and Download
      </button>
    </div>
  );
}
