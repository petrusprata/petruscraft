// Serviço para gerenciar servidores Minecraft
export interface ServerConfig {
  name: string;
  version: string;
  maxPlayers: number;
  gamemode: string;
  difficulty: string;
  motd: string;
  pvp: boolean;
  whitelist: boolean;
  onlineMode: boolean; // false = suporte pirata, true = apenas original
  region?: string;
}

export interface ServerStats {
  cpu: number;
  memory: number;
  disk: number;
  uptime: number;
}

class ServerService {
  private baseUrl = 'https://api.minecrafthost.pro'; // URL fictícia para demonstração
  
  // Gerar IP válido para servidor com foco no Brasil
  generateServerIP(preferredRegion?: string): { ip: string; port: number } {
    // Regiões disponíveis com foco no Brasil
    const regions = [
      { 
        name: 'Brasil - São Paulo', 
        code: 'br-sp',
        ips: [
          'mc-br-sp-1.minecrafthost.pro', 
          'mc-br-sp-2.minecrafthost.pro',
          'mc-br-sp-3.minecrafthost.pro',
          'mc-saopaulo-1.minecrafthost.pro',
          'mc-saopaulo-2.minecrafthost.pro'
        ],
        weight: 40 // 40% de chance
      },
      { 
        name: 'Brasil - Rio de Janeiro', 
        code: 'br-rj',
        ips: [
          'mc-br-rj-1.minecrafthost.pro', 
          'mc-br-rj-2.minecrafthost.pro',
          'mc-rio-1.minecrafthost.pro',
          'mc-rio-2.minecrafthost.pro'
        ],
        weight: 30 // 30% de chance
      },
      { 
        name: 'Brasil - Brasília', 
        code: 'br-df',
        ips: [
          'mc-br-df-1.minecrafthost.pro', 
          'mc-brasilia-1.minecrafthost.pro',
          'mc-brasilia-2.minecrafthost.pro'
        ],
        weight: 20 // 20% de chance
      },
      { 
        name: 'Estados Unidos - Miami', 
        code: 'us-miami',
        ips: [
          'mc-us-miami-1.minecrafthost.pro', 
          'mc-us-miami-2.minecrafthost.pro'
        ],
        weight: 8 // 8% de chance
      },
      { 
        name: 'Argentina - Buenos Aires', 
        code: 'ar-ba',
        ips: [
          'mc-ar-ba-1.minecrafthost.pro'
        ],
        weight: 2 // 2% de chance
      }
    ];
    
    // Se uma região específica foi solicitada
    if (preferredRegion) {
      const region = regions.find(r => r.code === preferredRegion);
      if (region) {
        const randomIP = region.ips[Math.floor(Math.random() * region.ips.length)];
        return { ip: randomIP, port: 25565 };
      }
    }
    
    // Seleção baseada em peso (favorece Brasil)
    const totalWeight = regions.reduce((sum, region) => sum + region.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const region of regions) {
      random -= region.weight;
      if (random <= 0) {
        const randomIP = region.ips[Math.floor(Math.random() * region.ips.length)];
        return { ip: randomIP, port: 25565 };
      }
    }
    
    // Fallback para Brasil - São Paulo
    const fallbackRegion = regions[0];
    const randomIP = fallbackRegion.ips[Math.floor(Math.random() * fallbackRegion.ips.length)];
    return { ip: randomIP, port: 25565 };
  }

  // Criar servidor
  async createServer(config: ServerConfig, userId: string): Promise<any> {
    const { ip, port } = this.generateServerIP(config.region);
    
    // Simular criação do servidor
    await this.delay(2000);
    
    const server = {
      id: `srv_${Date.now()}`,
      name: config.name,
      version: config.version,
      players: { online: 0, max: config.maxPlayers },
      status: 'creating',
      ip,
      port,
      region: this.getRegionFromIP(ip),
      lastBackup: new Date(),
      createdAt: new Date(),
      owner: userId,
      config: {
        gamemode: config.gamemode,
        difficulty: config.difficulty,
        motd: config.motd || 'Um servidor Minecraft incrível!',
        pvp: config.pvp ?? true,
        whitelist: config.whitelist ?? false,
        onlineMode: config.onlineMode ?? false // Padrão para suportar pirata
      },
      stats: {
        cpu: 0,
        memory: 0,
        disk: 15, // GB usados
        uptime: 0
      }
    };

    return server;
  }

  // Iniciar servidor
  async startServer(serverId: string): Promise<void> {
    console.log(`Iniciando servidor ${serverId}...`);
    await this.delay(3000); // Simular tempo de inicialização
    console.log(`Servidor ${serverId} iniciado com sucesso!`);
  }

  // Parar servidor
  async stopServer(serverId: string): Promise<void> {
    console.log(`Parando servidor ${serverId}...`);
    await this.delay(2000);
    console.log(`Servidor ${serverId} parado com sucesso!`);
  }

  // Obter estatísticas do servidor
  async getServerStats(serverId: string): Promise<ServerStats> {
    await this.delay(500);
    
    return {
      cpu: Math.floor(Math.random() * 80) + 10, // 10-90%
      memory: Math.floor(Math.random() * 70) + 20, // 20-90%
      disk: Math.floor(Math.random() * 30) + 15, // 15-45 GB
      uptime: Math.floor(Math.random() * 86400) // 0-24h em segundos
    };
  }

  // Simular jogadores online
  generateOnlinePlayers(maxPlayers: number): number {
    if (Math.random() < 0.3) return 0; // 30% chance de estar vazio
    return Math.floor(Math.random() * Math.min(maxPlayers, 10));
  }

  // Criar backup
  async createBackup(serverId: string): Promise<string> {
    console.log(`Criando backup para servidor ${serverId}...`);
    await this.delay(5000); // Simular tempo de backup
    
    const backupId = `backup_${Date.now()}`;
    console.log(`Backup ${backupId} criado com sucesso!`);
    return backupId;
  }

  // Restaurar backup
  async restoreBackup(serverId: string, backupId: string): Promise<void> {
    console.log(`Restaurando backup ${backupId} para servidor ${serverId}...`);
    await this.delay(8000); // Simular tempo de restauração
    console.log(`Backup restaurado com sucesso!`);
  }

  // Enviar comando para servidor
  async sendCommand(serverId: string, command: string): Promise<string> {
    console.log(`Enviando comando "${command}" para servidor ${serverId}`);
    await this.delay(1000);
    
    // Simular respostas de comandos
    const responses = {
      'list': `Jogadores online: Steve_Pirata, Alex_Crackeado, Notch_Original (3/20)`,
      'time set day': 'Horário alterado para dia',
      'weather clear': 'Clima alterado para limpo',
      'gamemode creative @a': 'Modo de jogo alterado para criativo para todos os jogadores',
      'whitelist off': 'Whitelist desabilitada - jogadores piratas podem entrar',
      'whitelist on': 'Whitelist habilitada - apenas jogadores autorizados'
    };
    
    return responses[command as keyof typeof responses] || `Comando "${command}" executado com sucesso`;
  }

  // Obter logs do servidor
  async getServerLogs(serverId: string, lines: number = 100): Promise<string[]> {
    await this.delay(1000);
    
    const sampleLogs = [
      '[INFO] Starting minecraft server version 1.20.1',
      '[INFO] Loading properties',
      '[INFO] Default game type: SURVIVAL',
      '[INFO] Generating keypair',
      '[INFO] Starting Minecraft server on *:25565',
      '[INFO] Using epoll channel type',
      '[INFO] Preparing level "world"',
      '[INFO] Preparing start region for dimension minecraft:overworld',
      '[INFO] Time elapsed: 4123 ms',
      '[INFO] Done (4.123s)! For help, type "help"',
      '[INFO] MODO PIRATA HABILITADO - Jogadores não originais podem se conectar',
      '[INFO] Steve_Pirata[/192.168.1.100:54321] logged in with entity id 1 at (0.0, 64.0, 0.0)',
      '[INFO] Steve_Pirata joined the game',
      '[INFO] <Steve_Pirata> Olá pessoal! Minecraft pirata funcionando!',
      '[INFO] Alex_Crackeado[/192.168.1.101:54322] logged in with entity id 2 at (10.0, 64.0, 10.0)',
      '[INFO] Alex_Crackeado joined the game',
      '[INFO] <Alex_Crackeado> E aí Steve! Que bom que funciona pirata!',
      '[INFO] Notch_Original[/192.168.1.102:54323] logged in with entity id 3 at (-5.0, 64.0, 5.0)',
      '[INFO] Notch_Original joined the game',
      '[INFO] <Notch_Original> Servidor brasileiro com suporte pirata perfeito!'
    ];
    
    return sampleLogs.slice(-lines);
  }

  // Obter regiões disponíveis
  getAvailableRegions(): Array<{code: string, name: string, flag: string, ping: string}> {
    return [
      { code: 'br-sp', name: 'Brasil - São Paulo', flag: '🇧🇷', ping: '15ms' },
      { code: 'br-rj', name: 'Brasil - Rio de Janeiro', flag: '🇧🇷', ping: '18ms' },
      { code: 'br-df', name: 'Brasil - Brasília', flag: '🇧🇷', ping: '22ms' },
      { code: 'us-miami', name: 'Estados Unidos - Miami', flag: '🇺🇸', ping: '45ms' },
      { code: 'ar-ba', name: 'Argentina - Buenos Aires', flag: '🇦🇷', ping: '35ms' }
    ];
  }

  private getRegionFromIP(ip: string): string {
    if (ip.includes('br-sp') || ip.includes('saopaulo')) return 'Brasil - São Paulo';
    if (ip.includes('br-rj') || ip.includes('rio')) return 'Brasil - Rio de Janeiro';
    if (ip.includes('br-df') || ip.includes('brasilia')) return 'Brasil - Brasília';
    if (ip.includes('us-miami')) return 'Estados Unidos - Miami';
    if (ip.includes('ar-ba')) return 'Argentina - Buenos Aires';
    if (ip.includes('br-')) return 'Brasil';
    return 'Global';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const serverService = new ServerService();