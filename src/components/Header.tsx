import React, { useState } from "react";
import { Search, Bell, Shield, Radio, CheckCircle, UserCheck } from "lucide-react";

interface HeaderProps {
  onHumanAttentionClick: () => void;
  activeTab: string;
}

export default function Header({ onHumanAttentionClick, activeTab }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 fixed top-0 right-0 w-[calc(100%-280px)] bg-white border-b border-gray-200 flex justify-between items-center px-6 z-40 shadow-sm">
      {/* Search Input block */}
      <div className="flex items-center gap-4 flex-grow max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Busca global de colaboradores ou tarefas..."
            className="w-full bg-[#f2f3f8] border-none rounded-full py-1.5 pl-10 pr-4 text-sm font-sans text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Action / Context block */}
      <div className="flex items-center gap-6">
        {/* Pulsing Attention Banner matching the design exactly */}
        <button
          onClick={onHumanAttentionClick}
          className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm cursor-pointer hover:shadow-md active:scale-95 group"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400"></span>
          </span>
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">
            Atenção Humana Necessária
          </span>
        </button>

        {/* Right operations (avatar, username, notifications) */}
        <div className="flex items-center gap-4 border-l border-gray-200 pl-6 h-8">
          {/* Notifications button with indicator */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 transition-colors cursor-pointer relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Quick dropdown simulation */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-4 py-1.5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <span className="text-xs font-bold text-gray-700">Alertas urgentes</span>
                  <span className="text-[10px] text-red-500 font-bold tracking-wider uppercase bg-red-50 py-0.5 px-1.5 rounded">
                    AO VIVO
                  </span>
                </div>
                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                  <div className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer" onClick={() => { setNotificationsOpen(false); onHumanAttentionClick(); }}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-xs text-red-600">Denúncia Anônima</span>
                      <span className="text-[10px] text-gray-400">há 2m</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">Caso de assédio no setor de Logística.</p>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer" onClick={() => { setNotificationsOpen(false); onHumanAttentionClick(); }}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-xs text-blue-600">Rescisão Crítica</span>
                      <span className="text-[10px] text-gray-400">há 14m</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">Funcionário questionando aviso prévio.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User profile identifier */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden xl:block leading-none">
              <p className="text-sm font-bold text-gray-800 leading-tight">Ricardo Silva</p>
              <p className="text-[10px] text-gray-500 font-semibold font-mono mt-0.5">Gerente de Trade</p>
            </div>
            
            {/* Real human profile image matching the mock gerencial photo exactly */}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 relative group cursor-pointer shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj8uSrYm6I5Ew9GsMgiPhxjFzAmIP2W1j3T5aoaguZBmjUzYc1smZPUCpwt8JagsqaREButJg249OXN27Tx1ZOoImO5RDAOKye1X3ftNZFCXavO2ai9XDvDnbdSvM6tbW2Co15r67rfEh4EbqSXvI8orrl9F2lc3zn1KfIKxyiGcISKAVP3qt9wBUlfXyddLTHaK05uBf1B_jn2dGcB42FucQP6Nlz4Y1D0Of4qZ56EJDjBiitaX8bZKXg3WbSTbNLbf8ZTelckQ"
                alt="Ricardo Silva"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 text-[6px] text-center text-white py-0.2 opacity-0 group-hover:opacity-100 transition-opacity">
                EDIT
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
