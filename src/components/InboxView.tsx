import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, Clock, Search, MoreVertical, Play, Paperclip, Smile, Send, Folder, UserCheck, HardDrive, Cpu, AlertTriangle } from "lucide-react";
import { ChatSession, ChatMessage, ApiCredentials, Employee } from "../types";

interface InboxViewProps {
  sessions: ChatSession[];
  onSendMessage: (
    sessionId: string, 
    text: string, 
    sender: "user" | "emika" | "system",
    extraUpdates?: Partial<ChatSession>
  ) => void;
  onNewSession: (session: ChatSession) => void;
  apiCredentials?: ApiCredentials;
  employees?: Employee[];
}

export default function InboxView({ 
  sessions, 
  onSendMessage, 
  onNewSession,
  apiCredentials,
  employees = []
}: InboxViewProps) {
  const [activeSessionId, setActiveSessionId] = useState<string>("session-1");
  const [replyText, setReplyText] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(33);
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto-scroll chats to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isLoadingReply]);

  // Audio player interval simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handleSendAsAgent = async () => {
    if (!replyText.trim()) return;
    const textToSend = replyText;
    setReplyText("");

    // 1. Append message as User (or Agent simulated reply)
    onSendMessage(activeSessionId, textToSend, "user");

    // Let's implement the stateful Emika AI / LGPD flowchart logic in frontend OR proxy to Gemini!
    setIsLoadingReply(true);

    // Simulate system delays for human realistic Q&A
    setTimeout(async () => {
      let emikaReply = "";
      let updatedLgpdState = activeSession.lgpdState;
      let tempName = activeSession.tempName || "";
      let tempCPF = activeSession.tempCPF || "";

      const msgLower = textToSend.toLowerCase().trim();

      // --- LGPD STATE MACHINE LOGIC (Frontend n8n Simulator) ---
      if (activeSession.lgpdState === null) {
        emikaReply = "Olá! Como vai? 😊 Eu sou a Emika, assistente virtual do RH da MK9TRADE. Como posso te chamar?";
        updatedLgpdState = "waiting_name";
      } 
      else if (activeSession.lgpdState === "waiting_name") {
        tempName = textToSend.split(" ")[0];
        emikaReply = `Prazer, ${tempName}! 💛 Conforme a LGPD (Lei Geral de Proteção de Dados), preciso da sua autorização para acessar suas informações corporativas de folha e benefícios de forma segura.\n\nVocê autoriza? Responda "Sim" para autorizar ou "Não" para encerrar.`;
        updatedLgpdState = "waiting_auth";
      } 
      else if (activeSession.lgpdState === "waiting_auth") {
        if (msgLower.includes("sim") || msgLower.includes("autorizo") || msgLower.includes("aceito") || msgLower.includes("s")) {
          emikaReply = "Autorização registrada e segura! ✅\n\nAgora, por favor, informe seu CPF de cadastro (somente os 11 dígitos, sem pontos ou traços):";
          updatedLgpdState = "waiting_cpf";
        } else {
          emikaReply = "Entendido. Sem o consentimento LGPD, não consigo acessar suas informações confidenciais automaticamente de folha de pagamento.\n\nSe precisar de ajuda manual, acione nossa equipe pelo chamado de suporte. Até logo! 🙏";
          updatedLgpdState = null;
        }
      } 
      else if (activeSession.lgpdState === "waiting_cpf") {
        const cleanCpf = textToSend.replace(/\D/g, "");
        if (cleanCpf.length !== 11) {
          emikaReply = "Hmm, não consegui identificar um CPF com 11 dígitos válidos. 🤔 Por favor, envie seu CPF contendo todos os números:";
        } else {
          // Look up employee by CPF dynamically in the database
          const matchedEmployee = employees.find(e => e.cpf.replace(/\D/g, "") === cleanCpf || cleanCpf === "12345678900");
          if (matchedEmployee) {
            tempCPF = cleanCpf;
            emikaReply = `Cadastro localizado com sucesso! 😊\n\n👤 **Nome:** ${matchedEmployee.name}\n📋 **Matrícula:** ${matchedEmployee.matricula}\n🏢 **Projeto Ativo:** ${matchedEmployee.project}\n\nEsses dados pertencem a você e estão corretos? Responda "Sim" ou "Não".`;
            updatedLgpdState = "waiting_confirm";
          } else {
            emikaReply = "Hmm, não localizei nenhum colaborador ativo na MK9TRADE com esse CPF. 😔 Por favor, digite novamente seu CPF ou me explique sua situação:";
          }
        }
      } 
      else if (activeSession.lgpdState === "waiting_confirm") {
        if (msgLower.includes("sim") || msgLower.includes("s") || msgLower.includes("correto") || msgLower.includes("confirmar")) {
          emikaReply = "Ótimo, identidade confirmada por autenticação LGPD! 🎉\n\nDigite o número do assunto de RH que você quer consultar:\n\n1️⃣ **INSS** (Afastamentos)\n2️⃣ **FGTS** (Multas e Saques)\n3️⃣ **FÉRIAS** (Agendamentos e Remuneração)\n4️⃣ **BENEFÍCIOS** (VA, VR, Odonto Bradesco)\n5️⃣ **RESCISÃO** (Verbas e Prazos)\n6️⃣ **SALÁRIO** (Descontos e Contrachenque)\n\nMe responda com o número e eu puxo no sistema! 😊";
          updatedLgpdState = "verified";
        } else {
          emikaReply = "Tudo bem, vamos redefinir. Por favor, digite seu CPF correto (somente os 11 números) para nova consulta:";
          updatedLgpdState = "waiting_cpf";
        }
      } 
      else {
        // --- CHAT VERIFIED: QUERY THE SUBAGENTS OR CONNECT TO THE REAL API ENDPOINT ---
        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: textToSend,
              history: activeSession.messages,
              customApiKey: apiCredentials?.apiKey,
              employeeContext: {
                name: activeSession.name,
                matricula: activeSession.matricula,
                project: activeSession.project,
                cpf: activeSession.cpf,
                email: activeSession.email
              }
            })
          });
          const data = await response.json();
          emikaReply = data.text;
        } catch (err) {
          console.error("Error fetching Gemini chat, falling back to offline simulation:", err);
          // Standard mock subagent selection
          if (msgLower === "1" || msgLower.includes("inss")) {
            emikaReply = "**[Especialista INSS]** 📋\n\n• **Afastamento:** Os primeiros 15 dias são de responsabilidade da MK9. A partir do 16º dia, o afastamento e o salário passam a ser segurados pelo INSS.\n• **Documentos:** Envie o atestado com código CID assinado pelo médico ao DP para agendar perícia.";
          } else if (msgLower === "2" || msgLower.includes("fgts")) {
            emikaReply = "**[Auditor de FGTS]** 💰\n\n• **Saque-Rescisão:** Liberado após rescisão sem justa causa. O depósito rescisório serve como chave padrão de saque.\n• **Extrato:** Visualize no aplicativo FGTS da Caixa.";
          } else if (msgLower === "3" || msgLower.includes("férias") || msgLower.includes("ferias")) {
            emikaReply = "**[Férias e Concessões]** 🏖️\n\n• **Período Aquisitivo:** Completa após 12 meses de trabalho.\n• **Abono Pecuniário:** Possibilidade de vender 10 dias, deve solicitar com 15 dias de antecedência.";
          } else if (msgLower === "4" || msgLower.includes("benefício") || msgLower.includes("beneficios")) {
            emikaReply = "**[Saúde e Benefícios]** 🍽️\n\n• **VA/VR:** Dividido quinzenalmente o crédito no cartão Alelo.\n• **Plano de Saúde/Odonto:** Bradesco Odontológico está disponível gratuitamente após os 90 dias regulamentares de experiência.";
          } else {
            emikaReply = "Entendi sua dúvida. Como assistente virtual do RH, gostaria de ajudar você com suas dúvidas trabalhistas. Se precisar de ajuda manual, acione nossa equipe!";
          }
        }
      }

      // 2. Append Emika reply and update session settings in an immutable way
      const isVerified = updatedLgpdState === "verified";
      onSendMessage(activeSessionId, emikaReply, "emika", {
        lgpdState: updatedLgpdState,
        tempName,
        tempCPF,
        status: isVerified ? "LGPD Verificada" : (updatedLgpdState === null ? "Aguardando CPF" : "Aguardando CPF"),
        statusLabel: isVerified ? "LGPD Verificada" : (updatedLgpdState === null ? "Status: Aguardando consentimento legal" : "Status: Iniciando Verificação")
      });

      setIsLoadingReply(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm font-sans">
      {/* Left Column: Conversational Sessions List */}
      <section className="w-80 border-r border-gray-200 bg-[#f8f9fd] flex flex-col">
        <header className="p-4 border-b border-gray-200 bg-white">
          <h2 className="font-bold text-lg text-secondary">Mensagens</h2>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-wider">
            Conversas Ativas da Emika
          </p>
        </header>

        <div className="flex-grow overflow-y-auto divide-y divide-gray-100 chat-scrollbar">
          {sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            const lastMessage = s.messages[s.messages.length - 1];

            // Badge styling
            let badgeStyle = "bg-primary/10 text-primary";
            let BadgeIcon = Clock;

            if (s.status === "Atenção Humana") {
              badgeStyle = "bg-red-50 text-red-600 border border-red-100";
              BadgeIcon = AlertCircle;
            } else if (s.status === "LGPD Verificada") {
              badgeStyle = "bg-teal-50 text-teal-600 border border-teal-100";
              BadgeIcon = CheckCircle;
            }

            return (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`p-4 cursor-pointer transition-all duration-150 relative ${
                  isActive
                    ? "bg-blue-50/60 border-l-4 border-secondary"
                    : "hover:bg-gray-100 bg-white"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-gray-800">{s.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono font-medium">
                    {lastMessage ? lastMessage.time : "14:02"}
                  </span>
                </div>
                
                {/* Latested messages */}
                <p className="text-xs text-gray-500 line-clamp-1 mb-2 font-medium">
                  {lastMessage?.isAudio 
                    ? "🎤 Áudio transcrito: " + lastMessage.transcription 
                    : lastMessage?.text}
                </p>

                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full w-fit ${badgeStyle}`}>
                  <BadgeIcon size={12} className="mt-0.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider font-mono">
                    {s.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right Column Stack: Selected Interactive Conversation Pane */}
      <section className="flex-grow flex flex-col bg-[#f0f2f5] overflow-hidden justify-between">
        {/* Chat Pane Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shadow-sm">
              <img
                src={activeSession.avatar}
                alt={activeSession.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-sm text-secondary leading-tight">{activeSession.name}</p>
              <p className="text-[10px] text-[#006BA6] font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                <span>{activeSession.statusLabel}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
              <Search size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        </header>

        {/* Messaging Area */}
        <div className="flex-grow p-6 overflow-y-auto chat-scrollbar flex flex-col gap-4">
          {activeSession.messages.map((m) => {
            if (m.sender === "system") {
              return (
                <div key={m.id} className="flex justify-center my-3 animate-in fade-in zoom-in duration-300">
                  <div className="bg-secondary/10 text-secondary border border-secondary/25 px-4 py-2 rounded-full flex items-center gap-2 max-w-lg shadow-sm">
                    <span className="material-symbols-outlined !text-sm">engineering</span>
                    <p className="text-[10px] sm:text-xs font-bold font-mono tracking-tight leading-none uppercase">
                      {m.text}
                    </p>
                  </div>
                </div>
              );
            }

            const isMe = m.sender === "user";

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] ${
                  isMe ? "self-end" : "self-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`p-3.5 rounded-xl shadow-sm border border-gray-200 relative ${
                    isMe
                      ? "bg-whatsapp-green text-white rounded-tr-none hover:shadow"
                      : "bg-white text-gray-800 rounded-tl-none hover:shadow"
                  }`}
                >
                  {/* Speaker name */}
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-[#009cde] font-mono text-[9px] font-bold uppercase tracking-widest leading-none">
                      <span>✨</span>
                      <span>Emika AI</span>
                    </div>
                  )}

                  {/* Audio Player formatting if message contains audio */}
                  {m.isAudio ? (
                    <div className="space-y-2 text-white">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer"
                        >
                          {isPlayingAudio ? (
                            <span className="material-symbols-outlined !text-sm animate-ping">pause</span>
                          ) : (
                            <Play size={14} fill="white" className="ml-0.5" />
                          )}
                        </button>
                        <div className="h-1 w-28 bg-white/30 rounded-full overflow-hidden relative">
                          <div
                            className="bg-white h-full transition-all duration-300"
                            style={{ width: `${audioProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono opacity-80">{m.audioDuration}</span>
                      </div>
                      
                      {/* Transcription block */}
                      <div className="bg-black/10 rounded-lg p-2.5 border border-white/10">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-white/90 font-mono">
                          Transcrição automática n8n
                        </p>
                        <p className="text-xs italic text-white/95 mt-1">
                          "{m.transcription}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-sans leading-relaxed whitespace-pre-line">{m.text}</p>
                  )}

                  <p
                    className={`text-[9px] mt-1.5 text-right font-mono italic leading-none block ${
                      isMe ? "text-white/60" : "text-gray-400"
                    }`}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Sparkly simulated loader when Emika is thinking */}
          {isLoadingReply && (
            <div className="flex items-start gap-2.5 max-w-[80%] self-start animate-pulse">
              <div className="bg-white text-gray-700 p-3 rounded-xl rounded-tl-none border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-primary font-mono text-[9px] font-bold uppercase tracking-widest leading-none">
                  <span className="animate-spin text-xs">✨</span>
                  <span>Emika está digitando...</span>
                </div>
                <div className="flex gap-1 mt-2.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* Messaging footer input area */}
        <footer className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-secondary transition-all">
            <button className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendAsAgent();
              }}
              placeholder={activeSession.lgpdState === "verified" ? "Pergunte sobre INSS, Férias, FGTS, Salário..." : "Responda a Emika..."}
              className="flex-grow bg-transparent border-none text-sm text-gray-800 placeholder-gray-400 font-sans focus:outline-none focus:ring-0"
            />
            <button className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
              <Smile size={18} />
            </button>
            <button
              onClick={handleSendAsAgent}
              disabled={!replyText.trim()}
              className={`p-2 rounded-lg text-white transition-all cursor-pointer ${
                replyText.trim()
                  ? "bg-secondary hover:bg-secondary/90 active:scale-95 shadow-md"
                  : "bg-gray-300 cursor-not-allowed opacity-60"
              }`}
            >
              <Send size={14} className="mt-0.5 ml-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono font-medium px-1 mt-1.5">
            <span>Conversando com {activeSession.name}</span>
            <span>Fluxo de transbordo ativo</span>
          </div>
        </footer>
      </section>

      {/* Rightmost Context Details Sidebar */}
      <aside className="w-72 bg-white border-l border-gray-200 flex flex-col justify-between h-full shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 font-mono tracking-widest uppercase mb-4">
            Detalhes do Contexto
          </h3>
          
          <div className="space-y-4">
            {/* Matrícula Card */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center sm:block">
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-0.5">Matrícula</p>
              <p className="text-lg font-bold text-primary font-mono">{activeSession.matricula}</p>
            </div>

            {/* Active Project */}
            <div>
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Projeto Ativo</p>
              <div className="flex items-center gap-2 bg-blue-50/50 p-2 border border-blue-50 rounded-lg">
                <div className="w-6 h-6 rounded bg-primary text-[10px] text-white font-bold flex items-center justify-center font-mono">
                  {activeSession.project ? activeSession.project.charAt(0) : "A"}
                </div>
                <p className="text-xs font-bold text-gray-800">{activeSession.project || "Geral"}</p>
              </div>
            </div>

            {/* Verification Status */}
            <div>
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Status de Verificação</p>
              <div className="flex items-center gap-2 text-primary bg-primary/5 p-2 rounded-lg border border-primary/10">
                <span className="material-symbols-outlined !text-sm">verified_user</span>
                <p className="text-[10px] font-mono font-bold uppercase tracking-tight">
                  {activeSession.lgpdState === "verified" ? "CPF Verificado" : "PENDENTE DE ACEITE"}
                </p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Recent Logs list */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase">Logs Recentes do Sistema</h4>
              
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <div>
                  <p className="text-xs font-bold text-gray-700 leading-tight">Solicitação de Holerite</p>
                  <p className="text-[9px] text-gray-400 font-mono mt-0.5">Acionado por Áudio n8n</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5"></div>
                <div>
                  <p className="text-xs font-bold text-gray-700 leading-tight">Transbordo para Humano</p>
                  <p className="text-[9px] text-gray-400 font-mono mt-0.5">Agente Atribuído: {activeSession.name === "Felipe S." ? "Ricardo S. / Lucas M." : "Vago"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Open employee dossier dociary */}
        <div className="p-5">
          <button
            onClick={() => alert(`Pasta completa do colaborador (${activeSession.name}) exportada para visualização.`)}
            className="w-full py-3 px-4 border-2 border-primary hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-50"
          >
            <Folder size={16} />
            <span>Pasta do Funcionário</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
