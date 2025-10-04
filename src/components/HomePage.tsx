'use client';

import {HistoryPanel, HistoryPhoto} from "../components/HistoryPanel";
import Mirror from "../components/Mirror";
import SuggestionList from "../components/SuggestionList";
import MirrorWithWebcam from "../components/MirrorWithWebcam";
import React, { useState } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Star } from "lucide-react";
import SearchBar from "../components/SearchBar";
// import Mirror from "../components/Mirror";

export interface ClothingItem {
  id: string;
  name: string;
  price: number;
  image: string | undefined;
  url?: string | undefined;
  category: string;
}
const mockSuggestions: ClothingItem[] = [
  {
    id: '1',
    name: 'Beige Sweater',
    price: 29,
    image: 'https://images.unsplash.com/photo-1632477443572-dd0aa40fc27c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHN3ZWF0ZXIlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTkyNTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    // url: undefined,
    category: 'Top'
  },
  {
    id: '2',
    name: 'White Shirt',
    price: 99,
    image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5MTczNzY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    // url: undefined,
    category: 'Shirt'
  },
  {
    id: '3',
    name: 'Blue Jeans',
    price: 79,
    image: 'https://images.unsplash.com/photo-1713880442898-0f151fba5e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NTkyNDU4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Bottom'
  },
  {
    id: '4',
    name: 'White Sneakers',
    price: 89,
    image: 'https://images.unsplash.com/photo-1651371409956-20e79c06a8bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwc2hvZXN8ZW58MXx8fHwxNzU5MTk4NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Shoes'
  },
  {
    id: '5',
    name: 'Leather Jacket',
    price: 199,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwamFja2V0fGVufDF8fHx8MTc1OTI1NTE1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Jacket'
  },
  {
    id: '6',
    name: 'Summer Dress',
    price: 69,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBkcmVzc3xlbnwxfHx8fDE3NTkyNTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Dress'
  },
  {
    id: '7',
    name: 'Black Blazer',
    price: 149,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGJsYXplcnxlbnwxfHx8fDE3NTkyNTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Jacket'
  },
  {
    id: '8',
    name: 'Casual Shorts',
    price: 45,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9ydHMlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTkyNTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Bottom'
  }
];

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [droppedOneItem, setDroppedItem] = useState<ClothingItem | undefined>(undefined);
  const [historyPhotos, setHistoryPhotos] = useState<HistoryPhoto[]>([]);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([
  "Clean look, good balance",
  "Colors match well",
  "Try experimenting with shoes for contrast",
]);
  const [suggestions, setSuggestions] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/searchClothes?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (Array.isArray(data.items)) {
        setSuggestions(data.items);
      } else {
        console.error("Invalid data format:", data);
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  const handleItemDrop = async (item: ClothingItem) => {
    console.log("handleItemDrop -> uploadedImage:", uploadedImage);
    if (!uploadedImage || uploadedImage.trim() === "") {
      console.log("Uploaded Image in handleItemDrop:", uploadedImage);

      alert("Please upload or take a photo first!");
      return;
    }

    // Only allow one item at a time
    setDroppedItem(item);

    try {
      const response = await fetch("/api/fashAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseImage: uploadedImage,
          clothing: item.image,
        }),
      });

      const data = await response.json();

      // Update mirror with API generated image
      setUploadedImage(data.generatedImageUrl);

      // store in history 
      setHistoryPhotos((prev) => [data.generatedImageUrl, ...prev])
    } catch (error) {
      console.error("API failed:", error);
      alert("Something went wrong while generating image");
    }
  };

  // const handleClearItems = () => {
  //   setDroppedItem(undefined);
  // };

  const handleAnalyzePhoto = async() => {
    if (!uploadedImage) {
      alert("Please Upload Image");
      return;
    }
    // const newPhoto: HistoryPhoto = {
    //   id: Date.now().toString(),
    //   imageUrl: uploadedImage,
    //   items: droppedItems.map(item => item.name),
    //   timestamp: Date.now(),
    //   score: currentScore > 0 ? currentScore : undefined,
    // };
  
    try {
    const response = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baseImage: uploadedImage,
      }),
    });

    const data = await response.json();

    // Update mirror with API generated image
    setCurrentScore(data.score);
    // suppose data.feedback = ["Great color choice", "Balance is off"]
    setFeedbackMessages(data.feedback);
  } catch (error) {
    console.error("API failed:", error);
    alert("Something went wrong while analyzing image");
  }
    // setHistoryPhotos((prev) => [newPhoto, ...prev]);
    setCurrentScore(0);

  };

  const handleRemovePhoto = (id: string) => {
    setHistoryPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const handleSelectPhoto = (photo: HistoryPhoto) => {
    setUploadedImage(photo.imageUrl ?? null );
  };

  const handleScoreSubmit = (score: number, feedback: string) => {
    setCurrentScore(score);
    console.log('Score:', score, 'Feedback:', feedback);
  };

return (
  <DndProvider backend={HTML5Backend}>
  <div className="w-screen h-screen flex justify-center items-center bg-[#e9e2d1] overflow-hidden">
    {/* Center the wardrobe scene */}
    <div
      className="relative w-[1920px] h-[1080px]"
      style={{
        backgroundImage: "url('/bg_wardrobe.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundColor: "#e9e2d1",
      }}
    >

     <div className="absolute top-[100px] left-[75px] right-[1315px] w-[300px] h-[800px] overflow-y-auto mx-auto">

        <HistoryPanel
          photos={historyPhotos}
          onRemove={handleRemovePhoto}
          onSelect={handleSelectPhoto}
        />
      </div>

      {/* Center Mirror */}
      <div className="absolute top-[105px] left-[370px] right-[567.5px] w-[595px] h-[595px] overflow-hidden mx-auto flex items-center justify-center">


        <MirrorWithWebcam
          uploadedImage={uploadedImage}
          onImageUpload={setUploadedImage}
          onItemDrop={handleItemDrop}
          droppedItem={droppedOneItem}
          // onClearItems={handleClearItems}
        />
      </div>
      <div className="absolute top-[815px] left-[660px] right-[850px] flex items-center">
        <button
          onClick={handleAnalyzePhoto}
          disabled={!uploadedImage}
          //  || droppedItems.length === 0
          className="w-[400px] bg-gradient-to-r from-[#8b7355] to-[#b89968] 
                    hover:from-[#7a6248] hover:to-[#a07d4d] text-white py-5 rounded-2xl 
                    shadow-2xl transition-all transform hover:scale-105 
                    disabled:cursor-not-allowed disabled:hover:scale-100 text-[22px] flex items-center justify-center overflow-hidden"
        >
          Process
         {/* {droppedItems.length > 0 && ` (${droppedItems.length} items)`} */}
        </button>
      </div>
      <div className="absolute top-[140px] left-[1130px] right-[120px] w-[370px] mx-auto ">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Suggestion List */}
          {loading ? (
            <p className="text-[#6b5d4f] text-center mt-4 italic">Searching...</p>
          ) : (
            <SuggestionList items={suggestions} />
          )}
        </div>

      {/* Right Suggestions */}
      <div className="absolute top-[260px] left-[1130px] right-[120px] w-[400px] h-[300px] overflow-y-auto mx-auto">
        <SuggestionList items={mockSuggestions} />
      </div>

      {/* Process Button */}


      {/* Right Bottom Feedback */}
      <div className="absolute bottom-[290px] left-[1130px] right-[120px] w-[380px]  mx-auto">

        <h3 className="mb-4 text-[#5a4633] flex items-center gap-3 text-2xl font-bold tracking-wide">
          <Star className="w-7 h-7 text-[#b89968]" />
          Score & Feedback
        </h3>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-lg text-[#5a4633] font-medium">Style Score:</span>
            <div className="flex-1 bg-[#e6dcc8] rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${currentScore}%` }}
              />
            </div>
            <span className="text-lg text-[#5a4633] font-bold">{currentScore}%</span>
          </div>

          <div className="text-lg text-[#4a3a28] leading-relaxed space-y-2">
            {feedbackMessages.map((msg, idx) => (
              <p key={idx}>• {msg}</p>
            ))}
          </div>

        </div>
      </div>
    </div>
  </div>
</DndProvider>

);

}
