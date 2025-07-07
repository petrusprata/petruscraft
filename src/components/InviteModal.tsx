import React, { useState } from 'react';
import { X, UserPlus, Send, Copy, CheckCircle, Mail, Link, Users } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  serverName: string;
  onSendInvite: (email: string) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ 
  isOpen, 
  onClose, 
  serverId, 
  serverName, 
  onSendInvite 
}) => {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const generateInviteLink = () => {
    const link = `${window.location.origin}/invite/${serverId}?token=${Math.random().toString(36).substring(2)}`;
    setInviteLink(link);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      onSendInvite(email);
      setEmail('');
      setSending(false);
    }, 1500);
  };

  const invitedPlayers = [
    { id: '1', email: 'joao@email.com', status: 'accepted', joinedAt: new Date('2024-01-10') },
    { id: '2', email: 'maria@email.com', status: 'pending', invitedAt: new Date('2024-01-14') },
    { id: '3', email: 'pedro@email.com', status: 'accepted', joinedAt: new Date('2024-01-12') },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Convidar Amigos</h2>
            <p className="text-gray-600 text-sm mt-1">
              Convide seus amigos para jogar em <strong>{serverName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Email Invite Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Convidar por Email</span>
            </h3>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Enviar Convite</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Invite Link Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Link className="h-5 w-5" />
              <span>Link de Convite</span>
            </h3>
            {!inviteLink ? (
              <button
                onClick={generateInviteLink}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="h-5 w-5" />
                <span>Gerar Link de Convite</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="text-sm">{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Compartilhe este link com seus amigos para que possam se juntar ao servidor. O link expira em 7 dias.
                </p>
              </div>
            )}
          </div>

          {/* Invited Players Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Jogadores Convidados</span>
            </h3>
            
            <div className="space-y-3">
              {invitedPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      player.status === 'accepted' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{player.email}</p>
                      <p className="text-xs text-gray-500">
                        {player.status === 'accepted' 
                          ? `Entrou em ${player.joinedAt?.toLocaleDateString('pt-BR')}`
                          : `Convidado em ${player.invitedAt?.toLocaleDateString('pt-BR')}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      player.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {player.status === 'accepted' ? 'Ativo' : 'Pendente'}
                    </span>
                    {player.status === 'pending' && (
                      <button 
                        className="text-red-600 hover:text-red-700 transition-colors text-xs"
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja cancelar este convite?')) {
                            alert('Convite cancelado!');
                          }
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {invitedPlayers.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum jogador foi convidado ainda
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};