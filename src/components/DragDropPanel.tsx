"use client";

const mockSuggestions = [
  { id: "1", emoji: "👕" },
  { id: "2", emoji: "👖" },
  { id: "3", emoji: "👟" },
];

export default function DragDropPanel() {
  return (
    <div className="flex flex-wrap gap-4">
      {mockSuggestions.map((item) => (
        <div
          key={item.id}
          draggable
          className="cursor-grab text-4xl opacity-80 hover:opacity-100 transition"
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
}
