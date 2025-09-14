// VipCard.tsx
import React from 'react';
import { CheckIcon } from 'lucide-react';

type Vip = {
  name: string;
  price: string;
  period: string;
  color: string;      // continua existindo, mas não influencia mais os checks
  image: string;
  features: string[];
  description: string;
  ctaPrimaryHref?: string;
  ctaSecondaryHref?: string;
  ctaPrimaryLabel?: string;
};

const VipCard: React.FC<{ vip: Vip }> = ({ vip }) => {
  const ctaPrimaryLabel = vip.ctaPrimaryLabel ?? 'Assinar agora';
  const ctaPrimaryHref = vip.ctaPrimaryHref ?? '#';
  const ctaSecondaryHref = vip.ctaSecondaryHref ?? '#';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-700/70 bg-gradient-to-b from-gray-900/70 to-black p-6">
      {/* IMAGEM: quadrada, cobrindo todo o espaço */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '1 / 1' }}>
        <img
          src={vip.image.replace('://imgur.com/', '://i.imgur.com/')}
          alt={`${vip.name} - imagem do plano`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Título */}
      <h3 className="mt-6 text-2xl font-bold text-white text-center">{vip.name}</h3>

      {/* Descrição + Preço */}
      <div className="mt-3 text-center">
        <p className="text-gray-300">{vip.description}</p>
        <div className="mt-3">
          <span className="text-3xl font-extrabold text-white align-middle">{vip.price}</span>
          <span className="ml-1 text-sm text-gray-400 align-middle">{vip.period}</span>
        </div>
      </div>

      {/* Benefícios (checks com cor FIXA) */}
      <ul className="mt-6 space-y-2">
        {vip.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-200">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full
                             bg-white/5 ring-1 ring-white/10">
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
            </span>
            <span className="text-sm md:text-base">{feat}</span>
          </li>
        ))}
      </ul>

      {/* Ações: botões brancos */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={ctaPrimaryHref}
          className="px-6 py-3 rounded-lg font-semibold bg-white text-black border-2 border-white
                     hover:bg-gray-200 visited:text-black no-underline inline-flex items-center justify-center
                     transition-all duration-300"
        >
          {ctaPrimaryLabel}
        </a>
      </div>
    </div>
  );
};

export default VipCard;
