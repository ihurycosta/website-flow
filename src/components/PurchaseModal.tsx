import React, { useState } from 'react';
import { X, User, Loader2 } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: string;
    features: string[];
  };
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, product }) => {
  const [step, setStep] = useState<'player-id' | 'processing'>('player-id');
  const [playerId, setPlayerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlayerIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNumeric = /^\d+$/;
    if (!playerId.trim()) {
      setError('Por favor, insira seu ID do jogador');
      return;
    }
    if (!isNumeric.test(playerId)) {
      setError('O ID do jogador deve conter apenas números.');
      return;
    }
    setError('');
    await processPayment();
  };

  const processPayment = async () => {
    setStep('processing');
    setIsLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('player_id', playerId);
      formData.append('product_name', product.name);
      formData.append('product_price', product.price);
      formData.append('payment_method', 'both'); // Permite ambos os métodos no MercadoPago

      const response = await fetch('https://auraprateada.shop/processa.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();
      console.log("Resposta recebida do servidor:", data);

      if (data.success) {
        window.location.href = data.payment_url;
        onClose();
      } else {
        console.error("O backend retornou um erro:", data.message);
        setError(data.message || 'Ocorreu um erro ao processar o pagamento.');
        setStep('player-id');
      }
    } catch (err) {
      console.error("Falha ao processar a requisição. Isso pode ser um erro no PHP. Causa:", err);
      setError('Falha na comunicação com o servidor. Verifique o console para mais detalhes.');
      setStep('player-id');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStep('player-id');
    setPlayerId('');
    setError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-b from-zinc-800 to-black rounded-xl border border-zinc-700 w-full max-w-sm mx-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h2 className="text-lg font-bold text-white">
            Comprar {product.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Product Summary */}
          <div className="bg-zinc-800/50 rounded-lg p-3 mb-4 border border-zinc-700">
            <h3 className="font-semibold text-white mb-1 text-sm">{product.name}</h3>
            <p className="text-xl font-bold text-green-400 mb-0">{product.price}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-2 mb-3">
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}

          {/* Player ID Form */}
          {step === 'player-id' && (
            <form onSubmit={handlePlayerIdSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  <User className="w-3 h-3 inline mr-1" />
                  ID do Jogador
                </label>
                <input
                  type="text"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  placeholder="Digite seu ID do jogador"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-white transition-colors text-sm"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processando...' : 'Prosseguir com o Pagamento'}
              </button>
            </form>
          )}

          {/* Processing State */}
          {step === 'processing' && (
            <div className="text-center py-6">
              <div className="text-center mb-3">
                <p className="text-zinc-300 text-sm">ID: <span className="text-white font-semibold">{playerId}</span></p>
              </div>
              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">Processando pagamento...</h3>
              <p className="text-zinc-400 text-sm">Você será redirecionado para o MercadoPago.</p>
              <p className="text-zinc-500 text-xs mt-1">PIX e Cartão disponíveis na próxima tela.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-700 bg-black/30 rounded-b-xl">
          <div className="flex items-center justify-center space-x-2 text-xs text-zinc-400">
            <span>🔒</span>
            <span>Pagamento seguro via MercadoPago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;