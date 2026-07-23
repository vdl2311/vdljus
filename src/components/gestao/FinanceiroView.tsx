import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import { FinancialLaunch } from "../../types";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ShieldCheck,
  Trash2,
  AlertTriangle,
} from "lucide-react";
export const FinanceiroView: React.FC = () => {
  const { financials, clients, addFinancial, toggleFinancialPaid, deleteFinancial } =
    useJusFlow();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false); // Form states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("Honorários");
  const [status, setStatus] = useState<"paid" | "pending">("pending");
  const [date, setDate] = useState("");
  const [clientId, setClientId] = useState("");
  const handleCreateFinancial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || !date) return;
    addFinancial({
      title,
      amount: Number(amount) || 0,
      type,
      category,
      status,
      date,
      clientId: clientId || undefined,
    });
    setTitle("");
    setAmount("");
    setType("income");
    setCategory("Honorários");
    setStatus("pending");
    setDate("");
    setClientId("");
    setIsModalOpen(false);
  }; // Filter Data
  const filtered = financials.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || f.type === filterType;
    const matchesStatus = filterStatus === "All" || f.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  }); // Calculate dynamic KPIs on-the-fly
  const paidIncome = financials
    .filter((f) => f.type === "income" && f.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const paidExpense = financials
    .filter((f) => f.type === "expense" && f.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingIncome = financials
    .filter((f) => f.type === "income" && f.status === "pending")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const netResult = paidIncome - paidExpense;
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div className="text-left">
          {" "}
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Fluxo de Caixa
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Monitore as receitas corporativas, honorários sob contrato e
            despesas de custeio.
          </p>{" "}
        </div>{" "}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 self-start shadow-md shadow-emerald-600/10 cursor-pointer"
        >
          {" "}
          <Plus className="w-4 h-4" /> Novo Lançamento{" "}
        </button>{" "}
      </div>{" "}
      {/* Financial KPIs widgets */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {" "}
        <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between text-left">
          {" "}
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Receita Recebida
          </span>{" "}
          <div className="flex justify-between items-center mt-1.5">
            {" "}
            <p className="text-base font-bold text-foreground">
              {" "}
              {paidIncome.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
            </p>{" "}
            <span className="p-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between text-left">
          {" "}
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Despesas pagas
          </span>{" "}
          <div className="flex justify-between items-center mt-1.5">
            {" "}
            <p className="text-base font-bold text-foreground">
              {" "}
              {paidExpense.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
            </p>{" "}
            <span className="p-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 shrink-0">
              <ArrowDownRight className="w-4 h-4" />
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between text-left">
          {" "}
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Honorários Pendentes
          </span>{" "}
          <div className="flex justify-between items-center mt-1.5">
            {" "}
            <p className="text-base font-bold text-foreground">
              {" "}
              {pendingIncome.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
            </p>{" "}
            <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-500 font-bold px-1.5 py-0.2 rounded shrink-0">
              A receber
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between text-left">
          {" "}
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Resultado Líquido
          </span>{" "}
          <div className="flex justify-between items-center mt-1.5">
            {" "}
            <p
              className={`text-base font-bold ${netResult >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}
            >
              {" "}
              {netResult.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
            </p>{" "}
            <span className="p-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Query panel */}{" "}
      <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col md:flex-row gap-3">
        {" "}
        <div className="flex-1 relative">
          {" "}
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />{" "}
          <input
            type="text"
            placeholder="Pesquisar lançamentos ou categorias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border focus:border-emerald-500 rounded-md pl-9 pr-4 py-2 text-xs text-card-foreground focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all"
          />{" "}
        </div>{" "}
        <div className="flex gap-2 shrink-0">
          {" "}
          <div className="flex items-center gap-1 bg-background border border-border rounded-md px-2 text-xs text-muted-foreground">
            {" "}
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />{" "}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent border-0 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all text-xs py-1.5 cursor-pointer text-muted-foreground"
            >
              {" "}
              <option value="All">Créditos/Débitos</option>{" "}
              <option value="income">Apenas Receitas (+)</option>{" "}
              <option value="expense">Apenas Despesas (-)</option>{" "}
            </select>{" "}
          </div>{" "}
          <div className="flex items-center gap-1 bg-background border border-border rounded-md px-2 text-xs text-muted-foreground">
            {" "}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-0 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all text-xs py-1.5 cursor-pointer text-muted-foreground"
            >
              {" "}
              <option value="All">Status Pagamento</option>{" "}
              <option value="paid">Confirmados (Pago)</option>{" "}
              <option value="pending">Aguardando (Pendente)</option>{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Main List */}{" "}
      <div className="bg-card border border-border rounded-xl shadow-sm text-left overflow-hidden">
        {" "}
        <div className="overflow-x-auto w-full">
          {" "}
          <table className="w-full text-xs text-left">
            {" "}
            <thead className="bg-background border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              {" "}
              <tr>
                {" "}
                <th className="px-5 py-3">Data</th>{" "}
                <th className="px-5 py-3">Lançamento / Categoria</th>{" "}
                <th className="px-5 py-3">Tipo</th>{" "}
                <th className="px-5 py-3 text-right">Valor</th>{" "}
                <th className="px-5 py-3 text-center">Status</th>{" "}
                <th className="px-5 py-3 text-right">Ações</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-border/50 dark:divide-border text-foreground ">
              {" "}
              {filtered.map((f) => (
                <tr
                  key={f.id}
                  className="hover:bg-muted/50 dark:hover:bg-background/20 transition-all"
                >
                  {" "}
                  <td className="px-5 py-3 font-mono font-bold text-muted-foreground">
                    {" "}
                    {new Date(f.date).toLocaleDateString("pt-BR")}{" "}
                  </td>{" "}
                  <td className="px-5 py-3">
                    {" "}
                    <span className="font-bold block text-card-foreground leading-tight">
                      {f.title}
                    </span>{" "}
                    <span className="text-[10px] text-muted-foreground">
                      {f.category}
                    </span>{" "}
                  </td>{" "}
                  <td className="px-5 py-3">
                    {" "}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${f.type === "income" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"}`}
                    >
                      {" "}
                      {f.type === "income" ? "Crédito" : "Débito"}{" "}
                    </span>{" "}
                  </td>{" "}
                  <td
                    className={`px-5 py-3 text-right font-bold ${f.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}
                  >
                    {" "}
                    {f.type === "income" ? "+" : "-"}{" "}
                    {f.amount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                  </td>{" "}
                  <td className="px-5 py-3 text-center">
                    {" "}
                    <button
                      onClick={() => toggleFinancialPaid(f.id)}
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded cursor-pointer ${f.status === "paid" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"}`}
                    >
                      {" "}
                      {f.status === "paid" ? "Pago" : "Pendente"}{" "}
                    </button>{" "}
                  </td>{" "}
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setDeleteConfirmId(f.id)}
                      className="p-1 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-all cursor-pointer"
                      title="Excluir lançamento"
                      aria-label="Excluir lançamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}{" "}
              {filtered.length === 0 && (
                <tr>
                  {" "}
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-xs text-muted-foreground"
                  >
                    {" "}
                    Nenhum lançamento contábil localizado para esses
                    filtros.{" "}
                  </td>{" "}
                </tr>
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </div>{" "}
      {/* Booking Form Modal */}{" "}
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
                  Registrar Lançamento Financeiro
                </h3>{" "}
                <p className="text-[11px] text-muted-foreground">
                  Cadastre notas fiscais, despesas de alvará ou faturas de
                  clientes.
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
            <form
              onSubmit={handleCreateFinancial}
              className="space-y-4 text-left"
            >
              {" "}
              {/* Title */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Descrição
                </label>{" "}
                <input
                  type="text"
                  required
                  placeholder="Ex: Honorários Contratuais de Sucumbência"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                />{" "}
              </div>{" "}
              {/* Value & Date */}{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Valor Bruto (R$)
                  </label>{" "}
                  <input
                    type="number"
                    required
                    placeholder="Ex: 1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  />{" "}
                </div>{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Data Limite / Vencimento
                  </label>{" "}
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* Type & Status */}{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Fluxo
                  </label>{" "}
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  >
                    {" "}
                    <option value="income">Receita (+)</option>{" "}
                    <option value="expense">Despesa (-)</option>{" "}
                  </select>{" "}
                </div>{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Status do Caixa
                  </label>{" "}
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  >
                    {" "}
                    <option value="pending">Aguardando Pagamento</option>{" "}
                    <option value="paid">Confirmado (Compensado)</option>{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
              {/* Category */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Categoria
                </label>{" "}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  {" "}
                  <option value="Honorários">
                    Honorários de Advocacia
                  </option>{" "}
                  <option value="Aluguel">Aluguel / Sede Física</option>{" "}
                  <option value="Impostos">Impostos de Alíquota Simples</option>{" "}
                  <option value="Softwares">Sistemas de Nuvem & TI</option>{" "}
                  <option value="Custas">
                    Custas e Preparos Processuais
                  </option>{" "}
                </select>{" "}
              </div>{" "}
              {/* Linked client */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Vincular a Cliente CRM (Opcional)
                </label>{" "}
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  {" "}
                  <option value="">Nenhum (Despesa/Receita Geral)</option>{" "}
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type.toUpperCase()})
                    </option>
                  ))}{" "}
                </select>{" "}
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
                  Registrar Lançamento{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-sm w-full p-5 text-left space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2 bg-rose-100 dark:bg-rose-950/50 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Confirmar Exclusão</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Tem certeza que deseja excluir este lançamento contábil? Esta ação é irreversível e atualizará o fluxo de caixa.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs font-semibold hover:bg-muted text-muted-foreground rounded-md cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteFinancial(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-md shadow cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
