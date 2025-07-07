import React, { useState } from 'react';
import { Server, Users, Upload, Download, Settings, Play, Square, UserPlus, Copy, CheckCircle, Trash2, Terminal, BarChart3, Globe, Zap, MapPin, Shield, ExternalLink, AlertCircle } from 'lucide-react';
import { MinecraftServer } from '../types';

interface ServerDashboardProps {
  servers: MinecraftServer[];
  onCreateServer: () => void;
  onInviteFriend: (serverId: string) => void;
  onUploadBackup: (serverId: string) => void;
  onStartServer: (serverId: string) => void;
  onStopServer: (serverId: string) => void;
  onDeleteServer: (serverId: string) => void;
  onOpenSettings: (serverId: string) => void;
  onOpenConsole: (serverId: string) => void;
  onOpenStats: (serverId: string) => void;
}

export const ServerDashboard: React.FC<ServerDashboardProps> = ({
  servers,
  onCreateServer,
  onInviteFriend,
  onUploadBackup,
  onStartServer,
  onStopServer,
  onDeleteServer,
  onOpenSettings,
  onOpenConsole,
  onOpenStats
}) => {
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [showConnectionGuide, setShowConnectionGuide] = useState<string | null>(null);

  const copyServerIp = (ip: string, port: number) => {
    const serverAddress = `${ip}:${port}`;
    navigator.clipboard.writeText(serverAddress);
    setCopiedIp(serverAddress);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const getStatusColor = (status: MinecraftServer['status']) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'starting': return 'text-yellow-500';
      case 'stopping': return 'text-orange-500';
      case 'creating': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: MinecraftServer['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'starting': return 'Iniciando';
      case 'stopping': return 'Parando';
      case 'creating': return 'Criando';
      default: return 'Desconhecido';
    }
  };

  const getStatusBadgeColor = (status: MinecraftServer['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'starting': return 'bg-yellow-500';
      case 'stopping': return 'bg-orange-500';
      case 'creating': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleServerAction = (serverId: string, action: 'start' | 'stop') => {
    if (action === 'start') {
      onStartServer(serverId);
    } else {
      onStopServer(serverId);
    }
  };

  const handleDeleteServer = (serverId: string, serverName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o servidor "${serverName}"? Esta ação não pode ser desfeita.`)) {
      onDeleteServer(serverId);
    }
  };

  const getRegionFlag = (region: string) => {
    if (region?.includes('Brasil') || region?.includes('br-')) return '🇧🇷';
    if (region?.includes('Estados Unidos') || region?.includes('us-')) return '🇺🇸';
    if (region?.includes('Argentina') || region?.includes('ar-')) return '🇦🇷';
    if (region?.includes('Europa') || region?.includes('eu-')) return '🇪🇺';
    return '🌍';
  };

  const getPingEstimate = (region: string) => {
    if (region?.includes('São Paulo')) return '~15ms';
    if (region?.includes('Rio de Janeiro')) return '~18ms';
    if (region?.includes('Brasília')) return '~22ms';
    if (region?.includes('Miami')) return '~45ms';
    if (region?.includes('Buenos Aires')) return '~35ms';
    return '~25ms';
  };

  const brazilianServers = servers.filter(s => s.region?.includes('Brasil'));
  const totalOnlinePlayers = servers.reduce((total, server) => total + server.players.online, 0);
  const pirateServers = servers.filter(s => !s.config?.onlineMode);

  const ConnectionGuideModal = ({ server }: { server: MinecraftServer }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Como Conectar ao Servidor</h2>
            <button
              onClick={() => setShowConnectionGuide(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">📋 Informações do Servidor</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Nome:</strong> {server.name}</p>
                <p><strong>IP:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{server.ip}:{server.port}</code></p>
                <p><strong>Versão:</strong> {server.version}</p>
                <p><strong>Tipo:</strong> {server.config?.onlineMode ? '🛡️ Original' : '🏴‍☠️ Pirata'}</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">🎮 Passo a Passo para Conectar</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
                <li>Abra o Minecraft {server.config?.onlineMode ? 'Original' : '(Original ou Pirata)'}</li>
                <li>Clique em "Multijogador" ou "Multiplayer"</li>
                <li>Clique em "Adicionar Servidor" ou "Add Server"</li>
                <li>Digite um nome para o servidor (ex: "{server.name}")</li>
                <li>Cole o IP: <strong>{server.ip}:{server.port}</strong></li>
                <li>Clique em "Concluído" e depois "Conectar"</li>
              </ol>
            </div>

            {!server.config?.onlineMode && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-3">🏴‍☠️ Instruções para Minecraft Pirata</h3>
                <div className="space-y-2 text-sm text-purple-700">
                  <p><strong>✅ Você pode usar qualquer nickname!</strong></p>
                  <p>• Não precisa de conta Mojang/Microsoft</p>
                  <p>• Funciona com launchers como TLauncher, Shiginima, etc.</p>
                  <p>• Certifique-se de estar na versão {server.version}</p>
                  <p>• Se não conectar, tente sem a porta (apenas {server.ip})</p>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Importante - Demonstração</h3>
              <div className="space-y-2 text-sm text-yellow-700">
                <p><strong>Este é um site de demonstração.</strong></p>
                <p>• Os IPs mostrados são fictícios para fins educacionais</p>
                <p>• Para criar servidores reais, você precisaria de:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Servidor dedicado ou VPS</li>
                  <li>Software do servidor Minecraft (Paper, Spigot, etc.)</li>
                  <li>Configuração de rede e firewall</li>
                  <li>Domínio ou IP público</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">🔧 Alternativas Reais</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Para hospedar um servidor real:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Aternos:</strong> Gratuito, mas com limitações</li>
                  <li><strong>Minehut:</strong> Gratuito com plugins</li>
                  <li><strong>Hostinger:</strong> Pago, mais recursos</li>
                  <li><strong>Próprio PC:</strong> Hamachi + port forwarding</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => copyServerIp(server.ip, server.port)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copiar IP</span>
            </button>
            <button
              onClick={() => setShowConnectionGuide(null)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Servidores</h1>
            <p className="text-gray-600 mt-2 flex items-center space-x-2">
              <span>🇧🇷 Servidores brasileiros com suporte para Minecraft pirata</span>
              {brazilianServers.length > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {brazilianServers.length} no Brasil
                </span>
              )}
              {pirateServers.length > 0 && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  🏴‍☠️ {pirateServers.length} pirata
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onCreateServer}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Server className="h-5 w-5" />
            <span>Criar Servidor</span>
          </button>
        </div>

        {/* Demo Warning */}
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-yellow-800 font-semibold">⚠️ Site de Demonstração</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Este é um protótipo educacional. Os servidores mostrados são fictícios. Para conectar a servidores reais, 
                use plataformas como Aternos, Minehut ou configure seu próprio servidor.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {servers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Server className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total de Servidores</p>
                  <p className="text-2xl font-bold text-gray-900">{servers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Servidores Online</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {servers.filter(s => s.status === 'online').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Jogadores Online</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOnlinePlayers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Servidores BR</p>
                  <p className="text-2xl font-bold text-gray-900">{brazilianServers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-indigo-500">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <div className="text-lg">🏴‍☠️</div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Modo Pirata</p>
                  <p className="text-2xl font-bold text-gray-900">{pirateServers.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {servers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="mb-6">
              <div className="text-6xl mb-4">🇧🇷🏴‍☠️</div>
              <Server className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">Nenhum servidor ainda</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Crie seu primeiro servidor Minecraft no Brasil com suporte completo para versões piratas e originais!
            </p>
            <button
              onClick={onCreateServer}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Criar Primeiro Servidor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <div key={server.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4 border-green-500">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{server.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusBadgeColor(server.status)} ${server.status === 'starting' || server.status === 'stopping' || server.status === 'creating' ? 'animate-pulse' : ''}`}></div>
                      <span className={`text-sm font-medium ${getStatusColor(server.status)}`}>
                        {getStatusText(server.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Versão:</span>
                      <span className="font-medium bg-gray-100 px-2 py-1 rounded">{server.version}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Jogadores:</span>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{server.players.online}/{server.players.max}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">IP do Servidor:</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => copyServerIp(server.ip, server.port)}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors bg-green-50 hover:bg-green-100 px-2 py-1 rounded"
                          title="Clique para copiar IP"
                        >
                          {copiedIp === `${server.ip}:${server.port}` ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="font-mono text-xs">{server.ip}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Tipo:</span>
                      <div className="flex items-center space-x-1">
                        {server.config?.onlineMode ? (
                          <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
                            <Shield className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-blue-700 font-medium">Original</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded">
                            <span className="text-sm">🏴‍☠️</span>
                            <span className="text-xs text-purple-700 font-medium">Pirata</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {server.region && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Região:</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{getRegionFlag(server.region)}</span>
                          <span className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                            {server.region}
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            {getPingEstimate(server.region)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Último backup:</span>
                      <span className="text-xs text-gray-600">
                        {server.lastBackup.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Primary Actions */}
                    <div className="flex gap-2">
                      {server.status === 'online' ? (
                        <button 
                          onClick={() => handleServerAction(server.id, 'stop')}
                          className="flex-1 flex items-center justify-center space-x-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          <Square className="h-4 w-4" />
                          <span>Parar</span>
                        </button>
                      ) : server.status === 'starting' || server.status === 'stopping' || server.status === 'creating' ? (
                        <button 
                          disabled
                          className="flex-1 flex items-center justify-center space-x-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700"></div>
                          <span>
                            {server.status === 'starting' ? 'Iniciando...' : 
                             server.status === 'stopping' ? 'Parando...' : 'Criando...'}
                          </span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleServerAction(server.id, 'start')}
                          className="flex-1 flex items-center justify-center space-x-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          <span>Iniciar</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => setShowConnectionGuide(server.id)}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        title="Como conectar"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onInviteFriend(server.id)}
                        className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                        title="Convidar amigos"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onUploadBackup(server.id)}
                        className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
                        title="Backup"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => onOpenConsole(server.id)}
                        className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        title="Console"
                        disabled={server.status !== 'online'}
                      >
                        <Terminal className="h-4 w-4" />
                      </button>

                      <button 
                        onClick={() => onOpenStats(server.id)}
                        className="flex items-center space-x-1 bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                        title="Estatísticas"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>

                      <button 
                        onClick={() => onOpenSettings(server.id)}
                        className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        title="Configurações"
                      >
                        <Settings className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteServer(server.id, server.name)}
                        className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        title="Excluir servidor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connection Guide Modal */}
        {showConnectionGuide && (
          <ConnectionGuideModal 
            server={servers.find(s => s.id === showConnectionGuide)!} 
          />
        )}

        {/* Platform Info */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-purple-50 rounded-xl shadow-lg p-8 border border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <div className="text-3xl">🇧🇷🏴‍☠️</div>
            <span>Hospedagem Minecraft Premium no Brasil - Suporte Pirata</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-3">🌐 IPs Brasileiros Válidos</h3>
              <p className="text-green-800 text-sm">
                Servidores com IPs como "mc-br-sp-1.minecrafthost.pro" que funcionam perfeitamente no Minecraft original e pirata.
              </p>
            </div>
            
            <div className="bg-white border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-3">🏴‍☠️ Suporte Minecraft Pirata</h3>
              <p className="text-purple-800 text-sm">
                Modo offline habilitado por padrão. Jogadores com versões não originais podem se conectar sem problemas.
              </p>
            </div>
            
            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">⚡ Baixa Latência</h3>
              <p className="text-blue-800 text-sm">
                Servidores em São Paulo, Rio de Janeiro e Brasília com ping de 15-25ms para jogadores brasileiros.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">✨ Recursos Premium Inclusos:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <p>• 🇧🇷 Servidores em múltiplas cidades brasileiras</p>
              <p>• 🏴‍☠️ Suporte completo para Minecraft pirata</p>
              <p>• 🔄 Backups automáticos diários</p>
              <p>• 💻 Console de administração avançado</p>
              <p>• 📊 Estatísticas em tempo real</p>
              <p>• 🔌 Suporte a plugins e mods</p>
              <p>• 👥 Sistema de convites para amigos</p>
              <p>• 🎮 Múltiplas versões do Minecraft</p>
              <p>• 🚀 IPs válidos e funcionais</p>
              <p>• 🛡️ Modo online/offline configurável</p>
              <p>• 🎯 Otimizado para jogadores brasileiros</p>
              <p>• 💎 Qualquer nickname funciona (modo pirata)</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              🎯 <strong>Foco no Brasil:</strong> 90% dos nossos servidores estão no Brasil com suporte completo para Minecraft pirata e original.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};