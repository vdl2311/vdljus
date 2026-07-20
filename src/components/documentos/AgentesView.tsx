import React, { useState, useEffect } from "react";
import {
  Bot,
  Play,
  Terminal,
  Loader2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  FileText,
} from "lucide-react";
export const AgentesView: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState("jurisprudence");
  const [inputQuery, setInputQuery] = useState(
    "Jurisprudência sobre rescisão contratual sem justa causa e aviso prévio indenizado.",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [agentResult, setAgentResult] = useState("");
  const agents = [
    {
      id: "jurisprudence",
      name: "Agente Pesquisador de Jurisprudência",
      desc: "Varre repositórios de tribunais superiores (STJ/STF) e tribunais estaduais (TJ) em busca de acórdãos paradigmas e enunciados de súmulas relevantes.",
      placeholder: "Termo de busca jurídica...",
    },
    {
      id: "lgpd",
      name: "Agente Auditor LGPD & Segurança",
      desc: "Examina contratos corporativos de TI, SaaS e prestação de serviços para certificar conformidade completa com a Lei Geral de Proteção de Dados.",
      placeholder: "Cole o contrato ou termos regulamentados...",
    },
    {
      id: "apelação",
      name: "Agente Analista de Apelações",
      desc: "Audita sentenças de primeiro grau para extrair nulidades processuais, cerceamento de defesa e vícios de fundamentação para apelar com segurança.",
      placeholder: "Cole a sentença de primeiro grau...",
    },
  ]; // Simulated agent thoughts
  const thoughtLogs: Record<string, string[]> = {
    jurisprudence: [
      "Iniciando sub-rotina de busca jurisprudencial...",
      "Acessando base de dados do Supremo Tribunal Federal (STF)...",
      "Filtrando acórdãos por relevância temática e data de publicação...",
      "Identificando Súmula Vinculante aplicável ao litígio...",
      "Cruzando resultados com precedentes obrigatórios do Superior Tribunal de Justiça (STJ)...",
      "Compilando relatório sintético de ementas paradigmas.",
    ],
    lgpd: [
      "Iniciando auditoria regulatória de privacidade...",
      "Identificando termos de transferência internacional de dados pessoais...",
      "Avaliando atribuições e obrigações do DPO (Encarregado) e Operadores...",
      "Analisando cláusulas de notificação de incidentes de segurança cibernética...",
      "Auditando conformidade de prazos com as diretrizes da ANPD...",
      "Formatando relatório de adequação LGPD com ações recomendadas.",
    ],
    apelação: [
      "Carregando sentença judicial para auditoria técnica...",
      "Mapeando histórico e cronologia processual do processo de origem...",
      "Varrendo julgado para identificar vícios de fundamentação ou contradição...",
      "Analisando pedidos julgados procedentes em confronto com provas dos autos...",
      "Investigando preclusão consumativa ou cerceamento de direito de defesa...",
      "Redigindo estrutura formal de recurso apelatório fundamentado.",
    ],
  };
  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    setIsLoading(true);
    setAgentResult("");
    setProgressStep(0);
    setLogs([]); // Run custom sequential log animations
    const activeThoughts = thoughtLogs[selectedAgent] || [];
    let currentStep = 0;
    const logInterval = setInterval(() => {
      if (currentStep < activeThoughts.length) {
        setLogs((prev) => [...prev, `[INFO] ${activeThoughts[currentStep]}`]);
        setProgressStep(currentStep + 1);
        currentStep++;
      } else {
        clearInterval(logInterval);
        triggerBackendRun();
      }
    }, 1500);
  };
  const triggerBackendRun = async () => {
    try {
      const response = await fetch("/api/agentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: selectedAgent, query: inputQuery }),
      });
      if (!response.ok) throw new Error("Agent run failed");
      const data = await response.json();
      setLogs((prev) => [
        ...prev,
        "[SUCESSO] Agente concluiu as tarefas autônomas de forma regular.",
      ]);
      setAgentResult(data.text);
    } catch (err) {
      console.error(err);
      setLogs((prev) => [
        ...prev,
        "[ERRO] Erro crítico na execução da sub-rotina do agente.",
      ]);
    } finally {
      setIsLoading(false);
    }
  }; // Change default input queries on selection change useEffect(() => { if (selectedAgent === "jurisprudence") { setInputQuery("Jurisprudência sobre rescisão contratual sem justa causa e aviso prévio indenizado."); } else if (selectedAgent === "lgpd") { setInputQuery("Contrato de Licenciamento de Software SaaS corporativo entre Aliança SA e TechCore Ltda contendo cláusulas de compartilhamento de logs."); } else if (selectedAgent === "apelação") { setInputQuery("Sentença que julgou improcedente o pedido de danos morais sob fundamento de mero aborrecimento cotidiano em caso de atraso de vôo de 18 horas."); } }, [selectedAgent]); return ( <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors"> {/* Header */} <div className="text-left"> <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Agentes Autônomos IA</h2> <p className="text-xs text-muted-foreground">Delegue tarefas complexas de auditoria ou pesquisa e receba relatórios estruturados de forma assíncrona.</p> </div> <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* Left column: Agent selector and input parameters (1 column) */} <div className="space-y-6 text-left"> {/* Selector */} <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4"> <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5"> <Bot className="w-4.5 h-4.5 text-cyan-500" /> Selecionar Agente Executor </h3> <div className="space-y-2"> {agents.map(a => ( <button key={a.id} onClick={() => !isLoading && setSelectedAgent(a.id)} className={`w-full text-left p-3 border rounded-xl transition-all cursor-pointer ${ selectedAgent === a.id ? "bg-cyan-50 border-cyan-500 dark:bg-cyan-950/40 dark:border-cyan-500/80" : "bg-background/10 border-border hover:border-border dark:hover:border-border" }`} > <span className={`text-xs font-bold block ${ selectedAgent === a.id ? "text-cyan-600 dark:text-cyan-400" : "text-foreground " }`}> {a.name} </span> <span className="text-[10px] text-muted-foreground mt-1 block leading-snug">{a.desc}</span> </button> ))} </div> </div> {/* Form parameters */} <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left"> <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Directivas do Agente</h3> <form onSubmit={handleRunAgent} className="space-y-4"> <div className="space-y-1.5"> <label className="text-[10px] text-muted-foreground font-bold uppercase block">Query / Diretivas Específicas</label> <textarea required placeholder={agents.find(a => a.id === selectedAgent)?.placeholder || "Digite o que o agente deve buscar..."} value={inputQuery} onChange={(e) => setInputQuery(e.target.value)} rows={4} className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0 resize-none font-sans" /> </div> <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-md transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer" > {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />} Disparar Agente Autônomo </button> </form> </div> </div> {/* Right column: Terminal thoughts and deliverables (2 columns) */} <div className="lg:col-span-2 space-y-6 text-left"> {/* Terminal Console Thoughts */} <div className="p-5 bg-background border border-slate-900 rounded-xl shadow-lg flex flex-col h-48"> <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-900"> <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5"> <Terminal className="w-3.5 h-3.5" /> console_trace@jusflow-agent-vm </span> {isLoading && ( <span className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold"> <Loader2 className="w-3 h-3 animate-spin" /> Executando sub-rotina {progressStep}/6 </span> )} </div> <div className="flex-1 overflow-y-auto font-mono text-[10px] text-muted-foreground space-y-1 pr-1 select-all no-scrollbar"> {logs.map((log, idx) => ( <div key={idx} className={log.includes("[SUCESSO]") ? "text-emerald-400" : log.includes("[ERRO]") ? "text-rose-400" : ""}> {log} </div> ))} {logs.length === 0 && ( <div className="text-muted-foreground text-center py-10">Aguardando disparo do agente...</div> )} </div> </div> {/* Deliverables Panel */} <div className="p-5 bg-card border border-border rounded-xl shadow-sm h-80 flex flex-col"> <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5 shrink-0"> <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Relatório Consolidado de Entrega </h3> <div className="flex-1 border border-border/80 bg-muted/40 /20 rounded-md p-4 overflow-y-auto text-xs text-foreground leading-relaxed whitespace-pre-wrap no-scrollbar select-all"> {isLoading ? ( <div className="h-full flex flex-col items-center justify-center text-center animate-pulse text-muted-foreground"> <Bot className="w-8 h-8 text-cyan-500 animate-spin mb-3" /> <p className="font-bold">Agente trabalhando em sandbox apartada...</p> <p className="text-[9px] mt-1 max-w-xs">Os resultados serão estruturados e impressos nesta seção assim que a varredura for concluída.</p> </div> ) : agentResult ? ( agentResult ) : ( <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground"> <FileText className="w-8 h-8 text-muted-foreground mb-2" /> <p className="font-bold">Nenhum resultado gerado</p> <p className="text-[9px] mt-1 max-w-xs">Após o término dos logs do console, o relatório jurídico de entrega será renderizado aqui.</p> </div> )} </div> <div className="mt-3 text-[10px] text-muted-foreground flex items-center gap-1.5 shrink-0"> <ShieldCheck className="w-4 h-4 text-emerald-500" /> <span>Assinado digitalmente por JusFlow Agentic System (OAB-Regular)</span> </div> </div> </div> </div> </div> );
};
