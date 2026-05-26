import React, { useState } from "react";
import { Plus, Download, Search, History, MessageSquare, Unlock, Trash2, X, AlertOctagon, Edit3 } from "lucide-react";
import { Employee } from "../types";

interface ColaboradoresViewProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  onRemoveEmployee: (id: string) => void;
  onNavigateToChat: (chatId: string) => void;
  onUpdateEmployee: (updated: Employee) => void;
}

export default function ColaboradoresView({
  employees,
  onAddEmployee,
  onRemoveEmployee,
  onNavigateToChat,
  onUpdateEmployee
}: ColaboradoresViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("Todos os Projetos");
  const [lgpdFilter, setLgpdFilter] = useState("Todos os Status");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Collaborator form controls
  const [newColabName, setNewColabName] = useState("");
  const [newColabCpf, setNewColabCpf] = useState("");
  const [newColabMatricula, setNewColabMatricula] = useState("");
  const [newColabProject, setNewColabProject] = useState("Hub de Inovação");
  const [newColabEmail, setNewColabEmail] = useState("");

  // Edit Collaborator form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editColabName, setEditColabName] = useState("");
  const [editColabCpf, setEditColabCpf] = useState("");
  const [editColabMatricula, setEditColabMatricula] = useState("");
  const [editColabProject, setEditColabProject] = useState("");
  const [editColabEmail, setEditColabEmail] = useState("");
  const [editColabStatusLgpd, setEditColabStatusLgpd] = useState<"VERIFICADO" | "PENDENTE">("PENDENTE");

  const handleStartEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setEditColabName(emp.name);
    setEditColabCpf(emp.cpf);
    setEditColabMatricula(emp.matricula);
    setEditColabProject(emp.project || "Hub de Inovação");
    setEditColabEmail(emp.email || "");
    setEditColabStatusLgpd(emp.statusLGPD);
    setIsEditModalOpen(true);
  };

  const handleSaveEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee || !editColabName || !editColabCpf || !editColabMatricula) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const updated: Employee = {
      ...editingEmployee,
      name: editColabName,
      matricula: editColabMatricula.toUpperCase(),
      project: editColabProject,
      cpf: editColabCpf.replace(/\D/g, ""), // clean digits
      email: editColabEmail || `${editColabName.toLowerCase().replace(/\s+/g, ".")}@mk9trade.com`,
      statusLGPD: editColabStatusLgpd,
      lastContact: "Hoje, recém editado",
      lastContactTopic: "Atualização de Cadastro"
    };

    onUpdateEmployee(updated);
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleAddNewEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColabName || !newColabCpf || !newColabMatricula) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const uniqueId = `colab-${Date.now()}`;
    const newEmployee: Employee = {
      id: uniqueId,
      name: newColabName,
      matricula: newColabMatricula.toUpperCase(),
      project: newColabProject,
      lastContact: "Hoje, recém adicionado",
      lastContactTopic: "Criação de Cadastro",
      statusLGPD: "PENDENTE",
      cpf: newColabCpf.replace(/\D/g, ""), // clean digits
      email: newColabEmail || `${newColabName.toLowerCase().replace(/\s+/g, ".")}@mk9trade.com`
    };

    onAddEmployee(newEmployee);
    setIsModalOpen(false);

    // Reset controls
    setNewColabName("");
    setNewColabCpf("");
    setNewColabMatricula("");
    setNewColabProject("Hub de Inovação");
    setNewColabEmail("");
  };

  const handleExportCSV = () => {
    // Generates simple CSV string
    const csvHeader = "Nome,Matricula,Projeto,CPF,Email,StatusLGPD\n";
    const csvRows = employees.map(e => `${e.name},${e.matricula},${e.project},${e.cpf},${e.email},${e.statusLGPD}`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `colaboradores_mk9_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.cpf.includes(searchTerm);

    const matchesProject =
      projectFilter === "Todos os Projetos" || e.project === projectFilter;

    // Filters Status Whatsapp map: verified vs pendente
    const matchesLgpd =
      lgpdFilter === "Todos os Status" ||
      (lgpdFilter === "Verificado" && e.statusLGPD === "VERIFICADO") ||
      (lgpdFilter === "Pendente" && e.statusLGPD === "PENDENTE");

    return matchesSearch && matchesProject && matchesLgpd;
  });

  return (
    <div className="space-y-6">
      {/* Title Header with interactive controls */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-secondary font-sans leading-tight">
            Gestão de Colaboradores
          </h2>
          <p className="text-gray-500 text-sm font-sans mt-0.5">
            Gerencie sua força de trabalho, monitore a conformidade com a LGPD e gerencie comunicações via WhatsApp.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="px-6 py-2.5 border border-primary text-secondary hover:bg-blue-50/50 rounded-lg font-bold text-xs font-sans tracking-wide transition-all uppercase flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg font-bold text-xs font-sans tracking-wide transition-all uppercase flex items-center gap-2 cursor-pointer shadow-md shadow-primary/20"
          >
            <Plus size={16} />
            <span>Novo Colaborador</span>
          </button>
        </div>
      </header>

      {/* Filter Section container */}
      <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2">
            <label className="font-mono text-[10px] text-gray-500 mb-2 block uppercase tracking-wider font-bold">
              Buscar Colaborador
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Nome, CPF ou Matrícula..."
                className="w-full bg-white border border-gray-200 rounded-lg py-1.5 pl-10 pr-4 text-sm font-sans text-gray-800 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-gray-500 mb-2 block uppercase tracking-wider font-bold">
              Projeto / Unidade
            </label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 text-gray-700 font-sans focus:outline-none"
            >
              <option>Todos os Projetos</option>
              <option>Hub de Inovação</option>
              <option>Operação Delta</option>
              <option>Núcleo Financeiro</option>
              <option>Logística</option>
              <option>R&S</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] text-gray-500 mb-2 block uppercase tracking-wider font-bold">
              Status WhatsApp
            </label>
            <select
              value={lgpdFilter}
              onChange={(e) => setLgpdFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 text-gray-700 font-sans focus:outline-none"
            >
              <option>Todos os Status</option>
              <option>Verificado</option>
              <option>Pendente</option>
            </select>
          </div>
        </div>
      </section>

      {/* Table employees roster */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto chat-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8f9fd] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                  Nome e Matrícula
                </th>
                <th className="px-6 py-4 font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                  Projeto
                </th>
                <th className="px-6 py-4 font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                  Último Contato
                </th>
                <th className="px-6 py-4 font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                  Status LGPD / CPF
                </th>
                <th className="px-6 py-4 font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold text-right">
                  Ações de Suporte
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm font-sans">
                    Nenhum colaborador encontrado correspondente aos filtros.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((e) => {
                  // Format CPF securely for Display
                  const formattedCpf = e.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");
                  
                  return (
                    <tr key={e.id} className="hover:bg-[#f8f9fd] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase font-mono">
                            {e.name.split(" ").map(p => p.charAt(0)).join("").substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-secondary text-sm leading-snug">{e.name}</p>
                            <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">
                              {e.matricula} • CPF: {formattedCpf}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-[#eceef2] rounded-full text-[10px] font-bold text-gray-800 uppercase tracking-wide">
                          {e.project || "Geral"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-gray-800">{e.lastContact}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{e.lastContactTopic}</p>
                      </td>

                      <td className="px-6 py-4">
                        {e.statusLGPD === "VERIFICADO" ? (
                          <div className="flex items-center gap-1 text-primary">
                            <span className="material-symbols-outlined !text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              verified
                            </span>
                            <span className="font-bold text-[10px] uppercase font-mono tracking-tight">
                              CONFORME
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-500">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="font-bold text-[10px] uppercase font-mono tracking-tight">
                              PENDENTE
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1.5 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Chat redirect action button */}
                          <button
                            onClick={() => onNavigateToChat("session-1")}
                            className="p-1.5 text-gray-400 hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-lg cursor-pointer transition-colors"
                            title="Chamar no WhatsApp"
                          >
                            <MessageSquare size={16} />
                          </button>
                          
                          {/* Edit collaborator details */}
                          <button
                            onClick={() => handleStartEditEmployee(e)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                            title="Editar Cadastro"
                          >
                            <Edit3 size={16} />
                          </button>

                          {/* Force-reverify security lock button */}
                          <button
                            onClick={() => alert(`Enviado token de reautorização LGPD para o email de ${e.name}.`)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="Forçar Reavaliação LGPD"
                          >
                            <Unlock size={16} />
                          </button>

                          {/* Delete collaborator */}
                          <button
                            onClick={() => {
                              if (confirm(`Tem certeza de que deseja remover ${e.name}?`)) {
                                onRemoveEmployee(e.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="Remover Cadastro"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Simple count footer */}
        <div className="px-6 py-4 bg-[#f8f9fd] border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>Exibindo de 1 a {filteredEmployees.length} colaboradores</span>
          <span className="font-bold text-secondary">Total geral: {employees.length} registros</span>
        </div>
      </div>

      {/* KPI Stats below roster */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm">
          <div>
            <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
            <h3 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-wider">
              Conformidade Geral LGPD
            </h3>
            <p className="text-xl font-bold font-sans text-secondary mt-1">94.2%</p>
          </div>
          <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[94.2%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm">
          <div>
            <span className="material-symbols-outlined text-green-500 mb-2">forum</span>
            <h3 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-wider">
              Adoção WhatsApp Corporativo
            </h3>
            <p className="text-xl font-bold font-sans text-secondary mt-1">1.204</p>
          </div>
          <p className="text-[10px] font-mono text-green-600 mt-4 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded w-fit">
            <span>+12 novos aceites nesta semana</span>
          </p>
        </div>

        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="z-10">
            <span className="material-symbols-outlined text-primary mb-2">bolt</span>
            <h3 className="font-mono text-xs font-bold text-gray-800 uppercase tracking-wider">
              Transbordamentos Pendentes
            </h3>
            <p className="text-xl font-bold font-sans text-secondary mt-1">18 Pedidos de RH</p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              notification_important
            </span>
          </div>
        </div>
      </section>

      {/* NEW COLLABORATOR MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 font-sans">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full p-1 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-secondary font-sans flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined">person_add</span>
              <span>Adicionar Novo Colaborador</span>
            </h3>
            <p className="text-xs text-gray-400 font-sans mb-4">
              Defina as credenciais para que o colaborador possa ser autenticado no canal WhatsApp.
            </p>

            <form onSubmit={handleAddNewEmployee} className="space-y-4 text-left">
              {/* Name */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                  NOME COMPLETO *
                </label>
                <input
                  type="text"
                  required
                  value={newColabName}
                  onChange={(e) => setNewColabName(e.target.value)}
                  placeholder="Ex: Carlos Heitor"
                  className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-800"
                />
              </div>

              {/* CPF */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                  CPF (SOMENTE 11 NÚMEROS) *
                </label>
                <input
                  type="text"
                  required
                  pattern="\d{11}"
                  maxLength={11}
                  value={newColabCpf}
                  onChange={(e) => setNewColabCpf(e.target.value)}
                  placeholder="Ex: 55611245699"
                  className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Matricula */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                    MATRÍCULA *
                  </label>
                  <input
                    type="text"
                    required
                    value={newColabMatricula}
                    onChange={(e) => setNewColabMatricula(e.target.value)}
                    placeholder="Ex: MAT-556112"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-800"
                  />
                </div>

                {/* Project selector */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                    PROJETO *
                  </label>
                  <select
                    value={newColabProject}
                    onChange={(e) => setNewColabProject(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-700"
                  >
                    <option>Hub de Inovação</option>
                    <option>Operação Delta</option>
                    <option>Núcleo Financeiro</option>
                    <option>Logística</option>
                    <option>R&S</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                  EMAIL CORPORATIVO
                </label>
                <input
                  type="email"
                  value={newColabEmail}
                  onChange={(e) => setNewColabEmail(e.target.value)}
                  placeholder="Ex: carlos@mk9trade.com"
                  className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-800"
                />
              </div>

              {/* Actions submit */}
              <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COLLABORATOR MODAL POPUP (CRUD - UPDATE) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-250 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-250 font-sans">
            <button
              onClick={() => { setIsEditModalOpen(false); setEditingEmployee(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full p-1 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-secondary font-sans flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined">edit_note</span>
              <span>Editar Dados do Colaborador</span>
            </h3>
            <p className="text-xs text-gray-400 font-sans mb-4">
              Atualize as informações de cadastro e autenticação de segurança do colaborador.
            </p>

            <form onSubmit={handleSaveEditEmployee} className="space-y-4 text-left">
              {/* Name */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                  NOME COMPLETO *
                </label>
                <input
                  type="text"
                  required
                  value={editColabName}
                  onChange={(e) => setEditColabName(e.target.value)}
                  placeholder="Ex: Carlos Heitor"
                  className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-800"
                />
              </div>

              {/* CPF */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                  CPF (SOMENTE NÚMEROS) *
                </label>
                <input
                  type="text"
                  required
                  pattern="\d{11}"
                  maxLength={11}
                  value={editColabCpf}
                  onChange={(e) => setEditColabCpf(e.target.value)}
                  placeholder="Ex: 55611245699"
                  className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Matricula */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                    MATRÍCULA *
                  </label>
                  <input
                    type="text"
                    required
                    value={editColabMatricula}
                    onChange={(e) => setEditColabMatricula(e.target.value)}
                    placeholder="Ex: MAT-556112"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-800"
                  />
                </div>

                {/* Project selector */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                    PROJETO *
                  </label>
                  <select
                    value={editColabProject}
                    onChange={(e) => setEditColabProject(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-700"
                  >
                    <option>Hub de Inovação</option>
                    <option>Operação Delta</option>
                    <option>Núcleo Financeiro</option>
                    <option>Logística</option>
                    <option>R&S</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                  EMAIL CORPORATIVO
                </label>
                <input
                  type="email"
                  value={editColabEmail}
                  onChange={(e) => setEditColabEmail(e.target.value)}
                  placeholder="Ex: carlos@mk9trade.com"
                  className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-800"
                />
              </div>

              {/* statusLGPD */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                  STATUS AUTORIZAÇÃO WHATSAPP *
                </label>
                <select
                  value={editColabStatusLgpd}
                  onChange={(e) => setEditColabStatusLgpd(e.target.value as "VERIFICADO" | "PENDENTE")}
                  className="w-full bg-[#f8f9fd] border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-sans focus:border-primary focus:outline-none text-gray-700 font-medium"
                >
                  <option value="VERIFICADO">VERIFICADO (Conforme LGPD)</option>
                  <option value="PENDENTE">PENDENTE (Requer Aceite)</option>
                </select>
              </div>

              {/* Actions submit */}
              <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditingEmployee(null); }}
                  className="px-4 py-2 border border-gray-300 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  Atualizar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
