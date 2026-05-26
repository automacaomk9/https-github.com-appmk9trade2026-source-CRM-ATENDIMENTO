import { Employee, ChatSession, Alert, AutomationRule, ApiCredentials } from "./types";

export const initialEmployees: Employee[] = [];

export const initialAlerts: Alert[] = [];

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

export const initialChats: ChatSession[] = [];

