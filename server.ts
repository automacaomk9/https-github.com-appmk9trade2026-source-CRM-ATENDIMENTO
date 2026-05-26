import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

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

// Emika AI Q&A API Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history, employeeContext, customApiKey } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const client = getGeminiClient(customApiKey);
  
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
