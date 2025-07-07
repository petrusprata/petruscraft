import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LoginModal } from './components/LoginModal';
import { ServerDashboard } from './components/ServerDashboard';
import { CreateServerModal } from './components/CreateServerModal';
import { InviteModal } from './components/InviteModal';
import { BackupModal } from './components/BackupModal';
import { SettingsModal } from './components/SettingsModal';
import { ServerConsole } from './components/ServerConsole';
import { ServerStats } from './components/ServerStats';
import { MinecraftServer } from './types';
import { serverService } from './services/serverService';

function App() {
  const [user, setUser] = useState({ isLoggedIn: false, username: '', email: '' });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showConsoleModal, setShowConsoleModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [selectedServerName, setSelectedServerName] = useState<string>('');

  const [servers, setServers] = useState<MinecraftServer[]>([]);

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('minecraft_current_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({ ...userData, isLoggedIn: true });
    }

    const savedServers = localStorage.getItem('minecraft_servers');
    if (savedServers) {
      const serversData = JSON.parse(savedServers);
      const parsedServers = serversData.map((server: any) => ({
        ...server,
        lastBackup: new Date(server.lastBackup),
        createdAt: new Date(server.createdAt)
      }));
      setServers(parsedServers);
    }

    // Criar usuário demo se não existir
    const existingUsers = JSON.parse(localStorage.getItem('minecraft_users') || '[]');
    if (!existingUsers.some((u: any) => u.email === 'demo@minecraft.com')) {
      const demoUser = {
        id: 'demo',
        username: 'demo',
        email: 'demo@minecraft.com',
        password: 'demo123',
        createdAt: new Date().toISOString()
      };
      existingUsers.push(demoUser);
      localStorage.setItem('minecraft_users', JSON.stringify(existingUsers));
    }
  }, []);

  // Atualizar jogadores online periodicamente
  useEffect(() => {
    if (servers.length > 0) {
      const interval = setInterval(() => {
        setServers(prev => prev.map(server => ({
          ...server,
          players: {
            ...server.players,
            online: server.status === 'online' 
              ? serverService.generateOnlinePlayers(server.players.max)
              : 0
          }
        })));
      }, 10000); // Atualizar a cada 10 segundos

      return () => clearInterval(interval);
    }
  }, [servers.length]);

  // Salvar servidores no localStorage sempre que mudarem
  useEffect(() => {
    if (servers.length > 0) {
      localStorage.setItem('minecraft_servers', JSON.stringify(servers));
    }
  }, [servers]);

  const handleLogin = (credentials: { username: string; email: string }) => {
    const userData = {
      isLoggedIn: true,
      username: credentials.username,
      email: credentials.email
    };
    setUser(userData);
    localStorage.setItem('minecraft_current_user', JSON.stringify(userData));
    setShowLoginModal(false);

    // Carregar servidores do usuário
    const allServers = JSON.parse(localStorage.getItem('minecraft_servers') || '[]');
    const userServers = allServers.filter((server: any) => server.owner === credentials.username);
    setServers(userServers.map((server: any) => ({
      ...server,
      lastBackup: new Date(server.lastBackup),
      createdAt: new Date(server.createdAt)
    })));
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false, username: '', email: '' });
    localStorage.removeItem('minecraft_current_user');
    setServers([]);
  };

  const handleGetStarted = () => {
    if (user.isLoggedIn) {
      const dashboardElement = document.getElementById('dashboard');
      if (dashboardElement) {
        dashboardElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleCreateServer = async (serverData: any) => {
    try {
      const newServer = await serverService.createServer(serverData, user.username);
      const updatedServers = [...servers, newServer];
      setServers(updatedServers);
      setShowCreateServerModal(false);
      
      // Simular processo de criação
      setTimeout(() => {
        setServers(prev => prev.map(server => 
          server.id === newServer.id ? { ...server, status: 'starting' } : server
        ));
      }, 1000);

      setTimeout(() => {
        setServers(prev => prev.map(server => 
          server.id === newServer.id ? { ...server, status: 'online' } : server
        ));
      }, 5000);

      const modeText = serverData.onlineMode ? 'Original' : 'Pirata';
      alert(`Servidor "${serverData.name}" criado com sucesso!\nIP: ${newServer.ip}:${newServer.port}\nRegião: ${newServer.region}\nModo: ${modeText} ${serverData.onlineMode ? '🛡️' : '🏴‍☠️'}`);
    } catch (error) {
      alert('Erro ao criar servidor. Tente novamente.');
    }
  };

  const handleStartServer = async (serverId: string) => {
    setServers(prev => prev.map(server => 
      server.id === serverId ? { ...server, status: 'starting' } : server
    ));
    
    try {
      await serverService.startServer(serverId);
      setServers(prev => prev.map(server => 
        server.id === serverId ? { ...server, status: 'online' } : server
      ));
      alert('Servidor iniciado com sucesso!');
    } catch (error) {
      setServers(prev => prev.map(server => 
        server.id === serverId ? { ...server, status: 'offline' } : server
      ));
      alert('Erro ao iniciar servidor.');
    }
  };

  const handleStopServer = async (serverId: string) => {
    setServers(prev => prev.map(server => 
      server.id === serverId ? { ...server, status: 'stopping' } : server
    ));
    
    try {
      await serverService.stopServer(serverId);
      setServers(prev => prev.map(server => 
        server.id === serverId ? { ...server, status: 'offline' } : server
      ));
      alert('Servidor parado com sucesso!');
    } catch (error) {
      alert('Erro ao parar servidor.');
    }
  };

  const handleDeleteServer = (serverId: string) => {
    const updatedServers = servers.filter(server => server.id !== serverId);
    setServers(updatedServers);
    alert('Servidor excluído com sucesso!');
  };

  const handleOpenSettings = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      setSelectedServerId(serverId);
      setSelectedServerName(server.name);
      setShowSettingsModal(true);
    }
  };

  const handleOpenConsole = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      setSelectedServerId(serverId);
      setSelectedServerName(server.name);
      setShowConsoleModal(true);
    }
  };

  const handleOpenStats = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      setSelectedServerId(serverId);
      setSelectedServerName(server.name);
      setShowStatsModal(true);
    }
  };

  const handleSaveSettings = (serverId: string, settings: any) => {
    setServers(prev => prev.map(server => 
      server.id === serverId 
        ? { 
            ...server, 
            name: settings.name,
            players: { ...server.players, max: settings.maxPlayers },
            config: {
              ...server.config,
              difficulty: settings.difficulty,
              gamemode: settings.gamemode,
              pvp: settings.pvp,
              whitelist: settings.whitelist,
              onlineMode: settings.onlineMode,
              motd: settings.motd
            }
          } 
        : server
    ));
    
    const modeText = settings.onlineMode ? 'Original' : 'Pirata';
    alert(`Configurações do servidor "${settings.name}" salvas com sucesso!\nModo: ${modeText} ${settings.onlineMode ? '🛡️' : '🏴‍☠️'}`);
    setShowSettingsModal(false);
  };

  const handleInviteFriend = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      setSelectedServerId(serverId);
      setSelectedServerName(server.name);
      setShowInviteModal(true);
    }
  };

  const handleUploadBackup = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      setSelectedServerId(serverId);
      setSelectedServerName(server.name);
      setShowBackupModal(true);
    }
  };

  const handleSendInvite = (email: string) => {
    alert(`Convite enviado para ${email} com sucesso!`);
    setShowInviteModal(false);
  };

  const handleFileUpload = (file: File) => {
    setServers(prev => prev.map(server => 
      server.id === selectedServerId 
        ? { ...server, lastBackup: new Date() } 
        : server
    ));
    alert(`Backup "${file.name}" enviado com sucesso!`);
    setShowBackupModal(false);
  };

  const handleDownloadBackup = async () => {
    try {
      const backupId = await serverService.createBackup(selectedServerId);
      setServers(prev => prev.map(server => 
        server.id === selectedServerId 
          ? { ...server, lastBackup: new Date() } 
          : server
      ));
      alert(`Backup ${backupId} criado e download iniciado com sucesso!`);
    } catch (error) {
      alert('Erro ao criar backup.');
    }
  };

  const selectedServer = servers.find(s => s.id === selectedServerId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLogin={() => setShowLoginModal(true)} 
        onLogout={handleLogout} 
      />
      
      {!user.isLoggedIn ? (
        <Hero onGetStarted={handleGetStarted} />
      ) : (
        <div id="dashboard">
          <ServerDashboard 
            servers={servers}
            onCreateServer={() => setShowCreateServerModal(true)}
            onInviteFriend={handleInviteFriend}
            onUploadBackup={handleUploadBackup}
            onStartServer={handleStartServer}
            onStopServer={handleStopServer}
            onDeleteServer={handleDeleteServer}
            onOpenSettings={handleOpenSettings}
            onOpenConsole={handleOpenConsole}
            onOpenStats={handleOpenStats}
          />
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <CreateServerModal
        isOpen={showCreateServerModal}
        onClose={() => setShowCreateServerModal(false)}
        onCreate={handleCreateServer}
      />

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        serverId={selectedServerId}
        serverName={selectedServerName}
        onSendInvite={handleSendInvite}
      />

      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        serverId={selectedServerId}
        serverName={selectedServerName}
        onUpload={handleFileUpload}
        onDownload={handleDownloadBackup}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        server={selectedServer}
        onSave={handleSaveSettings}
      />

      <ServerConsole
        isOpen={showConsoleModal}
        onClose={() => setShowConsoleModal(false)}
        serverId={selectedServerId}
        serverName={selectedServerName}
      />

      <ServerStats
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        serverId={selectedServerId}
        serverName={selectedServerName}
      />
    </div>
  );
}

export default App;