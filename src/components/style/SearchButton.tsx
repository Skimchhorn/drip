'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
}

export function SearchButton({
  onClick,
  loading = false,
  disabled = false,
  label = "Search",
}: SearchButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="px-6 h-12 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all hover:shadow-lg whitespace-nowrap"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Searching
        </>
      ) : (
        label
      )}
    </Button>
  );
}
