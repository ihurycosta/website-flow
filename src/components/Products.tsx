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
    image: 'https://imgur.com/h1Vw27f.png',
    features: [
      '5.000 coins mensais',
    ],
    description: 'Ideal para jogadores que querem acelerar seu progresso no servidor com benefícios exclusivos.',
    onPurchase: () => handlePurchase({
      name: 'VIP Ouro',
      price: 'R$ 29,90',
      features: [
        '5.000 coins mensais',
      ]
    })
  };

  const vipDiamond = {
    name: 'VIP Diamante',
    price: 'R$ 49,90',
    period: '/mês',
    image: 'https://imgur.com/cGtQc8M.png',
    features: [
      '10.000 coins mensais',
    ],
    description: 'A experiência VIP definitiva com benefícios únicos e acesso a conteúdo exclusivo do servidor.',
    onPurchase: () => handlePurchase({
      name: 'VIP Diamante',
      price: 'R$ 49,90',
      features: [
        '10.000 coins mensais',
      ]
    })
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Torne-se Premium
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Potencialize sua experiência no Flow Roleplay com nossos pacotes VIP. 
          </p>
        </div>

        {/* VIP Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <VipCard vip={vipGold} />
          <VipCard vip={vipDiamond} />
        </div>

        {/* Additional Info */}
      <div className="mt-16 bg-gradient-to-b from-zinc-900 to-black rounded-2xl p-6 border border-zinc-700 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Surgiu alguma dúvida?
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