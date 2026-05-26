import React, { useState } from "react";
import { MessageSquare, Award, TrendingUp, Sparkles, User, Database, BookmarkCheck, LayoutGrid, Clock, ShieldCheck, Smile, Volume2 } from "lucide-react";
import { Alert } from "../types";

interface DashboardViewProps {
  alerts: Alert[];
  onSolveAlert: (alertId: string) => void;
  onNavigateToChat: (chatId: string) => void;
}

export default function DashboardView({ alerts, onSolveAlert, onNavigateToChat }: DashboardViewProps) {
  const [chartRange, setChartRange] = useState<"hoje" | "semana">("hoje");

  // Chart bar Heights based on interval select
  const todayHeights = [30, 75, 95, 85, 45, 40, 65, 50, 35, 20];
  const weekHeights = [55, 40, 60, 90, 75, 80, 45, 60, 85, 70];
  const activeHeights = chartRange === "hoje" ? todayHeights : weekHeights;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold font-sans text-secondary tracking-tight mb-1">
          Visão Geral Operacional
        </h2>
        <p className="text-gray-500 text-sm font-sans">
          Métricas em tempo real e inteligência artificial MK9.
        </p>
      </div>

      {/* Bento Grid KPI Cards */}
      <div className="grid grid-cols-12 gap-5">
        {/* KPI Card 1: Total Conversations */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-primary p-2 bg-[#f2f3f8] rounded-xl">
                forum
              </span>
              <span className="text-secondary text-xs font-bold font-mono bg-blue-50 px-2 py-0.5 rounded-full">
                +12% vs ano ant.
              </span>
            </div>
            <h3 className="text-gray-500 font-mono text-xs uppercase tracking-wider mb-1">
              Total de Conversas
            </h3>
            <p className="text-2xl font-bold text-secondary font-sans leading-none">1.284</p>
          </div>
          <div className="mt-4 h-1.5 w-full bg-[#f2f3f8] rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "75%" }}></div>
          </div>
        </div>

        {/* KPI Card 2: Resolved by AI */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-secondary p-2 bg-blue-50 rounded-xl animate-pulse">
                smart_toy
              </span>
              <span className="text-teal-600 text-xs font-bold font-mono bg-teal-50 px-2 py-0.5 rounded-full">
                Estável
              </span>
            </div>
            <h3 className="text-gray-500 font-mono text-xs uppercase tracking-wider mb-1">
              Resolvido pela MK9 IA
            </h3>
            <p className="text-2xl font-bold text-secondary font-sans leading-none">88,4%</p>
          </div>
          <div className="mt-4 h-1.5 w-full bg-[#f2f3f8] rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full transition-all duration-1000" style={{ width: "88.4%" }}></div>
          </div>
        </div>

        {/* KPI Card 3: Human Escalation */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-[#36424A] p-2 bg-[#cee5ff]/20 rounded-xl">
                person_pin
              </span>
              <span className="text-red-600 text-xs font-bold font-mono bg-red-50 px-2 py-0.5 rounded-full">
                -2,4% queda
              </span>
            </div>
            <h3 className="text-gray-500 font-mono text-xs uppercase tracking-wider mb-1">
              Escalado para Humano
            </h3>
            <p className="text-2xl font-bold text-secondary font-sans leading-none">11,6%</p>
          </div>
          <div className="mt-4 h-1.5 w-full bg-[#f2f3f8] rounded-full overflow-hidden">
            <div className="h-full bg-mk9-slate rounded-full transition-all duration-1000" style={{ width: "11.6%" }}></div>
          </div>
        </div>

        {/* KPI Card 4: Most Requested */}
        <div className="col-span-12 lg:col-span-3 bg-[#006BA6] text-white p-5 rounded-xl border border-[#006BA6] shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider mb-4 opacity-80 text-[#cee5ff] font-bold">
              Principais Tópicos
            </h3>
            <ul className="space-y-3 font-sans">
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>💰</span> <span className="font-semibold text-white">FGTS</span>
                </span>
                <span className="font-mono font-bold text-[#cee5ff]">42%</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>🏖️</span> <span className="font-semibold text-white">Férias</span>
                </span>
                <span className="font-mono font-bold text-[#cee5ff]">28%</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>📄</span> <span className="font-semibold text-white">Holerite</span>
                </span>
                <span className="font-mono font-bold text-[#cee5ff]">15%</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 border-t border-white/20 pt-2 text-[10px] text-white/70 font-mono text-right font-medium">
            Atualizado em tempo real
          </div>
        </div>
      </div>

      {/* Charts & Alerts Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Service Volume Chart Area */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-semibold text-lg text-secondary font-sans">
                Volume de Atendimento por Hora
              </h3>
              <p className="text-gray-400 text-xs font-sans mt-0.5">
                Horários de pico identificados entre 09:00 e 11:00
              </p>
            </div>
            <div className="flex gap-2 bg-[#f2f3f8] p-1 rounded-lg">
              <button
                onClick={() => setChartRange("hoje")}
                className={`px-3.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  chartRange === "hoje"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setChartRange("semana")}
                className={`px-3.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  chartRange === "semana"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Semana
              </button>
            </div>
          </div>

          {/* Bar rendering */}
          <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 px-2 transition-all">
            {activeHeights.map((ht, idx) => {
              const hours = ["08h", "09h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h"];
              const isPeak = idx === 1 || idx === 2 || idx === 3;
              const barColor = isPeak 
                ? "bg-secondary hover:bg-secondary/90 shadow-md shadow-secondary/10" 
                : "bg-primary/50 hover:bg-primary/70";

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ease-out cursor-pointer ${barColor}`}
                    style={{ height: `${ht}%` }}
                  ></div>
                  <span
                    className={`text-[9px] sm:text-[10px] mt-2 font-bold uppercase ${
                      isPeak ? "text-secondary" : "text-gray-400"
                    }`}
                  >
                    {hours[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Alerts Section */}
        <div className="col-span-12 lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-secondary font-sans">
                Alertas em Tempo Real
              </h3>
              <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded animate-pulse tracking-wider">
                AO VIVO
              </span>
            </div>

            {/* List */}
            <div className="space-y-4 overflow-y-auto max-h-[300px] pr-1 chat-scrollbar">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-green-500 scale-150 mb-2">
                    check_circle
                  </span>
                  <p className="text-xs font-semibold text-gray-700">Tudo limpo por aqui!</p>
                  <p className="text-[10px] text-gray-400 mt-1">Nenhum alerta pendente no momento.</p>
                </div>
              ) : (
                alerts.map((al) => {
                  let alertBorder = "border-primary bg-blue-50/20";
                  let titleColor = "text-primary";
                  
                  if (al.type === "denuncia") {
                    alertBorder = "border-red-500 bg-red-50/10";
                    titleColor = "text-red-600";
                  } else if (al.type === "rescisao") {
                    alertBorder = "border-secondary bg-blue-50/20";
                    titleColor = "text-secondary";
                  } else {
                    alertBorder = "border-yellow-500 bg-yellow-50/10";
                    titleColor = "text-yellow-600";
                  }

                  return (
                    <div
                      key={al.id}
                      className={`p-4 border-l-4 rounded-r-lg shadow-sm transition-all hover:translate-x-1 ${alertBorder}`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className={`font-bold text-sm ${titleColor}`}>{al.title}</span>
                        <span className="text-[10px] text-gray-500 font-mono font-semibold">{al.time}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-tight mb-3">
                        {al.description}
                      </p>
                      
                      {/* Action trigger links based on alert configuration */}
                      <div className="flex gap-2">
                        {al.type === "denuncia" && (
                          <>
                            <button
                              onClick={() => {
                                onSolveAlert(al.id);
                                // Simulates resolving
                              }}
                              className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-[10px] font-bold tracking-wider uppercase cursor-pointer transition-all"
                            >
                              Tomar Providência
                            </button>
                            <button
                              onClick={() => alert("Logs do canal seguro de denúncias éticas carregados em nova aba.")}
                              className="px-2.5 py-1 bg-white border border-gray-300 text-secondary hover:bg-gray-50 rounded text-[10px] font-bold tracking-wider uppercase cursor-pointer transition-all"
                            >
                              Ver Logs
                            </button>
                          </>
                        )}
                        {al.type === "rescisao" && (
                          <>
                            <button
                              onClick={() => onNavigateToChat("session-1")}
                              className="px-2.5 py-1 bg-[#009cde] text-white hover:bg-[#009cde]/90 rounded text-[10px] font-bold tracking-wider uppercase cursor-pointer transition-all"
                            >
                              Entrar no Chat
                            </button>
                            <button
                              onClick={() => onNavigateToChat("session-1")}
                              className="px-2.5 py-1 bg-white border border-gray-300 text-secondary hover:bg-gray-50 rounded text-[10px] font-bold tracking-wider uppercase cursor-pointer transition-all"
                            >
                              Perfil
                            </button>
                          </>
                        )}
                        {al.type === "erro-holerite" && (
                          <button
                            onClick={() => onSolveAlert(al.id)}
                            className="px-2.5 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded text-[10px] font-bold tracking-wider uppercase cursor-pointer transition-all"
                          >
                            Resolver Alerta
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => alert("Todos os alertas históricos foram exportados para o painel consolidado do DP.")}
            className="w-full mt-6 py-2 text-secondary font-bold text-xs border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            Visualizar Todos os Alertas
          </button>
        </div>
      </div>

      {/* Bottom Quick Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {/* LGPD card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
          </div>
          <div>
            <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider">STATUS LGPD</p>
            <p className="font-bold text-secondary text-sm">100% Conforme</p>
          </div>
        </div>

        {/* Resposta Média card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-[#006BA6]/10 text-secondary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>
              speed
            </span>
          </div>
          <div>
            <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider">RESPOSTA MÉDIA</p>
            <p className="font-bold text-secondary text-sm">1,2 segundos</p>
          </div>
        </div>

        {/* Satisfação card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-gray-500/10 text-gray-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>
              mood
            </span>
          </div>
          <div>
            <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider font-bold">SATISFAÇÃO</p>
            <p className="font-bold text-secondary text-sm">4,8 / 5,0</p>
          </div>
        </div>

        {/* Armazenamento card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>
              database
            </span>
          </div>
          <div>
            <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider font-bold">ARMAZENAMENTO</p>
            <p className="font-bold text-secondary text-sm">82% Capacidade</p>
          </div>
        </div>
      </div>
    </div>
  );
}
