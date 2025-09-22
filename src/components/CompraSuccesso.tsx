import React, { useEffect, useState } from 'react';
import { CheckCircle, Home, ShoppingBag, Clock } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const CompraSuccesso: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState({
    paymentId: searchParams.get('payment_id') || '',
    status: searchParams.get('status') || 'approved',
    merchantOrderId: searchParams.get('merchant_order_id') || '',
    preferenceId: searchParams.get('preference_id') || ''
  });

  useEffect(() => {
    // Log para debug
    console.log('Parâmetros de pagamento recebidos:', paymentData);
    
    // Aqui você pode fazer uma chamada para seu backend para confirmar o pagamento
    // e atualizar o status no banco de dados se necessário
  }, [paymentData]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoProducts = () => {
    window.location.href = '/#products';
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Pagamento Aprovado!
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Sua compra foi processada com sucesso
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gradient-to-b from-zinc-900 to-black rounded-xl border border-zinc-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Detalhes da Compra
          </h2>
          
          <div className="space-y-3">
            {paymentData.paymentId && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">ID do Pagamento:</span>
                <span className="text-white text-sm font-mono">
                  {paymentData.paymentId.slice(0, 8)}...
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Status:</span>
              <span className="text-green-400 text-sm font-semibold">
                ✅ Aprovado
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Data:</span>
              <span className="text-white text-sm">
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4 mb-6">
          <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Próximos Passos
          </h3>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Seu VIP será ativado automaticamente</li>
            <li>• Processo pode levar até 5 minutos</li>
            <li>• Entre no servidor para verificar</li>
            <li>• Dúvidas? Contate nosso suporte no Discord</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Voltar ao Início
          </button>
          
          <button
            onClick={handleGoProducts}
            className="w-full border-2 border-white text-white font-semibold py-3 rounded-lg hover:bg-white hover:text-black transition-colors flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Ver Outros Produtos
          </button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-6 pt-6 border-t border-zinc-700">
          <p className="text-gray-400 text-xs mb-2">
            Precisa de ajuda?
          </p>
          <a
            href="https://dsc.gg/flowrpmta"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            Entre em contato no Discord
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompraSuccesso;