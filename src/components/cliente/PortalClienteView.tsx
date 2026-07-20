import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Folder,
  FileText,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  User,
} from "lucide-react";

export const PortalClienteView: React.FC = () => {
  const { clients, processes, financials, documents } = useJusFlow();
  const [selectedClientId, setSelectedClientId] = useState(
    clients[0]?.id || "",
  );
  
  // Form states
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const activeClient =
    clients.find((c) => c.id === selectedClientId) || clients[0];

  const clientProcesses = processes.filter(
    (p) => p.clientId === activeClient?.id && p.status === "active"
  );
  
  const clientFinancials = financials.filter(
    (f) => f.clientId === activeClient?.id && f.status === "pending"
  );
  
  const clientDocs = documents.filter((d) =>
    d.title.includes(activeClient?.name.split(" ")[0] || "")
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    
    setShowSuccess(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#f8fafc] dark:bg-[#0b0f17] transition-colors text-left font-sans">
      {/* Header and selector impersonator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e8f0] dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a] dark:text-white tracking-tight">
            Área do Cliente
          </h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
            Acompanhe seus processos, envie documentos e fale diretamente com sua equipe jurídica.
          </p>
        </div>
        
        {/* Simular como */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 px-3 py-1.5 rounded-lg shrink-0 shadow-sm">
          <span className="font-bold text-[#64748b] dark:text-slate-500 uppercase text-[9px] tracking-wider">
            Simular Cliente:
          </span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-transparent border-0 outline-0 font-semibold focus:ring-0 text-xs cursor-pointer text-[#0f172a] dark:text-white"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="dark:bg-slate-950">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showSuccess && (
        <div className="p-4 bg-[#f0fdf4] dark:bg-[#062f1d] border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span className="font-medium">Mensagem enviada com sucesso! Retornaremos o seu contato em breve.</span>
        </div>
      )}

      {activeClient ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns - Processes, Documents, Financials */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Meus processos card */}
            <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Folder className="w-5 h-5 text-[#10b981]" />
                <h3 className="font-bold text-sm text-[#0f172a] dark:text-white uppercase tracking-wider">
                  Meus processos
                </h3>
              </div>
              
              <div className="space-y-4">
                {clientProcesses.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-[#e2e8f0] dark:border-slate-800/80 rounded-lg space-y-2.5"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <span className="font-semibold text-xs text-[#0f172a] dark:text-white block leading-tight">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#64748b] dark:text-slate-400 block mt-1">
                          Número: {p.cnj} ({p.court})
                        </span>
                      </div>
                      <span className="text-[9px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                        {p.stage}
                      </span>
                    </div>
                    {p.aiSummary && (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded border border-[#e2e8f0] dark:border-slate-800/50 text-xs">
                        <span className="text-[9px] text-[#10b981] font-bold uppercase tracking-wider block mb-1">
                          Resumo Simplicado
                        </span>
                        <p className="text-[11px] text-[#475569] dark:text-slate-300 leading-relaxed">
                          {p.aiSummary}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {clientProcesses.length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">
                      Nenhum processo ativo
                    </p>
                    <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
                      Você não possui processos ativos vinculados ao seu cadastro neste momento.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Documentos card */}
            <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#10b981]" />
                <h3 className="font-bold text-sm text-[#0f172a] dark:text-white uppercase tracking-wider">
                  Documentos
                </h3>
              </div>
              
              <div className="space-y-2">
                {clientDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-[#e2e8f0] dark:border-slate-800/80 rounded-lg flex justify-between items-center text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#64748b]" />
                      <span className="font-medium text-[#0f172a] dark:text-white truncate">
                        {doc.title}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                      Disponível
                    </span>
                  </div>
                ))}
                
                {clientDocs.length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">
                      Nenhum documento disponível
                    </p>
                    <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
                      Não há documentos ou relatórios compartilhados com você no momento.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Honorários e boletos card */}
            <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#10b981]" />
                <h3 className="font-bold text-sm text-[#0f172a] dark:text-white uppercase tracking-wider">
                  Honorários e boletos
                </h3>
              </div>
              
              <div className="space-y-2">
                {clientFinancials.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-[#e2e8f0] dark:border-slate-800/80 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-semibold text-[#0f172a] dark:text-white block">
                        {f.title}
                      </span>
                      <span className="text-[10px] text-[#64748b] dark:text-slate-400 block">
                        Vencimento: {new Date(f.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-extrabold text-sm text-[#0f172a] dark:text-white">
                        {f.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <button className="px-3 py-1 bg-[#10b981] hover:bg-[#0d9488] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm">
                        Visualizar Boleto
                      </button>
                    </div>
                  </div>
                ))}
                
                {clientFinancials.length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">
                      Sem lançamentos
                    </p>
                    <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
                      Você não possui faturas ou cobranças pendentes de pagamento.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column - Falar com seu advogado form */}
          <div>
            <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-xl p-5 shadow-xs sticky top-24">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-5 h-5 text-[#10b981]" />
                <h3 className="font-bold text-sm text-[#0f172a] dark:text-white uppercase tracking-wider">
                  Falar com seu advogado
                </h3>
              </div>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mb-5">
                Envie uma mensagem direto para o escritório
              </p>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#475569] dark:text-slate-300 uppercase tracking-wide">
                    Assunto
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Dúvida sobre andamento"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-[#e2e8f0] dark:border-slate-800 rounded-lg outline-hidden focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-[#0f172a] dark:text-white transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#475569] dark:text-slate-300 uppercase tracking-wide">
                    Mensagem
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua dúvida ou mensagem detalhada..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-[#e2e8f0] dark:border-slate-800 rounded-lg outline-hidden focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-[#0f172a] dark:text-white transition-all resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#10b981] hover:bg-[#0d9488] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  Enviar mensagem
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-xl text-center text-xs text-muted-foreground shadow-xs">
          Nenhum cliente selecionado.
        </div>
      )}
    </div>
  );
};
