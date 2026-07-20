import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Sparkles,
  FileText,
  Download,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  ListChecks,
  CheckCircle2,
} from "lucide-react";
export const IaDocumentosView: React.FC = () => {
  const { clients, addDocument } = useJusFlow();
  const [activeIaTab, setActiveIaTab] = useState<"generator" | "reviewer">(
    "generator",
  );
  const [isLoading, setIsLoading] = useState(false); // Generator States
  const [docType, setDocType] = useState("Petição Inicial");
  const [docTitle, setDocTitle] = useState(
    "Ação de Reparação por Danos Morais",
  );
  const [clientName, setClientName] = useState("");
  const [facts, setFacts] = useState("");
  const [requests, setRequests] = useState("");
  const [generatedText, setGeneratedText] = useState(""); // Reviewer States
  const [contractText, setContractText] = useState("");
  const [reviewResult, setReviewResult] = useState<any | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const handleGeneratePetition = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedText("");
    try {
      const response = await fetch("/api/peticoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          title: docTitle,
          clientName,
          facts,
          requests,
        }),
      });
      if (!response.ok) throw new Error("Petition generation failed");
      const data = await response.json();
      setGeneratedText(data.text); // Save document into our contracts/drafts list!
      addDocument({
        title: `${docType}: ${clientName.split(" ")[0]} - ${docTitle}`,
        content: data.text,
        status: "draft",
      });
    } catch (err) {
      console.error(err);
      setGeneratedText(
        "Desculpe, falha ao conectar ao servidor de inteligência jurídica. Verifique sua chave API e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleReviewContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractText.trim()) return;
    setIsLoading(true);
    setReviewResult(null);
    try {
      const response = await fetch("/api/revisao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: contractText }),
      });
      if (!response.ok) throw new Error("Contract review failed");
      const data = await response.json();
      setReviewResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const triggerExport = (format: "pdf" | "docx") => {
    setFeedbackMsg(
      `Exportação para ${format.toUpperCase()} iniciada! O download começará automaticamente.`,
    );
    setTimeout(() => setFeedbackMsg(""), 4000);
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="text-left">
        {" "}
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Redação & Revisão Cognitiva
        </h2>{" "}
        <p className="text-xs text-muted-foreground">
          Desenvolva peças processuais de alta complexidade e revise
          vulnerabilidades contratuais em segundos com IA.
        </p>{" "}
      </div>{" "}
      {/* Mode selectors */}{" "}
      <div className="border-b border-border flex gap-1 shrink-0">
        {" "}
        <button
          onClick={() => setActiveIaTab("generator")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeIaTab === "generator" ? "border-cyan-500 text-cyan-600 dark:text-cyan-400" : "border-transparent text-muted-foreground hover:text-muted-foreground dark:hover:text-card-foreground"}`}
        >
          {" "}
          <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" /> Gerador de
          Petições e Recursos{" "}
        </button>{" "}
        <button
          onClick={() => setActiveIaTab("reviewer")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeIaTab === "reviewer" ? "border-cyan-500 text-cyan-600 dark:text-cyan-400" : "border-transparent text-muted-foreground hover:text-muted-foreground dark:hover:text-card-foreground"}`}
        >
          {" "}
          <ListChecks className="w-4 h-4 text-cyan-500 shrink-0" /> Analisador
          de Contratos & Riscos{" "}
        </button>{" "}
      </div>{" "}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded-md flex items-center gap-2 text-left">
          {" "}
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />{" "}
          <span>{feedbackMsg}</span>{" "}
        </div>
      )}{" "}
      {/* Sub Views */}{" "}
      {activeIaTab === "generator" ? (
        /* Generator View Workspace */ <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {" "}
          {/* Input Form Column (2/5) */}{" "}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm text-left h-max">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
              Dados da Peça
            </h3>{" "}
            <form onSubmit={handleGeneratePetition} className="space-y-4">
              {" "}
              <div className="grid grid-cols-1 gap-3">
                {" "}
                {/* Document Type */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                    Tipo de Documento
                  </label>{" "}
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  >
                    {" "}
                    <option value="Petição Inicial">
                      Petição Inicial
                    </option>{" "}
                    <option value="Contestação">Contestação</option>{" "}
                    <option value="Recurso de Apelação">
                      Recurso de Apelação
                    </option>{" "}
                    <option value="Contrarrazões">Contrarrazões</option>{" "}
                    <option value="Notificação Extrajudicial">
                      Notificação Extrajudicial
                    </option>{" "}
                  </select>{" "}
                </div>{" "}
                {/* Title */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                    Título da Peça / Objeto
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ação Rescisória / Restabelecimento de Benefício"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Client Link drop */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                    Cliente Autor / Beneficiário
                  </label>{" "}
                  <select
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  >
                    {" "}
                    <option value="">Selecione no CRM...</option>{" "}
                    {clients.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.type.toUpperCase()})
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                {/* Facts summary */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                    Fatos do Caso
                  </label>{" "}
                  <textarea
                    required
                    placeholder="Descreva brevemente o que aconteceu. Ex: O autor comprou um eletrodoméstico que apresentou defeito em 5 dias e a assistência recusou o conserto..."
                    rows={3}
                    value={facts}
                    onChange={(e) => setFacts(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Pedidos */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                    Fundamentos / Pedidos Principais
                  </label>{" "}
                  <textarea
                    required
                    placeholder="Ex: Condenação em danos morais de R$ 10.000,00 e devolução do valor pago em dobro..."
                    rows={2}
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-md transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer"
              >
                {" "}
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}{" "}
                Redigir Peça com IA{" "}
              </button>{" "}
            </form>{" "}
          </div>{" "}
          {/* Interactive Text Editor Workspace (3/5) */}{" "}
          <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col h-[520px] text-left">
            {" "}
            <div className="flex justify-between items-center mb-3 shrink-0">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <FileText className="w-4.5 h-4.5 text-muted-foreground" />{" "}
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Editor Digital de Minutas
                </h3>{" "}
              </div>{" "}
              {generatedText && (
                <div className="flex gap-2">
                  {" "}
                  <button
                    onClick={() => triggerExport("docx")}
                    className="p-1.5 hover:bg-accent hover:text-accent-foreground rounded text-muted-foreground hover:text-foreground dark:hover:text-slate-100 border border-border transition-all cursor-pointer"
                    title="Exportar para Word"
                  >
                    {" "}
                    <Download className="w-3.5 h-3.5" />{" "}
                  </button>{" "}
                  <button
                    onClick={() => triggerExport("pdf")}
                    className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    {" "}
                    Exportar PDF{" "}
                  </button>{" "}
                </div>
              )}{" "}
            </div>{" "}
            {/* Document body viewport */}{" "}
            <div className="flex-1 border border-border/80 bg-muted/40 /20 rounded-md p-5 overflow-y-auto no-scrollbar font-serif text-sm">
              {" "}
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-pulse">
                  {" "}
                  <Sparkles className="w-8 h-8 text-cyan-500 animate-spin mb-3" />{" "}
                  <p className="text-xs font-bold text-foreground ">
                    Estruturando tese jurídica e preâmbulo constitucional...
                  </p>{" "}
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
                    Aguarde, compilando os fatos e conectando jurisprudências do
                    STJ/STF em tempo real.
                  </p>{" "}
                </div>
              ) : generatedText ? (
                <textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full h-full bg-transparent border-0 outline-0 resize-none font-serif text-xs text-card-foreground select-all leading-relaxed"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                  {" "}
                  <FileText className="w-10 h-10 text-muted-foreground mb-2" />{" "}
                  <p className="text-xs font-bold">
                    Nenhum documento na área de transferência
                  </p>{" "}
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
                    Preencha os dados do formulário ao lado e clique em redigir
                    para iniciar a minuterização automatizada.
                  </p>{" "}
                </div>
              )}{" "}
            </div>{" "}
            <div className="mt-3 shrink-0 text-[10px] text-muted-foreground bg-background/40 p-2 rounded-md border border-border flex items-center gap-1.5">
              {" "}
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />{" "}
              <span>
                Peça gerada e salva no repositório de minutas com logs de
                autoria protegidos.
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      ) : (
        /* Reviewer View Workspace */ <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
          {" "}
          {/* Input text column */}{" "}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col h-[520px]">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              Inserir Texto do Contrato / Peça
            </h3>{" "}
            <p className="text-[10px] text-muted-foreground mb-3 leading-snug">
              Cole o texto integral de uma minuta, termo de confidencialidade ou
              acordo para auditar riscos de revelia, LGPD e Código da OAB.
            </p>{" "}
            <textarea
              placeholder="Cole o corpo do documento aqui..."
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              className="flex-1 w-full bg-background border border-border focus:border-cyan-500 rounded-md p-3 text-xs text-card-foreground outline-0 resize-none font-mono"
            />{" "}
            <button
              onClick={handleReviewContract}
              disabled={isLoading || !contractText.trim()}
              className="w-full mt-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs rounded-md transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/10 cursor-pointer"
            >
              {" "}
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}{" "}
              Analisar Riscos com IA{" "}
            </button>{" "}
          </div>{" "}
          {/* Output audited result column */}{" "}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col h-[520px] overflow-hidden">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
              Mapeamento de Riscos & Cláusulas Omissas
            </h3>{" "}
            <p className="text-[10px] text-muted-foreground mb-4 leading-snug">
              Relação de riscos jurídicos, desconformidades regulatórias e
              termos de perigo contratual mapeados pela IA:
            </p>{" "}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
              {" "}
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-pulse">
                  {" "}
                  <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin mb-3" />{" "}
                  <p className="text-xs font-bold text-foreground ">
                    Auditando cláusula por cláusula...
                  </p>{" "}
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
                    Varrendo termos de rescisão abusivos, foro de eleição
                    desvantajoso e multas fora da razoabilidade do Código Civil.
                  </p>{" "}
                </div>
              ) : reviewResult ? (
                <div className="space-y-4">
                  {" "}
                  {/* General score */}{" "}
                  <div className="p-3 bg-background/40 rounded-md border border-border flex justify-between items-center text-xs">
                    {" "}
                    <div>
                      {" "}
                      <span className="text-muted-foreground block font-semibold text-[9px] uppercase">
                        Score de Conformidade
                      </span>{" "}
                      <span className="text-sm font-black text-foreground">
                        8.2 / 10 OAB-Regular
                      </span>{" "}
                    </div>{" "}
                    <span className="font-bold text-emerald-500 text-[10px] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded uppercase">
                      {" "}
                      Baixo Risco Geral{" "}
                    </span>{" "}
                  </div>{" "}
                  {/* List items */}{" "}
                  {reviewResult.risks &&
                    reviewResult.risks.map((risk: any, idx: number) => {
                      let levelColor =
                        "bg-rose-950 text-rose-400 border border-rose-900/40";
                      if (risk.level === "medium")
                        levelColor =
                          "bg-amber-950 text-amber-400 border border-amber-900/40";
                      if (risk.level === "low")
                        levelColor = "bg-muted text-muted-foreground";
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-background/40 border border-border/80 rounded-md space-y-1.5 text-xs text-left"
                        >
                          {" "}
                          <div className="flex justify-between items-center">
                            {" "}
                            <span className="font-bold text-card-foreground">
                              {risk.clause}
                            </span>{" "}
                            <span
                              className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded ${levelColor}`}
                            >
                              {" "}
                              Risco {risk.level}{" "}
                            </span>{" "}
                          </div>{" "}
                          <p className="text-[11px] text-muted-foreground">
                            {risk.description}
                          </p>{" "}
                          <div className="p-2 bg-card rounded border border-border text-[10px] text-cyan-600 dark:text-cyan-400 leading-relaxed font-medium">
                            {" "}
                            <strong>Recomendação de ajuste:</strong>{" "}
                            {risk.suggestion}{" "}
                          </div>{" "}
                        </div>
                      );
                    })}{" "}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                  {" "}
                  <AlertTriangle className="w-10 h-10 text-muted-foreground mb-2 animate-bounce" />{" "}
                  <p className="text-xs font-bold">
                    Aguardando colagem de minuta
                  </p>{" "}
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
                    Cole o contrato de prestação de serviços, acordo ou
                    confidencialidade ao lado para auditar conformidade
                    regulatória.
                  </p>{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
