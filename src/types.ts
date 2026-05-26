export interface Employee {
  id: string;
  name: string;
  matricula: string;
  project: string;
  lastContact: string;
  lastContactTopic: string;
  statusLGPD: 'VERIFICADO' | 'PENDENTE';
  cpf: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'emika' | 'system';
  text?: string;
  time: string;
  isAudio?: boolean;
  audioDuration?: string;
  transcription?: string;
  isFile?: boolean;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
}

export interface ChatSession {
  id: string;
  name: string;
  avatar: string;
  status: 'Atenção Humana' | 'LGPD Verificada' | 'Aguardando CPF';
  statusLabel: string;
  project: string;
  matricula: string;
  cpf: string;
  email: string;
  messages: ChatMessage[];
  lgpdState: 'waiting_name' | 'waiting_auth' | 'waiting_cpf' | 'waiting_confirm' | 'verified' | null;
  tempName?: string;
  tempCPF?: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  desc: string;
  active: boolean;
}

export interface ApiCredentials {
  instanceName: string;
  apiKey: string;
  modelName: string;
  availableQuota: string;
  webhookUrl: string;
  provider?: 'gemini' | 'openrouter';
}

export interface Alert {
  id: string;
  type: 'denuncia' | 'rescisao' | 'erro-holerite';
  title: string;
  time: string;
  description: string;
  status: 'pending' | 'resolved';
}
