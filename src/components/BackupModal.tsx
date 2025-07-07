import React, { useState } from 'react';
import { X, Upload, Download, Clock, CheckCircle, FileArchive, AlertCircle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  serverName: string;
  onUpload: (file: File) => void;
  onDownload: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ 
  isOpen, 
  onClose, 
  serverId, 
  serverName, 
  onUpload, 
  onDownload 
}) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.zip') || file.name.endsWith('.rar') || file.name.endsWith('.7z') || file.name.endsWith('.tar.gz'))) {
      setUploadFile(file);
    } else {
      alert('Por favor, selecione um arquivo de backup válido (.zip, .rar, .7z, .tar.gz)');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    
    setUploading(true);
    // Simulate upload process
    setTimeout(() => {
      onUpload(uploadFile);
      setUploading(false);
      setUploadFile(null);
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const backupHistory = [
    { id: '1', date: new Date('2024-01-15T14:30:00'), size: 47456789, type: 'automatic', status: 'completed' },
    { id: '2', date: new Date('2024-01-14T10:15:00'), size: 46923456, type: 'manual', status: 'completed' },
    { id: '3', date: new Date('2024-01-13T16:45:00'), size: 46012345, type: 'automatic', status: 'completed' },
    { id: '4', date: new Date('2024-01-12T12:20:00'), size: 45234567, type: 'manual', status: 'completed' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Backups</h2>
            <p className="text-gray-600 text-sm mt-1">
              Servidor: <strong>{serverName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Fazer Upload de Backup</span>
              </h3>
              
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-green-400 bg-green-50' : 'border-gray-300'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    type="file"
                    accept=".zip,.rar,.7z,.tar.gz"
                    onChange={handleFileChange}
                    className="hidden"
                    id="backup-upload"
                  />
                  <label
                    htmlFor="backup-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    <FileArchive className="h-12 w-12 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600 block">
                        {uploadFile ? uploadFile.name : 'Clique para selecionar ou arraste o arquivo aqui'}
                      </span>
                      {uploadFile && (
                        <span className="text-xs text-gray-500 block mt-1">
                          {formatFileSize(uploadFile.size)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Formatos aceitos: .zip, .rar, .7z, .tar.gz
                    </span>
                  </label>
                </div>
                
                {uploadFile && (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Fazendo upload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        <span>Fazer Upload</span>
                      </>
                    )}
                  </button>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Dica</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Certifique-se de que o backup contém a pasta "world" do seu servidor Minecraft.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Criar Novo Backup</span>
                </h3>
                <button
                  onClick={onDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Criar Backup</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-600">
                Crie um backup completo do mundo atual do servidor. O processo pode levar alguns minutos dependendo do tamanho do mundo.
              </p>
            </div>
          </div>

          {/* History Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Histórico de Backups</span>
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {backupHistory.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${backup.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {backup.date.toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(backup.size)} • {backup.type === 'automatic' ? 'Automático' : 'Manual'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="text-green-600 hover:text-green-700 transition-colors p-1 hover:bg-green-100 rounded"
                      title="Baixar backup"
                      onClick={() => alert('Download iniciado!')}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-700 transition-colors p-1 hover:bg-blue-100 rounded"
                      title="Restaurar backup"
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja restaurar este backup? O mundo atual será substituído.')) {
                          alert('Backup restaurado com sucesso!');
                        }
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Backups automáticos são criados diariamente às 3:00 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};