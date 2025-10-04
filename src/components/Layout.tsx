import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const navItems = ['HOME', 'SHOP', 'FAVORITES'];

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <div className="bg-[#e8dcc8] rounded-lg shadow-2xl overflow-hidden">
          {/* Navigation */}
          <div className="bg-[#e8dcc8] p-6 border-b border-[#c4b5a0]">
            <nav className="flex gap-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => onNavigate(item)}
                  className={`px-4 py-2 rounded transition-colors ${
                    currentPage === item
                      ? 'bg-[#b89968] text-white'
                      : 'text-[#6b5d4f] hover:bg-[#d4c4ac]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8 min-h-[600px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}