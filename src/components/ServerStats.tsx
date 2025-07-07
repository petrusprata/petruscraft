import React, { useState, useEffect } from 'react';
import { X, Activity, HardDrive, Cpu, Clock, Users, Zap } from 'lucide-react';
import { serverService, ServerStats as IServerStats } from '../services/serverService';

interface ServerStatsProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  serverName: string;
}

export const ServerStats: React.FC<ServerStatsProps> = ({
  isOpen,
  onClose,
  serverId,
  serverName
}) => {
  const [stats, setStats] = useState<IServerStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStats();
      const interval = setInterval(loadStats, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const serverStats = await serverService.getServerStats(serverId);
      setStats(serverStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (percentage: number): string => {
    if (percentage < 50) return 'text-green-500';
    if (percentage < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Estatísticas do Servidor</h2>
            <p className="text-gray-600">{serverName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {loading && !stats ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Cpu className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-blue-800 font-semibold">CPU</p>
                      <p className={`text-2xl font-bold ${getStatusColor(stats.cpu)}`}>
                        {stats.cpu}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 bg-blue-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(stats.cpu)}`}
                      style={{ width: `${stats.cpu}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-purple-800 font-semibold">Memória</p>
                      <p className={`text-2xl font-bold ${getStatusColor(stats.memory)}`}>
                        {stats.memory}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 bg-purple-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(stats.memory)}`}
                      style={{ width: `${stats.memory}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-orange-800 font-semibold">Disco</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {stats.disk} GB
                      </p>
                    </div>
                  </div>
                  <p className="text-orange-700 text-sm mt-2">de 50 GB total</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-green-800 font-semibold">Uptime</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatUptime(stats.uptime)}
                      </p>
                    </div>
                  </div>
                  <p className="text-green-700 text-sm mt-2">Tempo online</p>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Performance</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">TPS (Ticks por segundo)</span>
                      <span className="font-semibold text-green-600">19.8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Latência média</span>
                      <span className="font-semibold text-blue-600">23ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Chunks carregados</span>
                      <span className="font-semibold text-purple-600">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Entidades ativas</span>
                      <span className="font-semibold text-orange-600">342</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Atividade dos Jogadores</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Jogadores únicos hoje</span>
                      <span className="font-semibold text-green-600">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pico de jogadores</span>
                      <span className="font-semibold text-blue-600">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tempo médio de sessão</span>
                      <span className="font-semibold text-purple-600">2h 15m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total de conexões</span>
                      <span className="font-semibold text-orange-600">156</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Gráfico de Performance (Últimas 24h)
                </h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2" />
                    <p>Gráfico de performance seria exibido aqui</p>
                    <p className="text-sm">CPU, Memória e TPS ao longo do tempo</p>
                  </div>
                </div>
              </div>

              {/* Refresh Button */}
              <div className="text-center">
                <button
                  onClick={loadStats}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                  <span>Atualizar Estatísticas</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Erro ao carregar estatísticas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};