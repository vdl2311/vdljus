import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Search,
  Landmark,
  Scale,
  AlertCircle,
  Clock,
  ShieldCheck,
  Database,
  Calendar,
  TrendingUp,
  BarChart3,
  Activity,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// 6-Month Process Status Trend Data for DataJud tracking
const processTrendData = [
  {
    month: "Fev/26",
    "Em Andamento": 14,
    "Conclusos p/ Decisão": 3,
    "Arquivados / Baixados": 2,
    "Novas Distribuições": 5,
  },
  {
    month: "Mar/26",
    "Em Andamento": 18,
    "Conclusos p/ Decisão": 5,
    "Arquivados / Baixados": 3,
    "Novas Distribuições": 7,
  },
  {
    month: "Abr/26",
    "Em Andamento": 22,
    "Conclusos p/ Decisão": 7,
    "Arquivados / Baixados": 4,
    "Novas Distribuições": 6,
  },
  {
    month: "Mai/26",
    "Em Andamento": 27,
    "Conclusos p/ Decisão": 9,
    "Arquivados / Baixados": 6,
    "Novas Distribuições": 8,
  },
  {
    month: "Jun/26",
    "Em Andamento": 31,
    "Conclusos p/ Decisão": 12,
    "Arquivados / Baixados": 7,
    "Novas Distribuições": 9,
  },
  {
    month: "Jul/26",
    "Em Andamento": 36,
    "Conclusos p/ Decisão": 15,
    "Arquivados / Baixados": 9,
    "Novas Distribuições": 11,
  },
];

export const DataJudView: React.FC = () => {
  const { processes, syncLogs, addSyncLog } = useJusFlow();
  const [cnj, setCnj] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [selectedMetric, setSelectedMetric] = useState<string>("todos");

  const handleCnjChange = (val: string) => {
    // Basic CNJ formatting helper: XXXXXXX-XX.XXXX.X.XX.XXXX (20 digits)
    const raw = val.replace(/\D/g, "").substring(0, 20);
    let formatted = raw;
    if (raw.length > 7)
      formatted = raw.substring(0, 7) + "-" + raw.substring(7);
    if (raw.length > 9)
      formatted = formatted.substring(0, 10) + "." + raw.substring(9);
    if (raw.length > 13)
      formatted = formatted.substring(0, 15) + "." + raw.substring(13);
    if (raw.length > 14)
      formatted = formatted.substring(0, 17) + "." + raw.substring(14);
    if (raw.length > 16)
      formatted = formatted.substring(0, 20) + "." + raw.substring(16);
    setCnj(formatted);
  };

  const handleConsultDataJud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnj) return;
    setIsLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/datajud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnj, isDemo: true }),
      });
      if (!response.ok) throw new Error("Falha na varredura do DataJud.");
      const data = await response.json();
      setResult(data); // Record in context sync logs
      addSyncLog({
        tribunal: data.tribunal,
        status: "success",
        cnj: cnj,
        movementsCount: data.movements.length,
      });
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao consultar CNJ."); // Record failed search in sync logs
      addSyncLog({
        tribunal: "TJSP",
        status: "failed",
        cnj: cnj,
        movementsCount: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Custom tooltip component for dark/light mode consistency
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 border border-border p-3 rounded-lg shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-foreground mb-1.5 border-b border-border/60 pb-1">
            {label}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold text-foreground">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {/* Header */}
      <div className="text-left">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Plataforma DataJud
        </h2>
        <p className="text-xs text-muted-foreground">
          Mecanismo unificado do Conselho Nacional de Justiça (CNJ) para
          extração de andamentos processuais e monitoramento de tendências.
        </p>
      </div>

      {/* Recharts Data Visualization: Status Trends Over Last 6 Months */}
      <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Evolução de Status dos Processos (Últimos 6 Meses)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Tendências históricas de processos monitorados na base unificada do DataJud
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Filter */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
              <button
                onClick={() => setSelectedMetric("todos")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedMetric === "todos"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedMetric("andamento")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedMetric === "andamento"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Andamento
              </button>
              <button
                onClick={() => setSelectedMetric("conclusos")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedMetric === "conclusos"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Conclusos
              </button>
            </div>

            {/* Chart Type Toggle */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
              <button
                onClick={() => setChartType("area")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  chartType === "area"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Gráfico de Área"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  chartType === "bar"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Gráfico de Barras"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-background/50 border border-border rounded-lg">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              Em Andamento
            </span>
            <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
              36
            </span>
            <span className="text-[10px] text-emerald-500 font-medium ml-1">
              +157% em 6 meses
            </span>
          </div>

          <div className="p-3 bg-background/50 border border-border rounded-lg">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              Conclusos p/ Decisão
            </span>
            <span className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
              15
            </span>
            <span className="text-[10px] text-indigo-500 font-medium ml-1">
              +400% em 6 meses
            </span>
          </div>

          <div className="p-3 bg-background/50 border border-border rounded-lg">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              Arquivados / Baixados
            </span>
            <span className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
              9
            </span>
            <span className="text-[10px] text-amber-500 font-medium ml-1">
              Encerramentos
            </span>
          </div>

          <div className="p-3 bg-background/50 border border-border rounded-lg">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              Novas Distribuições
            </span>
            <span className="text-base sm:text-lg font-bold text-sky-600 dark:text-sky-400">
              11
            </span>
            <span className="text-[10px] text-sky-500 font-medium ml-1">
              Média 8/mês
            </span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[260px] sm:h-[300px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart
                data={processTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAndamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorConclusos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorArquivados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorNovas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />

                {(selectedMetric === "todos" || selectedMetric === "andamento") && (
                  <Area
                    type="monotone"
                    dataKey="Em Andamento"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAndamento)"
                  />
                )}
                {(selectedMetric === "todos" || selectedMetric === "conclusos") && (
                  <Area
                    type="monotone"
                    dataKey="Conclusos p/ Decisão"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorConclusos)"
                  />
                )}
                {selectedMetric === "todos" && (
                  <Area
                    type="monotone"
                    dataKey="Arquivados / Baixados"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorArquivados)"
                  />
                )}
                {selectedMetric === "todos" && (
                  <Area
                    type="monotone"
                    dataKey="Novas Distribuições"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorNovas)"
                  />
                )}
              </AreaChart>
            ) : (
              <BarChart
                data={processTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />

                {(selectedMetric === "todos" || selectedMetric === "andamento") && (
                  <Bar dataKey="Em Andamento" fill="#10b981" radius={[4, 4, 0, 0]} />
                )}
                {(selectedMetric === "todos" || selectedMetric === "conclusos") && (
                  <Bar dataKey="Conclusos p/ Decisão" fill="#6366f1" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetric === "todos" && (
                  <Bar dataKey="Arquivados / Baixados" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetric === "todos" && (
                  <Bar dataKey="Novas Distribuições" fill="#0284c7" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Search form & Sync History (1 column) */}
        <div className="space-y-6">
          {/* Query Form */}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-emerald-500" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Nova Consulta CNJ
              </h3>
            </div>
            <form onSubmit={handleConsultDataJud} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                  Número Único do Processo (CNJ)
                </label>
                <div className="relative">
                  <Scale className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    maxLength={25}
                    placeholder="Ex: 5001234-56.2025.8.26.0100"
                    value={cnj}
                    onChange={(e) => handleCnjChange(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md pl-9 pr-4 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 font-mono focus:ring-0"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-md transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                {isLoading
                  ? "Consultando DataJud..."
                  : "Pesquisar Base CNJ"}
              </button>
            </form>
            <div className="p-3 bg-background/40 rounded-md border border-border/80 text-[10px] text-muted-foreground flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Conexão segura autorizada. Todas as requisições geram log de
                auditoria permanente no ecossistema JusFlow.
              </span>
            </div>
          </div>
          {/* Sync Logs Table / Auditoria */}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" /> Registro de
              Auditoria (Últimas Consultas)
            </h3>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar">
              {syncLogs.slice(0, 5).map((log, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-background/40 border border-border/80 rounded-md text-[10px]"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-card-foreground truncate max-w-[150px]">
                      {log.cnj}
                    </span>
                    <span
                      className={`font-bold px-1 rounded-sm text-[10px] uppercase ${log.status === "success" ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"}`}
                    >
                      {log.status === "success" ? "Sucesso" : "Erro"}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground mt-1">
                    <span>Tribunal: {log.tribunal}</span>
                    <span>{log.movementsCount} andamentos</span>
                  </div>
                </div>
              ))}
              {syncLogs.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Nenhuma consulta registrada.
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Right column: Search results (2 columns) */}
        <div className="lg:col-span-2">
          {isLoading && (
            <div className="h-[300px] bg-card border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center animate-pulse">
              <Database className="w-10 h-10 text-emerald-500 animate-bounce mb-3" />
              <p className="text-xs font-bold text-foreground ">
                Conectando ao WebService do CNJ / DataJud...
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Consultando metadados processuais e descompactando andamentos
                históricos estruturados.
              </p>
            </div>
          )}
          {error && (
            <div className="h-[300px] bg-card border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center text-rose-500">
              <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
              <p className="text-xs font-bold">Falha de Integração</p>
              <p className="text-[10px] text-muted-foreground mt-1 max-w-sm">
                {error}
              </p>
            </div>
          )}
          {!result && !isLoading && !error && (
            <div className="h-[300px] bg-card border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center">
              <Landmark className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="text-xs font-bold text-foreground ">
                Nenhum resultado carregado
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Insira um número CNJ ao lado e execute a consulta para raspar a
                base do tribunal.
              </p>
            </div>
          )}
          {result && !isLoading && (
            <div className="space-y-6 text-left">
              {/* Metadata Card */}
              <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
                <div className="pb-3 border-b border-border flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded uppercase">
                      Tribunal: {result.tribunal}
                    </span>
                    <h3 className="text-sm font-bold text-card-foreground mt-1.5 select-all">
                      {result.cnj}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-500 block">
                      Sincronizado
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      Valor: R$ {result.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-bold text-[10px] uppercase">
                      Classe
                    </span>
                    <span className="font-semibold text-foreground block truncate">
                      {result.class}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-bold text-[10px] uppercase">
                      Assunto Principal
                    </span>
                    <span className="font-semibold text-foreground block truncate">
                      {result.subject}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-bold text-[10px] uppercase">
                      Vara / Órgão Julgador
                    </span>
                    <span className="font-semibold text-foreground block truncate">
                      {result.division}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-bold text-[10px] uppercase">
                      Autor (Polo Ativo)
                    </span>
                    <span className="font-bold text-foreground block truncate">
                      {result.plaintiff}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-bold text-[10px] uppercase">
                      Réu (Polo Passivo)
                    </span>
                    <span className="font-bold text-foreground block truncate">
                      {result.defendant}
                    </span>
                  </div>
                </div>
              </div>
              {/* Scraped Movements Timeline */}
              <div className="p-5 bg-card border border-border rounded-xl shadow-sm">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-500" /> Andamentos
                  Estruturados Importados ({result.movements.length})
                </h3>
                <div className="relative pl-4 border-l border-border space-y-4 py-1.5">
                  {result.movements.map((m: any, idx: number) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-500" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground font-bold block">
                          {m.date}
                        </span>
                        <h4 className="text-xs font-bold text-foreground leading-tight">
                          {m.description}
                        </h4>
                        {m.details && (
                          <p className="text-[10px] text-muted-foreground leading-snug">
                            {m.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
