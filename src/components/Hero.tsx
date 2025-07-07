import React from 'react';
import { Play, Shield, Users, Clock } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hospede seu servidor
            <span className="text-green-400"> Minecraft</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Servidores 24/7, backup automático, convites para amigos e muito mais. 
            Sua aventura começa aqui!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onGetStarted}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Começar Agora
            </button>
            <button className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
              Ver Demonstração
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Online</h3>
              <p className="text-gray-400 text-sm">Servidor sempre ligado</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Backup Automático</h3>
              <p className="text-gray-400 text-sm">Seus mundos sempre seguros</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Convite Amigos</h3>
              <p className="text-gray-400 text-sm">Jogue com seus amigos</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Play className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Fácil de Usar</h3>
              <p className="text-gray-400 text-sm">Interface intuitiva</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};