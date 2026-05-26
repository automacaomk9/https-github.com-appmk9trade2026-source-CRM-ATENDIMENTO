import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, Clock, Search, MoreVertical, Play, Paperclip, Smile, Send, Folder, UserCheck, HardDrive, Cpu, AlertTriangle } from "lucide-react";
import { ChatSession, ChatMessage, ApiCredentials, Employee } from "../types";

interface InboxViewProps {
  sessions: ChatSession[];
  onSendMessage: (
    sessionId: string, 
    text: string, 
    sender: "user" | "emika" | "system",
    extraUpdates?: Partial<ChatSession>,
    extraMsgUpdates?: Partial<ChatMessage>
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

  // Keyboard, Emojis, Audio simulator and file drag state definitions
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<any>(null);

  useEffect(() => {
    if (isRecordingAudio) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecordingAudio]);

  const formatRecordingTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

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

  if (sessions.length === 0) {
    return (
      <div className="flex h-full w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm font-sans items-center justify-center">
        <div className="text-center p-10 max-w-md space-y-4">
          <div className="w-16 h-16 bg-[#e8fbf3] text-[#00a884] rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
            <span className="material-symbols-outlined !text-4xl">chat</span>
          </div>
          <h3 className="text-xl font-bold text-secondary">Nenhuma Conversa Ativa</h3>
          <p className="text-sm text-gray-400">
            O canal de WhatsApp está limpo de mensagens. Aguardando novo contato de colaborador ou inicie um simulado abaixo.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNewSession && onNewSession({} as any)}
              className="px-5 py-2.5 bg-[#00a884] hover:bg-[#008f70] text-white text-xs font-bold rounded-lg cursor-pointer shadow-md shadow-[#00a884]/20 uppercase transition-all"
            >
              Simular Novo Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file size to human readable
    const sizeKB = (file.size / 1024).toFixed(1);
    const labelSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${sizeKB} KB`;

    setSelectedFile({
      name: file.name,
      size: labelSize,
      type: file.name.split(".").pop() || "doc"
    });
  };

  const handleSendAudioFile = (seconds: number) => {
    if (seconds <= 0) return;
    
    const randomTranscripts = [
      "Oi, preciso de ajuda com o meu informe de rendimentos para o Imposto de Renda.",
      "Gostaria de agendar as minhas férias para o mês que vem, como funciona?",
      "O meu vale alimentação não caiu na data certa. Pode verificar meu saldo?",
      "Desejo saber qual é o prazo para homologação de rescisão no meu setor."
    ];
    
    const transcription = randomTranscripts[Math.floor(Math.random() * randomTranscripts.length)];
    const durationLabel = formatRecordingTime(seconds);

    onSendMessage(activeSessionId, `🎙️ Áudio gravado (${durationLabel})`, "user", {}, {
      isAudio: true,
      audioDuration: durationLabel,
      transcription: transcription
    });

    setIsRecordingAudio(false);
    setRecordingSeconds(0);

    // Prompt Emika AI to auto-reply to the transcription!
    setIsLoadingReply(true);
    setTimeout(async () => {
      let emikaReply = "";
      const msgLower = transcription.toLowerCase();
      
      if (msgLower.includes("férias") || msgLower.includes("ferias")) {
        emikaReply = "Perfeito! Conforme seu áudio, identifiquei interesse sobre **FÉRIAS (Opção 3)**. 🏖️\n\nPelo sistema da MK9, você já possui 1 período aquisitivo completo! Seu saldo disponível é de 30 dias.\n\nVocê gostaria de solicitar o adiantamento de 1/3 das férias ou dividir em 2 períodos?";
      } else if (msgLower.includes("rendimentos") || msgLower.includes("imposto")) {
        emikaReply = "Olá! Identifiquei sua dúvida sobre **Informe de Rendimentos**. 📄\n\nTodos os informes de rendimentos anuais MK9 estão arquivados na pasta digital e foram disparados para seu e-mail corporativo.\n\nVocê deseja que eu reenvie a folha atual para seu e-mail cadastrado?";
      } else if (msgLower.includes("alimentação") || msgLower.includes("alimentacao") || msgLower.includes("vale")) {
        emikaReply = "Compreendido! Questões sobre **Benefícios (Opção 4)**. 🍽️\n\nO crédito do VA/VR Alelo é programado sempre no 1º dia útil de cada mês. No seu extrato, consta que o lote foi deferido com sucesso.\n\nRecomendo verificar diretamente no aplicativo Alelo.";
      } else {
        emikaReply = `Entendi perfeitamente sua mensagem de voZ! 🎙️\n\nVocê perguntou: *"${transcription}"*\n\nComo posso te auxiliar sobre esse assunto para seu cadastro ativo?`;
      }

      onSendMessage(activeSessionId, emikaReply, "emika");
      setIsLoadingReply(false);
    }, 1800);
  };

  const handleSendAsAgent = async () => {
    if (!replyText.trim() && !selectedFile) return;
    
    const textToSend = replyText;
    const fileToSend = selectedFile;

    setReplyText("");
    setSelectedFile(null);
    setShowEmojiPicker(false);

    if (fileToSend) {
      // Send message containing file metadata
      onSendMessage(activeSessionId, textToSend || `Enviei o arquivo: ${fileToSend.name}`, "user", {}, {
        isFile: true,
        fileName: fileToSend.name,
        fileSize: fileToSend.size,
        fileType: fileToSend.type
      });

      // Emika reacts smartly to the uploaded file!
      setIsLoadingReply(true);
      setTimeout(() => {
        let reaction = "";
        const nameLower = fileToSend.name.toLowerCase();
        if (nameLower.includes("pdf") || nameLower.includes("contracheque") || nameLower.includes("atestado")) {
          reaction = `Recebi seu documento **${fileToSend.name}** (${fileToSend.size}) com sucesso! 📁\n\nJá encaminhei para a fila automatizada do DP da MK9TRADE via Workflow n8n. Deseja registrar alguma observação extra sobre esse envio?`;
        } else {
          reaction = `Arquivo **${fileToSend.name}** anexado à conversa de RH com sucesso! 📎\n\nNossa assistente e equipe analisaram os metadados. Deseja realizar mais alguma consulta?`;
        }
        onSendMessage(activeSessionId, reaction, "emika");
        setIsLoadingReply(false);
      }, 1800);

      return;
    }

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
              provider: apiCredentials?.provider,
              modelName: apiCredentials?.modelName,
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
    <div className="flex h-full w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm font-sans">
      {/* Left Column: Conversational Sessions List styled like WhatsApp Desktop */}
      <section className="w-80 border-r border-gray-200 bg-white flex flex-col">
        {/* Sidebar Header */}
        <header className="p-3 bg-[#f0f2f5] border-b border-gray-200/60 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#00a884]/20 text-[#00a884] flex items-center justify-center font-bold text-xs uppercase shadow-inner">
              MK
            </div>
            <div>
              <h2 className="font-bold text-xs text-[#111b21] leading-none mb-0.5">WhatsApp Web</h2>
              <p className="text-[10px] text-gray-500 font-medium">Controle de Conversas</p>
            </div>
          </div>
          <div className="flex gap-2 text-gray-500 items-center">
            <button className="material-symbols-outlined !text-lg text-gray-600 hover:text-gray-800 cursor-pointer">chat</button>
            <button className="p-1 hover:bg-gray-200 rounded-full cursor-pointer text-gray-600">
              <MoreVertical size={16} />
            </button>
          </div>
        </header>

        {/* Search input - Exactly matches WhatsApp screenshot style */}
        <div className="p-2 bg-white border-b border-gray-150">
          <div className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-1.5 rounded-lg border border-gray-100">
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              placeholder="Pesquisar ou começar uma nova conversa"
              className="w-full bg-transparent border-none text-[12px] text-gray-700 placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters / Tab row */}
        <div className="px-3 py-2 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto select-none">
          <button className="bg-[#e8fbf3] text-[#00a884] font-semibold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            Tudo
          </button>
          <button className="bg-gray-100 text-gray-500 hover:bg-gray-200 font-semibold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            Não Lidas
          </button>
          <button className="bg-gray-100 text-gray-500 hover:bg-gray-200 font-semibold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            Favoritas
          </button>
        </div>

        {/* Conversational Sessions List */}
        <div className="flex-grow overflow-y-auto divide-y divide-gray-100 chat-scrollbar bg-white">
          {sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            const lastMessage = s.messages[s.messages.length - 1];

            return (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`px-4 py-3 cursor-pointer transition-all flex items-center gap-3 relative ${
                  isActive
                    ? "bg-[#f0f2f5]"
                    : "hover:bg-gray-50 bg-white"
                }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 relative">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    s.status === "LGPD Verificada" ? "bg-[#25d366]" : "bg-[#f3a83b]"
                  }`} />
                </div>

                <div className="flex-grow overflow-hidden">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-xs text-[#111b21] truncate">{s.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                      {lastMessage ? lastMessage.time : "14:02"}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 line-clamp-1 truncate font-sans text-ellipsis overflow-hidden">
                    {lastMessage?.isAudio 
                      ? "🎤 Áudio gravado transcrito" 
                      : lastMessage?.text}
                  </p>
                </div>

                {/* Status Badges on the right of the chat list */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {s.status === "Atenção Humana" ? (
                    <span className="bg-[#fff3cd] text-[#b45309] font-bold text-[8.5px] px-1.5 py-0.5 rounded uppercase tracking-wider font-mono border border-[#ffeeba]">
                      Transbordo
                    </span>
                  ) : s.status === "LGPD Verificada" ? (
                    <span className="bg-[#e8fbf3] text-[#00a884] font-bold text-[8.5px] px-1.5 py-0.5 rounded uppercase tracking-wider font-mono border border-[#c3e6cb]">
                      LGPD OK
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 font-bold text-[8.5px] px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                      Aguardando
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right Column Pane: Active WhatsApp Conversation Window with Custom Tile Pattern Wallpaper */}
      <section className="flex-grow flex flex-col bg-[#efeae2] overflow-hidden justify-between relative">
        {/* Chat Pane Header */}
        <header className="h-14 flex items-center justify-between px-4 bg-[#f0f2f5] border-b border-gray-200/80 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shadow-sm">
              <img
                src={activeSession.avatar}
                alt={activeSession.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-[13px] text-[#111b21] leading-tight">{activeSession.name}</p>
              <p className="text-[10px] text-[#54656f] font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]"></span>
                <span className="lowercase">{activeSession.statusLabel || "online"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <button className="p-1.5 hover:bg-gray-200 rounded-full cursor-pointer transition-colors">
              <Search size={18} />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded-full cursor-pointer transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </header>

        {/* Messaging Area with realistic beige tiled wallpaper background */}
        {/* Drag and Drop Overlays */}
        <div 
          className={`flex-grow p-6 overflow-y-auto chat-scrollbar flex flex-col gap-3 relative transition-all duration-200 ${
            isDraggingOver ? "bg-[#efeae2]/40 ring-4 ring-[#00a884] ring-inset" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const sizeKB = (file.size / 1024).toFixed(1);
              const labelSize = file.size > 1024 * 1024 
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
                : `${sizeKB} KB`;
              setSelectedFile({
                name: file.name,
                size: labelSize,
                type: file.name.split(".").pop() || "doc"
              });
            }
          }}
          style={{
            backgroundColor: "#efeae2",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23e5ddd5' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm43-23c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-22 36c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0-36c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
          {activeSession.messages.map((m) => {
            if (m.sender === "system") {
              // Perfect WhatsApp yellow background system notification block
              return (
                <div key={m.id} className="flex justify-center my-2 animate-in fade-in zoom-in duration-300">
                  <div className="bg-[#ffeecd] text-[#54656f] text-[11px] font-sans px-3 py-1.5 rounded-lg shadow-sm text-center max-w-sm border border-[#ffe2a8]/30">
                    🔒 {m.text}
                  </div>
                </div>
              );
            }

            const isMe = m.sender === "user";

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? "items-end self-end" : "items-start self-start"} max-w-[65%] relative animate-in fade-in slide-in-from-bottom-1 duration-200`}
              >
                {/* Simulated WhatsApp bubble tails using absolute positioned exact curve SVGs */}
                {isMe ? (
                  <div className="absolute top-0 -right-1.5 w-2.5 h-3 overflow-hidden select-none">
                    <svg viewBox="0 0 8 13" className="w-2.5 h-3 fill-[#d9fdd3] text-[#d9fdd3]">
                      <path d="M6.467 3.568L0 12.018V0h8C7.659 0 7.39.1 7.159.34l-.692.682C5.654 1.825 4.979 2.594 6.466 3.568z"/>
                    </svg>
                  </div>
                ) : (
                  <div className="absolute top-0 -left-1.5 w-2.5 h-3 overflow-hidden select-none">
                    <svg viewBox="0 0 8 13" className="w-2.5 h-3 fill-white text-white">
                      <path d="M1.533 3.568L8 12.018V0H0c.341 0 .61.1.841.34l.692.682c.813.803 1.488 1.572.001 2.546z"/>
                    </svg>
                  </div>
                )}

                <div
                  className={`py-1.5 px-3 rounded-[7.5px] shadow-[0_1px_0.5px_rgba(11,20,26,.12)] relative ${
                    isMe
                      ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-none"
                      : "bg-white text-[#111b21] rounded-tl-none"
                  }`}
                >
                  {/* Speaker name/Identifier on top of Assistant response */}
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-[#00a884] font-sans text-[11px] font-bold tracking-wide leading-none">
                      <span>Emika AI</span>
                      <span className="text-[9px] px-1 py-0.2 bg-[#00a884]/10 rounded font-mono font-medium">Setor de RH</span>
                    </div>
                  )}

                   {/* File Attachment Card formatted if message contains file */}
                  {m.isFile ? (
                    <div className="space-y-2 mt-1 min-w-[240px]">
                      <div className="flex items-center gap-3 bg-white/60 p-2.5 rounded-lg border border-gray-100 flex-grow shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                        <div className="w-10 h-10 rounded bg-[#ffeecd] border border-[#ffd17d] text-[#b37400] flex items-center justify-center font-bold text-xs select-none uppercase font-mono shadow-sm">
                          {m.fileType || "doc"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate" title={m.fileName}>{m.fileName}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{m.fileSize}</p>
                        </div>
                        <button
                          onClick={() => alert(`Visualizando documento corporativo: ${m.fileName}`)}
                          className="w-8 h-8 rounded-full hover:bg-gray-100 text-[#00a884] flex items-center justify-center transition-all cursor-pointer active:scale-90"
                        >
                          <span className="material-symbols-outlined !text-base">download</span>
                        </button>
                      </div>
                      {m.text && m.text !== `Enviei o arquivo: ${m.fileName}` && (
                        <p className="text-[13.5px] font-sans text-[#111b21] leading-[18px] whitespace-pre-line break-words">{m.text}</p>
                      )}
                    </div>
                  ) : m.isAudio ? (
                    <div className="space-y-2 mt-1 min-w-[240px]">
                      <div className="flex items-center gap-3 bg-[#e8fbf3]/30 p-2 rounded-lg border border-teal-500/10">
                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center hover:bg-[#00a884]/90 transition-all cursor-pointer shadow-sm active:scale-90"
                        >
                          {isPlayingAudio ? (
                            <span className="material-symbols-outlined !text-base animate-pulse">pause</span>
                          ) : (
                            <Play size={14} fill="white" className="ml-0.5" />
                          )}
                        </button>
                        <div className="flex-grow">
                          <div className="h-1 bg-gray-200 rounded-full overflow-hidden relative">
                            <div
                              className="bg-[#00a884] h-full transition-all duration-300"
                              style={{ width: `${audioProgress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center mt-1 text-[9px] text-[#54656f] font-mono">
                            <span>transcrição automática n8n</span>
                            <span>{m.audioDuration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Transcription block */}
                      <div className="bg-gray-50/80 rounded border border-gray-100 p-2.5">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#006ba6] font-mono leading-none">
                          Transcrição automática de Áudio
                        </p>
                        <p className="text-[12px] italic text-[#3b3b3b] mt-1.5 font-sans leading-normal">
                          "{m.transcription}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13.5px] font-sans text-[#111b21] leading-[18px] whitespace-pre-line break-words">{m.text}</p>
                  )}

                  {/* Timing & read checkmarks */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9.5px] text-[#667781] select-none font-sans text-right leading-none">
                    <span>{m.time}</span>
                    {isMe && (
                      <span className="text-[#53bdeb] font-semibold text-xs leading-none relative -top-0.5" title="Lido">
                        ✓✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Elegant WhatsApp-style writing indicator for Emika */}
          {isLoadingReply && (
            <div className="flex items-start max-w-[65%] self-start animate-pulse relative">
              {/* Left Tail SVG */}
              <div className="absolute top-0 -left-1.5 w-2.5 h-3 overflow-hidden select-none">
                <svg viewBox="0 0 8 13" className="w-2.5 h-3 fill-white text-white">
                  <path d="M1.533 3.568L8 12.018V0H0c.341 0 .61.1.841.34l.692.682c.813.803 1.488 1.572.001 2.546z"/>
                </svg>
              </div>
              <div className="bg-white text-gray-700 py-2 px-3 rounded-lg rounded-tl-none shadow-[0_1px_0.5px_rgba(11,20,26,.12)]">
                <div className="flex items-center gap-1.5 text-[#00a884] font-sans text-[11px] font-bold tracking-wide leading-none">
                  <span>Emika AI</span>
                  <span className="text-[9px] font-normal lowercase tracking-normal text-gray-400">digitando...</span>
                </div>
                <div className="flex gap-1.5 items-center mt-2.5 h-3 w-12 justify-start pl-0.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0s] [animation-duration:0.9s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:0.9s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:0.9s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* Hidden inputs to support real local file uploads */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelected} 
          className="hidden" 
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
        />

        {/* Staged File Attachment Review Panel */}
        {selectedFile && (
          <div className="mx-3.5 mt-2 bg-white rounded-xl border border-gray-150 p-4 shadow-lg flex items-center justify-between animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-teal-50 text-[#00a884] rounded-lg flex items-center justify-center font-bold text-xs uppercase font-mono shadow-inner border border-teal-100">
                {selectedFile.type}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{selectedFile.name}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1.5">
                  <span>Tamanho: {selectedFile.size}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-teal-600 font-medium font-sans bg-teal-50 px-1 py-0.2 rounded text-[10px]">Pronto para enviar</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined !text-lg">close</span>
            </button>
          </div>
        )}

        {/* Emoji Selector Floating Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-40 bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 w-72 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-sans">Emojis Rápidos</p>
              <button 
                onClick={() => setShowEmojiPicker(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined !text-sm leading-none">close</span>
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[
                "😊", "👍", "❤️", "👏", "😂", "🎉", 
                "🚀", "💡", "😢", "🤔", "✅", "❌", 
                "📋", "🏖️", "💰", "🏢", "✉️", "📞"
              ].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setReplyText((prev) => prev + emoji);
                    // Leave open for fast typing but focus input triggers
                  }}
                  className="w-9 h-9 text-lg flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer active:scale-90 select-none pb-0.5"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messaging footer input styled exactly like WhatsApp Web input bar */}
        <footer className="p-3 bg-[#f0f2f5] border-t border-gray-200/50 flex items-center gap-3 relative">
          {/* Simulated Active Studio Voice Recording Flow */}
          {isRecordingAudio ? (
            <div className="w-full flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-red-200/50 shadow-sm animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
                <p className="text-xs font-bold text-red-600 font-mono flex items-center gap-1">
                  GRAVANDO ÁUDIO <span className="bg-red-50 py-0.5 px-1.5 rounded-md text-[10px] ml-1.5 border border-red-100">{formatRecordingTime(recordingSeconds)}</span>
                </p>
                
                {/* Visual active waveforms bouncing simulator */}
                <div className="flex gap-1.5 items-center pl-4 py-1">
                  <span className="w-1 h-3.5 bg-red-500 rounded animate-bounce [animation-delay:0s] duration-700"></span>
                  <span className="w-1 h-5.5 bg-red-500 rounded animate-bounce [animation-delay:0.1s] duration-700"></span>
                  <span className="w-1 h-7 bg-red-500 rounded animate-bounce [animation-delay:0.25s] duration-700"></span>
                  <span className="w-1 h-4 bg-red-500 rounded animate-bounce [animation-delay:0.15s] duration-700"></span>
                  <span className="w-1 h-6 bg-red-500 rounded animate-bounce [animation-delay:0.35s] duration-700"></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsRecordingAudio(false);
                    setRecordingSeconds(0);
                  }}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
                  title="Cancelar"
                >
                  <span className="material-symbols-outlined !text-lg">delete</span>
                </button>

                <button
                  onClick={() => handleSendAudioFile(recordingSeconds || 4)}
                  className="px-4 py-2 bg-[#dbebe6] hover:bg-[#c9e4db] text-[#00a884] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Enviar Áudio Gravado"
                >
                  <span className="material-symbols-outlined !text-sm">check</span>
                  <span>Enviar Áudio</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`text-[#54656f] hover:text-gray-800 transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-200/50 ${
                  showEmojiPicker ? "text-primary bg-primary/5" : ""
                }`}
                title="Mostrar Emojis"
              >
                <Smile size={23} />
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[#54656f] hover:text-gray-800 transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-200/50"
                title="Anexar Arquivo ou Documento"
              >
                <Paperclip size={21} className="rotate-45" />
              </button>
              
              <div className="flex-grow bg-white px-3.5 py-2.5 rounded-lg flex items-center border border-white filter drop-shadow-sm">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendAsAgent();
                  }}
                  placeholder={activeSession.lgpdState === "verified" ? "Digite uma mensagem" : "Responda a Emika..."}
                  className="w-full bg-transparent border-none text-[14px] text-[#111b21] placeholder-gray-400 font-sans focus:outline-none focus:ring-0"
                />
              </div>

              {replyText.trim() || selectedFile ? (
                <button
                  onClick={handleSendAsAgent}
                  className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#00a884]/95 text-white shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <Send size={16} fill="white" className="ml-0.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsRecordingAudio(true);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#00a884]/95 text-white shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 duration-200"
                  title="Clique para testar gravação de áudio"
                >
                  <span className="material-symbols-outlined !text-[18px]">mic</span>
                </button>
              )}
            </>
          )}
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
