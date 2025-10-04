"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search clothing...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        relative w-full h-[75px] md:h-[80px]
        flex items-center
        bg-[#f7f3e9]/90
        border border-[#d4c4a8]
        rounded-2xl
        shadow-inner
        backdrop-blur-sm
        transition-all duration-200
        focus-within:ring-2 focus-within:ring-[#b89968]
      "
    >
      {/* Search Icon */}
      <div className="absolute left-6 flex items-center justify-center">
        <Search className="text-[#7a6248] opacity-80" size={22} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-full
          pl-14 pr-6
          text-[#4a3a28] text-lg
          bg-transparent outline-none
          placeholder:text-[#9c8f7e]
          font-medium tracking-wide
        "
      />
    </form>
  );
}
