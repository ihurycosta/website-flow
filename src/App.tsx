import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Products from './components/Products';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-black text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-20">
        {activeTab === 'home' && <Home />}
        {activeTab === 'products' && <Products />}
      </main>
      <Footer />
    </div>
  );
}

export default App;