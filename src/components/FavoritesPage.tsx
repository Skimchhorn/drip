'use client';

import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Trash2 } from 'lucide-react';

const initialFavorites = [
  {
    id: '1',
    name: 'Cozy Beige Sweater',
    price: 29,
    image: 'https://images.unsplash.com/photo-1632477443572-dd0aa40fc27c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHN3ZWF0ZXIlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTkyNTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Tops'
  },
  {
    id: '2',
    name: 'Suiten Jacket',
    price: 189,
    image: 'https://images.unsplash.com/photo-1521510895919-46920266ddb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGF6ZXIlMjBqYWNrZXQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTkyNTUxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Outerwear'
  },
  {
    id: '3',
    name: 'White Sneakers',
    price: 89,
    image: 'https://images.unsplash.com/photo-1651371409956-20e79c06a8bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwc2hvZXN8ZW58MXx8fHwxNzU5MTk4NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Shoes'
  }
];

export function FavoritesPage() {
  const [favorites, setFavorites] = useState(initialFavorites);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-8 h-8 text-[#b89968] fill-[#b89968]" />
        <h2 className="text-[#6b5d4f]">My Favorites</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-gradient-to-br from-[#d4b896] to-[#c4a87c] rounded-lg p-12 text-center">
          <Heart className="w-16 h-16 text-[#c4b5a0] mx-auto mb-4" />
          <p className="text-[#8b7355]">No favorites yet. Start shopping to add items!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-[#d4b896] to-[#c4a87c] rounded-lg p-4 shadow-lg"
            >
              <div className="relative bg-white rounded-lg overflow-hidden mb-3 h-64">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFavorite(item.id)}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
              <div className="bg-[#f5ebe0] rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[#6b5d4f]">{item.name}</p>
                    <p className="text-xs text-[#8b7355]">{item.category}</p>
                  </div>
                  <p className="text-[#b89968]">${item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}