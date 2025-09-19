import React from 'react';
import { GamepadIcon, ShoppingBagIcon } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
  <header className="fixed top-0 left-0 right-0 z-10 custom-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="https://i.imgur.com/k5KuHFS.png"
              alt="Flow Roleplay - logo"
              className="w-12 h-12 rounded-lg object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'home'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'products'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <ShoppingBagIcon className="w-4 h-4" />
              <span>Produtos</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;