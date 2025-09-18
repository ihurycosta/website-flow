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
      'Limite de 5 veículos.',
      'Limite de 2 casas.',
      'Redução de 30% do tempo da prisão.',
      'Dinheiro na ativação. (R$ 20.000)',
      'Salário a cada 1 hora. (R$ 1.500)',
      'Entrada prioritária. (se o servidor estiver cheio)',
      '5% no ganho de XP ou DINHEIRO em salários públicos. (da prefeitura)',
      'Acesso a categorias exclusivas no setor de tunagem.',
      'Reduzir em 50% a sensação de fome e sede.',
      'Pegar veículos especiais (premium) espalhados pela cidade.',
      'Pedágio gratuito.'
    ],
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
      'Limite de 10 veículos.',
      'Limite de 3 casas.',
      'Redução de 50% do tempo de prisão.',
      'Dinheiro na ativação. (R$ 35.000)',
      'Salário a cada 1 hora. (R$ 3.500)',
      'Entrada prioritária. (se o servidor estiver cheio)',
      '10% no ganho de XP e DINHEIRO em salários públicos. (da prefeitura)',
      'Acesso a categorias exclusivas no setor de tunagem.',
      'Reduzir em 80% a sensação de fome e sede.',
      'Pegar veículos especiais (premium) espalhados pela cidade.',
      'Pedágio gratuito.'
    ],
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
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Torne-se Premium
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-4">
            Potencialize sua experiência no Flow Roleplay com nossos pacotes VIP. 
          </p>
        </div>

        {/* VIP Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
          <VipCard vip={vipGold} />
          <VipCard vip={vipDiamond} />
        </div>

        {/* Additional Info */}
      <div className="mt-8 sm:mt-12 lg:mt-16 bg-gradient-to-b from-zinc-900 to-black rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700 shadow-lg mx-2 sm:mx-0">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Surgiu alguma dúvida?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
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