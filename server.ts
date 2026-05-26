import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

const EMPLOYEES_FILE = path.join(process.cwd(), "employees.json");
const SESSIONS_FILE = path.join(process.cwd(), "sessions.json");
const ALERTS_FILE = path.join(process.cwd(), "alerts.json");

// Lazy-initialize Supabase client
let supabaseClient: any = null;

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (url && key && url !== "MY_SUPABASE_URL" && key !== "MY_SUPABASE_ANON_KEY" && url.trim() !== "" && key.trim() !== "") {
    if (!supabaseClient) {
      try {
        supabaseClient = createClient(url, key);
        console.log("Successfully initialized Supabase client.");
      } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
      }
    }
    return supabaseClient;
  }
  return null;
}

// Helper to load local fallback data or create it if not present
function loadLocalEmployees() {
  if (fs.existsSync(EMPLOYEES_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(EMPLOYEES_FILE, "utf-8"));
      if (Array.isArray(data)) {
        return data.filter((e: any) => !["1", "2", "3", "4", "5"].includes(String(e.id)));
      }
      return [];
    } catch (e) {
      console.error("Error reading employees file, using defaults:", e);
      return [];
    }
  }
  // Initialize with empty list if file doesn't exist
  const initial: any[] = [];
  saveLocalEmployees(initial);
  return initial;
}

function saveLocalEmployees(data: any) {
  try {
    fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing employees file:", e);
  }
}

function loadLocalSessions() {
  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"));
      if (Array.isArray(data)) {
        return data;
      }
    } catch (e) {
      console.error("Error reading sessions file:", e);
    }
  }
  return [];
}

function saveLocalSessions(data: any) {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing sessions file:", e);
  }
}

function loadLocalAlerts() {
  if (fs.existsSync(ALERTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(ALERTS_FILE, "utf-8"));
      if (Array.isArray(data)) {
        return data;
      }
    } catch (e) {
      console.error("Error reading alerts file:", e);
    }
  }
  return [];
}

function saveLocalAlerts(data: any) {
  try {
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing alerts file:", e);
  }
}


app.use(express.json());

// Lazy-initialize Gemini client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const hasCustomKey = customApiKey && 
    customApiKey !== "••••••••••••••••••••••••••••••••" && 
    customApiKey !== "••••••••••••••••••••••••••••••••••••••••" &&
    customApiKey.replace(/•/g, "").trim().length > 0;

  const key = hasCustomKey ? customApiKey : process.env.GEMINI_API_KEY;

  if (key && key !== "MY_GEMINI_API_KEY") {
    try {
      // Re-create dynamically if custom key provided, otherwise cache default env key
      if (hasCustomKey) {
        return new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      }
      
      if (!aiClient) {
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        console.log("Successfully initialized default GoogleGenAI client.");
      }
      return aiClient;
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
    }
  }
  return null;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// Employee CRUD Endpoints
app.get("/api/employees", async (req, res) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("employees").select("*");
      if (!error && data) {
        console.log(`Fetched ${data.length} employees from Supabase`);
        return res.json(data);
      }
      if (error && error.message.includes("Could not find the table")) {
        console.warn("\n=== SUPABASE TABLE NOT FOUND ===");
        console.warn("Table 'public.employees' was not found in your Supabase schema.");
        console.warn("Please execute the following SQL in your Supabase SQL Editor:");
        console.warn(`
CREATE TABLE public.employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  matricula TEXT NOT NULL,
  project TEXT,
  "lastContact" TEXT,
  "lastContactTopic" TEXT,
  "statusLGPD" TEXT,
  cpf TEXT,
  email TEXT
);
        `);
        console.warn("Falling back smoothly to local file memory...\n");
      } else {
        console.warn("Supabase employees select error, falling back:", error?.message);
      }
    } catch (err) {
      console.error("Supabase SELECT failed:", err);
    }
  }
  const local = loadLocalEmployees();
  res.json(local);
});

app.post("/api/employees", async (req, res) => {
  const newEmp = req.body;
  if (!newEmp.id) {
    newEmp.id = String(Date.now());
  }
  
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("employees").insert([newEmp]).select();
      if (!error && data) {
        console.log("Successfully inserted employee in Supabase:", data[0]);
        return res.status(201).json(data[0] || newEmp);
      }
      console.warn("Supabase insert failed, storing locally:", error?.message);
    } catch (err) {
      console.error("Supabase INSERT failed:", err);
    }
  }
  
  const local = loadLocalEmployees();
  local.push(newEmp);
  saveLocalEmployees(local);
  res.status(201).json(newEmp);
});

app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const updatedEmp = req.body;
  
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("employees").update(updatedEmp).eq("id", id).select();
      if (!error && data) {
        console.log("Successfully updated employee in Supabase:", data[0]);
        return res.json(data[0] || updatedEmp);
      }
      console.warn("Supabase update failed, storing locally:", error?.message);
    } catch (err) {
      console.error("Supabase UPDATE failed:", err);
    }
  }
  
  const local = loadLocalEmployees();
  const index = local.findIndex((e: any) => e.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], ...updatedEmp };
    saveLocalEmployees(local);
    res.json(local[index]);
  } else {
    res.status(404).json({ error: "Employee not found" });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (!error) {
        console.log("Successfully deleted employee in Supabase with id:", id);
        return res.json({ success: true });
      }
      console.warn("Supabase delete failed, removing locally:", error?.message);
    } catch (err) {
      console.error("Supabase DELETE failed:", err);
    }
  }
  
  const local = loadLocalEmployees();
  const updated = local.filter((e: any) => e.id !== id);
  saveLocalEmployees(updated);
  res.json({ success: true });
});

// --- Chat Sessions CRUD Endpoints ---
app.get("/api/sessions", async (req, res) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("sessions").select("*");
      if (!error && data) {
        return res.json(data);
      }
    } catch (err) {
      console.error("Supabase select sessions error:", err);
    }
  }
  const local = loadLocalSessions();
  res.json(local);
});

app.post("/api/sessions", async (req, res) => {
  const newSession = req.body;
  if (!newSession.id) {
    newSession.id = `session-${Date.now()}`;
  }
  if (!newSession.messages) {
    newSession.messages = [];
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("sessions").insert([newSession]).select();
      if (!error && data) {
        return res.status(201).json(data[0]);
      }
    } catch (err) {
      console.error("Supabase insert session error:", err);
    }
  }

  const local = loadLocalSessions();
  const existingIndex = local.findIndex((s: any) => s.id === newSession.id);
  if (existingIndex !== -1) {
    local[existingIndex] = { ...local[existingIndex], ...newSession };
  } else {
    local.unshift(newSession);
  }
  saveLocalSessions(local);
  res.status(201).json(newSession);
});

app.put("/api/sessions/:id", async (req, res) => {
  const { id } = req.params;
  const updatedSession = req.body;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("sessions").update(updatedSession).eq("id", id).select();
      if (!error && data) {
        return res.json(data[0]);
      }
    } catch (err) {
      console.error("Supabase update session error:", err);
    }
  }

  const local = loadLocalSessions();
  const index = local.findIndex((s: any) => s.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], ...updatedSession };
    saveLocalSessions(local);
    res.json(local[index]);
  } else {
    res.status(404).json({ error: "Session not found" });
  }
});

app.delete("/api/sessions/:id", async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("sessions").delete().eq("id", id);
      if (!error) {
        return res.json({ success: true });
      }
    } catch (err) {
      console.error("Supabase delete session error:", err);
    }
  }

  const local = loadLocalSessions();
  const updated = local.filter((s: any) => s.id !== id);
  saveLocalSessions(updated);
  res.json({ success: true });
});

// --- Alerts CRUD Endpoints ---
app.get("/api/alerts", async (req, res) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("alerts").select("*");
      if (!error && data) {
        return res.json(data);
      }
    } catch (err) {
      console.error("Supabase select alerts error:", err);
    }
  }
  const local = loadLocalAlerts();
  res.json(local);
});

app.post("/api/alerts", async (req, res) => {
  const newAlert = req.body;
  if (!newAlert.id) {
    newAlert.id = `alert-${Date.now()}`;
  }
  if (!newAlert.status) {
    newAlert.status = "pending";
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("alerts").insert([newAlert]).select();
      if (!error && data) {
        return res.status(201).json(data[0]);
      }
    } catch (err) {
      console.error("Supabase insert alert error:", err);
    }
  }

  const local = loadLocalAlerts();
  local.unshift(newAlert);
  saveLocalAlerts(local);
  res.status(201).json(newAlert);
});

app.put("/api/alerts/:id", async (req, res) => {
  const { id } = req.params;
  const updatedAlert = req.body;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("alerts").update(updatedAlert).eq("id", id).select();
      if (!error && data) {
        return res.json(data[0]);
      }
    } catch (err) {
      console.error("Supabase update alert error:", err);
    }
  }

  const local = loadLocalAlerts();
  const index = local.findIndex((a: any) => a.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], ...updatedAlert };
    saveLocalAlerts(local);
    res.json(local[index]);
  } else {
    res.status(404).json({ error: "Alert not found" });
  }
});

app.delete("/api/alerts/:id", async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("alerts").delete().eq("id", id);
      if (!error) {
        return res.json({ success: true });
      }
    } catch (err) {
      console.error("Supabase delete alert error:", err);
    }
  }

  const local = loadLocalAlerts();
  const updated = local.filter((a: any) => a.id !== id);
  saveLocalAlerts(updated);
  res.json({ success: true });
});

// --- Unified WhatsApp / n8n Webhook Listener ---
app.post("/api/webhooks/whatsapp", async (req, res) => {
  const payload = req.body;
  const cpf = payload.cpf || payload.taxId || "";
  const name = payload.name || payload.senderName || payload.contactName || "Colaborador Externo";
  const text = payload.message || payload.text || payload.body || "Olá, preciso de ajuda.";
  const email = payload.email || "";
  const phone = payload.phone || payload.senderPhone || payload.from || "";
  const avatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDZUdMK5kDqPr_dktmNvqbkkrKhkJc2IMw7J1yaHWJls7LDzO8Kj3FQ_sj5JimhGNLZDT-5H8zoUscocsgoa_akQ5WfKmZjiEg-OyRSbbtAX7M8K-_K9GIICazC0CH0JN7TyAkCtloAUTLKA3y1C1GNvQBCwP8Ro9ah0CCAByHdd9iGsR9uT2rlsaQUmJrg0OT0V8lPw4fS5P6ikzca_h3vdOEPs6OPyoXPTqRzVCYbvmU8Pr1I1R5tkwpVho0rh0YtPTZCg4qsTw";

  const sessionId = phone ? `session-${phone}` : `session-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const newMessage = {
    id: `msg-${Date.now()}`,
    sender: "user" as const,
    text: text,
    time: timestamp
  };

  const localSessions = loadLocalSessions();
  const existingIndex = localSessions.findIndex((s: any) => s.id === sessionId || (phone && s.id.includes(phone)));

  let sessionToSave;

  if (existingIndex !== -1) {
    localSessions[existingIndex].messages.push(newMessage);
    const lText = text.toLowerCase();
    if (lText.includes("atendente") || lText.includes("humano") || lText.includes("urgente") || lText.includes("falar com pessoa")) {
      localSessions[existingIndex].status = "Atenção Humana";
      localSessions[existingIndex].statusLabel = "Ação Necessária: Transbordo Humano";
    }
    sessionToSave = localSessions[existingIndex];
  } else {
    sessionToSave = {
      id: sessionId,
      name: name,
      avatar: avatar,
      status: "Aguardando CPF" as const,
      statusLabel: "Status: Aguardando consentimento legal",
      project: "Trade Geral",
      matricula: phone ? `TEL-${phone}` : "MAT-WEBHOOK",
      cpf: cpf,
      email: email,
      lgpdState: cpf ? ("waiting_confirm" as const) : ("waiting_name" as const),
      messages: [newMessage]
    };
    localSessions.unshift(sessionToSave);
  }

  saveLocalSessions(localSessions);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("sessions").upsert(sessionToSave);
      console.log(`Synced session ${sessionId} to Supabase on webhook`);
    } catch (err) {
      console.error("Supabase upsert session failed during webhook:", err);
    }
  }

  const lText = text.toLowerCase();
  if (lText.includes("denuncia") || lText.includes("rescisao") || lText.includes("erro") || lText.includes("problema") || lText.includes("atendente") || lText.includes("humano")) {
    const alertId = `alert-${Date.now()}`;
    const newAlert = {
      id: alertId,
      type: lText.includes("denuncia") ? ("denuncia" as const) : lText.includes("rescisao") ? ("rescisao" as const) : ("erro-holerite" as const),
      title: lText.includes("denuncia") ? "Alerta de Denúncia" : lText.includes("rescisao") ? "Rescisão Crítica" : "Erro / Chamado de Benefício",
      time: "Agora",
      description: `Mensagem de ${name}: "${text.substring(0, 60)}${text.length > 60 ? "..." : ""}"`,
      status: "pending" as const
    };

    const localAlerts = loadLocalAlerts();
    localAlerts.unshift(newAlert);
    saveLocalAlerts(localAlerts);

    if (supabase) {
      try {
        await supabase.from("alerts").insert([newAlert]);
      } catch (err) {
        console.error("Supabase insert alert failed during webhook:", err);
      }
    }
  }

  res.json({ success: true, session: sessionToSave });
});

// Emika AI Q&A API Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history, employeeContext, customApiKey, provider, modelName } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const reqProvider = provider || "openrouter";
  const reqModel = modelName || "meta-llama/llama-3-70b-instruct";

  const hasCustomKey = customApiKey && 
    customApiKey !== "••••••••••••••••••••••••••••••••" && 
    customApiKey !== "••••••••••••••••••••••••••••••••••••••••" &&
    customApiKey.replace(/•/g, "").trim().length > 0;

  // Custom system prompt for Emika AI based on the n8n state machine and subagents guidelines
  const systemInstruction = `
Você é Emika, atendente virtual do setor de Recursos Humanos (RH) da MK9TRADE.
Você não é apenas um assistente virtual, você é uma pessoa do RH, simpática, prestativa, paciente e profissional que atende colaboradores com carinho, empatia e sem formalismo robótico.

Seu público-alvo são os colaboradores da MK9TRADE, que estão buscando tirar suas dúvidas sobre:
1. INSS (Afastamentos, perícia, como solicitar)
2. FGTS (Visualização, multas rescisórias, saque-aniversário)
3. Férias (Período aquisitivo, agendamento)
4. Benefícios (Vale Alimentação/Refeição quinzenal, Vale Transporte de 6%, Plano Odontológico Bradesco após 3 meses de experiência)
5. Rescisão (Demitido sem justa causa, pedido de demissão, justa causa, prazos de 10 dias)
6. Salário (Descontos obrigatórios de INSS, faltas injustificadas que descontam o dia e o DSR, datas de pagamento até o 5º dia útil)
7. Holerite (Onde acessar, redefinição de senha, passo a passo)

INSTRUÇÕES IMPORTANTES:
- Se identificada qualquer ofensa ou insatisfação severa, sugira transbordar para um humano (acionando o Avisar Humano).
- Seja breve, use listas scaneáveis e emojis para um tom amigável.
- Dados do colaborador atendido se disponíveis: ${JSON.stringify(employeeContext || {})}

Se o Key estiver indisponível ou ocorrer erro, responda de acordo com essas regras de forma calorosa.
`;

  // Try OpenRouter first if provider is configured as OpenRouter
  if (reqProvider === "openrouter") {
    const key = hasCustomKey ? customApiKey : process.env.OPENROUTER_API_KEY;
    if (key && key !== "MY_OPENROUTER_API_KEY") {
      try {
        console.log(`Routing chat to OpenRouter using model: ${reqModel}`);
        
        const messages: any[] = [
          { role: "system", content: systemInstruction }
        ];

        if (Array.isArray(history)) {
          for (const turn of history) {
            messages.push({
              role: turn.sender === "user" ? "user" : "assistant",
              content: turn.text || turn.transcription || ""
            });
          }
        }

        messages.push({
          role: "user",
          content: message
        });

        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`,
            "HTTP-Referer": "https://ai.studio/build",
            "X-Title": "MK9 Trade RH Portal"
          },
          body: JSON.stringify({
            model: reqModel,
            messages: messages,
            temperature: 0.7
          })
        });

        if (openRouterResponse.ok) {
          const data = await openRouterResponse.json();
          if (data && data.choices && data.choices[0] && data.choices[0].message) {
            return res.json({ text: data.choices[0].message.content });
          } else {
            console.error("OpenRouter invalid response structure:", JSON.stringify(data));
          }
        } else {
          const errText = await openRouterResponse.text();
          console.error(`OpenRouter Error status ${openRouterResponse.status}:`, errText);
        }
      } catch (err: any) {
        console.error("Failed to fetch OpenRouter content:", err);
      }
    }
  }

  // Fallback / standard Google Gemini Client
  const client = getGeminiClient(customApiKey);
  if (client) {
    try {
      // Structure contents with history for full conversational context
      const contents = [];
      
      // Map history to Gemini API expected chat format
      if (Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: turn.sender === "user" ? "user" : "model",
            parts: [{ text: turn.text || turn.transcription || "" }]
          });
        }
      }
      
      // Append newest user message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini Generation Error:", err);
      // Fallback to elegant local responder below on failure
    }
  }

  // --- LOCAL SIMULATED LLM RESPONSES (Fallback if Gemini client or API Key is missing/fails) ---
  const lowerMsg = message.toLowerCase();
  let reply = "Olá! Desculpe, tive um probleminha para processar a resposta agora, mas posso te passar as orientações gerais do RH da MK9. ";

  if (lowerMsg.includes("oi") || lowerMsg.includes("olá") || lowerMsg.includes("bom dia") || lowerMsg.includes("boa tarde") || lowerMsg.includes("boa noite")) {
    const nomeColab = employeeContext?.name ? `${employeeContext.name.split(" ")[0]}` : "colaborador";
    reply = `Olá, ${nomeColab}! 😊 Aqui é a Emika, do RH da MK9TRADE. Como posso ajudar você hoje com suas dúvidas trabalhistas ou benefícios?`;
  } else if (lowerMsg.includes("holerite") || lowerMsg.includes("contracheque") || lowerMsg.includes("folha")) {
    reply = `Sobre seu **Holerite** 📄:\n\n• Ele é enviado mensalmente para seu e-mail cadastrado.\n• Verifique no spam ou lixo eletrônico.\n• Você pode reciclar sua senha diretamente no portal clicando em "Esqueci minha senha".\n• Se precisar do passo a passo completo ou do arquivo PDF, me avise!`;
  } else if (lowerMsg.includes("fgts") || lowerMsg.includes("fundo de garantia")) {
    reply = `Sobre o seu **FGTS** 💰:\n\n• **Saque-Rescisão:** É a modalidade padrão após demissão sem justa causa. O comprovante enviado pela empresa serve como chave de liberação.\n• **Extrato:** Você pode baixar no app oficial do FGTS e ver todos os depósitos da MK9.\n• **Multa:** Multa de 40% sobre o saldo acumulado (paga apenas na demissão sem justa causa).`;
  } else if (lowerMsg.includes("férias") || lowerMsg.includes("ferias") || lowerMsg.includes("período aquisitivo")) {
    reply = `Sobre as **Férias** 🏖️:\n\n1. **Período Aquisitivo:** 12 meses de trabalho consecutivo para adquirir o direito a 30 dias.\n2. **Agendamento:** Combine previamente com seu gestor de Trade e aguarde a formalização pelo DP.\n3. **Pagamento:** O salário de férias + o terço constitucional são pagos até 2 dias úteis antes de você iniciar seu descanso.`;
  } else if (lowerMsg.includes("diferença") || lowerMsg.includes("erro") || lowerMsg.includes("desconto") || lowerMsg.includes("faltas")) {
    reply = `Identificou algum desconto ou divergência no seu contracheque? 🔍\n\nPor favor, me informe o **mês de referência** e se houve alguma falta justificada (enviou atestado?). Faltas injustificadas descontam o dia e também o DSR (Descanso Semanal Remunerado). Se precisar, posso abrir um chamado para o DP investigar pessoalmente.`;
  } else if (lowerMsg.includes("benefício") || lowerMsg.includes("va") || lowerMsg.includes("vr") || lowerMsg.includes("transporte") || lowerMsg.includes("odonto")) {
    reply = `Sobre os seus **Benefícios** 🍽️🚌:\n\n• **VA / VR:** Pagamento quinzenal (duas parcelas por mês do seu ticket alimentação/refeição).\n• **VT:** Desconto padrão de 6% sobre o salário base em folha.\n• **Plano Odontológico:** Bradesco Odonto é 100% gratuito (sem custo para o colaborador) após completar os 3 meses de experiência.`;
  } else {
    reply = `Entendi sua dúvida sobre "${message}". Como atendente virtual, recomendo verificar as regras do nosso Guia de RH. Se você quiser posso encaminhar essa solicitação para transbordo para que um especialista de RH fale com você diretamente! Deseja que eu acione o nosso time? 😊`;
  }

  return res.json({ text: reply });
});

// Setup Vite Dev Server / Static Hosting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file fallback...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MK9 Client-Server active at http://localhost:${PORT}`);
  });
}

startServer();
