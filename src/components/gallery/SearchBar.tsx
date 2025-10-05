'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder="Search fashion styles..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 sm:pl-10 pr-3 bg-input-background border-border rounded-xl text-sm sm:text-base w-full"
      />
    </div>
  );
}
