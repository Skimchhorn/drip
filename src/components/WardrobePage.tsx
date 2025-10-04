import React from 'react';
import { WardrobeDisplay } from './WardrobeDisplay';
import { UploadPhotoBox } from './UploadPhotoBox';

const wardrobeItems = [
  {
    id: '1',
    name: 'Beige Sweater',
    type: 'hanging' as const,
    image: 'https://images.unsplash.com/photo-1632477443572-dd0aa40fc27c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHN3ZWF0ZXIlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTkyNTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '2',
    name: 'White Shirt',
    type: 'hanging' as const,
    image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5MTczNzY5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '3',
    name: 'Blazer',
    type: 'hanging' as const,
    image: 'https://images.unsplash.com/photo-1521510895919-46920266ddb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGF6ZXIlMjBqYWNrZXQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTkyNTUxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '4',
    name: 'Folded Clothes',
    type: 'folded' as const,
    image: 'https://images.unsplash.com/photo-1537274942065-eda9d00a6293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2xkZWQlMjBjbG90aGVzJTIwd2FyZHJvYmV8ZW58MXx8fHwxNzU5MjU1MTUyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '5',
    name: 'Jeans',
    type: 'folded' as const,
    image: 'https://images.unsplash.com/photo-1713880442898-0f151fba5e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NTkyNDU4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export function WardrobePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload Section */}
      <div>
        <h3 className="text-[#6b5d4f] mb-4">Add New Items</h3>
        <UploadPhotoBox />
        <button className="w-full mt-4 bg-[#8b7355] text-white py-3 rounded-lg hover:bg-[#7a6248] transition-colors">
          UPLOAD IMAGE
        </button>
      </div>

      {/* Wardrobe Display */}
      <div>
        <h3 className="text-[#6b5d4f] mb-4">My Wardrobe</h3>
        <WardrobeDisplay items={wardrobeItems} />
      </div>
    </div>
  );
}