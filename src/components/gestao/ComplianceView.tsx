import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Bot,
  HelpCircle,
} from "lucide-react";
export const ComplianceView: React.FC = () => {
  const [auditMode, setAuditMode] = useState<"oab" | "lgpd">("oab");
  const [textToAudit, setTextToAudit] = useState(
    "Anúncio patrocinado: Venha para o melhor escritório de SP! Garantimos vitória judicial em divórcios litigiosos rápidos. Fale agora com nossa equipe comercial e ganhe consulta gratuita com advogados.",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textToAudit.trim() || isLoading) return;
    setIsLoading(true);
    setAuditResult(null);
    try {
      const response = await fetch("/api/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: auditMode, text: textToAudit }),
      });
      if (!response.ok) throw new Error("Compliance audit failed");
      const data = await response.json();
      setAuditResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusBadge = (lvl: string) => {
    switch (lvl) {
      case "compliant":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40";
      case "warning":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40";
      default:
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40";
    }
  };
  const getStatusName = (lvl: string) => {
    switch (lvl) {
      case "compliant":
        return "Conforme";
      case "warning":
        return "Risco Moderado";
      default:
        return "Alerta Crítico";
    }
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="text-left">
        {" "}
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Compliance & Ética
        </h2>{" "}
        <p className="text-xs text-muted-foreground">
          Audite copys publicitárias, posts ou políticas contratuais sob a
          vigência do Código de Ética da OAB e da LGPD.
        </p>{" "}
      </div>{" "}
      <div className="border-b border-border flex gap-1 shrink-0">
        {" "}
        <button
          onClick={() => {
            setAuditMode("oab");
            setTextToAudit(
              "Anúncio patrocinado: Venha para o melhor escritório de SP! Garantimos vitória judicial em divórcios litigiosos rápidos. Fale agora com nossa equipe comercial e ganhe consulta gratuita com advogados.",
            );
            setAuditResult(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${auditMode === "oab" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-muted-foreground hover:text-muted-foreground dark:hover:text-card-foreground"}`}
        >
          {" "}
          <Bot className="w-4 h-4 text-emerald-500 shrink-0" /> Publicidade OAB
          (Art. 39 a 47){" "}
        </button>{" "}
        <button
          onClick={() => {
            setAuditMode("lgpd");
            setTextToAudit(
              "Seção de armazenamento: O escritório armazena em servidores locais desprotegidos cópias de passaportes, exames médicos admissoriais e contracheques dos colaboradores por tempo indeterminado e compartilha via grupo aberto do WhatsApp.",
            );
            setAuditResult(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${auditMode === "lgpd" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-muted-foreground hover:text-muted-foreground dark:hover:text-card-foreground"}`}
        >
          {" "}
          <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" /> Segurança
          de Dados & LGPD{" "}
        </button>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        {" "}
        {/* Input parameters panel */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[480px]">
          {" "}
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
            Conteúdo para Auditoria
          </h3>{" "}
          <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
            {" "}
            {auditMode === "oab"
              ? "Insira o rascunho de posts do Instagram, copies de landing pages, anúncios ou panfletos digitais para verificar vedações éticas de mercantilização."
              : "Insira a descrição de processos internos, fluxos de armazenamento de arquivos ou minutas de políticas de segurança e privacidade do escritório."}{" "}
          </p>{" "}
          <textarea
            required
            value={textToAudit}
            onChange={(e) => setTextToAudit(e.target.value)}
            className="flex-1 w-full bg-background border border-border focus:border-emerald-500 rounded-md p-3 text-xs text-card-foreground outline-0 resize-none font-sans"
          />{" "}
          <button
            onClick={handleRunAudit}
            disabled={isLoading || !textToAudit.trim()}
            className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-md transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer"
          >
            {" "}
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5" />
            )}{" "}
            Auditar Conformidade Legal{" "}
          </button>{" "}
        </div>{" "}
        {/* Audit feedback results */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[480px] overflow-hidden">
          {" "}
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
            {" "}
            <HelpCircle className="w-4.5 h-4.5 text-emerald-500" /> Relatório Ético
            Consolidado{" "}
          </h3>{" "}
          <p className="text-[10px] text-muted-foreground mb-4 leading-snug">
            Avaliação de violações estatutárias ou regulatórias geradas de forma
            cognitiva:
          </p>{" "}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar text-xs">
            {" "}
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-pulse">
                {" "}
                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mb-3" />{" "}
                <p className="font-bold text-foreground ">
                  Auditando sob o Código de Ética e Disciplina da OAB...
                </p>{" "}
                <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
                  Varrendo vedações contra mercantilização da profissão,
                  divulgação gratuita de consultas, ou descumprimento de guarda
                  de dados.
                </p>{" "}
              </div>
            ) : auditResult ? (
              <div className="space-y-4">
                {" "}
                {/* Score badge card */}{" "}
                <div className="p-3 bg-background/40 border border-border rounded-md flex items-center justify-between">
                  {" "}
                  <div>
                    {" "}
                    <span className="text-[9px] text-muted-foreground block font-bold uppercase">
                      Status de Adequação
                    </span>{" "}
                    <span className="text-sm font-bold text-foreground">
                      {" "}
                      {getStatusName(auditResult.level)}{" "}
                    </span>{" "}
                  </div>{" "}
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${getStatusBadge(auditResult.level)}`}
                  >
                    {" "}
                    OAB CED{" "}
                  </span>{" "}
                </div>{" "}
                {/* Score reasons */}{" "}
                <div className="space-y-3">
                  {" "}
                  {/* Analysis card */}{" "}
                  <div className="p-3 bg-background/40 rounded-md border border-border space-y-1">
                    {" "}
                    <span className="font-bold text-foreground block text-[10px] uppercase">
                      Análise de Riscos
                    </span>{" "}
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {auditResult.analysis}
                    </p>{" "}
                  </div>{" "}
                  {/* Recommendations */}{" "}
                  <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-md space-y-2">
                    {" "}
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block text-[10px] uppercase">
                      Plano de Ajuste Recomendado
                    </span>{" "}
                    <div className="space-y-1.5 text-[11px]">
                      {" "}
                      {auditResult.recommendations &&
                        auditResult.recommendations.map(
                          (rec: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-start gap-1.5 text-muted-foreground leading-relaxed"
                            >
                              {" "}
                              <span className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold">
                                •
                              </span>{" "}
                              <span>{rec}</span>{" "}
                            </div>
                          ),
                        )}{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                {" "}
                <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />{" "}
                <p className="font-bold text-xs">
                  Aguardando inserção de conteúdo
                </p>{" "}
                <p className="text-[10px] mt-1 max-w-xs">
                  Cole as copies de anúncios, posts, termos de uso ou políticas
                  de privacidade no painel ao lado para auditar conformidade
                  regulatória.
                </p>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
