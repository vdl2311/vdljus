import React, { useState, useEffect } from "react";
import { Key, CheckCircle2, AlertCircle, Shield, Sparkles, X, RefreshCw, Cpu, Database } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [openaiKey, setOpenopenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [datajudKey, setDatajudKey] = useState("");
  
  const [testStatus, setTestStatus] = useState<Record<string, "idle" | "testing" | "success" | "error">>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOpenrouterKey(localStorage.getItem("openrouter_api_key") || localStorage.getItem("jusflow_api_key") || "");
      setOpenopenaiKey(localStorage.getItem("openai_api_key") || "");
      setGeminiKey(localStorage.getItem("gemini_api_key") || "");
      setGroqKey(localStorage.getItem("groq_api_key") || "");
      setDatajudKey(localStorage.getItem("datajud_api_key") || "");
      setSavedSuccess(false);
      setTestStatus({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (openrouterKey.trim()) localStorage.setItem("openrouter_api_key", openrouterKey.trim());
    else localStorage.removeItem("openrouter_api_key");

    if (openaiKey.trim()) localStorage.setItem("openai_api_key", openaiKey.trim());
    else localStorage.removeItem("openai_api_key");

    if (geminiKey.trim()) localStorage.setItem("gemini_api_key", geminiKey.trim());
    else localStorage.removeItem("gemini_api_key");

    if (groqKey.trim()) localStorage.setItem("groq_api_key", groqKey.trim());
    else localStorage.removeItem("groq_api_key");

    if (datajudKey.trim()) localStorage.setItem("datajud_api_key", datajudKey.trim());
    else localStorage.removeItem("datajud_api_key");

    // Also update generic legacy key
    if (openrouterKey.trim()) localStorage.setItem("jusflow_api_key", openrouterKey.trim());

    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const testCopilot = async () => {
    setTestStatus((prev) => ({ ...prev, copilot: "testing" }));
    try {
      const res = await fetch("/api/copiloto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(openrouterKey ? { "x-openrouter-key": openrouterKey } : {}),
          ...(openaiKey ? { "x-openai-key": openaiKey } : {}),
        },
        body: JSON.stringify({
          message: "Teste de conexão IA do Copiloto Jurídico",
          openrouterKey,
          openaiKey,
        }),
      });
      if (res.ok) {
        setTestStatus((prev) => ({ ...prev, copilot: "success" }));
      } else {
        setTestStatus((prev) => ({ ...prev, copilot: "error" }));
      }
    } catch {
      setTestStatus((prev) => ({ ...prev, copilot: "error" }));
    }
  };

  const testDataJud = async () => {
    setTestStatus((prev) => ({ ...prev, datajud: "testing" }));
    try {
      const res = await fetch("/api/datajud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(datajudKey ? { "x-datajud-key": datajudKey } : {}),
        },
        body: JSON.stringify({
          cnj: "50123456720268260100",
        }),
      });
      if (res.ok) {
        setTestStatus((prev) => ({ ...prev, datajud: "success" }));
      } else {
        setTestStatus((prev) => ({ ...prev, datajud: "error" }));
      }
    } catch {
      setTestStatus((prev) => ({ ...prev, datajud: "error" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-xl w-full p-6 text-left relative space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Configuração de Chaves & Integrações
            </h2>
            <p className="text-xs text-muted-foreground">
              Insira suas chaves de API (OpenAI, OpenRouter, Google Gemini, Groq ou DataJud CNJ). Elas funcionam instantaneamente na aplicação e no Copiloto.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Chaves salvas com sucesso na sessão!</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* OpenAI Key */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-500" /> OpenAI API Key (GPT-4o-mini / GPT-4o)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">OPENAI_API_KEY</span>
            </label>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenopenaiKey(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* OpenRouter Key */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> OpenRouter API Key (Multi-LLM)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">OPENROUTER_API_KEY</span>
            </label>
            <input
              type="password"
              placeholder="sk-or-v1-..."
              value={openrouterKey}
              onChange={(e) => setOpenrouterKey(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Google Gemini Key */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Google Gemini / Google API Key
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">GEMINI_API_KEY</span>
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Groq Key */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-500" /> Groq API Key (Llama 3 Ultra-fast)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">GROQ_API_KEY</span>
            </label>
            <input
              type="password"
              placeholder="gsk_..."
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* DataJud CNJ Key */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-500" /> DataJud CNJ API Key (Base Pública CNJ)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">DATAJUD_API_KEY</span>
            </label>
            <input
              type="password"
              placeholder="cDZpQnlOWWJfc0Jo..."
              value={datajudKey}
              onChange={(e) => setDatajudKey(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action buttons & tests */}
        <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={testCopilot}
              disabled={testStatus.copilot === "testing"}
              className="px-3 py-1.5 bg-muted hover:bg-accent text-foreground rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer text-xs flex-1 sm:flex-initial justify-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus.copilot === "testing" ? "animate-spin" : ""}`} />
              <span>Testar Copiloto IA</span>
            </button>
            {testStatus.copilot === "success" && <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> OK</span>}
            {testStatus.copilot === "error" && <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Falha</span>}

            <button
              onClick={testDataJud}
              disabled={testStatus.datajud === "testing"}
              className="px-3 py-1.5 bg-muted hover:bg-accent text-foreground rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer text-xs flex-1 sm:flex-initial justify-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus.datajud === "testing" ? "animate-spin" : ""}`} />
              <span>Testar DataJud</span>
            </button>
            {testStatus.datajud === "success" && <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> OK</span>}
            {testStatus.datajud === "error" && <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Falha</span>}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
            >
              Salvar Chaves
            </button>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Dica para Vercel: Se configurou variáveis no painel da Vercel (`OPENAI_API_KEY`, etc.), certifique-se de clicar em <strong>Redeploy</strong> na Vercel para que o servidor as carregue.
        </p>
      </div>
    </div>
  );
};
