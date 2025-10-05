'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl md:scale-105 lg:scale-110 origin-center transition-transform">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search fashion styles..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-input-background border-border rounded-xl"
      />
    </div>
  );
}
