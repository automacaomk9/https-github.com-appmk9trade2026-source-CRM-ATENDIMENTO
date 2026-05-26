import React, { useState, useEffect } from "react";
import { Check, Edit3, Settings, Play, Database, Server, Cpu, Link, Key, RefreshCw, Layers } from "lucide-react";
import { AutomationRule, ApiCredentials } from "../types";

interface ConfiguracoesViewProps {
  rules: AutomationRule[];
  onToggleRule: (id: string) => void;
  apiCredentials: ApiCredentials;
  onUpdateCredentials: (cred: ApiCredentials) => void;
}

export default function ConfiguracoesView({
  rules,
  onToggleRule,
  apiCredentials,
  onUpdateCredentials
}: ConfiguracoesViewProps) {
  const [isEditingApi, setIsEditingApi] = useState(false);
  const [instanceName, setInstanceName] = useState(apiCredentials.instanceName);
  const [apiKey, setApiKey] = useState(apiCredentials.apiKey);
  const [webhookUrl, setWebhookUrl] = useState(apiCredentials.webhookUrl);

  // Sync state values dynamically when prop references update
  useEffect(() => {
    setInstanceName(apiCredentials.instanceName);
    setApiKey(apiCredentials.apiKey);
    setWebhookUrl(apiCredentials.webhookUrl);
  }, [apiCredentials]);

  // Playground simulation controls
  const [selectedSubagent, setSelectedSubagent] = useState("ferias");
  const [testPrompt, setTestPrompt] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const handleTestSubagent = () => {
    setIsTesting(true);
    setTestOutput("");
    
    setTimeout(() => {
      let output = "";
      if (selectedSubagent === "ferias") {
        output = `**[Menu Férias]** Como posso te ajudar hoje?\n\n1️⃣ Como funciona o período aquisitivo\n2️⃣ Como solicitar ou agendar férias\n3️⃣ Prazos e regras das férias\n4️⃣ Pagamento e descontos das férias\n5️⃣ Outros assuntos`;
      } else if (selectedSubagent === "inss") {
        output = `**[Menu INSS]** Escolha sua opção de INSS:\n\n1️⃣ Afastamento pela previdência\n2️⃣ Como dar entrada no benefício no Meu INSS\n3️⃣ Acompanhar perícia médica`;
      } else if (selectedSubagent === "fgts") {
        output = `**[Menu FGTS]** Atendimento automatico:\n\n1️⃣ Saque-rescisão padrão\n2️⃣ Rastrear extrato no app FGTS\n3️⃣ Multa de 40% em rescisões`;
      } else {
        output = `**[Onboarding Bot]** Olá, novo colaborador da MK9! Bem vindo ao portal. Escolha seu fluxo:\n\n1️⃣ Enviar documentos de admissão\n2️⃣ Assinar contrato de trabalho digital`;
      }

      setTestOutput(output);
      setIsTesting(false);
    }, 1000);
  };

  const handleSaveApi = () => {
    onUpdateCredentials({
      ...apiCredentials,
      instanceName,
      apiKey,
      webhookUrl
    });
    setIsEditingApi(false);
  };

  const handleSaveFluxo = () => {
    onUpdateCredentials({
      ...apiCredentials,
      instanceName,
      apiKey,
      webhookUrl
    });
    setIsEditingApi(false);
    alert("Parabéns! Fluxo publicado, credenciais de integração salvas com sucesso no banco de dados.");
  };

  const handleDiscardFluxo = () => {
    setInstanceName(apiCredentials.instanceName);
    setApiKey(apiCredentials.apiKey);
    setWebhookUrl(apiCredentials.webhookUrl);
    setIsEditingApi(false);
    alert("As alterações recentes do fluxo foram descartadas.");
  };

  return (
    <div className="space-y-6">
      {/* Page Header Title */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-secondary font-sans leading-tight">
            Configuração do Sistema
          </h2>
          <p className="text-gray-500 text-sm font-sans mt-0.5">
            Gerencie a inteligência da MK9, subagentes cognitivos e credenciais de integração.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDiscardFluxo}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-bold text-xs font-sans tracking-wide transition-all uppercase cursor-pointer"
          >
            Descartar
          </button>
          <button
            onClick={handleSaveFluxo}
            className="px-6 py-2.5 bg-secondary text-white hover:bg-secondary/90 rounded-lg font-bold text-xs font-sans tracking-wide transition-all uppercase cursor-pointer shadow-md shadow-secondary/15"
          >
            Salvar Fluxo
          </button>
        </div>
      </header>

      {/* Bento Grid Layout configuration */}
      <div className="grid grid-cols-12 gap-6">
        {/* MK9 Cognitive Engine Card (Left Card) */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-gray-200 rounded-xl p-6 relative overflow-hidden group shadow-sm flex flex-col justify-between">
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-green-50 text-green-600 font-bold font-mono rounded-full flex items-center gap-1 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              ATIVO
            </span>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#009cde] rounded-full blur-2xl opacity-10 animate-pulse"></div>
              {/* Premium abstract neural network profile image */}
              <img
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=180&q=80"
                alt="Núcleo MK9 AI"
                className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-xl relative z-10"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-secondary font-sans">Núcleo Cogntivo MK9</h3>
              <p className="text-gray-500 text-xs font-sans px-4 mt-1 leading-relaxed">
                O motor cognitivo mestre que governa as interações, estados LGPD e o roteamento inteligente de sub-tarefas da equipe de Trade.
              </p>
            </div>
          </div>

          {/* Interactive Playground Simulator */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 space-y-3 mt-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
              <span className="text-[10px] font-bold text-gray-500 font-mono tracking-wider uppercase">
                ⚙️ Lab de Teste de Subagente
              </span>
              <select
                value={selectedSubagent}
                onChange={(e) => {
                  setSelectedSubagent(e.target.value);
                  setTestOutput("");
                }}
                className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-secondary font-mono"
              >
                <option value="ferias">Auditor de Férias</option>
                <option value="inss">Analista de INSS</option>
                <option value="fgts">Auditor de FGTS</option>
                <option value="onboarding">Bot de Onboarding</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Simular prompt (ex: Ajuda férias)"
                className="flex-grow bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-sans text-gray-700"
              />
              <button
                onClick={handleTestSubagent}
                disabled={isTesting}
                className="px-3 bg-secondary text-white rounded text-xs font-bold font-sans flex items-center gap-1 cursor-pointer hover:bg-secondary/95 active:scale-95 transition-all"
              >
                {isTesting ? <RefreshCw className="animate-spin" size={12} /> : <Play size={10} fill="white" />}
                <span>Testar</span>
              </button>
            </div>

            {testOutput && (
              <div className="bg-white p-3 rounded border border-gray-200 text-[11px] font-mono text-gray-700 shadow-inner whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto chat-scrollbar animate-in fade-in duration-200">
                {testOutput}
              </div>
            )}
          </div>
        </div>

        {/* Subagents Hierarchy Cards (Right Card) */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-secondary font-sans flex items-center gap-2">
                <Layers className="text-[#009cde]" size={20} />
                <span>Hierarquia de Subagentes Cognitivos</span>
              </h3>
              <button
                onClick={() => alert("Formulário de criação de novo prompt-subagente integrado carregando...")}
                className="text-primary text-xs font-bold font-mono tracking-wide uppercase hover:underline cursor-pointer flex items-center gap-0.5"
              >
                ADICIONAR AGENTE +
              </button>
            </div>

            {/* List of subagents with details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card INSS */}
              <div
                onClick={() => {
                  setSelectedSubagent("inss");
                  setTestPrompt("Quero saber do INSS");
                  handleTestSubagent();
                }}
                className="p-4 border border-gray-200 hover:border-primary rounded-lg flex items-center justify-between cursor-pointer bg-gray-50/50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-50 text-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <span className="material-symbols-outlined font-semibold !text-lg">account_balance</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">Especialista INSS</h4>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-wide">Cálculos e Perícias</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400 font-semibold group-hover:text-secondary group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </span>
              </div>

              {/* Card FGTS */}
              <div
                onClick={() => {
                  setSelectedSubagent("fgts");
                  setTestPrompt("Puxar FGTS");
                  handleTestSubagent();
                }}
                className="p-4 border border-gray-200 hover:border-primary rounded-lg flex items-center justify-between cursor-pointer bg-gray-50/50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-50 text-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <span className="material-symbols-outlined font-semibold !text-lg">payments</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">Auditor de FGTS</h4>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-wide">Saques e Saldos</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400 font-semibold group-hover:text-secondary group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </span>
              </div>

              {/* Card Benefícios */}
              <div
                onClick={() => {
                  setSelectedSubagent("ferias");
                  setTestPrompt("Quais meus benefícios?");
                  handleTestSubagent();
                }}
                className="p-4 border border-gray-200 hover:border-primary rounded-lg flex items-center justify-between cursor-pointer bg-gray-50/50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-50 text-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <span className="material-symbols-outlined font-semibold !text-lg">medical_services</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">Saúde e Benefícios</h4>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-wide">Gestão Saúde e VR</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400 font-semibold group-hover:text-secondary group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </span>
              </div>

              {/* Card Onboarding */}
              <div
                onClick={() => {
                  setSelectedSubagent("onboarding");
                  setTestPrompt("Como fazer onboarding?");
                  handleTestSubagent();
                }}
                className="p-4 border border-gray-200 hover:border-primary rounded-lg flex items-center justify-between cursor-pointer bg-gray-50/50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-50 text-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <span className="material-symbols-outlined font-semibold !text-lg">person_add</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">Bot de Onboarding</h4>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-wide">Novos Contratados</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400 font-semibold group-hover:text-secondary group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-xs leading-relaxed font-sans text-secondary-container text-secondary font-medium mt-4">
            🔄 Todos os subagentes possuem conexões integradas por embeddings de memória cache do banco Postgres de n8n.
          </div>
        </div>
      </div>

      {/* Settings rules and integrations (Bottom Layout) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Automation left toggles block */}
        <section className="col-span-12 lg:col-span-5 bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-lg text-secondary font-sans flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_mode</span>
            <span>Regras de Automação de Fluxo</span>
          </h3>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="pr-4">
                  <p className="font-bold text-sm text-gray-800 leading-tight">{rule.title}</p>
                  <p className="text-[11px] text-gray-400 font-medium leading-normal mt-1">{rule.desc}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.active}
                    onChange={() => onToggleRule(rule.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-[10px] font-bold text-primary font-mono tracking-widest uppercase mb-1">
              Diretriz Corporativa
            </p>
            <p className="text-xs text-secondary leading-relaxed font-sans font-medium">
              O envio automático é sincronizado com o nó 'Folha Finalizada' no seu workflow MK9 de canais digitais.
            </p>
          </div>
        </section>

        {/* Integration Credentials editing card */}
        <section className="col-span-12 lg:col-span-7 bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center bg-white border-b border-gray-100 pb-3">
            <h3 className="font-bold text-lg text-secondary font-sans flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">api</span>
              <span>Integrações e Webhooks</span>
            </h3>
            <span className="px-2.5 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full font-mono">
              🔵 ATIVO E OPERACIONAL
            </span>
          </div>

          <div className="space-y-4">
            {/* Webhook API status */}
            <div className="flex items-center justify-between p-3.5 bg-[#f8f9fd] rounded-xl border border-gray-200 border-l-4 border-l-primary hover:shadow-xs transition-shadow">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">webhook</span>
                <div>
                  <p className="font-bold text-xs text-gray-800">Webhook MK9 Workflow</p>
                  <p className="font-mono text-[10px] text-gray-500 truncate max-w-sm">
                    {instanceName === apiCredentials.instanceName 
                      ? apiCredentials.webhookUrl 
                      : webhookUrl}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-primary font-mono leading-none">200 OK</p>
                <p className="text-[8px] text-gray-400 font-bold font-mono uppercase mt-1">LATÊNCIA 12ms</p>
              </div>
            </div>

            {/* Evolution controls */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest leading-none">
                  API Evolution (WhatsApp Gateway)
                </p>
                <button
                  onClick={() => {
                    if (isEditingApi) {
                      handleSaveApi();
                    } else {
                      setIsEditingApi(true);
                    }
                  }}
                  className="text-primary font-bold text-xs font-mono flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {isEditingApi ? (
                    <>
                      <Check size={12} />
                      <span>SALVAR</span>
                    </>
                  ) : (
                    <>
                      <Edit3 size={12} />
                      <span>EDITAR</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold font-mono text-gray-400 block mb-1">INSTÂNCIA WHATSAPP</label>
                    {isEditingApi ? (
                      <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-700 font-mono"
                        value={instanceName}
                        onChange={(e) => setInstanceName(e.target.value)}
                      />
                    ) : (
                      <div className="bg-white px-3 py-1.5 rounded text-xs font-mono border border-gray-200 font-semibold text-secondary">
                        {apiCredentials.instanceName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[9px] font-bold font-mono text-gray-400 block mb-1">CHAVE DA API</label>
                    {isEditingApi ? (
                      <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-700 font-mono"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    ) : (
                      <div className="bg-white px-3 py-1.5 rounded text-xs font-mono border border-gray-200 text-gray-500 font-bold truncate max-w-[200px]">
                        {apiCredentials.apiKey && apiCredentials.apiKey.includes("••") ? "•••••••••••••••••••••••••" : apiCredentials.apiKey}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold font-mono text-gray-400 block mb-1">WEBHOOK URL (n8n)</label>
                  {isEditingApi ? (
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-700 font-mono"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  ) : (
                    <div className="bg-white px-3 py-1.5 rounded text-xs font-mono border border-gray-200 text-gray-600 font-semibold truncate">
                      {apiCredentials.webhookUrl}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* LLM Infra info */}
            <div className="p-4 bg-[#f8f9fd] rounded-xl border border-gray-200 space-y-3">
              <p className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest leading-none">
                Infraestrutura LLM Corporativa
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold font-mono text-gray-400 block mb-1">VERSÃO DO MODELO LLM</label>
                  <div className="bg-white px-3 py-1.5 rounded text-xs font-mono border border-gray-200 font-semibold text-secondary">
                    {apiCredentials.modelName}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold font-mono text-gray-400 block mb-1">COTA DISPONÍVEL</label>
                  <div className="bg-white px-3 py-1.5 rounded text-xs font-mono border border-gray-200 font-bold text-[#006BA6]">
                    {apiCredentials.availableQuota}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
