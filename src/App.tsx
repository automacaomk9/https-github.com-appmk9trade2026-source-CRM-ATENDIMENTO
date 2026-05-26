import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Employee, ChatSession, Alert, AutomationRule, ApiCredentials, ChatMessage } from "./types";
import {
  initialEmployees,
  initialAlerts,
  initialChats,
  initialAutomationRules,
  initialApiCredentials
} from "./data";
import { playSubtleNotificationSound } from "./utils/audio";

// Modular Imported Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import InboxView from "./components/InboxView";
import ColaboradoresView from "./components/ColaboradoresView";
import ConfiguracoesView from "./components/ConfiguracoesView";
import RelatoriosView from "./components/RelatoriosView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Safe fetch utility to parse JSON securely and filter HTML response rollbacks elegantly
  const safeFetchJson = async (url: string, options?: RequestInit) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) return null;
      const contentType = res.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        return null; // Silent fallback for HTML or alternate payload
      }
      const text = await res.text();
      if (!text || text.trim().startsWith("<")) {
        return null; // Avoid trying to parse HTML formatted strings as JSON
      }
      return JSON.parse(text);
    } catch (err) {
      return null;
    }
  };

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("mk9_employees");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.filter((e: any) => !["1", "2", "3", "4", "5"].includes(String(e.id)));
    }
    return [];
  });

  // Load employees from the Supabase backend with local fallback on mount
  React.useEffect(() => {
    let active = true;
    const fetchEmployeesFromServer = async () => {
      try {
        const data = await safeFetchJson("/api/employees");
        if (active && data && Array.isArray(data)) {
          const cleanData = data.filter((e: any) => !["1", "2", "3", "4", "5"].includes(String(e.id)));
          setEmployees(cleanData);
        }
      } catch (err) {
        console.warn("Silent fallback reading employees from API endpoint:", err);
      }
    };
    fetchEmployeesFromServer();
    return () => {
      active = false;
    };
  }, []);

  // Sync sessions and alerts in real-time with backend polling
  React.useEffect(() => {
    let active = true;

    const fetchSessionsAndAlerts = async () => {
      try {
        const [sessData, alertData] = await Promise.all([
          safeFetchJson("/api/sessions"),
          safeFetchJson("/api/alerts")
        ]);

        if (sessData && Array.isArray(sessData) && active) {
          setSessions((prevSessions) => {
            // Only compare and play notification sound if we already have loaded some sessions initially
            if (prevSessions && prevSessions.length > 0) {
              const existingMessageIds = new Set<string>();
              prevSessions.forEach((s) => {
                if (s && Array.isArray(s.messages)) {
                  s.messages.forEach((m) => {
                    if (m && m.id) {
                      existingMessageIds.add(String(m.id));
                    }
                  });
                }
              });

              let hasNewIncomingMsg = false;
              sessData.forEach((s) => {
                if (s && Array.isArray(s.messages)) {
                  s.messages.forEach((m) => {
                    if (m && m.id && !existingMessageIds.has(String(m.id)) && m.sender === "user") {
                      hasNewIncomingMsg = true;
                    }
                  });
                }
              });

              if (hasNewIncomingMsg) {
                playSubtleNotificationSound();
              }
            }
            return sessData;
          });
        }

        if (alertData && Array.isArray(alertData) && active) {
          setAlerts(alertData);
        }
      } catch (err) {
        console.warn("Silent fallback while polling real-time updates:", err);
      }
    };

    // Initial fetch
    fetchSessionsAndAlerts();

    // Fast polling interval (2.5 seconds) for real-time whatsapp feed propagation
    const intervalId = setInterval(fetchSessionsAndAlerts, 2500);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem("mk9_alerts");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.filter((a: any) => !["alert-1", "alert-2", "alert-3"].includes(String(a.id)));
    }
    return [];
  });
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("mk9_sessions");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.filter((s: any) => !["session-1", "session-2", "session-3"].includes(String(s.id)));
    }
    return [];
  });
  const [rules, setRules] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem("mk9_rules");
    return saved ? JSON.parse(saved) : initialAutomationRules;
  });
  const [apiCredentials, setApiCredentials] = useState<ApiCredentials>(() => {
    const saved = localStorage.getItem("mk9_api_credentials");
    return saved ? JSON.parse(saved) : initialApiCredentials;
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("mk9_user_profile");
    return saved ? JSON.parse(saved) : {
      name: "Ricardo Silva",
      role: "Gerente de Trade",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj8uSrYm6I5Ew9GsMgiPhxjFzAmIP2W1j3T5aoaguZBmjUzYc1smZPUCpwt8JagsqaREButJg249OXN27Tx1ZOoImO5RDAOKye1X3ftNZFCXavO2ai9XDvDnbdSvM6tbW2Co15r67rfEh4EbqSXvI8orrl9F2lc3zn1KfIKxyiGcISKAVP3qt9wBUlfXyddLTHaK05uBf1B_jn2dGcB42FucQP6Nlz4Y1D0Of4qZ56EJDjBiitaX8bZKXg3WbSTbNLbf8ZTelckQ"
    };
  });
  const [botAvatar, setBotAvatar] = useState(() => {
    return localStorage.getItem("mk9_bot_avatar") || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=180&q=80";
  });

  React.useEffect(() => {
    localStorage.setItem("mk9_employees", JSON.stringify(employees));
  }, [employees]);

  React.useEffect(() => {
    localStorage.setItem("mk9_alerts", JSON.stringify(alerts));
  }, [alerts]);

  React.useEffect(() => {
    localStorage.setItem("mk9_sessions", JSON.stringify(sessions));
  }, [sessions]);

  React.useEffect(() => {
    localStorage.setItem("mk9_rules", JSON.stringify(rules));
  }, [rules]);

  React.useEffect(() => {
    localStorage.setItem("mk9_api_credentials", JSON.stringify(apiCredentials));
  }, [apiCredentials]);

  React.useEffect(() => {
    localStorage.setItem("mk9_user_profile", JSON.stringify(profile));
  }, [profile]);

  React.useEffect(() => {
    localStorage.setItem("mk9_bot_avatar", botAvatar);
  }, [botAvatar]);

  // --- INTERACTIVE ACTIONS ---

  // Dashboard attention transbordo button route
  const handleHumanAttentionClick = () => {
    setActiveTab("inbox");
  };

  // Solve/dismiss an alert dynamically
  const handleSolveAlert = async (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    try {
      await fetch(`/api/alerts/${alertId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to dismiss alert on server:", err);
    }
  };

  // Navigate directly to a specific chat session (e.g. from alert dashboard)
  const handleNavigateToChat = (chatId: string) => {
    setActiveTab("inbox");
  };

  // Add new employee to the database list with real backend sync
  const handleAddEmployee = async (newEmployee: Employee) => {
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (res.ok) {
        const saved = await res.json();
        setEmployees((prev) => [saved, ...prev]);
      } else {
        setEmployees((prev) => [newEmployee, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add employee via API:", err);
      setEmployees((prev) => [newEmployee, ...prev]);
    }
  };

  // Remove individual employee with real backend sync
  const handleRemoveEmployee = async (id: string) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
      } else {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Failed to remove employee via API:", err);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Update an existing employee securely with real backend sync
  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    try {
      const res = await fetch(`/api/employees/${updatedEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee),
      });
      if (res.ok) {
        const saved = await res.json();
        setEmployees((prev) =>
          prev.map((e) => (e.id === saved.id ? saved : e))
        );
      } else {
        setEmployees((prev) =>
          prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
        );
      }
    } catch (err) {
      console.error("Failed to update employee via API:", err);
      setEmployees((prev) =>
        prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
      );
    }
  };

  // Toggle automation rules
  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  // Update integration api settings
  const handleUpdateCredentials = (cred: ApiCredentials) => {
    setApiCredentials(cred);
  };

  // Add messages inside active session
  const handleSendMessage = async (
    sessionId: string, 
    text: string, 
    sender: "user" | "emika" | "system",
    extraUpdates?: Partial<ChatSession>,
    extraMsgUpdates?: Partial<ChatMessage>
  ) => {
    let finalSessionToSync: ChatSession | null = null;
    
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const timestamp = new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
          });
          
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender,
            text,
            time: timestamp,
            ...extraMsgUpdates
          };

          const updated = {
            ...s,
            messages: [...s.messages, newMsg],
            ...extraUpdates
          };

          finalSessionToSync = updated;
          return updated;
        }
        return s;
      })
    );

    if (finalSessionToSync) {
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalSessionToSync)
        });
      } catch (err) {
        console.error("Failed to sync message to server:", err);
      }
    }
  };

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatForm, setNewChatForm] = useState({
    name: "",
    project: "",
    matricula: "",
    cpf: "",
    email: ""
  });
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(0);

  const presetCollaborators = [
    {
      name: "Davi Lima",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      project: "Hub de Inovação",
      matricula: "MAT-559218",
      cpf: "123.456.789-00",
      email: "davi.lima@mk9trade.com"
    },
    {
      name: "Mariana Souza",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      project: "Operação Delta",
      matricula: "MAT-773210",
      cpf: "456.789.012-33",
      email: "mariana.souza@mk9trade.com"
    },
    {
      name: "Gustavo Henrique",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      project: "Logística Setorial",
      matricula: "MAT-110294",
      cpf: "987.654.321-22",
      email: "gustavo.henrique@mk9trade.com"
    },
    {
      name: "Ana Paula",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      project: "Mercado e Trade",
      matricula: "MAT-884129",
      cpf: "321.654.987-11",
      email: "ana.paula@mk9trade.com"
    }
  ];

  // Nova Conversa creation setup
  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleStartCustomChat = async (sessionData: {
    name: string;
    avatar: string;
    project: string;
    matricula: string;
    cpf: string;
    email: string;
  }) => {
    const uniqueId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: uniqueId,
      name: sessionData.name,
      avatar: sessionData.avatar,
      status: "Aguardando CPF",
      statusLabel: "Status: Aguardando consentimento legal",
      project: sessionData.project,
      matricula: sessionData.matricula,
      cpf: sessionData.cpf,
      email: sessionData.email,
      lgpdState: null, // trigger interactive flow
      messages: [
        {
          id: "msg-init",
          sender: "emika",
          text: `Olá! Como vai? 😊 Eu sou a Emika, assistente virtual do RH da MK9TRADE.\n\nPor favor, envie qualquer mensagem para iniciarmos nossa conversa e validarmos suas permissões LGPD!`,
          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        }
      ]
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveTab("inbox");
    setShowNewChatModal(false);

    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession)
      });
    } catch (err) {
      console.error("Failed to create new session on server:", err);
    }
  };

  const executeStartChat = () => {
    if (activePresetIndex !== null) {
      const selected = presetCollaborators[activePresetIndex];
      handleStartCustomChat(selected);
    } else {
      if (!newChatForm.name.trim()) {
        alert("Por favor, informe pelo menos o nome do colaborador.");
        return;
      }
      handleStartCustomChat({
        name: newChatForm.name,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        project: newChatForm.project || "Geral",
        matricula: newChatForm.matricula || `#MAT-${Math.floor(Math.random() * 900000 + 100000)}`,
        cpf: newChatForm.cpf || "000.000.000-00",
        email: newChatForm.email || `${newChatForm.name.toLowerCase().replace(/\s+/g, ".")}@mk9trade.com`
      });
      // Reset form
      setNewChatForm({
        name: "",
        project: "",
        matricula: "",
        cpf: "",
        email: ""
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fd] flex overflow-hidden">
      {/* Sidebar - Fixate Left (with mobile translation overlay controls) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main viewport Container (responsive left padding offset) */}
      <div className="flex-1 h-screen relative pl-0 lg:pl-[280px] pt-16 flex flex-col overflow-hidden">
        {/* Top Header Section */}
        <Header
          onHumanAttentionClick={handleHumanAttentionClick}
          activeTab={activeTab}
          profile={profile}
          onUpdateProfile={setProfile}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Stateful Page Views with slide-in scale animation effects */}
        <main className={`w-full max-w-7xl mx-auto min-h-0 ${
          activeTab === "inbox"
            ? "h-[calc(100vh-64px)] p-4 lg:p-6 flex flex-col overflow-hidden"
            : "p-6 overflow-y-auto h-[calc(100vh-64px)]"
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={activeTab === "inbox" ? "h-full flex flex-col min-h-0 overflow-hidden" : "h-full"}
            >
              {activeTab === "dashboard" && (
                <DashboardView
                  alerts={alerts}
                  onSolveAlert={handleSolveAlert}
                  onNavigateToChat={handleNavigateToChat}
                  sessions={sessions}
                />
              )}

              {activeTab === "inbox" && (
                <InboxView
                  sessions={sessions}
                  onSendMessage={handleSendMessage}
                  onNewSession={handleNewChat}
                  apiCredentials={apiCredentials}
                  employees={employees}
                />
              )}

              {activeTab === "colaboradores" && (
                <ColaboradoresView
                  employees={employees}
                  onAddEmployee={handleAddEmployee}
                  onRemoveEmployee={handleRemoveEmployee}
                  onNavigateToChat={handleNavigateToChat}
                  onUpdateEmployee={handleUpdateEmployee}
                />
              )}

              {activeTab === "relatorios" && <RelatoriosView />}

              {activeTab === "configuracoes" && (
                <ConfiguracoesView
                  rules={rules}
                  onToggleRule={handleToggleRule}
                  apiCredentials={apiCredentials}
                  onUpdateCredentials={handleUpdateCredentials}
                  botAvatar={botAvatar}
                  onUpdateBotAvatar={setBotAvatar}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modal Nova Conversa */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewChatModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 bg-[#00a884] text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold font-sans">Simular Nova Conversa (WhatsApp)</h3>
                  <p className="text-xs text-teal-100 mt-1">Crie um novo contato simulado recebendo mensagem na Caixa de Entrada</p>
                </div>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="text-teal-50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50 p-1">
                <button
                  onClick={() => setActivePresetIndex(0)}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all text-center cursor-pointer ${
                    activePresetIndex !== null
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Colaboradores Sugeridos
                </button>
                <button
                  onClick={() => {
                    setActivePresetIndex(null);
                  }}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all text-center cursor-pointer ${
                    activePresetIndex === null
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Inserir Manualmente (Custom)
                </button>
              </div>

              {/* Content body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {activePresetIndex !== null ? (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Selecione uma persona para teste:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {presetCollaborators.map((pc, idx) => (
                        <div
                          key={pc.name}
                          onClick={() => setActivePresetIndex(idx)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                            activePresetIndex === idx
                              ? "border-[#00a884] bg-teal-50/20"
                              : "border-gray-100 hover:border-gray-200 bg-white"
                          }`}
                        >
                          <img
                            src={pc.avatar}
                            alt={pc.name}
                            className={`w-12 h-12 rounded-full object-cover border-2 ${
                              activePresetIndex === idx ? "border-[#00a884]" : "border-gray-100"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm truncate">{pc.name}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{pc.project}</p>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500 font-mono">
                              <span>CPF: {pc.cpf}</span>
                              <span className="text-gray-300">•</span>
                              <span>{pc.matricula}</span>
                            </div>
                          </div>
                          {activePresetIndex === idx && (
                            <div className="w-5 h-5 rounded-full bg-[#00a884] text-white flex items-center justify-center">
                              <span className="material-symbols-outlined !text-xs">check</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Informe os dados cadastrais do novo colaborador:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Nome Completo</label>
                        <input
                          type="text"
                          placeholder="Ex: Roberto Carlos da Silva"
                          value={newChatForm.name}
                          onChange={(e) => setNewChatForm({ ...newChatForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00a884]/20 focus:border-[#00a884] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Projeto / Setor</label>
                        <input
                          type="text"
                          placeholder="Ex: Operação Trade Nordeste"
                          value={newChatForm.project}
                          onChange={(e) => setNewChatForm({ ...newChatForm, project: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00a884]/20 focus:border-[#00a884] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">C.P.F. (Para simulação de LGPD)</label>
                        <input
                          type="text"
                          placeholder="Ex: 999.999.999-99"
                          value={newChatForm.cpf}
                          onChange={(e) => setNewChatForm({ ...newChatForm, cpf: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00a884]/20 focus:border-[#00a884] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Matrícula Corporativa</label>
                        <input
                          type="text"
                          placeholder="Ex: MAT-102930"
                          value={newChatForm.matricula}
                          onChange={(e) => setNewChatForm({ ...newChatForm, matricula: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00a884]/20 focus:border-[#00a884] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">E-mail Corporativo</label>
                      <input
                        type="email"
                        placeholder="Ex: roberto.silva@mk9trade.com"
                        value={newChatForm.email}
                        onChange={(e) => setNewChatForm({ ...newChatForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00a884]/20 focus:border-[#00a884] text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-500 uppercase hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeStartChat}
                  className="px-6 py-2.5 bg-[#00a884] hover:bg-[#009172] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00a884]/20 uppercase"
                >
                  <span className="material-symbols-outlined !text-sm">chat</span>
                  <span>Iniciar Conversa Simulada</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
