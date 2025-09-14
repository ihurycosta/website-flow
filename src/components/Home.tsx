import React from 'react';
import ImageCarousel from './ImageCarousel';
import ServerInfo from './ServerInfo';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Flow Roleplay
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Onde histórias reais, aventuras inesquecíveis e personagens únicos se encontram. Venha se divertir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                Entrar no Servidor
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300">
                Discord Oficial
              </button>
            </div>
          </div>
        </div>
      </section>
      <ServerInfo />
    </div>
  );
};

export default Home;