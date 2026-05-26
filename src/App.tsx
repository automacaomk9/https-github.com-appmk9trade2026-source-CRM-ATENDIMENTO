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
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("mk9_employees");
    return saved ? JSON.parse(saved) : initialEmployees;
  });
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem("mk9_alerts");
    return saved ? JSON.parse(saved) : initialAlerts;
  });
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("mk9_sessions");
    return saved ? JSON.parse(saved) : initialChats;
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
  const handleSolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  // Navigate directly to a specific chat session (e.g. from alert dashboard)
  const handleNavigateToChat = (chatId: string) => {
    setActiveTab("inbox");
  };

  // Add new employee to the database list
  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees((prev) => [newEmployee, ...prev]);
  };

  // Remove individual employee
  const handleRemoveEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  // Update an existing employee securely
  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
    );
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
  const handleSendMessage = (
    sessionId: string, 
    text: string, 
    sender: "user" | "emika" | "system",
    extraUpdates?: Partial<ChatSession>
  ) => {
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
            time: timestamp
          };

          return {
            ...s,
            messages: [...s.messages, newMsg],
            ...extraUpdates
          };
        }
        return s;
      })
    );
  };

  // Nova Conversa creation setup
  const handleNewChat = () => {
    const uniqueId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: uniqueId,
      name: "Davi Lima",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      status: "Aguardando CPF",
      statusLabel: "Status: Aguardando consentimento legal",
      project: "Hub de Inovação",
      matricula: "#5592",
      cpf: "123.456.789-00",
      email: "davi.lima@mk9trade.com",
      lgpdState: null, // trigger interactive flow
      messages: [
        {
          id: "msg-init",
          sender: "emika",
          text: "Olá! Como vai? 😊 Eu sou a Emika, assistente virtual do RH da MK9TRADE.\n\nPor favor, envie qualquer mensagem para iniciarmos nossa conversa e validarmos suas permissões LGPD!",
          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        }
      ]
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveTab("inbox");
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
      <div className="flex-1 min-h-screen relative pl-0 lg:pl-[280px] pt-16 overflow-hidden">
        {/* Top Header Section */}
        <Header
          onHumanAttentionClick={handleHumanAttentionClick}
          activeTab={activeTab}
          profile={profile}
          onUpdateProfile={setProfile}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Stateful Page Views with slide-in scale animation effects */}
        <main className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full"
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
    </div>
  );
}
