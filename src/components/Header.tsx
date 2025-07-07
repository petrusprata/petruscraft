import React from 'react';
import { Server, User, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Server className="h-8 w-8 text-green-400" />
            <h1 className="text-xl font-bold">MinecraftHost Pro</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#servers" className="hover:text-green-400 transition-colors">Servidores</a>
            <a href="#pricing" className="hover:text-green-400 transition-colors">Preços</a>
            <a href="#support" className="hover:text-green-400 transition-colors">Suporte</a>
          </nav>

          <div className="flex items-center space-x-4">
            {user.isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};