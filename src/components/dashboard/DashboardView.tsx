import React from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Scale,
  AlarmClock,
  Users,
  Kanban,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  CheckCircle2,
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
  } = useJusFlow(); // On-the-fly dynamic Calculations
  const activeProcesses = processes.filter((p) => p.status === "active").length;
  const completedProcesses = processes.filter(
    (p) => p.status === "completed",
  ).length;
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
  ).length; // Finance metrics for current month
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
  // Stagnant processes (>90 days) // Let's assume
  // if lastMovementDate is earlier than 90 days ago, or if it is statically stagnant
  const stagnantProcesses = processes.filter((p) => {
    if (!p.lastMovementDate) return true;
    const diff = Date.now() - new Date(p.lastMovementDate).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days > 90;
  }); // Areas calculation for chart
  const areaCounts = processes.reduce(
    (acc, p) => {
      acc[p.area] = (acc[p.area] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const areaColors: Record<string, string> = {
    Civil: "bg-emerald-500",
    Trabalhista: "bg-purple-500",
    Tributário: "bg-amber-500",
    Penal: "bg-rose-500",
    Família: "bg-emerald-500",
  };
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Alert Section */}{" "}
      {(deadlinesToday > 0 || criticalTasks > 0) && (
        <div className="p-4 bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-200 dark:border-rose-900/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center">
              {" "}
              <AlertTriangle className="w-5 h-5" />{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                Atenção Crítica OAB
              </p>{" "}
              <p className="text-xs text-muted-foreground mt-0.5">
                {" "}
                Você tem{" "}
                <strong>{deadlinesToday} prazo(s) expirando hoje</strong> e{" "}
                <strong>{criticalTasks} tarefa(s) prioritária(s)</strong>{" "}
                precisando de revisão imediata.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={() => setActiveTab("operacao.prazos")}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 self-start md:self-auto shadow-md shadow-rose-600/10"
          >
            {" "}
            Verificar Prazos <ArrowRight className="w-3.5 h-3.5" />{" "}
          </button>{" "}
        </div>
      )}{" "}
      {/* Bento Grid: 8 KPIs */}{" "}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {" "}
        {/* KPI 1: Processos */}{" "}
        <div className="p-4 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col justify-between">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Processos
            </span>{" "}
            <Scale className="w-4 h-4 text-emerald-500" />{" "}
          </div>{" "}
          <div className="mt-2">
            {" "}
            <p className="text-2xl font-bold text-foreground font-sans tracking-tight">
              {" "}
              {activeProcesses}{" "}
              <span className="text-xs text-muted-foreground font-medium">
                Ativos
              </span>{" "}
            </p>{" "}
            <p className="text-[10px] text-muted-foreground mt-1">
              {completedProcesses} encerrados no histórico
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* KPI 2: Prazos */}{" "}
        <div className="p-4 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col justify-between">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Prazos Ativos
            </span>{" "}
            <AlarmClock className="w-4 h-4 text-rose-500" />{" "}
          </div>{" "}
          <div className="mt-2">
            {" "}
            <p className="text-2xl font-bold text-foreground font-sans tracking-tight">
              {" "}
              {deadlines.filter((d) => !d.completed).length}{" "}
              <span className="text-xs text-muted-foreground font-medium">
                Pendentes
              </span>{" "}
            </p>{" "}
            <p className="text-[10px] text-rose-500 font-semibold mt-1">
              {criticalDeadlines} prazos marcados como Crítico
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* KPI 3: Clientes */}{" "}
        <div className="p-4 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col justify-between">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Clientes Ativos
            </span>{" "}
            <Users className="w-4 h-4 text-emerald-500" />{" "}
          </div>{" "}
          <div className="mt-2">
            {" "}
            <p className="text-2xl font-bold text-foreground font-sans tracking-tight">
              {" "}
              {activeClients}{" "}
              <span className="text-xs text-muted-foreground font-medium">
                Contas
              </span>{" "}
            </p>{" "}
            <p className="text-[10px] text-muted-foreground mt-1">
              {clients.filter((c) => c.status === "prospect").length} prospects
              captados
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* KPI 4: Tarefas */}{" "}
        <div className="p-4 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col justify-between">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Tarefas Pendentes
            </span>{" "}
            <Kanban className="w-4 h-4 text-purple-500" />{" "}
          </div>{" "}
          <div className="mt-2">
            {" "}
            <p className="text-2xl font-bold text-foreground font-sans tracking-tight">
              {" "}
              {pendingTasks}{" "}
              <span className="text-xs text-muted-foreground font-medium">
                A Fazer
              </span>{" "}
            </p>{" "}
            <p className="text-[10px] text-purple-500 font-semibold mt-1">
              {tasks.filter((t) => t.column === "review").length} aguardando
              revisão sócia
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* KPI 5: Receita */}{" "}
        <div className="p-4 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col justify-between">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Receita Caixa
            </span>{" "}
            <div className="flex items-center gap-1 text-emerald-500">
              {" "}
              <TrendingUp className="w-3 h-3" />{" "}
              <ArrowUpRight className="w-4 h-4" />{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-2">
            {" "}
            <p className="text-lg font-bold text-foreground font-sans tracking-tight">
              {" "}
              {currentMonthIncome.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
            </p>{" "}
            <p className="text-[10px] text-muted-foreground mt-1">
              Este mês (Valores recebidos)
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* KPI 6: Despesas */}{" "}
        <div className="p-4 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col justify-between">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Despesas pagas
            </span>{" "}
            <ArrowDownRight className="w-4 h-4 text-rose-500" />{" "}
          </div>{" "}
          <div className="mt-2">
            {" "}
            <p className="text-lg font-bold text-foreground font-sans tracking-tight">
              {" "}
              {currentMonthExpense.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
            </p>{" "}
            <p className="text-[10px] text-muted-foreground mt-1">
              Sustento operacional e alvarás
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* KPI 7: Honorários Pendentes */}{" "}
        <div className="p-4 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col justify-between">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              A Receber
            </span>{" "}
            <TrendingUp className="w-4 h-4 text-amber-500" />{" "}
          </div>{" "}
          <div className="mt-2">
            {" "}
            <p className="text-lg font-bold text-foreground font-sans tracking-tight">
              {" "}
              {pendingFees.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
            </p>{" "}
            <p className="text-[10px] text-amber-500 font-semibold mt-1">
              Honorários sob contrato pendentes
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* KPI 8: Faturamento Líquido */}{" "}
        <div className="p-4 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col justify-between">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Saldo Líquido
            </span>{" "}
            <div
              className={`w-2 h-2 rounded-full ${netBalance >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
            />{" "}
          </div>{" "}
          <div className="mt-2">
            {" "}
            <p
              className={`text-lg font-bold font-sans tracking-tight ${netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
            >
              {" "}
              {netBalance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
            </p>{" "}
            <p className="text-[10px] text-muted-foreground mt-1">
              Resultado financeiro do período
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Grid: Charts & Statistics */}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        {/* Chart 1: Receitas vs Despesas (Bar Chart Custom) */}{" "}
        <div className="lg:col-span-2 p-5 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col">
          {" "}
          <div className="flex justify-between items-center mb-4">
            {" "}
            <div>
              {" "}
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Histórico de Fluxo de Caixa
              </h3>{" "}
              <p className="text-[10px] text-muted-foreground">
                Receitas vs Despesas operacionais do escritório (Últimos 6
                meses)
              </p>{" "}
            </div>{" "}
            <div className="flex gap-3 text-[10px] font-semibold">
              {" "}
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Receitas
              </span>{" "}
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-rose-400 rounded-sm" /> Despesas
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Custom Pristine SVG-based Bar Chart */}{" "}
          <div className="flex-1 min-h-[180px] flex items-end justify-between gap-2 border-b border-l border-border pb-2 pl-2 pt-4">
            {" "}
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
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group"
                >
                  {" "}
                  <div className="w-full flex justify-center gap-1 items-end h-full">
                    {" "}
                    {/* Income Bar */}{" "}
                    <div
                      style={{ height: `${Math.max(rPercent, 4)}%` }}
                      className="w-3 sm:w-4 bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-all duration-300 relative"
                    >
                      {" "}
                      {/* Tooltip on hover */}{" "}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] py-1 px-1.5 rounded scale-0 group-hover:scale-100 whitespace-nowrap transition-all z-10">
                        {" "}
                        Rec: R$ {d.r.toLocaleString()}{" "}
                      </span>{" "}
                    </div>{" "}
                    {/* Expense Bar */}{" "}
                    <div
                      style={{ height: `${Math.max(dPercent, 4)}%` }}
                      className="w-3 sm:w-4 bg-rose-400 hover:bg-rose-500 rounded-t-sm transition-all duration-300 relative"
                    >
                      {" "}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] py-1 px-1.5 rounded scale-0 group-hover:scale-100 whitespace-nowrap transition-all z-10">
                        {" "}
                        Des: R$ {d.d.toLocaleString()}{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="text-[10px] font-bold text-muted-foreground mt-2">
                    {d.m}
                  </span>{" "}
                </div>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
        {/* Chart 2: Processos por Área Jurídica (Donut Chart Custom) */}{" "}
        <div className="p-5 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col justify-between">
          {" "}
          <div>
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
              Processos por Área Jurídica
            </h3>{" "}
            <p className="text-[10px] text-muted-foreground">
              Divisão de contencioso ativo
            </p>{" "}
          </div>{" "}
          <div className="flex items-center justify-center py-4 gap-4">
            {" "}
            {/* Custom Pie/Donut Visualization */}{" "}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              {" "}
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                {" "}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeWidth="4"
                />{" "}
                {/* Simulated Segment 1: Civil (33%) */}{" "}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="4"
                  strokeDasharray="33 100"
                  strokeDashoffset="0"
                />{" "}
                {/* Simulated Segment 2: Trabalhista (33%) */}{" "}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="4"
                  strokeDasharray="33 100"
                  strokeDashoffset="-33"
                />{" "}
                {/* Simulated Segment 3: Tributário (34%) */}{" "}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray="34 100"
                  strokeDashoffset="-66"
                />{" "}
              </svg>{" "}
              <div className="absolute flex flex-col items-center">
                {" "}
                <span className="text-lg font-bold text-foreground leading-tight">
                  {" "}
                  {processes.length}{" "}
                </span>{" "}
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  Causas
                </span>{" "}
              </div>{" "}
            </div>{" "}
            {/* Area Legenda */}{" "}
            <div className="space-y-1.5 flex-1 text-left">
              {" "}
              {Object.entries(areaCounts).map(([area, count]) => (
                <div
                  key={area}
                  className="flex items-center justify-between text-[11px]"
                >
                  {" "}
                  <div className="flex items-center gap-1.5">
                    {" "}
                    <span
                      className={`w-2 h-2 rounded-full ${areaColors[area] || "bg-slate-400"}`}
                    />{" "}
                    <span className="text-muted-foreground font-medium">
                      {area}
                    </span>{" "}
                  </div>{" "}
                  <span className="font-bold text-foreground">
                    {count}
                  </span>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Grid: Prazos Urgentes & Processos Parados (>90 dias) */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {" "}
        {/* Left Side: Prazos do Dia */}{" "}
        <div className="p-5 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col">
          {" "}
          <div className="flex justify-between items-center mb-3">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              {" "}
              <Calendar className="w-4 h-4 text-emerald-500" /> Prazos do Dia &
              Críticos{" "}
            </h3>{" "}
            <button
              onClick={() => setActiveTab("operacao.prazos")}
              className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
            >
              {" "}
              Ver todos <ArrowRight className="w-3 h-3" />{" "}
            </button>{" "}
          </div>{" "}
          <div className="space-y-2 flex-1 max-h-56 overflow-y-auto no-scrollbar">
            {" "}
            {deadlines
              .filter((d) => !d.completed)
              .slice(0, 3)
              .map((d) => (
                <div
                  key={d.id}
                  className="p-3 bg-background/60 border border-border/80 rounded-md flex justify-between items-center gap-3 text-left"
                >
                  {" "}
                  <div>
                    {" "}
                    <h4 className="text-xs font-bold text-foreground leading-tight">
                      {d.title}
                    </h4>{" "}
                    <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-[240px]">
                      {" "}
                      {d.processTitle
                        ? `Proc: ${d.processTitle}`
                        : "Ação Geral do Escritório"}{" "}
                    </p>{" "}
                  </div>{" "}
                  <span
                    className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${d.priority === "critical" ? "bg-rose-950 text-rose-400" : "bg-amber-950 text-amber-400"}`}
                  >
                    {" "}
                    {d.priority === "critical"
                      ? "CRÍTICO"
                      : d.priority === "high"
                      ? "ALTA"
                      : d.priority === "medium"
                      ? "MÉDIA"
                      : "BAIXA"}{" "}
                  </span>{" "}
                </div>
              ))}{" "}
            {deadlines.filter((d) => !d.completed).length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground">
                {" "}
                Parabéns! Sem prazos pendentes marcados.{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        {/* Right Side: Processos Sem Movimento (>90 dias) */}{" "}
        <div className="p-5 bg-card border border-border/80 rounded-xl shadow-sm flex flex-col">
          {" "}
          <div className="flex justify-between items-center mb-3">
            {" "}
            <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              {" "}
              <Scale className="w-4 h-4 text-amber-500 animate-spin" />{" "}
              Processos Parados (&gt;90 dias){" "}
            </h3>{" "}
            <button
              onClick={() => setActiveTab("operacao.processos")}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
            >
              {" "}
              Ver todos <ArrowRight className="w-3 h-3" />{" "}
            </button>{" "}
          </div>{" "}
          <div className="space-y-2 flex-1 max-h-56 overflow-y-auto no-scrollbar">
            {" "}
            {stagnantProcesses.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProcessId(p.id);
                  setActiveTab("operacao.processo_detalhe");
                }}
                className="p-3 bg-background/60 hover:bg-accent hover:text-accent-foreground dark:hover:bg-card border border-border/80 rounded-md flex justify-between items-center gap-4 cursor-pointer text-left"
              >
                {" "}
                <div className="min-w-0">
                  {" "}
                  <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {p.title}
                  </h4>{" "}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    CNJ: {p.cnj}
                  </p>{" "}
                </div>{" "}
                <div className="text-right shrink-0">
                  {" "}
                  <span className="text-xs font-bold text-amber-500 block">
                    Sem Movimento
                  </span>{" "}
                  <span className="text-xs text-muted-foreground">
                    Último: {p.lastMovementDate || "Início"}
                  </span>{" "}
                </div>{" "}
              </div>
            ))}{" "}
            {stagnantProcesses.length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground">
                {" "}
                Todos os processos ativos movimentados recentemente.
                Excelente!{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* AI Copiloto Suggestions Center */}{" "}
      <div className="p-5 bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-xl border border-indigo-950 shadow-lg relative overflow-hidden">
        {" "}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          {" "}
          <Sparkles className="w-24 h-24 text-white" />{" "}
        </div>{" "}
        <div className="relative z-10 text-left">
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <div className="p-1.5 bg-emerald-500 text-white rounded-md">
              {" "}
              <Sparkles className="w-4 h-4" />{" "}
            </div>{" "}
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              JusFlow Copiloto IA
            </span>{" "}
          </div>{" "}
          <p className="text-sm font-semibold mt-2 text-slate-100">
            {" "}
            "Olá! Identifiquei que o processo tributário contra a Fazenda
            Nacional tem uma contingência estratégica de R$ 850.000,00 e o
            agravo de instrumento está concluso. Deseja minutar um memorial de
            sustentação oral para entrega imediata aos desembargadores?"{" "}
          </p>{" "}
          <div className="mt-4 flex flex-wrap gap-2">
            {" "}
            <button
              onClick={() => setActiveTab("principal.copiloto")}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/15"
            >
              {" "}
              Falar com o Copiloto <ArrowRight className="w-3.5 h-3.5" />{" "}
            </button>{" "}
            <button
              onClick={() => setActiveTab("documentos.ia")}
              className="px-3.5 py-1.5 bg-muted hover:bg-slate-700 text-muted-foreground hover:text-white font-bold text-xs rounded-md transition-colors border border-border"
            >
              {" "}
              Gerar Petição Rápida{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
