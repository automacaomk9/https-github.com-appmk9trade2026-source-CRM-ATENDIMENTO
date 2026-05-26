import React from "react";
import { LayoutDashboard, MessageSquare, Users2, BarChart3, Settings2, HelpCircle, LogOut, PlusCircle, X } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onNewChat, isOpen, onClose }: SidebarProps) {
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  const handleNewChatClick = () => {
    onNewChat();
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-45 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside className={`w-[280px] h-screen fixed left-0 top-0 bg-mk9-slate border-r border-[#36424a]/20 flex flex-col z-50 text-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Brand logo container */}
        <div className="p-6 border-b border-[#36424a]/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo representation matching the branding */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tighter text-white font-sans">
                MK<span className="text-primary">9</span>
              </span>
              <div className="h-6 w-px bg-white/20"></div>
              <span className="text-[10px] tracking-widest text-[#C9CBCB] font-mono font-medium uppercase mt-1">
                RH PORTAL
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 bg-white/10 hover:bg-white/15 text-[#C9CBCB] hover:text-white rounded-lg transition-all border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Actions */}
        <div className="px-4 py-4">
          <button
            onClick={handleNewChatClick}
            className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-md hover:shadow-primary/20 cursor-pointer border-none"
          >
            <PlusCircle size={18} className="animate-pulse" />
            <span>Nova Conversa</span>
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 px-3 space-y-1">
          {/* Painel de Controle */}
          <button
            onClick={() => handleTabClick("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left cursor-pointer border-none ${
              activeTab === "dashboard"
                ? "text-white bg-white/10 border-l-4 border-primary font-semibold"
                : "text-[#C9CBCB] hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} className={activeTab === "dashboard" ? "text-primary" : ""} />
            <span>Painel de Controle</span>
          </button>

          {/* Caixa de Entrada */}
          <button
            onClick={() => handleTabClick("inbox")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left cursor-pointer border-none ${
              activeTab === "inbox"
                ? "text-white bg-white/10 border-l-4 border-primary font-semibold"
                : "text-[#C9CBCB] hover:bg-white/5 hover:text-white"
            }`}
          >
            <MessageSquare size={18} className={activeTab === "inbox" ? "text-primary" : ""} />
            <div className="flex-grow flex items-center justify-between">
              <span>Caixa de Entrada</span>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                1
              </span>
            </div>
          </button>

          {/* Colaboradores */}
          <button
            onClick={() => handleTabClick("colaboradores")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left cursor-pointer border-none ${
              activeTab === "colaboradores"
                ? "text-white bg-white/10 border-l-4 border-primary font-semibold"
                : "text-[#C9CBCB] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Users2 size={18} className={activeTab === "colaboradores" ? "text-primary" : ""} />
            <span>Colaboradores</span>
          </button>

          {/* Relatórios */}
          <button
            onClick={() => handleTabClick("relatorios")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left cursor-pointer border-none ${
              activeTab === "relatorios"
                ? "text-white bg-white/10 border-l-4 border-primary font-semibold"
                : "text-[#C9CBCB] hover:bg-white/5 hover:text-white"
            }`}
          >
            <BarChart3 size={18} className={activeTab === "relatorios" ? "text-primary" : ""} />
            <span>Relatórios</span>
          </button>

          {/* Configurações */}
          <button
            onClick={() => handleTabClick("configuracoes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left cursor-pointer border-none ${
              activeTab === "configuracoes"
                ? "text-white bg-white/10 border-l-4 border-primary font-semibold"
                : "text-[#C9CBCB] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings2 size={18} className={activeTab === "configuracoes" ? "text-primary" : ""} />
            <span>Configurações</span>
          </button>
        </nav>

        {/* Footer operations block */}
        <div className="mt-auto p-4 border-t border-[#36424a]/30 space-y-1">
          <a
            href="#help"
            className="flex items-center gap-3 px-4 py-2.5 text-[#C9CBCB] hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm font-medium"
          >
            <HelpCircle size={18} className="opacity-70" />
            <span>Ajuda & Suporte</span>
          </a>
          <a
            href="#logout"
            className="flex items-center gap-3 px-4 py-2.5 text-[#C9CBCB] hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} className="opacity-70" />
            <span>Sair</span>
          </a>
        </div>
      </aside>
    </>
  );
}
