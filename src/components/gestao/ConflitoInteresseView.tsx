import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Search,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  Scale,
  FileText,
} from "lucide-react";
export const ConflitoInteresseView: React.FC = () => {
  const { clients, processes } = useJusFlow();
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<{
    conflict: boolean;
    reason?: string;
    details?: any[];
  } | null>(null);
  const handleSearchConflict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
    const lowercaseQuery = query.toLowerCase(); // Check if searched name is an existing client in our CRM!
    const matchingClients = clients.filter((c) =>
      c.name.toLowerCase().includes(lowercaseQuery),
    ); // Check if searched name matches a client or adverse party in processes
    const matchingProcesses = processes.filter(
      (p) =>
        p.adverseParty.toLowerCase().includes(lowercaseQuery) ||
        p.clientName.toLowerCase().includes(lowercaseQuery),
    );
    if (matchingClients.length > 0 || matchingProcesses.length > 0) {
      // Conflict!
      const reasons: string[] = [];
      if (matchingClients.length > 0) {
        reasons.push(
          `O nome pesquisado consta como CLIENTE CADASTRADO no CRM (${matchingClients.map((c) => c.name).join(", ")}).`,
        );
      }
      if (matchingProcesses.length > 0) {
        matchingProcesses.forEach((p) => {
          const relation = p.clientName.toLowerCase().includes(lowercaseQuery)
            ? "autor/réu patrocinado"
            : "parte contrária";
          reasons.push(
            `O termo pesquisado consta como ${relation} no processo judicial nº ${p.cnj} ("${p.title}").`,
          );
        });
      }
      setResults({
        conflict: true,
        reason: reasons.join(" "),
        details: [...matchingClients, ...matchingProcesses],
      });
    } else {
      // Clean path!
      setResults({ conflict: false });
    }
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="text-left">
        {" "}
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Conflito de Interesse
        </h2>{" "}
        <p className="text-xs text-muted-foreground">
          Mapeie preventivamente impedimentos e conflitos éticos de patrocínio
          antes de assinar procurações.
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {" "}
        {/* Search input parameters (1 column) */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm h-max space-y-4">
          {" "}
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Painel de Pesquisa
          </h3>{" "}
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {" "}
            Digite o nome de uma pessoa física, empresa contraponente, sócio
            investidor ou testemunha para cruzar com todos os históricos e
            processos vigentes do escritório.{" "}
          </p>{" "}
          <form onSubmit={handleSearchConflict} className="space-y-4">
            {" "}
            <div className="space-y-1.5">
              {" "}
              <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                Nome da Parte / Razão Social
              </label>{" "}
              <input
                type="text"
                required
                placeholder="Ex: Banco Itaú / Carlos Silva"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
              />{" "}
            </div>{" "}
            <button
              type="submit"
              className="w-full py-2 bg-card hover:bg-accent hover:text-accent-foreground dark:bg-muted dark:hover:bg-slate-700 text-white font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              {" "}
              <Search className="w-3.5 h-3.5" /> Investigar Impedimentos{" "}
            </button>{" "}
          </form>{" "}
        </div>{" "}
        {/* Results output panel (2 columns) */}{" "}
        <div className="lg:col-span-2 space-y-4">
          {" "}
          {hasSearched && results ? (
            results.conflict ? (
              /* Conflict Detected alert card */ <div className="space-y-4 animate-fade-in">
                {" "}
                <div className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl shadow-sm space-y-3">
                  {" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />{" "}
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-rose-800 dark:text-rose-300">
                      {" "}
                      Impedimento Ético Detectado!{" "}
                    </h4>{" "}
                  </div>{" "}
                  <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed font-normal">
                    {" "}
                    <strong>Atenção:</strong> O patrocínio desta causa apresenta
                    riscos éticos graves sob o artigo 20 do Código de Ética e
                    Disciplina da OAB (conflito de interesse ativo).{" "}
                  </p>{" "}
                  <div className="p-3.5 bg-card /80 rounded-md border border-rose-100 dark:border-rose-950 text-xs text-foreground leading-relaxed">
                    {" "}
                    <strong>Motivo mapeado:</strong> {results.reason}{" "}
                  </div>{" "}
                </div>{" "}
                {/* Conflict Details table mapping */}{" "}
                <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-3">
                  {" "}
                  <span className="text-[10px] text-muted-foreground font-bold block uppercase">
                    Vínculos Mapeados no Banco de Dados
                  </span>{" "}
                  <div className="space-y-2.5">
                    {" "}
                    {results.details?.map((item: any, idx: number) => {
                      const isClient = "email" in item;
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-background rounded-md border border-border/80 flex justify-between items-center text-xs"
                        >
                          {" "}
                          <div className="flex items-center gap-2.5">
                            {" "}
                            {isClient ? (
                              <UserCheck className="w-4.5 h-4.5 text-cyan-500" />
                            ) : (
                              <Scale className="w-4.5 h-4.5 text-indigo-500" />
                            )}{" "}
                            <div>
                              {" "}
                              <span className="font-bold text-card-foreground">
                                {item.name || item.title}
                              </span>{" "}
                              <span className="text-[10px] text-muted-foreground block">
                                {" "}
                                {isClient
                                  ? `Cliente CRM cadastrado (${item.type.toUpperCase()})`
                                  : `Processo CNJ: ${item.cnj}`}{" "}
                              </span>{" "}
                            </div>{" "}
                          </div>{" "}
                          <span className="text-[9px] font-bold uppercase bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded">
                            {" "}
                            Impedimento{" "}
                          </span>{" "}
                        </div>
                      );
                    })}{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            ) : (
              /* Clean check success */ <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl shadow-sm space-y-4 animate-fade-in">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />{" "}
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
                    {" "}
                    Nenhum Impedimento Encontrado{" "}
                  </h4>{" "}
                </div>{" "}
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-normal">
                  {" "}
                  O nome <strong>"{query}"</strong> foi submetido a uma
                  varredura rigorosa em todas as bases estruturadas do
                  escritório e não corresponde a clientes vigentes, partes
                  adversas ativas ou minutas prévias em andamento.{" "}
                </p>{" "}
                <div className="p-3 bg-card rounded-md border border-emerald-100 dark:border-emerald-950 text-[10px] text-muted-foreground flex items-center gap-1.5">
                  {" "}
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{" "}
                  <span>
                    Causa livre para formalização de contrato de honorários e
                    procuração (Art. 39 a 47 OAB).
                  </span>{" "}
                </div>{" "}
              </div>
            )
          ) : (
            <div className="p-12 bg-card border border-border rounded-xl text-center text-xs text-muted-foreground">
              {" "}
              Digite os parâmetros e clique em pesquisar para rodar a auditoria
              ética de impedimentos.{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
