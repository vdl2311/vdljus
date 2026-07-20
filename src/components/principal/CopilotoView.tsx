import React, { useState, useRef, useEffect } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Sparkles,
  Send,
  Sparkle,
  Loader2,
  ArrowRight,
  CornerDownLeft,
  Bot,
  User,
} from "lucide-react";
export const CopilotoView: React.FC = () => {
  const { processes, deadlines, financials, clients, teamMembers } =
    useJusFlow();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content: `Olá! Sou o **JusFlow Copiloto**, o assistente cognitivo do seu escritório. Compreendo as causas vigentes, faturamento financeiro, prazos da equipe e as regras do Código de Ética da OAB. Como posso apoiar sua atuação jurídica hoje?`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null); // Suggested Prompts
  const suggestions = [
    {
      label: "Prazos da semana",
      prompt:
        "Quais são todos os prazos e compromissos críticos agendados para esta semana?",
    },
    {
      label: "Inadimplentes",
      prompt:
        "Existem clientes inadimplentes ou honorários pendentes este mês? Se sim, quem?",
    },
    {
      label: "Resumo de processo",
      prompt:
        "Faça um resumo executivo estratégico do processo tributário de R$ 850 mil da Aliança.",
    },
    {
      label: "Audiências agendadas",
      prompt:
        "Temos alguma audiência marcada? Qual é o processo, data e link se houver?",
    },
    {
      label: "Processos por Área",
      prompt:
        "Quantos processos temos cadastrados no escritório e como estão divididos por área de atuação?",
    },
    {
      label: "Relatório Financeiro",
      prompt:
        "Dê um relatório consolidado do financeiro deste mês: quanto recebemos, quanto gastamos e qual é o saldo líquido?",
    },
    {
      label: "Processos Parados",
      prompt:
        "Quais processos estão sem movimentação recente e qual ação de impulso você recomenda?",
    },
    {
      label: "Sugestão de Argumentos",
      prompt:
        "Quais argumentos de Código de Defesa do Consumidor você sugere para refutar cobrança indevida de operadora?",
    },
  ]; // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMessage = text.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true); // Prepare context data to feed the Gemini API
    const contextData = {
      prazos: deadlines.map((d) => ({
        titulo: d.title,
        data: d.date,
        concluido: d.completed,
        prioridade: d.priority,
      })),
      processos: processes.map((p) => ({
        cnj: p.cnj,
        titulo: p.title,
        area: p.area,
        risco: p.risk,
        cliente: p.clientName,
        valor: p.value,
        status: p.status,
        ultimoAndamento: p.lastMovementDate,
      })),
      faturamento: financials.map((f) => ({
        titulo: f.title,
        valor: f.amount,
        tipo: f.type,
        status: f.status,
        data: f.date,
      })),
      equipe: teamMembers.map((t) => ({
        nome: t.name,
        papel: t.role,
        oab: t.oab,
      })),
    };
    try {
      const response = await fetch("/api/copiloto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages
            .slice(-5)
            .map((m) => ({ role: m.role, content: m.content })),
          contextData,
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Oops! Desculpe, tive uma instabilidade na minha conexão. Por favor, tente enviar novamente em instantes.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }; // Basic formatter to render bold, bullet points, headers elegantly in HTML
  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      let content = line; // Headers
      if (content.startsWith("### ")) {
        return (
          <h4
            key={i}
            className="text-xs font-bold uppercase text-emerald-400 mt-3 mb-1.5"
          >
            {content.substring(4)}
          </h4>
        );
      }
      if (content.startsWith("## ")) {
        return (
          <h3 key={i} className="text-sm font-bold text-foreground mt-4 mb-2">
            {content.substring(3)}
          </h3>
        );
      }
      if (content.startsWith("# ")) {
        return (
          <h2 key={i} className="text-base font-bold text-foreground mt-5 mb-3">
            {content.substring(2)}
          </h2>
        );
      } // Bullet points
      if (content.trim().startsWith("- ") || content.trim().startsWith("* ")) {
        const cleanText = content.trim().substring(2);
        return (
          <li
            key={i}
            className="ml-4 list-disc text-xs text-muted-foreground mb-1"
          >
            {" "}
            {parseBold(cleanText)}{" "}
          </li>
        );
      } // Number list
      if (/^\d+\.\s/.test(content.trim())) {
        const cleanText = content.trim().replace(/^\d+\.\s/, "");
        const num = content.trim().match(/^\d+/)?.[0];
        return (
          <div
            key={i}
            className="flex gap-2 text-xs text-muted-foreground ml-2 mb-1.5"
          >
            {" "}
            <span className="font-bold text-emerald-400">{num}.</span>{" "}
            <div className="flex-1">{parseBold(cleanText)}</div>{" "}
          </div>
        );
      } // Empty line
      if (!content.trim()) return <div key={i} className="h-2" />;
      return (
        <p
          key={i}
          className="text-xs text-muted-foreground leading-relaxed mb-1.5"
        >
          {parseBold(content)}
        </p>
      );
    });
  }; // Inline bold parser
  const parseBold = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="text-emerald-300 font-bold">
          {part}
        </strong>
      ) : (
        part
      ),
    );
  };
  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-background text-card-foreground">
      {" "}
      {/* Main Chat Area */}{" "}
      <div className="flex-1 flex flex-col h-full border-r border-slate-900 overflow-hidden relative">
        {" "}
        {/* Chat History Container */}{" "}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {" "}
          {messages.map((m, idx) => {
            const isAI = m.role === "assistant";
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] text-left ${isAI ? "self-start" : "self-end ml-auto flex-row-reverse"}`}
              >
                {" "}
                {/* Avatar */}{" "}
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 shadow-md ${isAI ? "bg-emerald-600 text-white" : "bg-muted text-card-foreground"}`}
                >
                  {" "}
                  {isAI ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}{" "}
                </div>{" "}
                {/* Bubble content */}{" "}
                <div
                  className={`p-4 rounded-xl border ${isAI ? "bg-card border-border/80 rounded-tl-none shadow-sm" : "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 rounded-tr-none text-emerald-900 dark:text-emerald-100 shadow-sm shadow-emerald-950/10"}`}
                >
                  {" "}
                  {isAI ? (
                    <div className="space-y-0.5">
                      {formatContent(m.content)}
                    </div>
                  ) : (
                    <p className="text-xs text-foreground leading-relaxed font-medium">
                      {m.content}
                    </p>
                  )}{" "}
                </div>{" "}
              </div>
            );
          })}{" "}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] self-start text-left">
              {" "}
              <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 animate-spin">
                {" "}
                <Loader2 className="w-4 h-4" />{" "}
              </div>{" "}
              <div className="p-4 bg-card border border-border rounded-xl rounded-tl-none flex items-center gap-2">
                {" "}
                <span className="text-xs text-muted-foreground">
                  Copiloto analisando jurisprudências e faturamento...
                </span>{" "}
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />{" "}
              </div>{" "}
            </div>
          )}{" "}
          <div ref={scrollRef} />{" "}
        </div>{" "}
        {/* Input area */}{" "}
        <div className="p-4 border-t border-slate-900 bg-card/40">
          {" "}
          <div className="max-w-3xl mx-auto flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 shadow-lg focus-within:border-emerald-600/80 transition-colors">
            {" "}
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(input);
                }
              }}
              placeholder="Pergunte sobre as finanças, OAB, processos parados ou peça conselho estratégico..."
              className="flex-1 bg-transparent border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 resize-none text-xs text-card-foreground focus:ring-0 placeholder:text-muted-foreground py-1 no-scrollbar min-h-[24px]"
            />{" "}
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-colors cursor-pointer shrink-0 shadow-md"
            >
              {" "}
              <Send className="w-3.5 h-3.5" />{" "}
            </button>{" "}
          </div>{" "}
          <div className="flex justify-between max-w-3xl mx-auto px-1 mt-1.5 text-[10px] text-muted-foreground">
            {" "}
            <span>Acesso em tempo real aos dados locais</span>{" "}
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-2.5 h-2.5" /> Enter para enviar
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Suggested shortcuts sidebar panel */}{" "}
      <div className="w-full md:w-64 p-4 md:p-5 space-y-3 md:space-y-4 bg-background/60 shrink-0 border-t md:border-t-0 md:border-l border-slate-900 md:h-full overflow-y-auto no-scrollbar">
        {" "}
        <div>
          {" "}
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider">
            {" "}
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />{" "}
            Sugestões Rápidas{" "}
          </div>{" "}
          <p className="hidden md:block text-[10px] text-muted-foreground mt-1 leading-snug">
            {" "}
            Selecione uma consulta automatizada de alta complexidade para
            extrair as métricas cruzadas de compliance e andamentos do seu
            escritório:{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 no-scrollbar snap-x">
          {" "}
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s.prompt)}
              className="min-w-[140px] md:min-w-0 w-auto md:w-full text-left p-2.5 bg-card hover:bg-accent hover:text-accent-foreground/80 border border-border/80 rounded-md text-[11px] text-muted-foreground hover:text-emerald-300 font-medium transition-all flex items-center justify-between gap-2 group cursor-pointer snap-start shrink-0"
            >
              {" "}
              <span className="truncate">{s.label}</span>{" "}
              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-emerald-400 transition-colors shrink-0" />{" "}
            </button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
