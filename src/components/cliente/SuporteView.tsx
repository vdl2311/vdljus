import React, { useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Calendar,
} from "lucide-react";
interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: "open" | "solving" | "resolved";
  date: string;
  details: string;
}
export const SuporteView: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      subject: "Dúvida sobre andamento na 2ª Vara Cível",
      category: "Processual",
      status: "solving",
      date: "2026-07-18",
      details:
        "Gostaria de saber o que significa a última movimentação informada pelo robô do TJSP.",
    },
    {
      id: "2",
      subject: "Solicitação de alteração no boleto de honorários",
      category: "Financeiro",
      status: "resolved",
      date: "2026-07-15",
      details:
        "Preciso postergar o vencimento da parcela em 3 dias por questões bancárias.",
    },
  ]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectInput, setSubjectInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Processual");
  const [detailsInput, setDetailsInput] = useState("");
  const faqs = [
    {
      q: "O que é o sistema de tradução jurídica por Inteligência Artificial?",
      a: "É uma ferramenta cognitiva desenvolvida para traduzir o jargão técnico dos tribunais (como 'decisão interlocutória' ou 'concluso para despacho') em linguagem simples e de fácil leitura, garantindo transparência completa ao cliente.",
    },
    {
      q: "Como posso pagar minhas faturas judiciais?",
      a: "Você pode pagar suas faturas diretamente do Portal do Cliente copiando a chave de transação Pix integrada ou o código de barras, com compensação imediata.",
    },
    {
      q: "Como funciona a segurança e integridade de dados na plataforma?",
      a: "Toda a plataforma JusFlow está hospedada sob servidores em nuvem seguros de alta criptografia, com habilitação obrigatória de autenticação em duas etapas (2FA) e logs de auditoria invioláveis, em total conformidade com a LGPD.",
    },
  ];
  const handleOpenTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectInput.trim() || !detailsInput.trim()) return;
    setTickets((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        subject: subjectInput,
        category: categoryInput,
        status: "open",
        date: new Date().toISOString().split("T")[0],
        details: detailsInput,
      },
    ]);
    setSubjectInput("");
    setDetailsInput("");
    setIsModalOpen(false);
  };
  const getStatusStyle = (s: string) => {
    switch (s) {
      case "resolved":
        return "bg-emerald-950 text-emerald-400";
      case "solving":
        return "bg-amber-950 text-amber-400";
      default:
        return "bg-indigo-950 text-indigo-400";
    }
  };
  const getStatusName = (s: string) => {
    switch (s) {
      case "resolved":
        return "Respondido";
      case "solving":
        return "Em Análise";
      default:
        return "Aberto";
    }
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div className="text-left">
          {" "}
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Suporte & FAQ
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Esclareça dúvidas recorrentes ou abra um canal direto de contato com
            o atendimento do escritório.
          </p>{" "}
        </div>{" "}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 self-start shadow-md shadow-emerald-600/10 cursor-pointer"
        >
          {" "}
          <Plus className="w-4 h-4" /> Abrir Chamado de Dúvida{" "}
        </button>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        {" "}
        {/* FAQ list accordion */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-3 h-max">
          {" "}
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            {" "}
            <HelpCircle className="w-4.5 h-4.5 text-emerald-500" /> Dúvidas
            Frequentes (FAQ){" "}
          </h3>{" "}
          <div className="space-y-2 pt-1">
            {" "}
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-border/80 rounded-md overflow-hidden text-xs"
              >
                {" "}
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-3 bg-background hover:bg-accent hover:text-accent-foreground font-bold text-foreground flex justify-between items-center transition-colors cursor-pointer"
                >
                  {" "}
                  <span>{faq.q}</span>{" "}
                  <span className="text-muted-foreground font-bold shrink-0">
                    {activeFaq === idx ? "−" : "+"}
                  </span>{" "}
                </button>{" "}
                {activeFaq === idx && (
                  <div className="p-3 bg-card/40 text-[11px] text-muted-foreground leading-relaxed font-normal">
                    {" "}
                    {faq.a}{" "}
                  </div>
                )}{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        {/* Support tickets list */}{" "}
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[420px]">
          {" "}
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5 shrink-0">
            {" "}
            <MessageSquare className="w-4.5 h-4.5 text-emerald-500" /> Histórico de
            Chamados Ativos{" "}
          </h3>{" "}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-1.5 no-scrollbar text-xs">
            {" "}
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-3 bg-background border border-border/80 rounded-md text-left space-y-2"
              >
                {" "}
                <div className="flex justify-between items-center flex-wrap gap-2">
                  {" "}
                  <span className="font-bold text-card-foreground">
                    {t.subject}
                  </span>{" "}
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getStatusStyle(t.status)}`}
                  >
                    {" "}
                    {getStatusName(t.status)}{" "}
                  </span>{" "}
                </div>{" "}
                <p className="text-[11px] text-muted-foreground font-normal leading-relaxed">
                  {t.details}
                </p>{" "}
                <div className="flex gap-4 text-[10px] text-muted-foreground border-t border-border/40 pt-1.5">
                  {" "}
                  <span>
                    Categoria:{" "}
                    <span className="font-semibold">{t.category}</span>
                  </span>{" "}
                  <span>
                    Aberto em:{" "}
                    <span className="font-mono">
                      {new Date(t.date).toLocaleDateString("pt-BR")}
                    </span>
                  </span>{" "}
                </div>{" "}
              </div>
            ))}{" "}
            {tickets.length === 0 && (
              <div className="text-center text-muted-foreground py-16">
                Nenhum ticket aberto ou registrado.
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Ticket Opening Modal */}{" "}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {" "}
          <div role="dialog" aria-modal="true" className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6">
            {" "}
            <div className="flex justify-between items-center mb-4 text-left">
              {" "}
              <div>
                {" "}
                <h3 className="text-sm font-bold text-foreground">
                  Abrir Novo Chamado de Dúvida
                </h3>{" "}
                <p className="text-[11px] text-muted-foreground">
                  Escreva sua dúvida e nossos sócios responderão com presteza.
                </p>{" "}
              </div>{" "}
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-muted-foreground dark:hover:text-card-foreground font-bold"
              >
                {" "}
                Fechar{" "}
              </button>{" "}
            </div>{" "}
            <form onSubmit={handleOpenTicket} className="space-y-4 text-left">
              {" "}
              {/* Category */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Setor do Chamado
                </label>{" "}
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  {" "}
                  <option value="Processual">
                    Dúvida Processual (Andamento de Causa)
                  </option>{" "}
                  <option value="Financeiro">
                    Dúvida Financeira (Fatura / Boletos)
                  </option>{" "}
                  <option value="Técnico">
                    Problema Técnico / Acesso ao Sistema
                  </option>{" "}
                </select>{" "}
              </div>{" "}
              {/* Subject */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Assunto Principal
                </label>{" "}
                <input
                  type="text"
                  required
                  placeholder="Ex: Não consigo abrir o PDF assinado da Procuração"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                />{" "}
              </div>{" "}
              {/* Details */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Detalhamento da Dúvida
                </label>{" "}
                <textarea
                  required
                  placeholder="Explique detalhadamente qual é a sua dúvida ou solicitação..."
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  rows={4}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 resize-none font-sans"
                />{" "}
              </div>{" "}
              {/* Buttons */}{" "}
              <div className="pt-3 border-t border-border flex justify-end gap-2">
                {" "}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 hover:bg-accent hover:text-accent-foreground text-xs font-bold text-muted-foreground rounded-md cursor-pointer"
                >
                  {" "}
                  Cancelar{" "}
                </button>{" "}
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md shadow-md cursor-pointer"
                >
                  {" "}
                  Enviar Chamado{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
