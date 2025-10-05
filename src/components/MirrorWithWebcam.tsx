"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { Upload, Camera, X } from "lucide-react";
import { ClothingItem } from "./HomePage";

interface MirrorWithWebcamProps {
  uploadedImage: string | null;
  onImageUpload: (image: string | null) => void;
  onItemDrop: (item: ClothingItem) => void;
  droppedItem?: ClothingItem;
  // onClearItems: () => void;
}

export default function MirrorWithWebcam({
  uploadedImage,
  onImageUpload,
  onItemDrop,
  droppedItem,
  // onClearItems,
}: MirrorWithWebcamProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // 🔁 Track image key for forced re-render
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    setImageKey((prev) => prev + 1);
  }, [uploadedImage]);

  // 📦 React DnD Drop Zone
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "clothing-item",
    drop: (item: ClothingItem) => {
      onItemDrop(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  drop(dropRef);

  // 🎥 Handle webcam stream
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      console.log("Reattached stream to video:", stream);
    }
  }, [stream]);

  // 🖼️ Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string | null;
        if (result) {
          onImageUpload(result);
        } else {
          console.error("Image upload failed, result was null");
        }
        // reset file input so selecting the same file again will trigger change
        if (fileInputRef.current) {
          try {
            fileInputRef.current.value = "";
          } catch (err) {
            /* ignore in case browser prevents direct value set */
          }
        }

        stopWebcam();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 📷 Start webcam
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log("Set srcObject:", videoRef.current.srcObject);
      }

      setStream(mediaStream);
      setIsWebcamActive(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert("Unable to access webcam. Please check permissions.");
    }
  };

  // 🛑 Stop webcam
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsWebcamActive(false);
    }
    // clear video srcObject to avoid holding onto stopped stream
    if (videoRef.current) {
      try {
        // @ts-ignore assignment to srcObject
        videoRef.current.srcObject = null;
      } catch (err) {
        // ignore
      }
    }
  };

  // 📸 Capture photo from webcam
  const capturePhoto = () => {
    console.log("capturePhoto called");
    console.log("videoRef.current:", videoRef.current);
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      console.log("Canvas dimensions:", canvas.width, canvas.height);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/png");
        console.log("Image data created, length:", imageData.length);
        console.log("Image data preview:", imageData.substring(0, 50));
        console.log("Calling onImageUpload with imageData");
        onImageUpload(imageData);
        stopWebcam();
      } else {
        console.error("Failed to get canvas context");
      }
    } else {
      console.error("videoRef.current is null");
    }
  };

  // 🧹 Remove uploaded image (clear file input too so same-file re-uploads work)
  const handleRemoveImage = () => {
    onImageUpload(null);
    if (fileInputRef.current) {
      try {
        fileInputRef.current.value = "";
      } catch (err) {
        // ignore
      }
    }
    // also stop webcam if somehow active
    stopWebcam();
  };

  return (
    <div
      ref={dropRef}
      className={`relative w-full h-full transition-all duration-300 ${
        isOver ? "scale-105" : ""
      }`}
    >
      {/* Mirror Surface */}
      <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg">
        <div className="relative w-full h-full">
          {/* --- Webcam View --- */}
          {isWebcamActive ? (
            <div>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onCanPlay={() => {
                  videoRef.current
                    ?.play()
                    .catch((err) => console.error("Play failed:", err));
                }}
                className="absolute inset-0 w-full h-full object-cover z-20"
              />
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                <button
                  onClick={capturePhoto}
                  className="bg-white hover:bg-gray-100 text-[#6b5d4f] px-6 py-3 rounded-full shadow-lg transition-all"
                >
                  <Camera className="inline-block mr-2 w-5 h-5" />
                  Capture
                </button>
                <button
                  onClick={stopWebcam}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg transition-all"
                >
                  <X className="inline-block mr-2 w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          ) : uploadedImage ? (
            /* --- Uploaded Image View --- */
            <div key={imageKey} className="relative w-full h-full fade-in">
              <img
                key={imageKey}
                src={uploadedImage ?? ""}
                alt="Uploaded"
                className="w-full h-full object-cover z-10 transition-opacity duration-500 opacity-100"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 shadow-lg transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            /* --- Default Upload UI --- */
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/30 via-transparent to-white/10">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <button
                    onClick={handleUploadClick}
                    className="bg-[#8b7355] hover:bg-[#7a6248] text-white px-8 py-4 rounded-xl shadow-xl transition-all transform hover:scale-105"
                  >
                    <Upload className="inline-block mr-2 w-5 h-5" />
                    UPLOAD IMAGE
                  </button>
                  <div className="text-[#8b7355]">or</div>
                  <button
                    onClick={startWebcam}
                    className="bg-white hover:bg-gray-50 text-[#6b5d4f] px-8 py-4 rounded-xl shadow-xl transition-all transform hover:scale-105 border-2 border-[#c4b5a0]"
                  >
                    <Camera className="inline-block mr-2 w-5 h-5" />
                    TAKE PHOTO
                  </button>
                </div>
              </div>
            </div>
          )}
         {isOver && (
                <div className="absolute inset-0 bg-[#b89968]/30 border-4 border-dashed border-[#b89968] rounded-xl flex items-center justify-center backdrop-blur-sm z-50">
                  <p className="text-[#6b5d4f] text-xl bg-white/90 px-6 py-3 rounded-lg shadow-lg">
                    Drop item here!
                  </p>
                </div>
              )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
