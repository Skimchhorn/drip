import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShoppingBag } from 'lucide-react';

const shopItems = [
  {
    id: '1',
    name: 'Cozy Beige Sweater',
    price: 29,
    image: 'https://images.unsplash.com/photo-1632477443572-dd0aa40fc27c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHN3ZWF0ZXIlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTkyNTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Tops'
  },
  {
    id: '2',
    name: 'Classic White Shirt',
    price: 99,
    image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5MTczNzY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Shirts'
  },
  {
    id: '3',
    name: 'Denim Jeans',
    price: 79,
    image: 'https://images.unsplash.com/photo-1713880442898-0f151fba5e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NTkyNDU4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Bottoms'
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
    name: 'Suiten Jacket',
    price: 189,
    image: 'https://images.unsplash.com/photo-1521510895919-46920266ddb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGF6ZXIlMjBqYWNrZXQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTkyNTUxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Outerwear'
  },
  {
    id: '6',
    name: 'Folded Essentials',
    price: 49,
    image: 'https://images.unsplash.com/photo-1537274942065-eda9d00a6293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2xkZWQlMjBjbG90aGVzJTIwd2FyZHJvYmV8ZW58MXx8fHwxNzU5MjU1MTUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Basics'
  }
];

export function ShopPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#6b5d4f]">Browse Collection</h2>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-[#f5ebe0] border border-[#c4b5a0] rounded text-[#6b5d4f]">
            <option>All Categories</option>
            <option>Tops</option>
            <option>Bottoms</option>
            <option>Outerwear</option>
            <option>Shoes</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className="bg-gradient-to-br from-[#d4b896] to-[#c4a87c] rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-white rounded-lg overflow-hidden mb-3 h-64">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#f5ebe0] rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-[#6b5d4f]">{item.name}</p>
                  <p className="text-xs text-[#8b7355]">{item.category}</p>
                </div>
                <p className="text-[#b89968]">${item.price}</p>
              </div>
              <button className="w-full bg-[#8b7355] text-white py-2 rounded hover:bg-[#7a6248] transition-colors flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}