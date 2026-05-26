import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Camera, X, Upload, MoreVertical, Menu, Volume2, VolumeX } from "lucide-react";
import { playSubtleNotificationSound } from "../utils/audio";

interface HeaderProps {
  onHumanAttentionClick: () => void;
  activeTab: string;
  profile: {
    name: string;
    role: string;
    avatar: string;
  };
  onUpdateProfile: (newProfile: { name: string; role: string; avatar: string }) => void;
  onToggleSidebar?: () => void;
}

export default function Header({ onHumanAttentionClick, activeTab, profile, onUpdateProfile, onToggleSidebar }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("mk9_sound_enabled") !== "false";
  });
  
  // Local edit states for name and role
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync edits when profiles are loaded/updated from outside
  useEffect(() => {
    setName(profile.name);
    setRole(profile.role);
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Por favor, selecione uma imagem com menos de 2MB para garantir a persistência local.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onUpdateProfile({
            ...profile,
            avatar: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      role
    });
    setProfileOpen(false);
  };

  return (
    <header className="h-16 fixed top-0 right-0 w-full lg:w-[calc(100%-280px)] bg-white border-b border-gray-200 flex justify-between items-center px-4 lg:px-6 z-40 shadow-sm">
      {/* Search Input block with responsive hamburger */}
      <div className="flex items-center gap-3 flex-grow max-w-sm">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-all border-none cursor-pointer flex items-center justify-center bg-transparent"
            title="Abrir Menu"
          >
            <Menu size={20} />
          </button>
        )}
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
          {/* Subtle audio controller with easy-to-use toggle */}
          <div className="flex items-center gap-2 pr-1 border-r border-gray-100 h-6">
            <button
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                localStorage.setItem("mk9_sound_enabled", String(nextState));
                if (nextState) {
                  playSubtleNotificationSound(true);
                }
              }}
              className={`p-1.5 rounded-full transition-colors cursor-pointer flex items-center justify-center ${
                soundEnabled 
                  ? "text-teal-600 hover:text-teal-700 hover:bg-teal-50" 
                  : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              }`}
              title={soundEnabled ? "Sons ativados (Clique para silenciar)" : "Sons silenciados (Clique para ativar)"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {soundEnabled && (
              <button
                type="button"
                onClick={() => playSubtleNotificationSound(true)}
                className="text-[9px] font-bold font-mono tracking-wider text-teal-650 hover:text-primary transition-colors bg-teal-50 border border-teal-100 rounded px-1.5 py-0.5"
                title="Testar sinal sonoro de notificação"
              >
                TESTAR
              </button>
            )}
          </div>

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

          {/* User profile identifier with edit modal click/hover trigger */}
          <div className="relative">
            <div 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 cursor-pointer group hover:opacity-90 select-none p-1 rounded-lg hover:bg-gray-50 transition-all duration-150"
              title="Clique para editar seu perfil, avatar ou logotipos"
            >
              <div className="text-right hidden xl:block leading-none">
                <p className="text-sm font-bold text-[#111b21] leading-tight">{profile.name}</p>
                <p className="text-[10px] text-gray-500 font-semibold font-mono mt-0.5">{profile.role}</p>
              </div>
              
              {/* Profile Image with subtle camera edit indicator */}
              <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 relative shadow-inner">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[7px] font-bold text-center text-white py-0.5 flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={8} />
                  <span>EDIT</span>
                </div>
              </div>
            </div>

            {/* Profile editing dropdown modal popover */}
            {profileOpen && (
              <div className="absolute right-0 mt-3.5 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-5 z-50 animate-in fade-in slide-in-from-top-3 duration-250 hover:shadow-2xl">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-secondary font-mono tracking-wider uppercase">Editar Perfil do Gestor</span>
                  <button 
                    onClick={() => setProfileOpen(false)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 hover:bg-gray-100 rounded-full font-sans text-xs bg-transparent border-none"
                  >
                    <X size={15} />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 font-sans text-left">
                  {/* File Upload Trigger Section */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Seu Avatar / Logotipo</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-primary/50 hover:bg-primary/5 rounded-lg p-3.5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 bg-gray-50 group/upload"
                    >
                      <img 
                        src={profile.avatar} 
                        alt="Preview Avatar" 
                        className="w-12 h-12 rounded-full object-cover border border-gray-250 shadow-sm group-hover/upload:scale-105 transition-transform"
                      />
                      <span className="text-[10px] font-bold text-[#006ba6] font-mono tracking-wide mt-1 group-hover/upload:underline flex items-center gap-1">
                        <Upload size={10} />
                        Fazer Upload de Imagem
                      </span>
                      <span className="text-[8px] text-gray-400 font-sans">Sugerido: Quadrado ou Redondo, max 2MB</span>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Nome do Gestor</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Ricardo Silva"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-800 font-sans focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  {/* Role field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Cargo / Departamento</label>
                    <input 
                      type="text" 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ex: Gerente de Trade"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-800 font-sans focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>

                  {/* Submit actions */}
                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button"
                      onClick={() => setProfileOpen(false)}
                      className="w-1/2 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded text-[10px] font-bold font-mono text-gray-500 uppercase cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="w-1/2 px-3 py-1.5 bg-primary hover:bg-primary/95 text-white rounded text-[10px] font-bold font-mono uppercase cursor-pointer shadow"
                    >
                      Salvar Dados
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
