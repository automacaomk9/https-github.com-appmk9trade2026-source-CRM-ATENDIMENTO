import { Employee, ChatSession, Alert, AutomationRule, ApiCredentials } from "./types";

export const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Adriana Martins",
    matricula: "MAT-982310",
    project: "Hub de Inovação",
    lastContact: "Hoje, 10:45",
    lastContactTopic: "Dúvida sobre Holerite",
    statusLGPD: "VERIFICADO",
    cpf: "98231045612",
    email: "adriana.martins@mk9trade.com"
  },
  {
    id: "2",
    name: "Ricardo Silva",
    matricula: "MAT-774122",
    project: "Operação Delta",
    lastContact: "12 Out, 2023",
    lastContactTopic: "Onboarding de Benefícios",
    statusLGPD: "PENDENTE",
    cpf: "77412245622",
    email: "ricardo.silva@mk9trade.com"
  },
  {
    id: "3",
    name: "Lúcia Costa",
    matricula: "MAT-120934",
    project: "Núcleo Financeiro",
    lastContact: "Ontem, 16:15",
    lastContactTopic: "Solicitação de Férias",
    statusLGPD: "VERIFICADO",
    cpf: "12093445633",
    email: "lucia.costa@mk9trade.com"
  },
  {
    id: "4",
    name: "Marcos Vinícius",
    matricula: "MAT-203512",
    project: "Logística",
    lastContact: "Há 14 mins",
    lastContactTopic: "Cálculos de Aviso Prévio",
    statusLGPD: "VERIFICADO",
    cpf: "12345678900",
    email: "marcos.vinicius@mk9trade.com"
  },
  {
    id: "5",
    name: "João Castro",
    matricula: "MAT-556112",
    project: "R&S",
    lastContact: "Hoje, 11:20",
    lastContactTopic: "Aguardando CPF",
    statusLGPD: "PENDENTE",
    cpf: "55611245699",
    email: "joao.castro@candidate.com"
  }
];

export const initialAlerts: Alert[] = [
  {
    id: "alert-1",
    type: "denuncia",
    title: "Denúncia Anônima",
    time: "há 2 mins",
    description: "Possível caso de assédio relatado no Setor de Logística.",
    status: "pending"
  },
  {
    id: "alert-2",
    type: "rescisao",
    title: "Rescisão Crítica",
    time: "há 14 mins",
    description: "Funcionário Marcos V. questionando cálculos de aviso prévio.",
    status: "pending"
  },
  {
    id: "alert-3",
    type: "erro-holerite",
    title: "Erro de Holerite",
    time: "há 1h",
    description: "5+ usuários relatando atraso na visualização do PDF de Julho.",
    status: "pending"
  }
];

export const initialAutomationRules: AutomationRule[] = [
  {
    id: "rule-1",
    title: "Envio Automático de PDF",
    desc: "Envia instantaneamente o Holerite via WhatsApp ao gerar no sistema.",
    active: true
  },
  {
    id: "rule-2",
    title: "Bloqueio de Verificação LGPD",
    desc: "Forçar validação rigorosa de ID/CPF antes de exibir dados sensíveis da folha.",
    active: true
  }
];

export const initialApiCredentials: ApiCredentials = {
  instanceName: "MK9_PROD_01",
  apiKey: "••••••••••••••••••••••••••••••••",
  modelName: "llama3-70b-v2",
  availableQuota: "84% de Tokens",
  webhookUrl: "https://api.mk9.hr/v1/webhook/whatsapp-inc...",
  provider: "openrouter"
};

export const initialChats: ChatSession[] = [
  {
    id: "session-1",
    name: "Felipe S.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZUdMK5kDqPr_dktmNvqbkkrKhkJc2IMw7J1yaHWJls7LDzO8Kj3FQ_sj5JimhGNLZDT-5H8zoUscocsgoa_akQ5WfKmZjiEg-OyRSbbtAX7M8K-_K9GIICazC0CH0JN7TyAkCtloAUTLKA3y1C1GNvQBCwP8Ro9ah0CCAByHdd9iGsR9uT2rlsaQUmJrg0OT0V8lPw4fS5P6ikzca_h3vdOEPs6OPyoXPTqRzVCYbvmU8Pr1I1R5tkwpVho0rh0YtPTZCg4qsTw",
    status: "Atenção Humana",
    statusLabel: "Ação Necessária: Transbordo Humano",
    project: "Projeto Ambev",
    matricula: "#2026",
    cpf: "123.456.789-00",
    email: "felipe.santos@amtrade.com",
    lgpdState: "verified",
    messages: [
      {
        id: "msg-1-1",
        sender: "emika",
        text: "Olá! Sou a Emika, sua assistente de RH. Como posso ajudar você hoje? Por favor, informe seu CPF para que eu possa localizar seu cadastro.",
        time: "13:58"
      },
      {
        id: "msg-1-2",
        sender: "user",
        isAudio: true,
        audioDuration: "0:12",
        transcription: "Oi, é o Felipe. Meu CPF é 123.456.789-00. Eu preciso urgentemente do meu último contracheque para uma aplicação de empréstimo habitacional.",
        time: "14:01"
      },
      {
        id: "msg-1-3",
        sender: "system",
        text: "Fluxo n8n: Solicitação complexa detectada. Iniciando transbordo para agente humano.",
        time: "14:02"
      },
      {
        id: "msg-1-4",
        sender: "emika",
        text: "Entendi, Felipe. Como se trata de um documento para comprovação de renda e você mencionou urgência, estou transferindo este chat para um de nossos especialistas em RH. Um momento, por favor.",
        time: "14:02"
      }
    ]
  },
  {
    id: "session-2",
    name: "Maria Oliveira",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    status: "LGPD Verificada",
    statusLabel: "LGPD Verificada",
    project: "Operação Delta",
    matricula: "#3015",
    cpf: "456.789.012-33",
    email: "maria.oliveira@delta.com",
    lgpdState: "verified",
    messages: [
      {
        id: "msg-2-1",
        sender: "emika",
        text: "Olá, Maria! Vi aqui que seu saldo de Vale-Alimentação foi ajustado. Ficou alguma dúvida sobre o desconto da parcela?",
        time: "13:30"
      },
      {
        id: "msg-2-2",
        sender: "user",
        text: "Obrigada, Emika! Tudo certo agora. Já consegui ver as datas certinho.",
        time: "13:45"
      },
      {
        id: "msg-2-3",
        sender: "emika",
        text: "Excelente! Se precisar de algo mais, estou por aqui. Tenha um ótimo dia de trabalho! 😊",
        time: "13:46"
      }
    ]
  },
  {
    id: "session-3",
    name: "João Castro",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    status: "Aguardando CPF",
    statusLabel: "Aguardando CPF",
    project: "R&S",
    matricula: "#5561",
    cpf: "Exemplo: 556...",
    email: "joao.castro@candidate.com",
    lgpdState: "waiting_cpf",
    messages: [
      {
        id: "msg-3-1",
        sender: "emika",
        text: "Prazer, João! 💛 Para acessar suas informações com segurança, preciso da sua autorização conforme a LGPD. Você autoriza?",
        time: "11:15"
      },
      {
        id: "msg-3-2",
        sender: "user",
        text: "Sim, eu autorizo.",
        time: "11:19"
      },
      {
        id: "msg-3-3",
        sender: "emika",
        text: "Autorização registrada! ✅ Agora, por favor, me informe seu CPF (somente números):",
        time: "11:20"
      }
    ]
  }
];
