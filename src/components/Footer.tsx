import React from 'react';
import {
  MessageCircleIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon, // ok deixar, mesmo sem uso, ou remova se seu TS estiver com noUnusedLocals
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Grid de colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="text-xl font-bold text-white">Flow Roleplay</h3>
                <p className="text-sm text-gray-400">Junte-se a nós!</p>
              </div>
            </div>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="https://discord.gg/flowroleplay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                aria-label="Discord"
              >
                <MessageCircleIcon className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://instagram.com/flowroleplay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://youtube.com/flowroleplay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-300"
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
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Regras do Servidor
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Facções
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
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
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Denúncias
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Recuperar Conta
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-white">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <MailIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">contato@flowroleplay.com.br</span>
              </div>
              <div className="flex items-start space-x-3 justify-center md:justify-start">
                <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <p>IP do Servidor:</p>
                  <p className="font-mono text-green-400">192.168.1.100:22003</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Termos de Serviço
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Política de Reembolso
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Código de Conduta
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 Flow Roleplay. Todos os direitos reservados.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Não afiliado à Rockstar Games ou Take-Two Interactive
              </p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
