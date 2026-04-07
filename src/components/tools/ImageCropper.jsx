// src/components/tools/ImageCropper.jsx
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

const ImageCropper = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (err) => reject(err));
      img.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const { width, height, x, y } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve({ url, blob });
        }, "image/jpeg");
      });
    } catch (e) {
      console.error("Crop failed", e);
      return null;
    }
  };

  const handleCrop = async () => {
    const cropped = await getCroppedImg();
    if (cropped) {
      setCroppedImage(cropped.url);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setCroppedImage(null);
    }
  };

  const downloadImage = () => {
    if (!croppedImage) return;
    const toastId = toast.loading("Download Started");
    try {
      const a = document.createElement("a");
      a.href = croppedImage;
      a.download = "cropped.jpg";
      a.click();
      toast.success("Download Completed", { id: toastId });
    } catch(err) {
      toast.error("Download Failed", { id: toastId });
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-3">Image Cropper</h3>
      <p className="text-gray-400 text-sm mb-4">
        Upload an image, adjust the crop area, then save the cropped result.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {imageSrc && !croppedImage && (
        <div className="relative w-full h-96 bg-gray-900 mb-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {imageSrc && !croppedImage && (
        <div className="flex gap-3 mb-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      <div className="flex gap-3">
        {imageSrc && !croppedImage && (
          <button
            onClick={handleCrop}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Crop
          </button>
        )}
        {croppedImage && (
          <>
            <button
              onClick={downloadImage}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Download Cropped
            </button>
            <button
              onClick={() => {
                setCroppedImage(null);
                setImageSrc(null);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Reset
            </button>
          </>
        )}
      </div>

      {croppedImage && (
        <div className="mt-4">
          <h4 className="text-white mb-2">Preview</h4>
          <img
            src={croppedImage}
            alt="Cropped result"
            className="rounded border border-gray-600 max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
