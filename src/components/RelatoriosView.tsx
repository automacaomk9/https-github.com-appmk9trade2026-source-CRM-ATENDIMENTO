import React from "react";
import { BarChart3, TrendingUp, Sparkles, Award, UserCheck, PhoneCall, HelpCircle, FileText, Check, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const last30DaysData = [
  { data: "27/04", chamados: 42, automaticos: 36 },
  { data: "28/04", chamados: 45, automaticos: 39 },
  { data: "29/04", chamados: 48, automaticos: 41 },
  { data: "30/04", chamados: 52, automaticos: 44 },
  { data: "01/05", chamados: 50, automaticos: 43 },
  { data: "02/05", chamados: 55, automaticos: 48 },
  { data: "03/05", chamados: 58, automaticos: 50 },
  { data: "04/05", chamados: 63, automaticos: 55 },
  { data: "05/05", chamados: 68, automaticos: 60 },
  { data: "06/05", chamados: 72, automaticos: 64 },
  { data: "07/05", chamados: 70, automaticos: 61 },
  { data: "08/05", chamados: 75, automaticos: 66 },
  { data: "09/05", chamados: 80, automaticos: 71 },
  { data: "10/05", chamados: 85, automaticos: 76 },
  { data: "11/05", chamados: 82, automaticos: 73 },
  { data: "12/05", chamados: 88, automaticos: 78 },
  { data: "13/05", chamados: 94, automaticos: 84 },
  { data: "14/05", chamados: 91, automaticos: 81 },
  { data: "15/05", chamados: 96, automaticos: 85 },
  { data: "16/05", chamados: 102, automaticos: 90 },
  { data: "17/05", chamados: 105, automaticos: 94 },
  { data: "18/05", chamados: 100, automaticos: 89 },
  { data: "19/05", chamados: 108, automaticos: 96 },
  { data: "20/05", chamados: 112, automaticos: 100 },
  { data: "21/05", chamados: 115, automaticos: 102 },
  { data: "22/05", chamados: 121, automaticos: 108 },
  { data: "23/05", chamados: 125, automaticos: 111 },
  { data: "24/05", chamados: 120, automaticos: 106 },
  { data: "25/05", chamados: 128, automaticos: 114 },
  { data: "26/05", chamados: 135, automaticos: 122 }
];

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

      {/* Trends section using Recharts */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-secondary font-sans flex items-center gap-2">
              <TrendingUp size={20} className="text-primary animate-pulse" />
              <span>Tendência de Chamados (Últimos 30 Dias)</span>
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Crescimento do volume de solicitações de suporte em relação ao índice de resolução automatizada por IA.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-full inline-block"></span>
              <span className="text-gray-600">Volume Total</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-teal-500 rounded-full inline-block"></span>
              <span className="text-gray-600">Autoatendimento</span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-[11px] font-mono">
              <ArrowUpRight size={14} />
              <span>+24.8% Crescimento</span>
            </div>
          </div>
        </div>

        <div className="h-[280px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={last30DaysData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="data" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }} 
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-md p-3.5 border border-gray-100 rounded-xl shadow-xl transition-all duration-200 transform hover:scale-[1.02] font-sans">
                        <p className="text-[10px] font-bold text-gray-400 font-mono mb-2 uppercase tracking-wide">Data: {label}</p>
                        <div className="space-y-1.5">
                          {payload.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: item.stroke }} />
                                <span className="text-xs text-gray-600 font-medium">{item.name}</span>
                              </div>
                              <span className="text-xs font-bold font-mono ml-auto text-secondary">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                name="Volume de Chamados" 
                type="monotone" 
                dataKey="chamados" 
                stroke="#009cde" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, className: "transition-all duration-150" }} 
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Line 
                name="Atendidos Automaticamente" 
                type="monotone" 
                dataKey="automaticos" 
                stroke="#0d9488" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={false} 
                isAnimationActive={true}
                animationDuration={1800}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
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
