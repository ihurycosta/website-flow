// Header.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // <<< Importe Link e useLocation
import { GamepadIcon, ShoppingBagIcon } from 'lucide-react';

const Header: React.FC = () => { // <<< Remova as props
  const location = useLocation(); // <<< Pega a localização atual (URL)
  const activeTab = location.pathname; // <<< Ex: "/" ou "/products"

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
            {/* Use o componente Link em vez de button */}
            <Link
              to="/" // <<< Navega para a home
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === '/'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products" // <<< Navega para produtos
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === '/products'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <ShoppingBagIcon className="w-4 h-4" />
              <span>Produtos</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;