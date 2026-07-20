import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  ArrowLeft,
  Scale,
  Sparkles,
  Clock,
  Landmark,
  ShieldCheck,
  Calendar,
  Kanban,
  DollarSign,
  FileText,
  AlertTriangle,
  Plus,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  Lock,
} from "lucide-react";
export const ProcessoDetalheView: React.FC = () => {
  const {
    processes,
    movements,
    deadlines,
    tasks,
    financials,
    documents,
    selectedProcessId,
    setSelectedProcessId,
    setActiveTab,
    updateProcess,
    addMovement,
    addDeadline,
    addTask,
    addFinancial,
    addSyncLog,
    toggleDeadlineCompleted,
    toggleFinancialPaid,
  } = useJusFlow();
  const [activeSubTab, setActiveSubTab] = useState<
    "andamentos" | "prazos" | "tarefas" | "financeiro" | "documentos"
  >("andamentos");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false); // Form input states
  const [newDesc, setNewDesc] = useState("");
  const [newDeadlineTitle, setNewDeadlineTitle] = useState("");
  const [newDeadlineDate, setNewDeadlineDate] = useState("");
  const [newDeadlinePriority, setNewDeadlinePriority] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const process = processes.find((p) => p.id === selectedProcessId);
  if (!process) {
    return (
      <div className="p-12 text-center bg-background h-full flex flex-col items-center justify-center">
        {" "}
        <AlertTriangle className="w-12 h-12 text-muted-foreground mb-3 animate-bounce" />{" "}
        <h3 className="text-sm font-bold text-card-foreground">
          Nenhum processo selecionado
        </h3>{" "}
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          Por favor, selecione um processo no painel geral para visualizar seus
          detalhes.
        </p>{" "}
        <button
          onClick={() => setActiveTab("operacao.processos")}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
        >
          {" "}
          Ir para Processos{" "}
        </button>{" "}
      </div>
    );
  }
  const procMovements = movements[process.id] || [];
  const procDeadlines = deadlines.filter((d) => d.processId === process.id);
  const procTasks = tasks.filter((t) => t.processId === process.id);
  const procFinancials = financials.filter((f) => f.processId === process.id);
  const procDocuments = documents.filter(
    (d) =>
      d.content.includes(process.clientName) ||
      d.title.includes(process.clientName.split(" ")[0]),
  ); // Unify Timeline entries
  const timelineEntries = [
    ...procMovements.map((m) => ({
      date: m.date,
      title: m.description,
      desc: m.details || "",
      type: "movement" as const,
      color: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    })),
    ...procDeadlines.map((d) => ({
      date: d.date.split("T")[0],
      title: `Prazo Judicial: ${d.title}`,
      desc: `Prioridade: ${d.priority.toUpperCase()} • Status: ${d.completed ? "CONCLUÍDO" : "PENDENTE"}`,
      type: "deadline" as const,
      color: "border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/40",
    })),
    ...procTasks.map((t) => ({
      date: process.createdAt.split("T")[0], // Fallback date
      title: `Tarefa vinculada: ${t.title}`,
      desc: `Fila: ${t.column.toUpperCase()} • Responsável: ${t.assigneeName || "Sem atribuição"}`,
      type: "task" as const,
      color:
        "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/40",
    })),
    ...procFinancials.map((f) => ({
      date: f.date,
      title: `Lançamento: ${f.title}`,
      desc: `${f.type === "income" ? "Crédito (+)" : "Débito (-)"} de R$ ${f.amount.toLocaleString()} • Status: ${f.status.toUpperCase()}`,
      type: "financial" as const,
      color:
        "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    })),
  ].sort((a, b) => {
    const dateA = new Date(a.date || "2000-01-01").getTime();
    const dateB = new Date(b.date || "2000-01-01").getTime();
    return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
  }); // Trigger DataJud Import
  const handleDataJudImport = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/datajud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnj: process.cnj, isDemo: true }),
      });
      if (!response.ok) throw new Error("Erro na consulta DataJud");
      const data = await response.json(); // Add movements that don't already exist
      if (data.movements && data.movements.length > 0) {
        data.movements.forEach((m: any, idx: number) => {
          // Convert date formatting if needed, but keeping standard
          const formattedDate = m.date.split("/").reverse().join("-"); // DD/MM/YYYY to YYYY-MM-DD
          addMovement(process.id, m.description, m.details);
        });
      } // Record Sync Audit Log
      addSyncLog({
        tribunal: data.tribunal,
        status: "success",
        cnj: process.cnj,
        movementsCount: data.movements.length,
      });
      // Update last sync date
      updateProcess(process.id, {
        lastMovementDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  }; // AI Summary generation
  const handleRegenerateAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch("/api/copiloto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Faça uma análise rigorosa e me dê um resumo estratégico no padrão brasileiro do processo judicial com os seguintes dados: CNJ: ${process.cnj} Título: ${process.title} Área: ${process.area} Tribunal/Vara: ${process.court} - ${process.division} Polo Ativo: ${process.plaintiff} Polo Passivo: ${process.defendant} Assunto: ${process.subject} Valor da Causa: R$ ${process.value} Andamentos cadastrados: ${JSON.stringify(procMovements.slice(0, 3))} Escreva o resumo em 4 parágrafos pequenos abordando: 1. Situação Processual Atual. 2. Últimos andamentos críticos. 3. Próximos passos necessários da advocacia. 4. Principais riscos ou contingências identificadas.`,
          history: [],
          contextData: {},
        }),
      });
      if (!response.ok) throw new Error("AI Summary failed");
      const data = await response.json();
      updateProcess(process.id, { aiSummary: data.text });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };
  const handleAddMovementLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    addMovement(
      process.id,
      newDesc,
      "Adicionado manualmente pelo advogado signatário.",
    );
    setNewDesc("");
  };
  const handleAddDeadlineLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadlineTitle.trim() || !newDeadlineDate) return;
    addDeadline({
      title: newDeadlineTitle,
      date: new Date(newDeadlineDate).toISOString(),
      completed: false,
      priority: newDeadlinePriority,
      processId: process.id,
      processTitle: process.title,
    });
    setNewDeadlineTitle("");
    setNewDeadlineDate("");
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Back button and header */}{" "}
      <div className="flex items-center gap-3">
        {" "}
        <button
          onClick={() => {
            setSelectedProcessId(null);
            setActiveTab("operacao.processos");
          }}
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-accent hover:text-accent-foreground rounded-md text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-all cursor-pointer shrink-0"
        >
          {" "}
          <ArrowLeft className="w-4 h-4" />{" "}
        </button>{" "}
        <div className="text-left">
          {" "}
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Contencioso Judicial
          </span>{" "}
          <h2 className="text-base font-bold text-foreground leading-tight">
            Dossiê do Processo
          </h2>{" "}
        </div>{" "}
      </div>{" "}
      {/* Complete Process Card Header */}{" "}
      <div className="p-6 bg-card border border-border rounded-xl shadow-sm text-left">
        {" "}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
          {" "}
          <div>
            {" "}
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full uppercase">
              {" "}
              {process.area}{" "}
            </span>{" "}
            <h3 className="text-base font-bold text-foreground mt-1 leading-tight">
              {" "}
              {process.title}{" "}
            </h3>{" "}
            <p className="text-xs font-mono text-muted-foreground mt-0.5 select-all">
              {" "}
              CNJ: {process.cnj}{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            <button
              onClick={handleDataJudImport}
              disabled={isSyncing}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:opacity-50 text-white text-[10px] font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-md shadow-amber-600/10 cursor-pointer shrink-0"
            >
              {" "}
              {isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Landmark className="w-3.5 h-3.5" />
              )}{" "}
              Importar DataJud (CNJ){" "}
            </button>{" "}
            <button
              onClick={handleRegenerateAISummary}
              disabled={isGeneratingSummary}
              className="px-3.5 py-1.5 bg-card hover:bg-accent hover:text-accent-foreground disabled:opacity-50 text-white text-[10px] font-bold rounded-md transition-colors border border-border flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {" "}
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />{" "}
              {isGeneratingSummary
                ? "Processando..."
                : "Regerar Resumo IA"}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Process Meta Grid */}{" "}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          {" "}
          <div>
            {" "}
            <span className="text-muted-foreground block font-semibold text-[10px] uppercase">
              Polo Ativo (Autor)
            </span>{" "}
            <span className="font-semibold text-foreground block truncate mt-0.5">
              {process.plaintiff}
            </span>{" "}
          </div>{" "}
          <div>
            {" "}
            <span className="text-muted-foreground block font-semibold text-[10px] uppercase">
              Polo Passivo (Réu)
            </span>{" "}
            <span className="font-semibold text-foreground block truncate mt-0.5">
              {process.defendant}
            </span>{" "}
          </div>{" "}
          <div>
            {" "}
            <span className="text-muted-foreground block font-semibold text-[10px] uppercase">
              Tribunal / Vara
            </span>{" "}
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block truncate mt-0.5">
              {process.court} - {process.division}
            </span>{" "}
          </div>{" "}
          <div>
            {" "}
            <span className="text-muted-foreground block font-semibold text-[10px] uppercase">
              Valor da Causa
            </span>{" "}
            <span className="font-bold text-foreground block mt-0.5">
              {" "}
              {process.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* IA Summary Panel */}{" "}
      <div className="p-5 bg-gradient-to-tr from-slate-900 to-indigo-950 border border-indigo-950 rounded-xl shadow-lg text-left relative overflow-hidden">
        {" "}
        <div className="absolute top-0 right-0 p-4 opacity-5">
          {" "}
          <Sparkles className="w-24 h-24 text-white" />{" "}
        </div>{" "}
        <div className="relative z-10">
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <Sparkles className="w-4.5 h-4.5 text-emerald-400 animate-pulse shrink-0" />{" "}
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Resumo Gerado por IA
            </h4>{" "}
          </div>{" "}
          <div className="mt-3 text-xs text-slate-200 leading-relaxed font-normal whitespace-pre-wrap max-h-48 overflow-y-auto no-scrollbar">
            {" "}
            {process.aiSummary}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Unified Timeline & Modular Tabs Section */}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        {/* Left Side: Modular 5-Tab Area (2 columns) */}{" "}
        <div className="lg:col-span-2 space-y-4 text-left">
          {" "}
          {/* Tab switches */}{" "}
          <div className="border-b border-border flex gap-1 overflow-x-auto no-scrollbar shrink-0">
            {" "}
            {[
              {
                id: "andamentos",
                label: "Andamentos",
                count: procMovements.length,
                icon: Landmark,
              },
              {
                id: "prazos",
                label: "Prazos",
                count: procDeadlines.filter((d) => !d.completed).length,
                icon: Calendar,
              },
              {
                id: "tarefas",
                label: "Tarefas",
                count: procTasks.length,
                icon: Kanban,
              },
              {
                id: "financeiro",
                label: "Financeiro",
                count: procFinancials.length,
                icon: DollarSign,
              },
              {
                id: "documentos",
                label: "Documentos",
                count: procDocuments.length,
                icon: FileText,
              },
            ].map((tab) => {
              const IsActive = activeSubTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer shrink-0 ${IsActive ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-muted-foreground hover:text-muted-foreground dark:hover:text-card-foreground"}`}
                >
                  {" "}
                  <Icon className="w-3.5 h-3.5 shrink-0" />{" "}
                  <span>{tab.label}</span>{" "}
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${IsActive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}
                  >
                    {" "}
                    {tab.count}{" "}
                  </span>{" "}
                </button>
              );
            })}{" "}
          </div>{" "}
          {/* Tab content area */}{" "}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm min-h-[300px]">
            {" "}
            {/* 1. ANDAMENTOS TAB */}{" "}
            {activeSubTab === "andamentos" && (
              <div className="space-y-4">
                {" "}
                {/* Manual movement adding form */}{" "}
                <form onSubmit={handleAddMovementLocal} className="flex gap-2">
                  {" "}
                  <input
                    type="text"
                    placeholder="Adicionar novo andamento manual..."
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="flex-1 bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-1.5 text-xs text-card-foreground outline-0"
                  />{" "}
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md transition-colors cursor-pointer shrink-0 flex items-center gap-1 shadow-md shadow-emerald-600/10"
                  >
                    {" "}
                    <Plus className="w-3.5 h-3.5" /> Incluir{" "}
                  </button>{" "}
                </form>{" "}
                {/* List */}{" "}
                <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                  {" "}
                  {procMovements.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 bg-background/40 border border-border/80 rounded-md space-y-1"
                    >
                      {" "}
                      <div className="flex justify-between items-center text-[10px]">
                        {" "}
                        <span className="text-muted-foreground flex items-center gap-1">
                          {" "}
                          <Clock className="w-3 h-3" />{" "}
                          {new Date(m.date).toLocaleDateString("pt-BR")}{" "}
                        </span>{" "}
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[8px] bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                          {" "}
                          Andamento{" "}
                        </span>{" "}
                      </div>{" "}
                      <h4 className="text-xs font-bold text-foreground leading-tight">
                        {m.description}
                      </h4>{" "}
                      {m.details && (
                        <p className="text-[10px] text-muted-foreground">
                          {m.details}
                        </p>
                      )}{" "}
                    </div>
                  ))}{" "}
                  {procMovements.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">
                      Nenhum andamento cadastrado para este processo.
                    </p>
                  )}{" "}
                </div>{" "}
              </div>
            )}{" "}
            {/* 2. PRAZOS TAB */}{" "}
            {activeSubTab === "prazos" && (
              <div className="space-y-4">
                {" "}
                {/* Manual deadline adding */}{" "}
                <form
                  onSubmit={handleAddDeadlineLocal}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-background/40 p-3 rounded-md border border-border"
                >
                  {" "}
                  <div className="space-y-1">
                    {" "}
                    <span className="text-[10px] text-muted-foreground font-bold block uppercase">
                      Título do Prazo
                    </span>{" "}
                    <input
                      type="text"
                      required
                      placeholder="Ex: Interpor Recurso de Apelação"
                      value={newDeadlineTitle}
                      onChange={(e) => setNewDeadlineTitle(e.target.value)}
                      className="w-full bg-card border border-border rounded-md px-2 py-1 text-xs outline-none"
                    />{" "}
                  </div>{" "}
                  <div className="space-y-1">
                    {" "}
                    <span className="text-[10px] text-muted-foreground font-bold block uppercase">
                      Data Final
                    </span>{" "}
                    <input
                      type="date"
                      required
                      value={newDeadlineDate}
                      onChange={(e) => setNewDeadlineDate(e.target.value)}
                      className="w-full bg-card border border-border rounded-md px-2 py-1 text-xs outline-none"
                    />{" "}
                  </div>{" "}
                  <div className="space-y-1 flex items-end">
                    {" "}
                    <button
                      type="submit"
                      className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md shadow-md cursor-pointer flex items-center justify-center gap-1"
                    >
                      {" "}
                      <Plus className="w-3.5 h-3.5" /> Adicionar{" "}
                    </button>{" "}
                  </div>{" "}
                </form>{" "}
                {/* List */}{" "}
                <div className="space-y-2">
                  {" "}
                  {procDeadlines.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 bg-background/40 border border-border/80 rounded-md flex items-center justify-between gap-4"
                    >
                      {" "}
                      <div className="flex gap-2.5 items-center">
                        {" "}
                        <input
                          type="checkbox"
                          checked={d.completed}
                          onChange={() => toggleDeadlineCompleted(d.id)}
                          className="w-4 h-4 text-emerald-600 border-border rounded focus:ring-0 cursor-pointer"
                        />{" "}
                        <div className="text-left">
                          {" "}
                          <p
                            className={`text-xs font-bold ${d.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {" "}
                            {d.title}{" "}
                          </p>{" "}
                          <p className="text-[9px] text-muted-foreground mt-0.5">
                            Vence em:{" "}
                            {new Date(d.date).toLocaleDateString("pt-BR")}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <span
                        className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${d.priority === "critical" ? "bg-rose-950 text-rose-400" : "bg-amber-950 text-amber-400"}`}
                      >
                        {" "}
                        {d.priority}{" "}
                      </span>{" "}
                    </div>
                  ))}{" "}
                  {procDeadlines.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">
                      Sem prazos cadastrados para este processo.
                    </p>
                  )}{" "}
                </div>{" "}
              </div>
            )}{" "}
            {/* 3. TAREFAS TAB */}{" "}
            {activeSubTab === "tarefas" && (
              <div className="space-y-3">
                {" "}
                {procTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-background/40 border border-border/80 rounded-md flex justify-between items-center"
                  >
                    {" "}
                    <div className="text-left">
                      {" "}
                      <h4 className="text-xs font-bold text-foreground">
                        {t.title}
                      </h4>{" "}
                      {t.description && (
                        <p className="text-[10px] text-muted-foreground truncate max-w-[340px] mt-0.5">
                          {t.description}
                        </p>
                      )}{" "}
                      <span className="text-[9px] text-muted-foreground block mt-1">
                        Responsável: {t.assigneeName || "Ninguém"}
                      </span>{" "}
                    </div>{" "}
                    <div className="text-right flex flex-col items-end gap-1 shrink-0">
                      {" "}
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 rounded">
                        {" "}
                        {t.column.replace("_", " ")}{" "}
                      </span>{" "}
                      <span className="text-[8px] text-muted-foreground">
                        Prioridade: {t.priority.toUpperCase()}
                      </span>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
                {procTasks.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    Nenhuma tarefa vinculada para este processo no Kanban.
                  </p>
                )}{" "}
              </div>
            )}{" "}
            {/* 4. FINANCEIRO TAB */}{" "}
            {activeSubTab === "financeiro" && (
              <div className="space-y-3">
                {" "}
                {procFinancials.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-background/40 border border-border/80 rounded-md flex justify-between items-center"
                  >
                    {" "}
                    <div className="text-left">
                      {" "}
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase mr-2 ${f.type === "income" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"}`}
                      >
                        {" "}
                        {f.type === "income" ? "Crédito" : "Débito"}{" "}
                      </span>{" "}
                      <span className="text-xs font-bold text-foreground">
                        {f.title}
                      </span>{" "}
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        Data: {f.date} • Categoria: {f.category}
                      </p>{" "}
                    </div>{" "}
                    <div className="text-right shrink-0">
                      {" "}
                      <span
                        className={`text-xs font-bold block ${f.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        {" "}
                        {f.type === "income" ? "+" : "-"} R${" "}
                        {f.amount.toLocaleString()}{" "}
                      </span>{" "}
                      <button
                        onClick={() => toggleFinancialPaid(f.id)}
                        className={`text-[9px] font-bold uppercase mt-1 px-1.5 py-0.2 rounded cursor-pointer ${f.status === "paid" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"}`}
                      >
                        {" "}
                        {f.status === "paid" ? "Pago" : "Pendente"}{" "}
                      </button>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
                {procFinancials.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    Sem lançamentos financeiros cadastrados para este processo.
                  </p>
                )}{" "}
              </div>
            )}{" "}
            {/* 5. DOCUMENTOS TAB */}{" "}
            {activeSubTab === "documentos" && (
              <div className="space-y-3">
                {" "}
                {procDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-background/40 border border-border/80 rounded-md flex justify-between items-center"
                  >
                    {" "}
                    <div className="text-left">
                      {" "}
                      <h4 className="text-xs font-bold text-foreground">
                        {doc.title}
                      </h4>{" "}
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        Criado em:{" "}
                        {new Date(doc.createdAt).toLocaleDateString("pt-BR")}
                      </p>{" "}
                    </div>{" "}
                    <span
                      className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${doc.status === "signed" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"}`}
                    >
                      {" "}
                      {doc.status}{" "}
                    </span>{" "}
                  </div>
                ))}{" "}
                {procDocuments.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    Sem documentos ou minutas contratuais vinculadas ao cliente
                    deste processo.
                  </p>
                )}{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        {/* Right Side: Timeline unificada (1 column) */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left">
          {" "}
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
            {" "}
            <Clock className="w-4 h-4 text-emerald-500 shrink-0" /> Timeline
            Unificada do Processo{" "}
          </h3>{" "}
          <div className="relative pl-4 border-l border-border space-y-5 py-2 max-h-[500px] overflow-y-auto no-scrollbar">
            {" "}
            {timelineEntries.map((e, idx) => (
              <div key={idx} className="relative group">
                {" "}
                {/* Timeline node dot */}{" "}
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-500 group-hover:scale-125 transition-transform" />{" "}
                <div className="space-y-0.5">
                  {" "}
                  <div className="flex items-center justify-between text-[10px]">
                    {" "}
                    <span className="text-muted-foreground font-bold">
                      {new Date(e.date).toLocaleDateString("pt-BR")}
                    </span>{" "}
                    <span
                      className={`px-1.5 rounded uppercase font-bold text-[8px] shrink-0 ${e.color}`}
                    >
                      {" "}
                      {e.type}{" "}
                    </span>{" "}
                  </div>{" "}
                  <h4 className="text-xs font-bold text-foreground leading-tight">
                    {e.title}
                  </h4>{" "}
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {e.desc}
                  </p>{" "}
                </div>{" "}
              </div>
            ))}{" "}
            {timelineEntries.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">
                Nenhum evento registrado na linha do tempo ainda.
              </p>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
