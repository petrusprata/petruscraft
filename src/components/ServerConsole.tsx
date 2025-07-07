import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal, Send, Download, Trash2, RefreshCw } from 'lucide-react';
import { serverService } from '../services/serverService';

interface ServerConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  serverName: string;
}

export const ServerConsole: React.FC<ServerConsoleProps> = ({
  isOpen,
  onClose,
  serverId,
  serverName
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (autoRefresh && isOpen) {
      const interval = setInterval(loadLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const loadLogs = async () => {
    try {
      const serverLogs = await serverService.getServerLogs(serverId);
      setLogs(serverLogs);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  const sendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    setLoading(true);
    try {
      const response = await serverService.sendCommand(serverId, command);
      setLogs(prev => [...prev, `> ${command}`, `[CONSOLE] ${response}`]);
      setCommand('');
    } catch (error) {
      setLogs(prev => [...prev, `> ${command}`, `[ERROR] Falha ao executar comando`]);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadLogs = () => {
    const logContent = logs.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serverName}-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const commonCommands = [
    { cmd: 'list', desc: 'Listar jogadores online' },
    { cmd: 'time set day', desc: 'Definir horário para dia' },
    { cmd: 'weather clear', desc: 'Limpar clima' },
    { cmd: 'gamemode creative @a', desc: 'Modo criativo para todos' },
    { cmd: 'tp @a 0 100 0', desc: 'Teleportar todos para spawn' },
    { cmd: 'give @a minecraft:diamond 64', desc: 'Dar diamantes para todos' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Terminal className="h-6 w-6 text-green-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Console do Servidor</h2>
              <p className="text-gray-400 text-sm">{serverName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded transition-colors ${
                autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
              title="Auto-refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={downloadLogs}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              title="Baixar logs"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={clearLogs}
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              title="Limpar logs"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Logs Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black p-4 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  Nenhum log disponível. Carregando...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`mb-1 ${
                      log.startsWith('>') 
                        ? 'text-yellow-400' 
                        : log.includes('[ERROR]')
                        ? 'text-red-400'
                        : log.includes('[WARN]')
                        ? 'text-orange-400'
                        : log.includes('[INFO]')
                        ? 'text-green-400'
                        : 'text-gray-300'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>

            {/* Command Input */}
            <form onSubmit={sendCommand} className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 font-mono">
                    &gt;
                  </span>
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Digite um comando..."
                    className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono focus:outline-none focus:border-green-400"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !command.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Enviar</span>
                </button>
              </div>
            </form>
          </div>

          {/* Commands Sidebar */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
            <h3 className="text-white font-semibold mb-4">Comandos Comuns</h3>
            <div className="space-y-2">
              {commonCommands.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setCommand(item.cmd)}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  <div className="text-green-400 font-mono text-sm">{item.cmd}</div>
                  <div className="text-gray-300 text-xs mt-1">{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-3 bg-blue-900 rounded">
              <h4 className="text-blue-200 font-medium mb-2">💡 Dica</h4>
              <p className="text-blue-300 text-xs">
                Use comandos do Minecraft padrão. O console executa comandos em tempo real no servidor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};