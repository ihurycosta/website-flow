// app.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'; // <<< Importe o Outlet
import Header from './components/Header';
import Home from './components/Home';
import Products from './components/Products';
import CompraSuccesso from './components/CompraSuccesso';
import CompraFalha from './components/CompraFalha';
import Footer from './components/Footer';
import './App.css';

// Componente de Layout que terá o Header e Footer
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header /> {/* <<< Não precisa mais passar props de estado */}
      <main className="pt-20">
        <Outlet /> {/* <<< Aqui é onde Home ou Products aparecerão */}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal que usa o layout */}
        <Route path="/" element={<AppLayout />}>
          {/* Rotas filhas que serão renderizadas dentro do <Outlet /> */}
          <Route index element={<Home />} /> {/* <<< 'index' é a rota padrão para "/" */}
          <Route path="products" element={<Products />} /> {/* <<< Rota para "/products" */}
        </Route>
        
        {/* Rotas que não usam o layout principal */}
        <Route path="/compra-sucesso" element={<CompraSuccesso />} />
        <Route path="/compra-falha" element={<CompraFalha />} />
      </Routes>
    </Router>
  );
}

export default App;