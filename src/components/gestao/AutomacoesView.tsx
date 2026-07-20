import React, { useState } from "react";
import {
  Zap,
  Play,
  CheckCircle2,
  RefreshCw,
  Plus,
  ToggleLeft,
  ToggleRight,
  Scale,
  ShieldCheck,
} from "lucide-react";
interface Rule {
  id: string;
  trigger: string;
  action: string;
  active: boolean;
  desc: string;
}
export const AutomacoesView: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      trigger: "Alteração de Status para Sentença",
      action: "Enviar Notificação por E-mail ao Cliente",
      active: true,
      desc: "Dispara automaticamente um relatório formatado informando o resultado de primeiro grau ao cliente vinculado.",
    },
    {
      id: "2",
      trigger: "Audiência Cadastrada na Agenda",
      action: "Criar Tarefa de Memoriais no Kanban",
      active: true,
      desc: "Ao agendar audiência de instrução, o sistema delega automaticamente uma tarefa de 'Redação de Memorial' na coluna A Fazer.",
    },
    {
      id: "3",
      trigger: "Novo Prazo Forense Adicionado",
      action: "Disparar SMS de Alerta Crítico ao Advogado",
      active: false,
      desc: "Envia alertas SMS de backup aos sócios vinculados quando prazos restarem com menos de 24h para preclusão.",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerInput, setTriggerInput] = useState(
    "Alteração de Status para Sentença",
  );
  const [actionInput, setActionInput] = useState(
    "Enviar Notificação por E-mail ao Cliente",
  );
  const [descInput, setDescInput] = useState("");
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testingRuleId, setTestingRuleId] = useState<string | null>(null);
  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );
  };
  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descInput.trim()) return;
    setRules((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        trigger: triggerInput,
        action: actionInput,
        active: true,
        desc: descInput,
      },
    ]);
    setDescInput("");
    setIsModalOpen(false);
  };
  const handleTestRule = (rule: Rule) => {
    setTestingRuleId(rule.id);
    setTestLogs([`[EXEC] Inicializando testes para regra: ${rule.trigger}`]);
    setTimeout(() => {
      setTestLogs((prev) => [
        ...prev,
        `[EVENTO] Gatilho simulado com sucesso.`,
      ]);
    }, 800);
    setTimeout(() => {
      setTestLogs((prev) => [
        ...prev,
        `[ROTA] Roteador de mensageria chamou webhook: ${rule.action}`,
      ]);
    }, 1600);
    setTimeout(() => {
      setTestLogs((prev) => [
        ...prev,
        `[SUCESSO] Pipeline executado de forma íntegra. Nenhuma inconformidade reportada.`,
      ]);
      setTestingRuleId(null);
    }, 2400);
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div className="text-left">
          {" "}
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Gatilhos & Automação
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Configure automações de ponta a ponta (No-Code) ligando as
            movimentações processuais a alertas de mensageria.
          </p>{" "}
        </div>{" "}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 self-start shadow-md shadow-cyan-600/10 cursor-pointer"
        >
          {" "}
          <Plus className="w-4 h-4" /> Nova Regra{" "}
        </button>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {" "}
        {/* Rules column (2 columns) */}{" "}
        <div className="lg:col-span-2 space-y-4">
          {" "}
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-cyan-500/20 transition-all"
            >
              {" "}
              <div className="space-y-1.5 flex-1">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="p-1 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Zap className="w-4 h-4 fill-current" />
                  </span>{" "}
                  <h4 className="text-xs font-extrabold text-card-foreground leading-snug">
                    {" "}
                    Se:{" "}
                    <span className="text-cyan-600 dark:text-cyan-400">
                      {rule.trigger}
                    </span>{" "}
                    → Então:{" "}
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {rule.action}
                    </span>{" "}
                  </h4>{" "}
                </div>{" "}
                <p className="text-[11px] text-muted-foreground font-normal leading-relaxed">
                  {rule.desc}
                </p>{" "}
              </div>{" "}
              {/* Status and test hooks */}{" "}
              <div className="flex items-center gap-3 shrink-0">
                {" "}
                <button
                  onClick={() => handleTestRule(rule)}
                  disabled={testingRuleId !== null}
                  className="px-2.5 py-1.5 bg-background hover:bg-accent hover:text-accent-foreground/80 disabled:opacity-30 border border-border text-muted-foreground text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition-all"
                >
                  {" "}
                  <Play className="w-3 h-3 fill-current" /> Testar{" "}
                </button>{" "}
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className="text-muted-foreground hover:text-muted-foreground dark:hover:text-slate-100 transition-colors cursor-pointer"
                >
                  {" "}
                  {rule.active ? (
                    <ToggleRight className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-muted-foreground " />
                  )}{" "}
                </button>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
        {/* Debug Console Logs Column (1 column) */}{" "}
        <div className="bg-background border border-slate-900 rounded-xl p-5 shadow-lg flex flex-col h-72">
          {" "}
          <div className="pb-3 border-b border-slate-900 shrink-0">
            {" "}
            <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
              {" "}
              <RefreshCw
                className={`w-3.5 h-3.5 ${testingRuleId !== null ? "animate-spin text-cyan-500" : ""}`}
              />{" "}
              Automations Sandbox Console{" "}
            </span>{" "}
          </div>{" "}
          <div className="flex-1 overflow-y-auto font-mono text-[10px] text-muted-foreground space-y-1.5 mt-3 select-all no-scrollbar">
            {" "}
            {testLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes("[SUCESSO]")
                    ? "text-emerald-400"
                    : log.includes("[EXEC]")
                      ? "text-cyan-400 font-bold"
                      : ""
                }
              >
                {" "}
                {log}{" "}
              </div>
            ))}{" "}
            {testLogs.length === 0 && (
              <div className="text-muted-foreground text-center py-16">
                {" "}
                Clique no botão de teste ao lado de qualquer regra para
                interceptar e auditar pipelines em tempo real.{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Rules Creation Modal */}{" "}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {" "}
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6">
            {" "}
            <div className="flex justify-between items-center mb-4 text-left">
              {" "}
              <div>
                {" "}
                <h3 className="text-sm font-bold text-foreground">
                  Criar Nova Automação
                </h3>{" "}
                <p className="text-[11px] text-muted-foreground">
                  Configure rotas lógicas baseadas em gatilhos e reações.
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
            <form onSubmit={handleCreateRule} className="space-y-4 text-left">
              {" "}
              {/* Trigger */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Se o evento for (Gatilho)
                </label>{" "}
                <select
                  value={triggerInput}
                  onChange={(e) => setTriggerInput(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                >
                  {" "}
                  <option value="Alteração de Status para Sentença">
                    Alteração de Status para Sentença
                  </option>{" "}
                  <option value="Audiência Cadastrada na Agenda">
                    Audiência Cadastrada na Agenda
                  </option>{" "}
                  <option value="Novo Prazo Forense Adicionado">
                    Novo Prazo Forense Adicionado
                  </option>{" "}
                  <option value="Cliente Assinou Procuração">
                    Cliente Assinou Procuração
                  </option>{" "}
                </select>{" "}
              </div>{" "}
              {/* Action */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Disparar então a Ação
                </label>{" "}
                <select
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                >
                  {" "}
                  <option value="Enviar Notificação por E-mail ao Cliente">
                    Enviar Notificação por E-mail ao Cliente
                  </option>{" "}
                  <option value="Criar Tarefa de Memoriais no Kanban">
                    Criar Tarefa de Memoriais no Kanban
                  </option>{" "}
                  <option value="Disparar SMS de Alerta Crítico ao Advogado">
                    Disparar SMS de Alerta Crítico ao Advogado
                  </option>{" "}
                  <option value="Disparar Notificação por WhatsApp">
                    Disparar Notificação por WhatsApp ao Cliente
                  </option>{" "}
                </select>{" "}
              </div>{" "}
              {/* Description */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Finalidade / Descrição Curta
                </label>{" "}
                <textarea
                  required
                  placeholder="Escreva a justificativa regulatória ou operacional para este fluxo..."
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  rows={2}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
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
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md shadow-md cursor-pointer"
                >
                  {" "}
                  Criar Fluxo{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
