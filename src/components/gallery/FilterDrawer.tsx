'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface FilterDrawerProps {
  onFilterChange?: (filters: any) => void;
}

const filterCategories = {
  gender: ['Men', 'Women', 'Unisex'],
  color: ['Black', 'White', 'Blue', 'Red', 'Green', 'Neutral'],
  occasion: ['Casual', 'Formal', 'Sport', 'Party', 'Work'],
  aesthetic: ['Minimalist', 'Streetwear', 'Vintage', 'Elegant', 'Bohemian'],
};

export function FilterDrawer({ onFilterChange }: FilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-xl">
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {Object.entries(filterCategories).map(([category, options]) => (
            <div key={category}>
              <h4 className="mb-3 capitalize">{category}</h4>
              <div className="space-y-3">
                {options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={`${category}-${option}`} />
                    <Label
                      htmlFor={`${category}-${option}`}
                      className="cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <Button className="w-full">Apply Filters</Button>
          <Button variant="outline" className="w-full">Reset</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
