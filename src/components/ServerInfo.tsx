import React from 'react';
import { ServerIcon, MessageCircleIcon, PlayIcon, DownloadIcon } from 'lucide-react';

const ServerInfo: React.FC = () => {
  const handleConnectMTA = () => window.open('mtasa://192.168.1.100:22003', '_self');
  const handleDiscord = () => window.open('https://discord.gg/flowroleplay', '_blank');

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Como Entrar no Servidor
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Siga os passos abaixo para começar sua jornada no Flow Roleplay
          </p>
        </div>

        {/* Grid container */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Item único: faz span nas 2 colunas no desktop e centraliza */}
          <div className="space-y-8 w-full max-w-2xl mx-auto md:col-span-2">
            {/* Passo 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Baixe o MTA San Andreas
                </h3>
                <p className="text-gray-300">
                  Caso não tenha, baixe o MTA San Andreas gratuitamente no site oficial.
                  É necessário ter o GTA San Andreas instalado.
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <ServerIcon className="w-5 h-5 mr-2" />
                  Conecte-se ao Servidor
                </h3>
                <p className="text-gray-300 mb-4">
                  Use nosso botão de conexão direta ou adicione manualmente o IP do servidor no MTA.
                </p>
                <div className="bg-gray-800 p-3 rounded-lg font-mono text-green-400 text-sm">
                  IP: 192.168.1.100:22003
                </div>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <MessageCircleIcon className="w-5 h-5 mr-2" />
                  Entre no Discord
                </h3>
                <p className="text-gray-300">
                  Junte-se à nossa comunidade no Discord para receber suporte,
                  participar de eventos e conhecer outros jogadores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServerInfo;
