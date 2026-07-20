import React from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Folder,
  Bell,
  Users,
  CheckSquare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Calendar,
  DollarSign,
  Scale,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    processes,
    deadlines,
    tasks,
    clients,
    financials,
    setActiveTab,
    setSelectedProcessId,
  } = useJusFlow();

  // On-the-fly dynamic Calculations
  const activeProcesses = processes.filter((p) => p.status === "active").length;
  const completedProcesses = processes.filter((p) => p.status === "completed").length;

  const todayDateStr = new Date().toISOString().split("T")[0];
  const deadlinesToday = deadlines.filter(
    (d) => d.date.startsWith(todayDateStr) && !d.completed,
  ).length;
  const criticalDeadlines = deadlines.filter(
    (d) => d.priority === "critical" && !d.completed,
  ).length;

  const activeClients = clients.filter((c) => c.status === "active").length;
  const pendingTasks = tasks.filter((t) => t.column !== "done").length;
  const criticalTasks = tasks.filter(
    (t) => t.priority === "critical" && t.column !== "done",
  ).length;

  // Finance metrics for current month
  const incomeLaunches = financials.filter(
    (f) => f.type === "income" && f.status === "paid",
  );
  const currentMonthIncome = incomeLaunches.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );
  const expenseLaunches = financials.filter(
    (f) => f.type === "expense" && f.status === "paid",
  );
  const currentMonthExpense = expenseLaunches.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );
  const pendingFees = financials
    .filter((f) => f.type === "income" && f.status === "pending")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = currentMonthIncome - currentMonthExpense;

  // Stagnant processes (>90 days)
  const stagnantProcesses = processes.filter((p) => {
    if (!p.lastMovementDate) return true;
    const diff = Date.now() - new Date(p.lastMovementDate).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days > 90;
  });

  // Areas calculation for chart
  const areaCounts = processes.reduce(
    (acc, p) => {
      acc[p.area] = (acc[p.area] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const areaColors: Record<string, string> = {
    Civil: "bg-cyan-500",
    Trabalhista: "bg-purple-500",
    Tributário: "bg-amber-500",
    Penal: "bg-rose-500",
    Família: "bg-emerald-500",
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full bg-background transition-colors text-left font-sans">
      
      {/* Alert Section */}
      {(deadlinesToday > 0 || criticalTasks > 0) && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-900 dark:text-rose-300">
                Atenção Crítica OAB
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-400/80 mt-0.5">
                Você tem <strong>{deadlinesToday} prazo(s) expirando hoje</strong> e{" "}
                <strong>{criticalTasks} tarefa(s) prioritária(s)</strong> precisando de revisão imediata.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("operacao.prazos")}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            Verificar Prazos
          </button>
        </div>
      )}

      {/* Primary KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                PROCESSOS ATIVOS
              </span>
              <p className="text-xl md:text-2xl font-semibold text-card-foreground tracking-tight">
                {activeProcesses}
              </p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/10 rounded-md text-emerald-600 group-hover:scale-110 transition-transform">
              <Folder className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{completedProcesses} encerrados</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between group hover:border-rose-500/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                PRAZOS HOJE
              </span>
              <p className="text-xl md:text-2xl font-semibold text-card-foreground tracking-tight">
                {deadlinesToday}
              </p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-rose-500/10 rounded-md text-rose-500 group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>{criticalDeadlines} críticos no total</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between group hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                CLIENTES ATIVOS
              </span>
              <p className="text-xl md:text-2xl font-semibold text-card-foreground tracking-tight">
                {activeClients}
              </p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/10 rounded-md text-cyan-500 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
            <span>{stagnantProcesses.length} processos parados</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between group hover:border-purple-500/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                TAREFAS PENDENTES
              </span>
              <p className="text-xl md:text-2xl font-semibold text-card-foreground tracking-tight">
                {pendingTasks}
              </p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-purple-500/10 rounded-md text-purple-500 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle className="w-3.5 h-3.5 text-purple-500" />
            <span>{criticalTasks} atrasadas</span>
          </div>
        </div>

      </div>

      {/* Financial KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Recebido */}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                RECEBIDO NO MÊS
              </span>
              <p className="text-xl md:text-2xl font-semibold text-card-foreground tracking-tight">
                {currentMonthIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/10 rounded-md text-emerald-600 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lançamentos liquidados</span>
          </div>
        </div>

        {/* Despesas */}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between group hover:border-rose-500/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                DESPESAS NO MÊS
              </span>
              <p className="text-xl md:text-2xl font-semibold text-rose-600 dark:text-rose-400 tracking-tight">
                {currentMonthExpense.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-rose-500/10 rounded-md text-rose-500 group-hover:scale-110 transition-transform">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            <span>Controle operacional de custos</span>
          </div>
        </div>

        {/* A Receber */}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between group hover:border-amber-500/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                A RECEBER
              </span>
              <p className="text-xl md:text-2xl font-semibold text-amber-600 dark:text-amber-400 tracking-tight">
                {pendingFees.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-amber-500/10 rounded-md text-amber-500 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Honorários pendentes</span>
          </div>
        </div>

        {/* Resultado */}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                RESULTADO DO MÊS
              </span>
              <p className={`text-xl md:text-2xl font-semibold tracking-tight ${netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {netBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-md group-hover:scale-110 transition-transform ${netBalance >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-500"}`}>
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            {netBalance >= 0 ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Positivo</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-500 dark:text-rose-400 font-semibold">Negativo</span>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Receita vs Despesas */}
        <div className="lg:col-span-2 p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-card-foreground">
                Receita vs Despesas
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Acompanhamento dos últimos 6 meses
              </p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2.5 h-2.5 bg-primary rounded-full" /> Receitas
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2.5 h-2.5 bg-rose-400 rounded-full" /> Despesas
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[220px] flex items-end justify-between gap-3 border-b border-border pb-2">
            {[
              { m: "Fev", r: 12000, d: 2500 },
              { m: "Mar", r: 15500, d: 3100 },
              { m: "Abr", r: 18000, d: 2900 },
              { m: "Mai", r: 21000, d: 4200 },
              { m: "Jun", r: 19500, d: 3800 },
              { m: "Jul", r: currentMonthIncome, d: currentMonthExpense },
            ].map((d, idx) => {
              const maxVal = 25000;
              const rPercent = (d.r / maxVal) * 100;
              const dPercent = (d.d / maxVal) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex justify-center gap-2 items-end h-full relative">
                    <div
                      style={{ height: `${Math.max(rPercent, 4)}%` }}
                      className="w-4 sm:w-6 bg-primary hover:bg-primary/80 rounded-t-sm transition-all duration-300 relative"
                    >
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
                        R$ {d.r.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{ height: `${Math.max(dPercent, 4)}%` }}
                      className="w-4 sm:w-6 bg-rose-400 hover:bg-rose-500 rounded-t-sm transition-all duration-300 relative"
                    >
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
                        R$ {d.d.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground mt-3">
                    {d.m}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Processos por Área */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-card-foreground">
              Processos por área
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Distribuição dos casos ativos
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-6 gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--border)" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4" strokeDasharray="33 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4" strokeDasharray="33 100" strokeDashoffset="-33" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="34 100" strokeDashoffset="-66" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-card-foreground">
                  {processes.length}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Causas
                </span>
              </div>
            </div>

            <div className="w-full space-y-2">
              {Object.entries(areaCounts).map(([area, count]) => (
                <div key={area} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${areaColors[area] || "bg-slate-400"}`} />
                    <span className="text-muted-foreground font-medium">{area}</span>
                  </div>
                  <span className="font-semibold text-card-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Prazos de hoje */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" /> Prazos de hoje
            </h3>
            <button
              onClick={() => setActiveTab("operacao.prazos")}
              className="text-xs text-primary hover:underline font-medium"
            >
              Ver todos
            </button>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {deadlines.filter((d) => !d.completed).slice(0, 3).map((d) => (
              <div key={d.id} className="p-3 bg-muted/30 border border-border rounded-lg flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-card-foreground truncate">
                    {d.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {d.processTitle ? `Proc: ${d.processTitle}` : "Ação Geral"}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${d.priority === "critical" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"}`}>
                  {d.priority === "critical" ? "CRÍTICO" : "NORMAL"}
                </span>
              </div>
            ))}
            {deadlines.filter((d) => !d.completed).length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nenhum prazo vencendo hoje
              </div>
            )}
          </div>
        </div>

        {/* Processos sem movimento */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-500" /> Processos Parados
            </h3>
            <button
              onClick={() => setActiveTab("operacao.processos")}
              className="text-xs text-primary hover:underline font-medium"
            >
              Ver todos
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Mais de 90 dias sem andamento
          </p>
          
          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {stagnantProcesses.slice(0, 3).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProcessId(p.id);
                  setActiveTab("operacao.processo_detalhe");
                }}
                className="p-3 bg-muted/30 hover:bg-muted/50 border border-border rounded-lg cursor-pointer transition-colors"
              >
                <h4 className="text-sm font-medium text-card-foreground truncate">
                  {p.title}
                </h4>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>CNJ: {p.cnj}</span>
                  <span>{p.lastMovementDate || "Início"}</span>
                </div>
              </div>
            ))}
            {stagnantProcesses.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nenhum processo parado
              </div>
            )}
          </div>
        </div>

        {/* Ações sugeridas pelo Copiloto */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" /> Sugestões do Copiloto
            </h3>
            
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-2">
              <span className="font-semibold text-sm text-card-foreground block">
                Prazos exigem atenção
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Você possui prazos vencendo hoje que precisam ser peticionados e revisados. O copiloto pode ajudar a gerar as peças.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setActiveTab("principal.copiloto")}
            className="w-full mt-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Abrir Copiloto IA
          </button>
        </div>

      </div>

      {/* Main AI Copiloto Suggestions Center banner */}
      <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Sparkles className="w-32 h-32 text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-primary text-primary-foreground rounded-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              JusFlow Copiloto IA
            </span>
          </div>
          <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed max-w-4xl">
            "Olá! Identifiquei que o processo tributário contra a Fazenda Nacional tem uma contingência estratégica de R$ 850.000,00 e o agravo de instrumento está concluso. Deseja minutar um memorial de sustentação oral para entrega imediata aos desembargadores?"
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("principal.copiloto")}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              Falar com o Copiloto
            </button>
            <button
              onClick={() => setActiveTab("documentos.ia")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg transition-colors"
            >
              Gerar Petição Rápida
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
