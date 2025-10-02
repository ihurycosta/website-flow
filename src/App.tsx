// app.tsx - VERSÃO CORRIGIDA

import React from 'react';
// V GARANTA QUE O OUTLET ESTÁ SENDO IMPORTADO AQUI V
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'; 

import Header from './components/Header';
import Home from './components/Home';
import Products from './components/Products';
import CompraSuccesso from './components/CompraSuccesso';
import CompraFalha from './components/CompraFalha';
import Footer from './components/Footer';
import './App.css';

// Este é o seu "molde" de página. O Header e Footer são fixos.
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        {/* O <Outlet /> é o espaço que será preenchido pelo Home ou Products */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Todas as rotas aqui dentro usarão o AppLayout (Header/Footer) */}
        <Route path="/" element={<AppLayout />}>

          {/* A rota "index" é a página padrão quando a URL for "/" */}
          <Route index element={<Home />} />
          
          {/* A rota "products" será acionada quando a URL for "/products" */}
          <Route path="products" element={<Products />} />

        </Route>
        
        {/* Estas rotas não têm o Header/Footer */}
        <Route path="/compra-sucesso" element={<CompraSuccesso />} />
        <Route path="/compra-falha" element={<CompraFalha />} />
      </Routes>
    </Router>
  );
}

export default App;