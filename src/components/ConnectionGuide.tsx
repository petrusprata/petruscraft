import React from 'react';
import { X, Copy, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { MinecraftServer } from '../types';

interface ConnectionGuideProps {
  isOpen: boolean;
  onClose: () => void;
  server: MinecraftServer;
}

export const ConnectionGuide: React.FC<ConnectionGuideProps> = ({ 
  isOpen, 
  onClose, 
  server 
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🎮 Como Conectar ao Servidor</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Server Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                <div className="text-lg">📋</div>
                <span>Informações do Servidor</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nome:</strong> {server.name}</p>
                  <p><strong>Versão:</strong> {server.version}</p>
                  <p><strong>Região:</strong> {server.region}</p>
                </div>
                <div>
                  <p><strong>IP:</strong> 
                    <button 
                      onClick={() => copyToClipboard(`${server.ip}:${server.port}`)}
                      className="ml-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-mono text-xs transition-colors"
                    >
                      {server.ip}:{server.port} <Copy className="inline h-3 w-3 ml-1" />
                    </button>
                  </p>
                  <p><strong>Tipo:</strong> {server.config?.onlineMode ? '🛡️ Original' : '🏴‍☠️ Pirata'}</p>
                  <p><strong>Jogadores:</strong> {server.players.online}/{server.players.max}</p>
                </div>
              </div>
            </div>

            {/* Step by Step */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                <div className="text-lg">🎮</div>
                <span>Passo a Passo para Conectar</span>
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-sm text-green-700">
                <li className="flex items-start space-x-2">
                  <span className="font-medium">1.</span>
                  <div>
                    <p><strong>Abra o Minecraft</strong> {server.config?.onlineMode ? '(versão original)' : '(original ou pirata)'}</p>
                    <p className="text-xs text-green-600 mt-1">Certifique-se de estar na versão {server.version}</p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">2.</span>
                  <p>Clique em <strong>"Multijogador"</strong> ou <strong>"Multiplayer"</strong></p>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">3.</span>
                  <p>Clique em <strong>"Adicionar Servidor"</strong> ou <strong>"Add Server"</strong></p>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">4.</span>
                  <div>
                    <p>Digite um nome para o servidor:</p>
                    <code className="bg-white px-2 py-1 rounded text-xs">{server.name}</code>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">5.</span>
                  <div>
                    <p>Cole o endereço do servidor:</p>
                    <button 
                      onClick={() => copyToClipboard(`${server.ip}:${server.port}`)}
                      className="bg-white hover:bg-gray-50 px-3 py-2 rounded font-mono text-xs border transition-colors flex items-center space-x-2 mt-1"
                    >
                      <span>{server.ip}:{server.port}</span>
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">6.</span>
                  <p>Clique em <strong>"Concluído"</strong> e depois <strong>"Conectar"</strong></p>
                </li>
              </ol>
            </div>

            {/* Pirate Instructions */}
            {!server.config?.onlineMode && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center space-x-2">
                  <div className="text-lg">🏴‍☠️</div>
                  <span>Instruções Especiais para Minecraft Pirata</span>
                </h3>
                <div className="space-y-3 text-sm text-purple-700">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                    <p><strong>Você pode usar qualquer nickname!</strong> Não precisa ser único.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                    <p>Não precisa de conta Mojang/Microsoft</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                    <p>Funciona com launchers como TLauncher, Shiginima, MultiMC, etc.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                    <p>Se não conectar com a porta, tente apenas: <code className="bg-white px-1 rounded">{server.ip}</code></p>
                  </div>
                </div>
              </div>
            )}

            {/* Troubleshooting */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center space-x-2">
                <div className="text-lg">🔧</div>
                <span>Problemas de Conexão?</span>
              </h3>
              <div className="space-y-2 text-sm text-orange-700">
                <p><strong>Se não conseguir conectar:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Verifique se está na versão correta: <strong>{server.version}</strong></li>
                  <li>Tente conectar sem a porta: <code className="bg-white px-1 rounded">{server.ip}</code></li>
                  <li>Verifique sua conexão com a internet</li>
                  <li>Desative temporariamente firewall/antivírus</li>
                  <li>Reinicie o Minecraft e tente novamente</li>
                </ul>
              </div>
            </div>

            {/* Demo Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>⚠️ Importante - Site de Demonstração</span>
              </h3>
              <div className="space-y-3 text-sm text-yellow-700">
                <p><strong>Este é um protótipo educacional.</strong></p>
                <p>Os IPs mostrados são fictícios para demonstração. Para jogar em servidores reais:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <p><strong>🆓 Opções Gratuitas:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Aternos:</strong> aternos.org</li>
                      <li><strong>Minehut:</strong> minehut.com</li>
                      <li><strong>Server.pro:</strong> server.pro</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>💰 Opções Pagas:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Hostinger:</strong> hostinger.com.br</li>
                      <li><strong>Shockbyte:</strong> shockbyte.com</li>
                      <li><strong>Apex Hosting:</strong> apexminecrafthosting.com</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => copyToClipboard(`${server.ip}:${server.port}`)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copiar IP do Servidor</span>
              </button>
              <button
                onClick={() => window.open('https://www.minecraft.net/download', '_blank')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Baixar Minecraft</span>
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};