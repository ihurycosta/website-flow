import React from 'react';
import {
  MessageCircle as DiscordIcon, // Renomeado para clareza
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Youtube as YoutubeIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-zinc-900 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Grid de colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Flow Roleplay</h3>
            <p className="text-sm text-zinc-400">Junte-se a nós!</p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="https://dsc.gg/flowrpmtay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-zinc-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                aria-label="Discord"
              >
                <DiscordIcon className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://instagram.com/flowroleplaymta"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-zinc-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@flowroleplaymta"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-zinc-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Server Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-white">Servidor</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://flow-roleplay.gitbook.io/flow-roleplay/politicas/diretrizes-do-servidor" className="text-zinc-300 hover:text-white transition-colors duration-300 text-sm">
                  Regras do Servidor
                </a>
              </li>
              <li>
                <a href="https://flow-roleplay.gitbook.io/flow-roleplay/o-que-voce-precisa-saber/empregos" className="text-zinc-300 hover:text-white transition-colors duration-300 text-sm">
                  Empregos
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-white">Suporte</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://flow-roleplay.gitbook.io/flow-roleplay/informacoes-gerais/flow-roleplay" className="text-zinc-300 hover:text-white transition-colors duration-300 text-sm">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="https://dsc.gg/flowrpmta" className="text-zinc-300 hover:text-white transition-colors duration-300 text-sm">
                  Denúncias
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-white">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <MailIcon className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-300 text-sm">contato@flowroleplay.com.br</span>
              </div>
              <div className="flex items-start space-x-3 justify-center md:justify-start">
                <MapPinIcon className="w-4 h-4 text-zinc-400 mt-0.5" />
                <div className="text-zinc-300 text-sm">
                  <p>IP do Servidor:</p>
                  <p className="font-mono text-green-400">connect 151.242.227.196:22053</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              <a href="https://flow-roleplay.gitbook.io/flow-roleplay/politicas/diretrizes-do-servidor/regras-do-jogo" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                Política de Privacidade
              </a>
              <a href="https://flow-roleplay.gitbook.io/flow-roleplay/politicas/diretrizes-do-servidor/regras-do-jogo" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                Termos de Serviço
              </a>
              <a href="https://flow-roleplay.gitbook.io/flow-roleplay/politicas/diretrizes-do-servidor/regras-do-jogo" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                Política de Reembolso
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-zinc-400 text-sm">
                © {new Date().getFullYear()} Flow Roleplay. Todos os direitos reservados.
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Não possuímos afiliação com a Rockstar Games ou Take-Two Interactive.
              </p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;