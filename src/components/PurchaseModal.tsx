import React, { useState } from 'react';
import { X, User, CreditCard, QrCode, Loader2 } from 'lucide-react';

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
  const [step, setStep] = useState<'player-id' | 'payment-method' | 'processing'>('player-id');
  const [playerId, setPlayerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlayerIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId.trim()) {
      setError('Por favor, insira seu ID do jogador');
      return;
    }
    if (playerId.length < 3) {
      setError('ID do jogador deve ter pelo menos 3 caracteres');
      return;
    }
    setError('');
    setStep('payment-method');
  };

  const handlePaymentMethodSelect = async (method: 'pix' | 'credit_card') => {
  setPaymentMethod(method);
  setStep('processing');
  setIsLoading(true);
  setError(''); // Limpa erros antigos

  try {
    const formData = new URLSearchParams();
    formData.append('player_id', playerId);
    formData.append('product_name', product.name);
    formData.append('product_price', product.price);
    formData.append('payment_method', method);

    const response = await fetch('https://auraprateada.shop/processa.php', {
      method: 'POST',
      headers: {
        // MUDANÇA AQUI
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // MUDANÇA AQUI
      body: formData.toString(),
    });

    // Tenta ler a resposta como JSON
    const data = await response.json();

    // ----> LOG ADICIONADO AQUI <----
    console.log("Resposta recebida do servidor:", data);

    if (data.success) {
      window.open(data.payment_url, '_blank');
      onClose();
    } else {
      // Se o backend enviar uma mensagem de erro, ela será mostrada aqui
      console.error("O backend retornou um erro:", data.message);
      setError(data.message || 'Ocorreu um erro ao processar o pagamento.');
      setStep('payment-method');
    }
  } catch (err) {
    // ----> LOG ADICIONADO AQUI <----
    // Se a resposta do servidor não for um JSON válido (ex: um erro de PHP), vai cair aqui
    console.error("Falha ao processar a requisição. Isso pode ser um erro no PHP. Causa:", err);
    setError('Falha na comunicação com o servidor. Verifique o console para mais detalhes.');
    setStep('payment-method');
  } finally {
    setIsLoading(false);
  }
};

  const resetModal = () => {
    setStep('player-id');
    setPlayerId('');
    setPaymentMethod(null);
    setError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
className="absolute inset-0 bg-black/50 backdrop-blur-lg"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-b from-zinc-900 to-black rounded-2xl border border-zinc-700 w-full max-w-md mx-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">
            Comprar {product.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Summary */}
          <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-white mb-2">{product.name}</h3>
            <p className="text-2xl font-bold text-green-400 mb-3">{product.price}</p>
            <div className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <p key={index} className="text-sm text-gray-300">• {feature}</p>
              ))}
              {product.features.length > 3 && (
                <p className="text-sm text-gray-400">+ {product.features.length - 3} benefícios adicionais</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Player ID */}
          {step === 'player-id' && (
            <form onSubmit={handlePlayerIdSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  ID do Jogador
                </label>
                <input
                  type="text"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  placeholder="Digite seu ID do jogador"
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">
                  Este é o nome do seu personagem no servidor
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continuar
              </button>
            </form>
          )}

          {/* Step 2: Payment Method */}
          {step === 'payment-method' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-300">Jogador: <span className="text-white font-semibold">{playerId}</span></p>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-4">Escolha a forma de pagamento:</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => handlePaymentMethodSelect('pix')}
                  className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <QrCode className="w-6 h-6 text-green-400 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold text-white">PIX</p>
                      <p className="text-sm text-gray-400">Aprovação instantânea</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">{product.price}</p>
                    <p className="text-xs text-gray-400">Sem taxas</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePaymentMethodSelect('credit_card')}
                  className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <CreditCard className="w-6 h-6 text-blue-400 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold text-white">Cartão de Crédito</p>
                      <p className="text-sm text-gray-400">Até 12x sem juros</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-semibold">{product.price}</p>
                    <p className="text-xs text-gray-400">Parcelado</p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setStep('player-id')}
                className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
              >
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Processando pagamento...</h3>
              <p className="text-gray-400">Você será redirecionado para o MercadoPago</p>
            </div>
          )}
        </div>

        {/* Footer */}
<div className="px-6 py-4 border-t border-zinc-700 bg-black/30 rounded-b-2xl">
    <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <span>🔒</span>
            <span>Pagamento seguro via MercadoPago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;