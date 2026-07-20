import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import { Client, ClientType, ClientStatus } from "../../types";
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Scale,
  Trash2,
  ShieldCheck,
} from "lucide-react";
export const ClientesCRMView: React.FC = () => {
  const { clients, processes, addClient, deleteClient } = useJusFlow();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false); // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [type, setType] = useState<ClientType>("pf");
  const [status, setStatus] = useState<ClientStatus>("prospect");
  const [address, setAddress] = useState("");
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !document.trim() || !email.trim()) return;
    addClient({ name, email, phone, document, type, status, address });
    setName("");
    setEmail("");
    setPhone("");
    setDocument("");
    setType("pf");
    setStatus("prospect");
    setAddress("");
    setIsModalOpen(false);
  };
  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.document.includes(search);
    const matchesType = filterType === "All" || c.type === filterType;
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div className="text-left">
          {" "}
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            CRM Jurídico
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Mapeie leads, prospectos e gerencie a base ativa de clientes do
            escritório.
          </p>{" "}
        </div>{" "}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 self-start shadow-md shadow-cyan-600/10 cursor-pointer"
        >
          {" "}
          <Plus className="w-4 h-4" /> Cadastrar Cliente{" "}
        </button>{" "}
      </div>{" "}
      {/* Query Bar */}{" "}
      <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col md:flex-row gap-3">
        {" "}
        {/* Search */}{" "}
        <div className="flex-1 relative">
          {" "}
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />{" "}
          <input
            type="text"
            placeholder="Pesquisar por nome, CPF/CNPJ, e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border focus:border-cyan-500 rounded-md pl-9 pr-4 py-2 text-xs text-card-foreground outline-0 focus:ring-0"
          />{" "}
        </div>{" "}
        {/* Filters */}{" "}
        <div className="flex gap-2 shrink-0">
          {" "}
          <div className="flex items-center gap-1 bg-background border border-border rounded-md px-2 text-xs text-muted-foreground">
            {" "}
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />{" "}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent border-0 outline-0 focus:ring-0 text-xs py-1.5 cursor-pointer text-muted-foreground"
            >
              {" "}
              <option value="All">Todos Tipos</option>{" "}
              <option value="pf">Pessoa Física (PF)</option>{" "}
              <option value="pj">Pessoa Jurídica (PJ)</option>{" "}
            </select>{" "}
          </div>{" "}
          <div className="flex items-center gap-1 bg-background border border-border rounded-md px-2 text-xs text-muted-foreground">
            {" "}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-0 outline-0 focus:ring-0 text-xs py-1.5 cursor-pointer text-muted-foreground"
            >
              {" "}
              <option value="All">Todos Status</option>{" "}
              <option value="active">Ativo</option>{" "}
              <option value="prospect">Prospect</option>{" "}
              <option value="inactive">Inativo</option>{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Clients list cards */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {" "}
        {filtered.map((c) => {
          const clientProcesses = processes.filter((p) => p.clientId === c.id);
          return (
            <div
              key={c.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-cyan-500/30 transition-all group relative animate-fade-in"
            >
              {" "}
              <div className="space-y-4">
                {" "}
                {/* Header card */}{" "}
                <div className="flex justify-between items-start">
                  {" "}
                  <div>
                    {" "}
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded mr-2">
                      {" "}
                      {c.type.toUpperCase()}{" "}
                    </span>{" "}
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${c.status === "active" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"}`}
                    >
                      {" "}
                      {c.status}{" "}
                    </span>{" "}
                  </div>{" "}
                  <button
                    onClick={() => deleteClient(c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-muted-foreground hover:text-rose-500 rounded transition-all cursor-pointer shrink-0"
                  >
                    {" "}
                    <Trash2 className="w-3.5 h-3.5" />{" "}
                  </button>{" "}
                </div>{" "}
                {/* Name */}{" "}
                <div className="space-y-0.5">
                  {" "}
                  <h3 className="text-sm font-extrabold text-foreground truncate">
                    {c.name}
                  </h3>{" "}
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    DOC: {c.document}
                  </span>{" "}
                </div>{" "}
                {/* Contacts details */}{" "}
                <div className="space-y-1.5 text-xs text-muted-foreground border-t border-slate-50 pt-3">
                  {" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                    <span className="truncate">{c.email}</span>{" "}
                  </div>{" "}
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      {" "}
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                      <span>{c.phone}</span>{" "}
                    </div>
                  )}{" "}
                  {c.address && (
                    <div className="flex items-center gap-2">
                      {" "}
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />{" "}
                      <span className="truncate">{c.address}</span>{" "}
                    </div>
                  )}{" "}
                </div>{" "}
                {/* Active processes linkage */}{" "}
                <div className="border-t border-slate-50 pt-3 text-xs text-left">
                  {" "}
                  <span className="text-[10px] text-muted-foreground font-bold block uppercase mb-1.5 flex items-center gap-1">
                    {" "}
                    <Scale className="w-3.5 h-3.5 text-cyan-500" /> Processos
                    Patrocinados ({clientProcesses.length}){" "}
                  </span>{" "}
                  <div className="space-y-1">
                    {" "}
                    {clientProcesses.map((p) => (
                      <div
                        key={p.id}
                        className="text-[10px] text-muted-foreground truncate font-semibold"
                      >
                        {" "}
                        • {p.title} ({p.court}){" "}
                      </div>
                    ))}{" "}
                    {clientProcesses.length === 0 && (
                      <span className="text-[10px] text-muted-foreground block font-normal">
                        Nenhum processo litigioso ativo.
                      </span>
                    )}{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          );
        })}{" "}
        {filtered.length === 0 && (
          <div className="col-span-full p-12 bg-card border border-border rounded-xl text-center text-xs text-muted-foreground">
            {" "}
            Nenhum cliente localizado para esses filtros.{" "}
          </div>
        )}{" "}
      </div>{" "}
      {/* Creation Modal */}{" "}
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
                  Cadastrar Cliente PF / PJ
                </h3>{" "}
                <p className="text-[11px] text-muted-foreground">
                  Insira as informações societárias ou civis obrigatórias.
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
            <form onSubmit={handleCreateClient} className="space-y-4 text-left">
              {" "}
              {/* Name */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Nome Completo / Razão Social
                </label>{" "}
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente PF ou PJ por extenso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                />{" "}
              </div>{" "}
              {/* Email & Phone */}{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    E-mail
                  </label>{" "}
                  <input
                    type="email"
                    required
                    placeholder="email@cliente.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Telefone
                  </label>{" "}
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* Document & Type */}{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    CPF ou CNPJ
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Somente dígitos"
                    value={document}
                    onChange={(e) =>
                      setDocument(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Tipo de Cliente
                  </label>{" "}
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  >
                    {" "}
                    <option value="pf">Pessoa Física (PF)</option>{" "}
                    <option value="pj">Pessoa Jurídica (PJ)</option>{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
              {/* Status */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Fase CRM
                </label>{" "}
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                >
                  {" "}
                  <option value="prospect">
                    Prospect (Em negociação de contrato)
                  </option>{" "}
                  <option value="active">
                    Ativo (Contrato assinado e outorgado)
                  </option>{" "}
                  <option value="inactive">Inativo</option>{" "}
                </select>{" "}
              </div>{" "}
              {/* Address */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Endereço Residencial / Comercial
                </label>{" "}
                <input
                  type="text"
                  placeholder="Rua, número, complemento, bairro, cidade/UF"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  Confirmar Cadastro{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
