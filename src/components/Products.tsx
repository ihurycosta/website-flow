import React from 'react';
import VipCard from './VipCard';
import PurchaseModal from './PurchaseModal';

const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

  const handlePurchase = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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
    description: 'Ideal para jogadores que querem acelerar seu progresso no servidor com benefícios exclusivos.',
    onPurchase: () => handlePurchase({
      name: 'VIP Ouro',
      price: 'R$ 29,90',
      features: [
        '5.000 coins mensais',
        '2x experiência em empregos',
        'Acesso a veículos VIP',
        'Casa VIP gratuita',
        'Kit de armas semanal',
        'Tag [VIP] no nome',
        'Canal VIP no Discord',
        'Suporte prioritário'
      ]
    })
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
    description: 'A experiência VIP definitiva com benefícios únicos e acesso a conteúdo exclusivo do servidor.',
    onPurchase: () => handlePurchase({
      name: 'VIP Diamante',
      price: 'R$ 49,90',
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
      ]
    })
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Produtos VIP
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Potencialize sua experiência no Flow Roleplay com nossos pacotes VIP. 
            Desbloqueie benefícios exclusivos, acelere seu progresso e tenha acesso 
            a conteúdo premium que apenas jogadores VIP podem desfrutar.
          </p>
        </div>

        {/* VIP Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <VipCard vip={vipGold} />
          <VipCard vip={vipDiamond} />
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Surgiu dúvidas?
            </h2>
              <p className="text-base text-gray-300">
  Dúvidas sobre compra ou ativação do VIP? Chame nosso time no Discord — abrimos um ticket,
  orientamos o pagamento e ativamos seu plano sem burocracia.
              </p>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedProduct && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Products;