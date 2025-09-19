import React from 'react';
import ServerInfo from './ServerInfo';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen custom-background">
      <section className="relative py-16 animate-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent animate-title">
              Flow Roleplay
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl mx-auto animate-subtitle">
              Onde histórias reais, aventuras inesquecíveis e personagens únicos se encontram. Venha se divertir.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 animate-buttons">
              <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                Entrar no Servidor
              </button>
              <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300">
                Discord Oficial
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="animate-section">
        <ServerInfo />
      </div>
    </div>
  );
};

export default Home;