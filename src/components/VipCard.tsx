import React from 'react';
import { CheckIcon } from 'lucide-react';

type Vip = {
  name: string;
  price: string;
  period: string;
  color: string;
  image: string;
  features: string[];
  description: string;
  ctaPrimaryHref?: string;
  ctaSecondaryHref?: string;
  ctaPrimaryLabel?: string;
  onPurchase?: () => void;
};

const VipCard: React.FC<{ vip: Vip }> = ({ vip }) => {
  const ctaPrimaryLabel = vip.ctaPrimaryLabel ?? 'Assinar agora';
  
  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (vip.onPurchase) {
      vip.onPurchase();
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-black p-5">
      {/* IMAGEM */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16 / 10' }}>
        <img
          src={vip.image.replace('://imgur.com/', '://i.imgur.com/')}
          alt={`${vip.name} - imagem do plano`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Descrição + Preço */}
      <div className="mt-2 text-center">
        <div className="mt-2">
          <span className="text-2xl font-extrabold text-white align-middle">{vip.price}</span>
          <span className="ml-1 text-sm text-zinc-400 align-middle">{vip.period}</span>
        </div>
      </div>

      {/* Benefícios */}
      <ul className="mt-4 space-y-1.5">
        {vip.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-3 text-zinc-300">
            <span className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full
                             bg-white/5 ring-1 ring-white/10">
              <CheckIcon className="h-2.5 w-2.5 text-emerald-400" />
            </span>
            <span className="text-xs md:text-sm">{feat}</span>
          </li>
        ))}
      </ul>

      {/* Ações */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
        <button
          onClick={handlePurchaseClick}
          className="px-5 py-2.5 rounded-lg font-semibold bg-white text-black
                     hover:bg-zinc-200 visited:text-black no-underline inline-flex items-center justify-center
                     transition-all duration-300 text-sm"
        >
          {ctaPrimaryLabel}
        </button>
      </div>
    </div>
  );
};

export default VipCard;