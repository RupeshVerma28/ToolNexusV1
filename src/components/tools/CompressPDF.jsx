// src/components/tools/CompressPDF.jsx
import React, { useRef, useState } from "react";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

/**
 * CompressPDF.jsx
 *
 * - Renders PDF pages to canvas using pdfjs, encodes them as JPEG at chosen quality,
 *   packs images into a new PDF using jsPDF, and downloads it.
 * - Uses `pdfjs-dist/build/pdf` import (compatible with modern pdfjs-dist).
 * - Falls back to CDN-hosted pdf.worker if automatic resolution fails.
 *
 * Caveats:
 * - This rasterizes pages: resulting PDF will not have selectable/searchable text.
 * - Heavy PDFs (many pages / very large pages) may be slow or memory-heavy in the browser.
 */

const CompressPDF = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(0.7); // JPEG quality 0.05 - 1.0
  const [scaleFactor, setScaleFactor] = useState(1); // render scale (0.5 = half)
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [isWorking, setIsWorking] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setStatus("");
    setProgress(0);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) {
      setFile(e.dataTransfer.files[0]);
      setStatus("");
      setProgress(0);
    }
  };

  const onDragOver = (e) => e.preventDefault();

  const compressAndDownload = async () => {
    if (!file) {
      alert("Please choose a PDF first.");
      return;
    }

    setIsWorking(true);
    setStatus("Loading libraries...");
    setProgress(0);
    const toastId = toast.loading("Download Started");

    try {
      // dynamic import so heavy libs aren't bundled until needed
      const [pdfjsLibModule, jsPDFModule] = await Promise.all([
        import("pdfjs-dist/build/pdf"), // stable modern path
        import("jspdf"),
      ]);

      // pdfjs exports (getDocument, GlobalWorkerOptions, version)
      const {
        getDocument,
        GlobalWorkerOptions,
        version: pdfjsVersion,
      } = pdfjsLibModule;

      // set workerSrc to CDN fallback (works in Vite dev & production)
      // pdfjs-dist may provide a worker file inside node_modules, but referencing it reliably across bundlers is tricky.
      if (!GlobalWorkerOptions.workerSrc) {
        GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${
          pdfjsVersion || "2.16.105"
        }/pdf.worker.min.js`;
      }

      setStatus("Loading PDF...");
      const arrayBuffer = await file.arrayBuffer();
      setProgress(5);

      const loadingTask = getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const pageCount = pdf.numPages || 0;
      if (!pageCount) {
        setStatus("Could not determine page count.");
        setIsWorking(false);
        return;
      }

      setStatus(`Processing ${pageCount} page(s)...`);
      const { jsPDF } = jsPDFModule;
      const outPdf = new jsPDF({ unit: "pt" }); // points for accurate sizing
      let createdFirst = false;

      for (let i = 1; i <= pageCount; i++) {
        setStatus(`Rendering page ${i} / ${pageCount}...`);
        const page = await pdf.getPage(i);
        // render viewport at chosen scale
        const renderViewport = page.getViewport({ scale: scaleFactor });

        // create canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = Math.round(renderViewport.width);
        canvas.height = Math.round(renderViewport.height);

        // Wait for render to finish
        await page.render({ canvasContext: context, viewport: renderViewport })
          .promise;

        // Convert canvas to JPEG data URL at chosen quality
        const jpegQuality = Math.min(1, Math.max(0.05, quality));
        const dataUrl = canvas.toDataURL("image/jpeg", jpegQuality);

        // convert px -> pt (assuming 96dpi CSS pixels) : pt = px * 72 / 96 = px * 0.75
        const pxToPt = 0.75;
        const imgWidthPt = canvas.width * pxToPt;
        const imgHeightPt = canvas.height * pxToPt;

        if (!createdFirst) {
          // replace default page with page sized to image
          outPdf.deletePage(1);
          outPdf.addPage([imgWidthPt, imgHeightPt]);
          createdFirst = true;
        } else {
          outPdf.addPage([imgWidthPt, imgHeightPt]);
          outPdf.setPage(outPdf.getNumberOfPages());
        }

        // add image full page
        outPdf.addImage(
          dataUrl,
          "JPEG",
          0,
          0,
          imgWidthPt,
          imgHeightPt,
          undefined,
          "FAST"
        );

        // update progress
        setProgress(Math.round((i / pageCount) * 90));

        // free canvas memory
        canvas.width = 0;
        canvas.height = 0;
      }

      setStatus("Finalizing PDF...");
      setProgress(95);

      const outBlob = outPdf.output("blob");
      setProgress(100);

      const name = (file.name || "document").replace(/\.pdf$/i, "");
      saveAs(outBlob, `${name}-compressed.pdf`);
      setStatus("Done — downloaded!");
      toast.success("Download Completed", { id: toastId });
    } catch (err) {
      console.error("Compression failed:", err);
      setStatus("Compression failed: " + (err?.message || err));
      toast.error("Download Failed", { id: toastId });
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div
      className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <h3 className="text-2xl font-semibold text-white mb-3">Compress PDF</h3>
      <p className="text-gray-400 text-sm mb-4">
        Rasterizes each page and re-encodes as JPEG. Best for PDFs with images.
        Rasterization removes selectable text/searchability.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            PDF file
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="w-full p-2 rounded bg-gray-700 text-white"
            disabled={isWorking}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            JPEG quality ({Math.round(quality * 100)}%)
          </label>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            disabled={isWorking}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Downscale (page render scale)
          </label>
          <select
            value={scaleFactor}
            onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
            disabled={isWorking}
            className="w-full p-2 bg-gray-700 rounded text-white"
          >
            <option value={1}>100% (no downscale)</option>
            <option value={0.8}>80%</option>
            <option value={0.6}>60%</option>
            <option value={0.5}>50% (good size reduction)</option>
            <option value={0.4}>40%</option>
            <option value={0.3}>30%</option>
            <option value={0.2}>20% (very small)</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={compressAndDownload}
            disabled={isWorking || !file}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-60"
          >
            {isWorking ? "Working..." : "Compress & Download"}
          </button>

          <button
            onClick={() => {
              setFile(null);
              setStatus("");
              setProgress(0);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            disabled={isWorking}
          >
            Reset
          </button>
        </div>

        <div>
          <div className="text-sm text-gray-300">{status}</div>
          {progress > 0 && (
            <div className="w-full bg-gray-700 h-2 rounded mt-2 overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="bg-green-500 h-2"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompressPDF;
