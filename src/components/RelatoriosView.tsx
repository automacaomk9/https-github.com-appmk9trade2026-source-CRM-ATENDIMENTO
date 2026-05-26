import React from "react";
import { BarChart3, TrendingUp, Sparkles, Award, UserCheck, PhoneCall, HelpCircle, FileText, Check } from "lucide-react";

export default function RelatoriosView() {
  const reportsData = [
    { name: "Cálculos de FGTS", volume: 540, autoRate: "92.4%", color: "bg-[#009cde]" },
    { name: "Agendamento de Férias", volume: 360, autoRate: "88.1%", color: "bg-[#006ba6]" },
    { name: "Consultas de Holerites", volume: 210, autoRate: "98.5%", color: "bg-teal-500" },
    { name: "Afastamentos INSS", volume: 110, autoRate: "72.0%", color: "bg-[#36424a]" },
    { name: "Onboarding de Contratados", volume: 64, autoRate: "90.4%", color: "bg-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold font-sans text-secondary tracking-tight mb-1">
          Relatórios & Analytics
        </h2>
        <p className="text-gray-500 text-sm font-sans">
          Métricas consolidadas de autoatendimento, canais interativos e canais sazonais.
        </p>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-primary p-2 bg-blue-50 rounded-xl">
              star_rate
            </span>
            <span className="text-green-600 text-xs font-bold font-mono bg-green-50 px-2 py-0.5 rounded">
              Excelente
            </span>
          </div>
          <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider">SATISFAÇÃO DO COLABORADOR</p>
          <p className="text-2xl font-bold text-secondary font-sans mt-1">4.8 / 5.0</p>
          <p className="text-xs text-justify text-gray-500 mt-2">
            Mais de 92% das avaliações foram consideradas ótimas ou excelentes pelos colaboradores.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-secondary p-2 bg-blue-50 rounded-xl">
              psychology
            </span>
            <span className="text-teal-600 text-xs font-bold font-mono bg-teal-50 px-2 py-0.5 rounded">
              Ótimo Índice
            </span>
          </div>
          <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider">RETENÇÃO DE IA</p>
          <p className="text-2xl font-bold text-secondary font-sans mt-1">88.4%</p>
          <p className="text-xs text-justify text-gray-500 mt-2">
            Porcentagem de solicitações que foram resolvidas no menu automático da Emika sem intervenção humana.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#36424a] p-2 bg-gray-100 rounded-xl">
              schedule
            </span>
            <span className="text-blue-600 text-xs font-bold font-mono bg-blue-50 px-2 py-0.5 rounded">
              Super Ágil
            </span>
          </div>
          <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider font-bold">TEMPO DE INTERAÇÃO MEDIO</p>
          <p className="text-2xl font-bold text-secondary font-sans mt-1">2m 14s</p>
          <p className="text-xs text-justify text-gray-500 mt-2">
            Duração média das conversas operacionais desde a saudação até a finalização do protocolo.
          </p>
        </div>
      </div>

      {/* Topic breakdown graph and Logs */}
      <div className="grid grid-cols-12 gap-6">
        {/* Topic Breakdown Card */}
        <div className="col-span-12 lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-lg text-secondary font-sans">Breakdown de Demandas</h3>
            <p className="text-gray-400 text-xs mt-0.5">Visão consolidada de tópicos conversados na semana corrente.</p>
          </div>

          <div className="space-y-4 font-sans">
            {reportsData.map((d, index) => {
              const maxVal = 540;
              const barPercent = (d.volume / maxVal) * 100;
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>{d.name}</span>
                    <span className="font-mono text-gray-500">
                      {d.volume} interações • Automação: <span className="text-primary font-bold">{d.autoRate}</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#f2f3f8] h-3 rounded-full overflow-hidden">
                    <div 
                      className={`${d.color} h-full rounded-full transition-all duration-1000`} 
                      style={{ width: `${barPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time system log tracker */}
        <div className="col-span-12 lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-lg text-secondary font-sans">Sincronização Ativa</h3>
            <p className="text-gray-400 text-xs mt-0.5">Logs de auditoria dos gatilhos n8n executados recentemente.</p>
          </div>

          <div className="space-y-3 font-mono text-[11px] bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[250px] overflow-y-auto chat-scrollbar leading-relaxed">
            <p className="text-gray-500">[15:02:12] <span className="text-green-600">SUCCESS</span> Init webhook listener on /api/chat</p>
            <p className="text-gray-400">[14:58:10] INFO Carregando banco de embeddings - subagentes</p>
            <p className="text-gray-500">[14:02:00] <span className="text-blue-500">TRANSBORDO</span> Felipe S. escalado para gerente do trade</p>
            <p className="text-gray-400">[13:46:12] INFO CPF 456.789.***-33 autenticado com sucesso</p>
            <p className="text-gray-500">[13:30:14] <span className="text-green-600">DELIVERED</span> Holerite PDF enviado via WhatsApp para Maria O.</p>
            <p className="text-gray-400">[11:20:01] INFO Solicitação de consentimento LGPD para João Castro</p>
            <p className="text-teal-600 font-bold mt-2 animate-pulse">[+] Escuta de Webhook ativa em tempo real...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
