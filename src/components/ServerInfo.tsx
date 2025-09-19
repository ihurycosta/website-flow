import React from 'react';
import { ServerIcon, MessageCircle as DiscordIcon, PlayIcon, DownloadIcon } from 'lucide-react';

const ServerInfo: React.FC = () => {
  const handleConnectMTA = () => window.open('mtasa://fivem.flowrp.com.br', '_self');
  const handleDiscord = () => window.open('https://discord.gg/flowroleplay', '_blank');
  const handleDownload = () => window.open('https://mtasa.com/', '_blank');

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-zinc-900/80">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Como Entrar no Servidor
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Siga os passos abaixo para começar sua jornada no Flow Roleplay.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 w-full max-w-2xl mx-auto md:col-span-2">
            {/* Passo 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Baixe o MTA San Andreas
                </h3>
                <p className="text-zinc-400 text-sm">
                  Caso não tenha, baixe o Multi Theft Auto gratuitamente. É necessário ter o GTA San Andreas instalado previamente.
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                  <ServerIcon className="w-5 h-5 mr-2" />
                  Conecte-se ao Servidor
                </h3>
                <p className="text-zinc-400 text-sm mb-3">
                  Use nosso botão de conexão direta ou adicione manualmente o IP do servidor no MTA.
                </p>
                <div className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg font-mono text-green-400 text-xs">
                  IP: connect fivem.flowrp.com.br
                </div>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                  <DiscordIcon className="w-5 h-5 mr-2" />
                  Entre no Discord
                </h3>
                <p className="text-zinc-400 text-sm">
                  Junte-se à nossa comunidade no Discord para receber suporte, participar de eventos e conhecer outros jogadores.
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