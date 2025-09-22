import React, { useEffect, useState } from 'react';
import { XCircle, Home, ShoppingBag, RefreshCw, MessageCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const CompraFalha: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState({
    paymentId: searchParams.get('payment_id') || '',
    status: searchParams.get('status') || 'rejected',
    statusDetail: searchParams.get('status_detail') || '',
    merchantOrderId: searchParams.get('merchant_order_id') || ''
  });

  useEffect(() => {
    // Log para debug
    console.log('Parâmetros de pagamento rejeitado:', paymentData);
  }, [paymentData]);

  const getStatusMessage = (status: string, statusDetail: string) => {
    if (status === 'rejected') {
      switch (statusDetail) {
        case 'cc_rejected_insufficient_amount':
          return 'Saldo insuficiente no cartão';
        case 'cc_rejected_bad_filled_security_code':
          return 'Código de segurança inválido';
        case 'cc_rejected_bad_filled_date':
          return 'Data de vencimento inválida';
        case 'cc_rejected_bad_filled_other':
          return 'Dados do cartão incorretos';
        default:
          return 'Pagamento rejeitado pelo banco';
      }
    } else if (status === 'cancelled') {
      return 'Pagamento cancelado pelo usuário';
    } else if (status === 'pending') {
      return 'Pagamento ainda está sendo processado';
    }
    return 'Falha no processamento do pagamento';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoProducts = () => {
    window.location.href = '/#products';
  };

  const handleTryAgain = () => {
    window.location.href = '/#products';
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Pagamento Não Aprovado
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Houve um problema com seu pagamento
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-gradient-to-b from-zinc-900 to-black rounded-xl border border-red-700/50 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-red-400" />
            Detalhes do Problema
          </h2>
          
          <div className="space-y-3">
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
              <p className="text-red-300 text-sm font-medium">
                {getStatusMessage(paymentData.status, paymentData.statusDetail)}
              </p>
            </div>
            
            {paymentData.paymentId && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">ID da Tentativa:</span>
                <span className="text-white text-sm font-mono">
                  {paymentData.paymentId.slice(0, 8)}...
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Status:</span>
              <span className="text-red-400 text-sm font-semibold">
                ❌ {paymentData.status === 'rejected' ? 'Rejeitado' : 
                     paymentData.status === 'cancelled' ? 'Cancelado' : 'Falhou'}
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

        {/* Solutions */}
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 mb-6">
          <h3 className="text-yellow-300 font-semibold mb-2">
            💡 O que você pode fazer:
          </h3>
          <ul className="text-yellow-200 text-sm space-y-1">
            <li>• Verifique os dados do seu cartão</li>
            <li>• Confirme se há saldo suficiente</li>
            <li>• Tente outro método de pagamento</li>
            <li>• Entre em contato com seu banco</li>
            <li>• Use PIX para pagamento instantâneo</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Tentar Novamente
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoHome}
              className="border-2 border-white text-white font-semibold py-3 rounded-lg hover:bg-white hover:text-black transition-colors flex items-center justify-center text-sm"
            >
              <Home className="w-4 h-4 mr-1" />
              Início
            </button>
            
            <button
              onClick={handleGoProducts}
              className="border-2 border-white text-white font-semibold py-3 rounded-lg hover:bg-white hover:text-black transition-colors flex items-center justify-center text-sm"
            >
              <ShoppingBag className="w-4 h-4 mr-1" />
              Produtos
            </button>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center mt-6 pt-6 border-t border-zinc-700">
          <p className="text-gray-400 text-xs mb-2">
            Ainda com problemas?
          </p>
          <a
            href="https://dsc.gg/flowrpmta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm underline"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Suporte no Discord
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompraFalha;