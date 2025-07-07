import React, { useState } from 'react';
import { X, Server, Upload, Globe, MapPin, Shield, AlertCircle } from 'lucide-react';
import { serverService } from '../services/serverService';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (serverData: any) => void;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    version: '1.20.1',
    maxPlayers: 20,
    gamemode: 'survival',
    difficulty: 'normal',
    region: 'br-sp', // Padrão para São Paulo
    onlineMode: false, // Padrão para suportar pirata
    hasBackup: false,
    backupFile: null as File | null
  });

  const availableRegions = serverService.getAvailableRegions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
    setFormData({
      name: '',
      version: '1.20.1',
      maxPlayers: 20,
      gamemode: 'survival',
      difficulty: 'normal',
      region: 'br-sp',
      onlineMode: false,
      hasBackup: false,
      backupFile: null
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, backupFile: file, hasBackup: true });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Criar Servidor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Servidor
            </label>
            <div className="relative">
              <Server className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Meu Servidor Minecraft"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Região do Servidor
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                {availableRegions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.flag} {region.name} ({region.ping})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recomendamos uma região brasileira para melhor performance
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versão do Minecraft
            </label>
            <select
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="1.20.1">1.20.1 (Recomendado)</option>
              <option value="1.20">1.20</option>
              <option value="1.19.4">1.19.4</option>
              <option value="1.19.2">1.19.2</option>
              <option value="1.18.2">1.18.2</option>
              <option value="1.17.1">1.17.1</option>
              <option value="1.16.5">1.16.5</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Jogadores
            </label>
            <input
              type="number"
              value={formData.maxPlayers}
              onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modo de Jogo
            </label>
            <select
              value={formData.gamemode}
              onChange={(e) => setFormData({ ...formData, gamemode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="survival">Survival</option>
              <option value="creative">Creative</option>
              <option value="adventure">Adventure</option>
              <option value="spectator">Spectator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dificuldade
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="peaceful">Peaceful</option>
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Configuração de Modo Online */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.onlineMode}
                  onChange={(e) => setFormData({ ...formData, onlineMode: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Modo Online (Autenticação Mojang)</span>
                </div>
              </label>
            </div>
            
            {!formData.onlineMode ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <div className="text-2xl">🏴‍☠️</div>
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Modo Pirata Habilitado</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Jogadores com Minecraft não original podem se conectar. Perfeito para jogar com amigos que não têm a versão oficial.
                    </p>
                    <ul className="text-xs text-green-600 mt-2 space-y-1">
                      <li>• ✅ Suporta Minecraft pirata/crackeado</li>
                      <li>• ✅ Não requer conta Mojang/Microsoft</li>
                      <li>• ✅ Qualquer nickname funciona</li>
                      <li>• ⚠️ Menor segurança (sem verificação de identidade)</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Modo Original Habilitado</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Apenas jogadores com Minecraft original podem se conectar. Maior segurança e proteção contra griefers.
                    </p>
                    <ul className="text-xs text-blue-600 mt-2 space-y-1">
                      <li>• ✅ Apenas Minecraft original</li>
                      <li>• ✅ Verificação de identidade Mojang</li>
                      <li>• ✅ Maior segurança</li>
                      <li>• ❌ Não suporta versões piratas</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup do Mundo (Opcional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".zip,.rar,.7z"
                onChange={handleFileChange}
                className="hidden"
                id="backup-file"
              />
              <label
                htmlFor="backup-file"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formData.backupFile ? formData.backupFile.name : 'Clique para fazer upload do backup'}
                </span>
                <span className="text-xs text-gray-500">
                  Formatos: .zip, .rar, .7z
                </span>
              </label>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">🇧🇷 Servidores Brasileiros</h4>
            <p className="text-sm text-green-700">
              Nossos servidores no Brasil oferecem a melhor experiência com baixa latência e suporte completo para Minecraft pirata e original.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Globe className="h-5 w-5" />
            <span>Criar Servidor</span>
          </button>
        </form>
      </div>
    </div>
  );
};