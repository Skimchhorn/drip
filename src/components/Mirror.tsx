"use client";
import { useState } from "react";

export default function Mirror() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="w-[420px] h-[425px] bg-white/70 border-4 border-[#b8a47e] rounded-xl shadow-lg flex items-center justify-center">
      {image ? (
        <img src={image} alt="Mirror" className="max-h-full rounded" />
      ) : (
        <label className="cursor-pointer bg-[#8b7355] px-6 py-2 rounded-lg text-white hover:bg-[#6c5741]">
          Upload Photo
          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              setImage(URL.createObjectURL(e.target.files![0]))
            }
          />
        </label>
      )}
    </div>
  );
}
