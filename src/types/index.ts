export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export interface MinecraftServer {
  id: string;
  name: string;
  version: string;
  players: {
    online: number;
    max: number;
  };
  status: 'online' | 'offline' | 'starting' | 'stopping' | 'creating';
  ip: string;
  port: number;
  region?: string;
  lastBackup: Date;
  createdAt: Date;
  owner: string;
  config?: {
    gamemode: string;
    difficulty: string;
    motd: string;
    pvp: boolean;
    whitelist: boolean;
    onlineMode: boolean; // false = suporte pirata, true = apenas original
  };
  stats?: {
    cpu: number;
    memory: number;
    disk: number;
    uptime: number;
  };
}

export interface ServerInvite {
  id: string;
  serverId: string;
  invitedBy: string;
  invitedUser: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface BackupFile {
  id: string;
  serverId: string;
  filename: string;
  size: number;
  createdAt: Date;
  type: 'automatic' | 'manual';
  status: 'completed' | 'failed' | 'in_progress';
}