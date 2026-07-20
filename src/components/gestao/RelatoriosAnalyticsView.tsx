import React from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Map,
  User2,
  Star,
  ShieldCheck,
} from "lucide-react";
export const RelatoriosAnalyticsView: React.FC = () => {
  const { processes, financials, tasks } = useJusFlow(); // On-the-fly math
  const activeCount = processes.filter((p) => p.status === "active").length;
  const closedCount = processes.filter((p) => p.status === "closed").length;
  const winCount = processes.filter(
    (p) => p.status === "closed" && p.outcome === "Procedente",
  ).length;
  const winRatio =
    closedCount > 0 ? Math.round((winCount / closedCount) * 100) : 85;
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="text-left">
        {" "}
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Relatórios & Analytics
        </h2>{" "}
        <p className="text-xs text-muted-foreground">
          Avalie métricas consolidadas de contencioso ativo, tempo de êxito e
          rentabilidade processual.
        </p>{" "}
      </div>{" "}
      {/* Analytics KPIs Row */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {" "}
        {/* Card 1: Success Rate */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-3 text-left relative overflow-hidden">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <div>
              {" "}
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Taxa de Êxito Judicial
              </span>{" "}
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {winRatio}% de Vitórias
              </p>{" "}
            </div>{" "}
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-md shrink-0">
              <Award className="w-5 h-5" />
            </span>{" "}
          </div>{" "}
          <p className="text-[10px] text-muted-foreground">
            Proporção de sentenças dadas como PROCEDENTES em primeira e segunda
            instância.
          </p>{" "}
          {/* Progress bar */}{" "}
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            {" "}
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${winRatio}%` }}
            />{" "}
          </div>{" "}
        </div>{" "}
        {/* Card 2: Average resolution time */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-3 text-left relative overflow-hidden">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <div>
              {" "}
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Tempo Médio de Sentença
              </span>{" "}
              <p className="text-2xl font-bold text-foreground mt-1">
                14.2 Meses
              </p>{" "}
            </div>{" "}
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-md shrink-0">
              <Clock className="w-5 h-5" />
            </span>{" "}
          </div>{" "}
          <p className="text-[10px] text-muted-foreground">
            Tempo decorrido entre a distribuição do preâmbulo e a publicação da
            decisão final.
          </p>{" "}
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            {" "}
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: "65%" }}
            />{" "}
          </div>{" "}
        </div>{" "}
        {/* Card 3: Productivity */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-3 text-left relative overflow-hidden">
          {" "}
          <div className="flex justify-between items-start">
            {" "}
            <div>
              {" "}
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Produtividade de Prazos
              </span>{" "}
              <p className="text-2xl font-bold text-indigo-600 mt-1">
                100% de Entrega
              </p>{" "}
            </div>{" "}
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-md shrink-0">
              <TrendingUp className="w-5 h-5" />
            </span>{" "}
          </div>{" "}
          <p className="text-[10px] text-muted-foreground">
            Zero perdas de prazos forenses ou preclusões registradas nos últimos
            12 meses.
          </p>{" "}
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            {" "}
            <div
              className="bg-indigo-500 h-full rounded-full"
              style={{ width: "100%" }}
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Advanced statistical panels (Bento Grid) */}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        {" "}
        {/* Left Side: Court averages stats list */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
          {" "}
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            {" "}
            <Map className="w-4.5 h-4.5 text-emerald-500" /> Demanda Média de
            Resolução por Tribunal (TJ){" "}
          </h3>{" "}
          <div className="space-y-3.5 pt-1.5">
            {" "}
            {[
              {
                court: "TJSP (Tribunal de São Paulo)",
                time: "11.5 meses",
                percentage: 40,
                active: 4,
              },
              {
                court: "TJRJ (Tribunal do Rio de Janeiro)",
                time: "18.2 meses",
                percentage: 70,
                active: 2,
              },
              {
                court: "TRF3 (Justiça Federal de SP)",
                time: "24.6 meses",
                percentage: 95,
                active: 1,
              },
              {
                court: "TST (Tribunal Superior do Trabalho)",
                time: "14.0 meses",
                percentage: 55,
                active: 3,
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                {" "}
                <div className="flex justify-between text-muted-foreground">
                  {" "}
                  <span className="font-bold">{item.court}</span>{" "}
                  <span className="font-mono text-muted-foreground">
                    {item.time} ({item.active} ativos)
                  </span>{" "}
                </div>{" "}
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  {" "}
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        {/* Right Side: Attorney distribution statistics */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
          {" "}
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            {" "}
            <User2 className="w-4.5 h-4.5 text-emerald-500" /> Carga Processual por
            Advogado Sócio{" "}
          </h3>{" "}
          <div className="space-y-3.5 pt-1.5">
            {" "}
            {[
              {
                name: "Dr. André Martins (Sócio-Diretor)",
                role: "Direito de Negócios / Societário",
                cases: 6,
                score: "4.9 / 5.0",
              },
              {
                name: "Dra. Letícia Schmidt (Sócia)",
                role: "Cível / Contratos",
                cases: 4,
                score: "4.8 / 5.0",
              },
              {
                name: "Dra. Bruna Ramos (Sócia)",
                role: "Trabalhista / Tributário",
                cases: 3,
                score: "4.7 / 5.0",
              },
            ].map((lawyer, idx) => (
              <div
                key={idx}
                className="p-3 bg-background border border-border/80 rounded-md flex justify-between items-center text-xs"
              >
                {" "}
                <div className="space-y-0.5">
                  {" "}
                  <span className="font-bold text-card-foreground block">
                    {lawyer.name}
                  </span>{" "}
                  <span className="text-[10px] text-muted-foreground block">
                    {lawyer.role}
                  </span>{" "}
                </div>{" "}
                <div className="text-right">
                  {" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    {lawyer.cases} causas
                  </span>{" "}
                  <span className="text-[10px] text-amber-500 flex items-center gap-0.5 justify-end">
                    {" "}
                    <Star className="w-3.5 h-3.5 fill-current" />{" "}
                    {lawyer.score}{" "}
                  </span>{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
