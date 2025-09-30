import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Products from './components/Products';
import CompraSuccesso from './components/CompraSuccesso';
import CompraFalha from './components/CompraFalha';
import Footer from './components/Footer';
import './App.css';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Scroll to top functionality when switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Smooth scroll to top when switching tabs
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Header activeTab={activeTab} setActiveTab={handleTabChange} />
        <main className="pt-20">
          {activeTab === 'home' && <Home />}
          {activeTab === 'products' && <Products />}
        </main>
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/products" element={<MainApp initialTab="products" />} />
        <Route path="/compra-sucesso" element={<CompraSuccesso />} />
        <Route path="/compra-falha" element={<CompraFalha />} />
      </Routes>
    </Router>
  );
}

export default App;