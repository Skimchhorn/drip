"use client";

import { useState } from "react";

interface GeminiResponse {
  score: string;
  feedback: {
    bullet_point_1: { summary: string; detail: string };
    bullet_point_2: { summary: string; detail: string };
    bullet_point_3: { summary: string; detail: string };
    ai_script: string;
  };
  garment_suggestion: {
    garment_1: string;
    garment_2: string;
    garment_3: string;
    garment_4: string;
  };
}

export default function TestSearchPage() {
  const [styleQuery, setStyleQuery] = useState("casual summer mens outfits");
  const [styleResults, setStyleResults] = useState<any>(null);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);
  const [garmentResults, setGarmentResults] = useState<any[]>([]);
  const [loading, setLoading] = useState({ style: false, gemini: false, garments: false });

  const searchStyles = async () => {
    setLoading({ ...loading, style: true });
    const res = await fetch(`/api/style_search?q=${encodeURIComponent(styleQuery)}`);
    const data = await res.json();
    setStyleResults(data);
    setLoading({ ...loading, style: false });
  };

  const handleStyleClick = async (style: any) => {
    setSelectedStyle(style);
    setGeminiResponse(null);
    setGarmentResults([]);

    // Send to Gemini
    setLoading({ ...loading, gemini: true });
    try {
      const geminiRes = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: style.url })
      });
      const geminiData = await geminiRes.json();

      // Check for errors
      if (geminiData.error) {
        console.error('Gemini API error:', geminiData);
        alert(`Gemini error: ${geminiData.error}`);
        setLoading({ ...loading, gemini: false });
        return;
      }

      setGeminiResponse(geminiData);
      setLoading({ ...loading, gemini: false });

      // Search garments for each suggestion
      if (geminiData.garment_suggestion) {
        setLoading({ ...loading, garments: true });
        const suggestions = Object.values(geminiData.garment_suggestion);
        const allGarmentResults = [];

        for (const suggestion of suggestions) {
          const garmentRes = await fetch(`/api/garment_search?q=${encodeURIComponent(suggestion as string)}`);
          const garmentData = await garmentRes.json();
          allGarmentResults.push({
            query: suggestion,
            ...garmentData
          });
        }

        setGarmentResults(allGarmentResults);
        setLoading({ ...loading, garments: false });
      }
    } catch (error) {
      console.error('Error in handleStyleClick:', error);
      alert(`Error: ${error}`);
      setLoading({ ...loading, gemini: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Full Workflow Test</h1>

      {/* Step 1: Style Search */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Step 1: Search Styles (Pinterest)</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={styleQuery}
            onChange={(e) => setStyleQuery(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="Enter style query..."
          />
          <button
            onClick={searchStyles}
            disabled={loading.style}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading.style ? "Loading..." : "Search Styles"}
          </button>
        </div>

        {styleResults && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Found {styleResults.total} results - Click a style to analyze with Gemini
            </p>
            <div className="grid grid-cols-4 gap-3">
              {styleResults.images?.map((img: any, i: number) => (
                <div
                  key={i}
                  className="border rounded p-2 cursor-pointer hover:border-blue-500 transition"
                  onClick={() => handleStyleClick(img)}
                >
                  <img src={img.thumb || img.url} alt={img.title} className="w-full h-32 object-cover rounded" />
                  <p className="text-xs mt-1 truncate">{img.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Gemini Analysis */}
      {selectedStyle && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Gemini Analysis</h2>
          <div className="flex gap-4 mb-4">
            <img src={selectedStyle.thumb || selectedStyle.url} alt="Selected" className="w-32 h-32 object-cover rounded" />
            {loading.gemini && <p className="text-gray-600">Analyzing with Gemini...</p>}
            {geminiResponse && (
              <div className="flex-1">
                <p className="font-semibold">Score: {geminiResponse.score}/99</p>
                {geminiResponse.garment_suggestion && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Garment Suggestions:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      <li>{geminiResponse.garment_suggestion.garment_1}</li>
                      <li>{geminiResponse.garment_suggestion.garment_2}</li>
                      <li>{geminiResponse.garment_suggestion.garment_3}</li>
                      <li>{geminiResponse.garment_suggestion.garment_4}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Garment Results */}
      {loading.garments && (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Searching for garments...</p>
        </div>
      )}

      {garmentResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Step 3: Garment Search Results (Uniqlo)</h2>
          {garmentResults.map((result, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="font-medium mb-2">
                Search: "{result.query}" ({result.total} results)
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {result.images?.slice(0, 5).map((img: any, i: number) => (
                  <div key={i} className="border rounded p-2">
                    <img src={img.thumb || img.url} alt={img.title} className="w-full h-24 object-cover rounded" />
                    <p className="text-xs mt-1 truncate">{img.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
