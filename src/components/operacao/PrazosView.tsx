import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  AlarmClock,
  Plus,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
export const PrazosView: React.FC = () => {
  const {
    deadlines,
    processes,
    addDeadline,
    toggleDeadlineCompleted,
    deleteDeadline,
  } = useJusFlow();
  const [activeRange, setActiveRange] = useState<
    "hoje" | "semana" | "mes" | "todos"
  >("todos");
  const [filterPriority, setFilterPriority] = useState("All"); // Manual Add Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const [processId, setProcessId] = useState("");
  const handleCreateDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    const selectedProcess = processes.find((p) => p.id === processId);
    addDeadline({
      title,
      date: new Date(date).toISOString(),
      completed: false,
      priority,
      processId: processId || undefined,
      processTitle: selectedProcess ? selectedProcess.title : undefined,
    });
    setTitle("");
    setDate("");
    setPriority("medium");
    setProcessId("");
  }; // Helper date matches
  const todayStr = new Date().toISOString().split("T")[0];
  const nextWeekStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const nextMonthStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const filtered = deadlines.filter((d) => {
    // Priority filter
    const matchesPriority =
      filterPriority === "All" || d.priority === filterPriority; // Date range filter
    const dDateStr = d.date.split("T")[0];
    let matchesRange = true;
    if (activeRange === "hoje") {
      matchesRange = dDateStr === todayStr;
    } else if (activeRange === "semana") {
      matchesRange = dDateStr >= todayStr && dDateStr <= nextWeekStr;
    } else if (activeRange === "mes") {
      matchesRange = dDateStr >= todayStr && dDateStr <= nextMonthStr;
    }
    return matchesPriority && matchesRange;
  }); // Check critical 24h deadlines (uncompleted & high/critical priority expiring today) const critical24h = deadlines.filter(d => !d.completed && d.date.split("T")[0] === todayStr && (d.priority === "critical" || d.priority === "high")); return ( <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors"> {/* Header */} <div className="text-left"> <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Controle de Prazos</h2> <p className="text-xs text-muted-foreground">Monitore as contagens de prazos processuais para evitar preclusões judiciais.</p> </div> {/* Critical 24h Alert */} {critical24h.length > 0 && ( <div className="p-4 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/40 rounded-xl flex items-center gap-3 text-left"> <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0"> <AlertTriangle className="w-5 h-5 animate-bounce" /> </div> <div> <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">Perigo de Revelia ou Preclusão (24h)</h4> <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5"> Identificamos <strong>{critical24h.length} prazo(s) crítico(s)</strong> que vencem nas próximas 24 horas. Providencie a petição e o protocolo imediatamente. </p> </div> </div> )} {/* Grid: Calendar, Filters, and New Deadline */} <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* Left columns: List & Tabs (2 columns) */} <div className="lg:col-span-2 space-y-4"> {/* Tabs and Quick Filter */} <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-2"> <div className="flex gap-1 overflow-x-auto no-scrollbar"> {[ { id: "todos", label: "Todos Ativos" }, { id: "hoje", label: "Expira Hoje" }, { id: "semana", label: "Esta Semana" }, { id: "mes", label: "Este Mês" } ].map(tab => ( <button key={tab.id} onClick={() => setActiveRange(tab.id as any)} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${ activeRange === tab.id ? "bg-card text-white dark:bg-muted" : "text-muted-foreground hover:bg-slate-200/50 dark:hover:bg-accent hover:text-accent-foreground/40" }`} > {tab.label} </button> ))} </div> <div className="flex items-center gap-2 text-xs bg-card border border-border px-2.5 py-1 rounded-md"> <span className="text-muted-foreground">Gravidade:</span> <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="bg-transparent border-0 outline-0 focus:ring-0 text-xs py-0.5 cursor-pointer text-foreground dark:text-card-foreground font-medium" > <option value="All">Todas</option> <option value="low">Baixa</option> <option value="medium">Média</option> <option value="high">Alta</option> <option value="critical">Crítica</option> </select> </div> </div> {/* List Content */} <div className="space-y-3 text-left"> {filtered.map(d => ( <div key={d.id} className={`p-4 bg-card border rounded-xl shadow-sm flex items-center justify-between gap-4 hover:border-border dark:hover:border-border transition-all ${ d.completed ? "opacity-60" : "" } ${ !d.completed && d.priority === "critical" ? "border-rose-300 dark:border-rose-950/60" : "border-border" }`} > <div className="flex items-start gap-3"> {/* Complete Action Checkbox */} <input type="checkbox" checked={d.completed} onChange={() => toggleDeadlineCompleted(d.id)} className="w-4 h-4 text-cyan-600 border-border rounded focus:ring-0 cursor-pointer mt-0.5 shrink-0" /> <div> <h4 className={`text-xs font-bold leading-tight ${ d.completed ? "line-through text-muted-foreground" : "text-foreground" }`}> {d.title} </h4> {d.processTitle && ( <p className="text-[10px] text-muted-foreground mt-1"> Vinculado: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{d.processTitle}</span> </p> )} <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground"> <span className="flex items-center gap-1"> <Calendar className="w-3 h-3" /> Limite: {new Date(d.date).toLocaleDateString("pt-BR")} </span> </div> </div> </div> <div className="text-right shrink-0"> <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${ d.priority === "critical" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" : d.priority === "high" ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" : "bg-muted text-muted-foreground dark:bg-muted " }`}> {d.priority} </span> </div> </div> ))} {filtered.length === 0 && ( <div className="p-12 bg-card border border-border rounded-xl text-center text-xs text-muted-foreground"> Tudo em ordem! Nenhum prazo localizado para esta categoria. </div> )} </div> </div> {/* Right column: Quick manual add form (1 column) */} <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left h-max"> <div className="flex items-center gap-2 mb-4"> <AlarmClock className="w-4.5 h-4.5 text-cyan-500" /> <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Agendar Novo Prazo</h3> </div> <form onSubmit={handleCreateDeadline} className="space-y-4"> {/* Title */} <div className="space-y-1.5"> <label className="text-[10px] text-muted-foreground font-bold uppercase block">Descrição do Prazo</label> <input type="text" required placeholder="Ex: Réplica à contestação / Recurso Extraordinário" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0" /> </div> {/* Date */} <div className="space-y-1.5"> <label className="text-[10px] text-muted-foreground font-bold uppercase block">Data Limite de Protocolo</label> <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0" /> </div> {/* Priority */} <div className="space-y-1.5"> <label className="text-[10px] text-muted-foreground font-bold uppercase block">Nível de Prioridade</label> <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0" > <option value="low">Baixa (Rotina interna)</option> <option value="medium">Média (Ações preparatórias)</option> <option value="high">Alta (Intimação regular)</option> <option value="critical">Crítica (Preclusiva / 24h)</option> </select> </div> {/* Linked Process */} <div className="space-y-1.5"> <label className="text-[10px] text-muted-foreground font-bold uppercase block">Vincular a Processo Judicial (Opcional)</label> <select value={processId} onChange={(e) => setProcessId(e.target.value)} className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0" > <option value="">Nenhum (Prazo Administrativo)</option> {processes.map(p => ( <option key={p.id} value={p.id}>{p.title} ({p.cnj})</option> ))} </select> </div> <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/10 cursor-pointer" > <Plus className="w-3.5 h-3.5" /> Registrar Prazo OAB </button> </form> <div className="mt-4 p-2.5 bg-background rounded-md border border-border text-[9px] text-muted-foreground flex gap-1.5"> <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span>Este prazo será indexado à Central e sincronizará alarmes automáticos em toda a equipe de advocacia.</span> </div> </div> </div> </div> );
};
