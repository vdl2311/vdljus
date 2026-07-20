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
} from "lucide-react";
export const DataJudView: React.FC = () => {
  const { syncLogs, addSyncLog } = useJusFlow();
  const [cnj, setCnj] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");
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
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="text-left">
        {" "}
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Plataforma DataJud
        </h2>{" "}
        <p className="text-xs text-muted-foreground">
          Mecanismo unificado do Conselho Nacional de Justiça (CNJ) para
          extração de andamentos processuais integrados.
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        {/* Left column: Search form & Sync History (1 column) */}{" "}
        <div className="space-y-6">
          {" "}
          {/* Query Form */}{" "}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left space-y-4">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <Database className="w-4.5 h-4.5 text-cyan-500" />{" "}
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Nova Consulta CNJ
              </h3>{" "}
            </div>{" "}
            <form onSubmit={handleConsultDataJud} className="space-y-3">
              {" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                  Número Único do Processo (CNJ)
                </label>{" "}
                <div className="relative">
                  {" "}
                  <Scale className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />{" "}
                  <input
                    type="text"
                    required
                    maxLength={25}
                    placeholder="Ex: 5001234-56.2025.8.26.0100"
                    value={cnj}
                    onChange={(e) => handleCnjChange(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md pl-9 pr-4 py-2 text-xs text-card-foreground outline-0 font-mono focus:ring-0"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-md transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer"
              >
                {" "}
                {isLoading
                  ? "Consultando DataJud..."
                  : "Pesquisar Base CNJ"}{" "}
              </button>{" "}
            </form>{" "}
            <div className="p-3 bg-background/40 rounded-md border border-border/80 text-[10px] text-muted-foreground flex items-start gap-1.5">
              {" "}
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{" "}
              <span>
                Conexão segura autorizada. Todas as requisições geram log de
                auditoria permanente no ecossistema JusFlow.
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Sync Logs Table / Auditoria */}{" "}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              {" "}
              <Clock className="w-4 h-4 text-muted-foreground" /> Registro de
              Auditoria (Últimas Consultas){" "}
            </h3>{" "}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar">
              {" "}
              {syncLogs.slice(0, 5).map((log, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-background/40 border border-border/80 rounded-md text-[10px]"
                >
                  {" "}
                  <div className="flex justify-between items-center">
                    {" "}
                    <span className="font-mono text-card-foreground truncate max-w-[150px]">
                      {log.cnj}
                    </span>{" "}
                    <span
                      className={`font-bold px-1 rounded-sm text-[8px] uppercase ${log.status === "success" ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"}`}
                    >
                      {" "}
                      {log.status}{" "}
                    </span>{" "}
                  </div>{" "}
                  <div className="flex justify-between text-muted-foreground mt-1">
                    {" "}
                    <span>Tribunal: {log.tribunal}</span>{" "}
                    <span>{log.movementsCount} andamentos</span>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
              {syncLogs.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Nenhuma consulta registrada.
                </p>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right column: Search results (2 columns) */}{" "}
        <div className="lg:col-span-2">
          {" "}
          {isLoading && (
            <div className="h-[300px] bg-card border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center animate-pulse">
              {" "}
              <Database className="w-10 h-10 text-cyan-500 animate-bounce mb-3" />{" "}
              <p className="text-xs font-bold text-foreground ">
                Conectando ao WebService do CNJ / DataJud...
              </p>{" "}
              <p className="text-[10px] text-muted-foreground mt-1">
                Consultando metadados processuais e descompactando andamentos
                históricos estruturados.
              </p>{" "}
            </div>
          )}{" "}
          {error && (
            <div className="h-[300px] bg-card border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center text-rose-500">
              {" "}
              <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />{" "}
              <p className="text-xs font-bold">Falha de Integração</p>{" "}
              <p className="text-[10px] text-muted-foreground mt-1 max-w-sm">
                {error}
              </p>{" "}
            </div>
          )}{" "}
          {!result && !isLoading && !error && (
            <div className="h-[300px] bg-card border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center">
              {" "}
              <Landmark className="w-10 h-10 text-muted-foreground mb-2" />{" "}
              <p className="text-xs font-bold text-foreground ">
                Nenhum resultado carregado
              </p>{" "}
              <p className="text-[10px] text-muted-foreground mt-1">
                Insira um número CNJ ao lado e execute a consulta para raspar a
                base do tribunal.
              </p>{" "}
            </div>
          )}{" "}
          {result && !isLoading && (
            <div className="space-y-6 text-left">
              {" "}
              {/* Metadata Card */}{" "}
              <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
                {" "}
                <div className="pb-3 border-b border-border flex justify-between items-center">
                  {" "}
                  <div>
                    {" "}
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded uppercase">
                      {" "}
                      Tribunal: {result.tribunal}{" "}
                    </span>{" "}
                    <h3 className="text-sm font-black text-card-foreground mt-1.5 select-all">
                      {result.cnj}
                    </h3>{" "}
                  </div>{" "}
                  <div className="text-right">
                    {" "}
                    <span className="text-[10px] font-bold text-emerald-500 block">
                      Sincronizado
                    </span>{" "}
                    <span className="text-[9px] text-muted-foreground block mt-0.5">
                      Valor: R$ {result.value.toLocaleString()}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  {" "}
                  <div>
                    {" "}
                    <span className="text-muted-foreground block font-bold text-[9px] uppercase">
                      Classe
                    </span>{" "}
                    <span className="font-semibold text-foreground block truncate">
                      {result.class}
                    </span>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <span className="text-muted-foreground block font-bold text-[9px] uppercase">
                      Assunto Principal
                    </span>{" "}
                    <span className="font-semibold text-foreground block truncate">
                      {result.subject}
                    </span>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <span className="text-muted-foreground block font-bold text-[9px] uppercase">
                      Vara / Órgão Julgador
                    </span>{" "}
                    <span className="font-semibold text-foreground block truncate">
                      {result.division}
                    </span>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <span className="text-muted-foreground block font-bold text-[9px] uppercase">
                      Autor (Polo Ativo)
                    </span>{" "}
                    <span className="font-bold text-foreground block truncate">
                      {result.plaintiff}
                    </span>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <span className="text-muted-foreground block font-bold text-[9px] uppercase">
                      Réu (Polo Passivo)
                    </span>{" "}
                    <span className="font-bold text-foreground block truncate">
                      {result.defendant}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {/* Scraped Movements Timeline */}{" "}
              <div className="p-5 bg-card border border-border rounded-xl shadow-sm">
                {" "}
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  {" "}
                  <Calendar className="w-4 h-4 text-cyan-500" /> Andamentos
                  Estruturados Importados ({result.movements.length}){" "}
                </h3>{" "}
                <div className="relative pl-4 border-l border-border space-y-4 py-1.5">
                  {" "}
                  {result.movements.map((m: any, idx: number) => (
                    <div key={idx} className="relative">
                      {" "}
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-cyan-500" />{" "}
                      <div className="space-y-0.5">
                        {" "}
                        <span className="text-[10px] text-muted-foreground font-bold block">
                          {m.date}
                        </span>{" "}
                        <h4 className="text-xs font-bold text-foreground leading-tight">
                          {m.description}
                        </h4>{" "}
                        {m.details && (
                          <p className="text-[10px] text-muted-foreground leading-snug">
                            {m.details}
                          </p>
                        )}{" "}
                      </div>{" "}
                    </div>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
