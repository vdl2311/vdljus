import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  User,
  Scale,
  DollarSign,
  FileText,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
export const PortalClienteView: React.FC = () => {
  const { clients, processes, financials, documents } = useJusFlow();
  const [selectedClientId, setSelectedClientId] = useState(
    clients[0]?.id || "",
  );
  const [copiedText, setCopiedText] = useState("");
  const activeClient =
    clients.find((c) => c.id === selectedClientId) || clients[0];
  const clientProcesses = processes.filter(
    (p) => p.clientId === activeClient?.id,
  );
  const clientFinancials = financials.filter(
    (f) => f.clientId === activeClient?.id,
  );
  const clientDocs = documents.filter((d) =>
    d.title.includes(activeClient?.name.split(" ")[0] || ""),
  );
  const triggerCopy = (text: string, label: string) => {
    setCopiedText(`${label} copiado para a área de transferência!`);
    setTimeout(() => setCopiedText(""), 3500);
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header and selector impersonator */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div className="text-left">
          {" "}
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Portal do Cliente
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Módulo externo simplificado para o cliente acompanhar andamentos
            processuais traduzidos e pagar honorários.
          </p>{" "}
        </div>{" "}
        {/* Impersonator */}{" "}
        <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-md shrink-0 text-xs">
          {" "}
          <span className="font-bold text-muted-foreground uppercase text-[9px] shrink-0">
            Simular como:
          </span>{" "}
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-transparent border-0 outline-0 font-semibold focus:ring-0 text-xs cursor-pointer text-card-foreground"
          >
            {" "}
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}{" "}
          </select>{" "}
        </div>{" "}
      </div>{" "}
      {copiedText && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded-md flex items-center gap-2 text-left animate-bounce">
          {" "}
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{" "}
          <span>{copiedText}</span>{" "}
        </div>
      )}{" "}
      {activeClient ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {" "}
          {/* Main timeline processes - 2 columns */}{" "}
          <div className="lg:col-span-2 space-y-6">
            {" "}
            {/* Process card list */}{" "}
            <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
              {" "}
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                {" "}
                <Scale className="w-4.5 h-4.5 text-cyan-500" /> Seus Processos
                em Andamento{" "}
              </h3>{" "}
              <div className="space-y-4">
                {" "}
                {clientProcesses.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-background rounded-md border border-border space-y-3"
                  >
                    {" "}
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      {" "}
                      <div>
                        {" "}
                        <span className="font-bold text-xs text-card-foreground block leading-tight">
                          {p.title}
                        </span>{" "}
                        <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                          CNJ: {p.cnj} ({p.court})
                        </span>{" "}
                      </div>{" "}
                      <span className="text-[9px] font-bold uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded">
                        {" "}
                        Fase: {p.stage}{" "}
                      </span>{" "}
                    </div>{" "}
                    {/* AI Translation section! */}{" "}
                    <div className="p-3 bg-card rounded border border-border/60 space-y-1.5 text-xs">
                      {" "}
                      <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-extrabold uppercase tracking-wider block">
                        Explicação em Linguagem Simples (IA)
                      </span>{" "}
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-normal">
                        {" "}
                        {p.aiSummary ||
                          "Nossos advogados estão redigindo minutas processuais e preparando as teses de defesa. Você será notificado de qualquer decisão judicial."}{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
                {clientProcesses.length === 0 && (
                  <div className="py-12 text-center text-xs text-muted-foreground font-normal">
                    {" "}
                    Nenhum processo judicial ativo associado a esta conta.{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </div>{" "}
            {/* Invoices pay board */}{" "}
            <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
              {" "}
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                {" "}
                <DollarSign className="w-4.5 h-4.5 text-cyan-500" /> Faturas e
                Cobranças de Honorários{" "}
              </h3>{" "}
              <div className="space-y-3">
                {" "}
                {clientFinancials.map((f) => (
                  <div
                    key={f.id}
                    className="p-3.5 bg-background rounded-md border border-border/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
                  >
                    {" "}
                    <div className="text-left space-y-1">
                      {" "}
                      <span className="font-bold text-card-foreground block">
                        {f.title}
                      </span>{" "}
                      <span className="text-[10px] text-muted-foreground block">
                        Vencimento:{" "}
                        {new Date(f.date).toLocaleDateString("pt-BR")}
                      </span>{" "}
                    </div>{" "}
                    <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                      {" "}
                      <span className="font-extrabold text-foreground">
                        {" "}
                        {f.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}{" "}
                      </span>{" "}
                      {f.status === "paid" ? (
                        <span className="text-[9px] font-bold uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">
                          {" "}
                          Pago e Compensado{" "}
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          {" "}
                          <button
                            onClick={() =>
                              triggerCopy(
                                `00020101021126380014br.gov.pix0114+5511999999995204000053039865407${f.amount}5802BR5915JUSFLOWADVOCAC6009SAOPAULO62070503***`,
                                "Código PIX",
                              )
                            }
                            className="px-2.5 py-1 bg-card dark:bg-muted hover:bg-accent hover:text-accent-foreground text-white text-[10px] font-bold rounded cursor-pointer transition-colors"
                          >
                            {" "}
                            Pagar via Pix{" "}
                          </button>{" "}
                        </div>
                      )}{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
                {clientFinancials.length === 0 && (
                  <div className="py-12 text-center text-xs text-muted-foreground font-normal">
                    {" "}
                    Nenhuma fatura pendente de faturamento.{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Side columns: client profile and documents folder (1 column) */}{" "}
          <div className="space-y-6">
            {" "}
            {/* Customer Profile card */}{" "}
            <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left space-y-3">
              {" "}
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-2.5">
                {" "}
                <User className="w-4.5 h-4.5 text-cyan-500" /> Seu Perfil de
                Outorga{" "}
              </h3>{" "}
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {" "}
                <div>
                  {" "}
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">
                    Nome
                  </span>{" "}
                  <span className="font-bold text-foreground">
                    {activeClient.name}
                  </span>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">
                    Documento Civil
                  </span>{" "}
                  <span className="font-mono">
                    {activeClient.document}
                  </span>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">
                    E-mail Cadastrado
                  </span>{" "}
                  <span>{activeClient.email}</span>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Document checklist vault */}{" "}
            <div className="p-5 bg-card border border-border rounded-xl shadow-sm text-left space-y-3">
              {" "}
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-2.5">
                {" "}
                <FileText className="w-4.5 h-4.5 text-cyan-500" /> Seus
                Documentos & Procurações{" "}
              </h3>{" "}
              <div className="space-y-2">
                {" "}
                {clientDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 bg-background border border-border rounded-md flex justify-between items-center text-[11px]"
                  >
                    {" "}
                    <span className="font-semibold text-foreground truncate pr-2">
                      {doc.title}
                    </span>{" "}
                    <span className="text-[8px] font-bold uppercase bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded shrink-0">
                      {" "}
                      Assinado{" "}
                    </span>{" "}
                  </div>
                ))}{" "}
                {clientDocs.length === 0 && (
                  <span className="text-[10px] text-muted-foreground block py-6 text-center">
                    Nenhum documento assinado pendente de guarda.
                  </span>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      ) : (
        <div className="p-12 bg-card border border-border rounded-xl text-center text-xs text-muted-foreground">
          {" "}
          Nenhum cliente cadastrado no CRM. Cadastre um cliente para simular o
          portal externo.{" "}
        </div>
      )}{" "}
    </div>
  );
};
