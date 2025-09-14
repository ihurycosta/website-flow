import React from 'react';
import VipCard from './VipCard';

const Products: React.FC = () => {
  const vipGold = {
    name: 'VIP Ouro',
    price: 'R$ 29,90',
    period: '/mês',
    image: 'https://imgur.com/YPxC5kS.png',
    features: [
      '5.000 coins mensais',
      '2x experiência em empregos',
      'Acesso a veículos VIP',
      'Casa VIP gratuita',
      'Kit de armas semanal',
      'Tag [VIP] no nome',
      'Canal VIP no Discord',
      'Suporte prioritário'
    ],
    description: 'Ideal para jogadores que querem acelerar seu progresso no servidor com benefícios exclusivos.'
  };

  const vipDiamond = {
    name: 'VIP Diamante',
    price: 'R$ 49,90',
    period: '/mês',
    image: 'https://imgur.com/uP9KZWQ.png',
    features: [
      '10.000 coins mensais',
      '3x experiência em empregos',
      'Todos os benefícios VIP Ouro',
      'Veículos exclusivos Diamante',
      'Mansão VIP gratuita',
      'Kit premium de armas',
      'Roupas e acessórios exclusivos',
      'Comandos especiais',
      'Área VIP exclusiva',
      'Evento mensal exclusivo'
    ],
    description: 'A experiência VIP definitiva com benefícios únicos e acesso a conteúdo exclusivo do servidor.'
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Produtos VIP
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Potencialize sua experiência no Flow Roleplay com nossos pacotes VIP. 
            Desbloqueie benefícios exclusivos, acelere seu progresso e tenha acesso 
            a conteúdo premium que apenas jogadores VIP podem desfrutar.
          </p>
        </div>

        {/* VIP Cards */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <VipCard vip={vipGold} />
          <VipCard vip={vipDiamond} />
        </div>

        {/* Additional Info */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Surgiu dúvidas?
            </h2>
              <p className="text-lg text-gray-300">
  Dúvidas sobre compra ou ativação do VIP? Chame nosso time no Discord — abrimos um ticket,
  orientamos o pagamento e ativamos seu plano sem burocracia.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;