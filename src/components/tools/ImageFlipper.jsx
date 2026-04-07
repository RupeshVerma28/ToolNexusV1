// src/components/tools/ImageFlipper.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";

const ImageFlipper = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [flippedImage, setFlippedImage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setFlippedImage(null);
    }
  };

  const flipImage = (direction) => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();

      if (direction === "left" || direction === "right") {
        // horizontal flip
        ctx.scale(-1, 1);
        ctx.drawImage(img, -img.width, 0);
      } else if (direction === "up" || direction === "down") {
        // vertical flip
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, -img.height);
      }

      ctx.restore();

      const url = canvas.toDataURL("image/png");
      setFlippedImage(url);
    };
  };

  const downloadImage = () => {
    if (!flippedImage) return;
    const toastId = toast.loading("Download Started");
    try {
      const a = document.createElement("a");
      a.href = flippedImage;
      a.download = "flipped.png";
      a.click();
      toast.success("Download Completed", { id: toastId });
    } catch(err) {
      toast.error("Download Failed", { id: toastId });
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-3">Image Flipper</h3>
      <p className="text-gray-400 text-sm mb-4">
        Upload an image and flip it using the arrow buttons.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {imageSrc && !flippedImage && (
        <div className="mb-4">
          <img
            src={imageSrc}
            alt="Original"
            className="max-w-full rounded border border-gray-600"
          />
        </div>
      )}

      {imageSrc && !flippedImage && (
        <div className="flex gap-3 mb-4 justify-center">
          <button
            onClick={() => flipImage("left")}
            className="bg-gray-700 hover:bg-gray-600 text-white text-2xl py-2 px-4 rounded"
            title="Flip Left/Right"
          >
            ⬅️
          </button>
          <button
            onClick={() => flipImage("right")}
            className="bg-gray-700 hover:bg-gray-600 text-white text-2xl py-2 px-4 rounded"
            title="Flip Left/Right"
          >
            ➡️
          </button>
          <button
            onClick={() => flipImage("up")}
            className="bg-gray-700 hover:bg-gray-600 text-white text-2xl py-2 px-4 rounded"
            title="Flip Up/Down"
          >
            ⬆️
          </button>
          <button
            onClick={() => flipImage("down")}
            className="bg-gray-700 hover:bg-gray-600 text-white text-2xl py-2 px-4 rounded"
            title="Flip Up/Down"
          >
            ⬇️
          </button>
        </div>
      )}

      {flippedImage && (
        <>
          <div className="mb-4">
            <h4 className="text-white mb-2">Flipped Preview</h4>
            <img
              src={flippedImage}
              alt="Flipped result"
              className="max-w-full rounded border border-gray-600"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadImage}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Download Flipped
            </button>
            <button
              onClick={() => {
                setFlippedImage(null);
                setImageSrc(null);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageFlipper;
