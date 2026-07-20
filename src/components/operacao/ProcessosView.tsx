import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import { Process, ProcessStatus, ProcessRisk } from "../../types";
import {
  Scale,
  Search,
  Filter,
  Plus,
  Eye,
  Landmark,
  AlertCircle,
  Trash2,
} from "lucide-react";
export const ProcessosView: React.FC = () => {
  const {
    processes,
    clients,
    addProcess,
    deleteProcess,
    setSelectedProcessId,
    setActiveTab,
  } = useJusFlow();
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false); // New Process Form States
  const [title, setTitle] = useState("");
  const [cnj, setCnj] = useState("");
  const [clientId, setClientId] = useState("");
  const [area, setArea] = useState("Civil");
  const [risk, setRisk] = useState<ProcessRisk>("low");
  const [court, setCourt] = useState("");
  const [division, setDivision] = useState("");
  const [classType, setClassType] = useState("");
  const [value, setValue] = useState("");
  const [plaintiff, setPlaintiff] = useState("");
  const [defendant, setDefendant] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState<ProcessStatus>("active");
  const [notes, setNotes] = useState("");
  const handleCnjChange = (val: string) => {
    // Basic CNJ auto-format helper: XXXXXXX-XX.XXXX.X.XX.XXXX (20 digits)
    const raw = val.replace(/\D/g, "").substring(0, 20);
    let formatted = raw;
    if (raw.length > 7) {
      formatted = raw.substring(0, 7) + "-" + raw.substring(7);
    }
    if (raw.length > 9) {
      formatted = formatted.substring(0, 10) + "." + raw.substring(9);
    }
    if (raw.length > 13) {
      formatted = formatted.substring(0, 15) + "." + raw.substring(13);
    }
    if (raw.length > 14) {
      formatted = formatted.substring(0, 17) + "." + raw.substring(14);
    }
    if (raw.length > 16) {
      formatted = formatted.substring(0, 20) + "." + raw.substring(16);
    }
    setCnj(formatted);
  };
  const handleCreateProcess = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === clientId);
    if (!selectedClient) return;
    addProcess({
      cnj,
      title,
      clientId,
      clientName: selectedClient.name,
      area,
      risk,
      court,
      division,
      class: classType,
      value: Number(value) || 0,
      plaintiff,
      defendant,
      subject,
      status,
      notes,
    }); // Reset fields
    setTitle("");
    setCnj("");
    setClientId("");
    setCourt("");
    setDivision("");
    setClassType("");
    setValue("");
    setPlaintiff("");
    setDefendant("");
    setSubject("");
    setNotes("");
    setIsModalOpen(false);
  }; // Filtering
  const filtered = processes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.cnj.includes(search) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.plaintiff.toLowerCase().includes(search.toLowerCase()) ||
      p.defendant.toLowerCase().includes(search.toLowerCase());
    const matchesArea = filterArea === "All" || p.area === filterArea;
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    return matchesSearch && matchesArea && matchesStatus;
  });
  const getRiskStyle = (r: ProcessRisk) => {
    switch (r) {
      case "high":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40";
      case "medium":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40";
      default:
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40";
    }
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header and Add button */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div className="text-left">
          {" "}
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Painel Processual
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Registre e acompanhe as ações judiciais integradas ao DataJud.
          </p>{" "}
        </div>{" "}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 self-start shadow-md shadow-cyan-600/10 cursor-pointer"
        >
          {" "}
          <Plus className="w-4 h-4" /> Cadastrar Processo{" "}
        </button>{" "}
      </div>{" "}
      {/* Filter and Search Bar */}{" "}
      <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col md:flex-row gap-3">
        {" "}
        {/* Search */}{" "}
        <div className="flex-1 relative">
          {" "}
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />{" "}
          <input
            type="text"
            placeholder="Pesquisar por Título, CNJ, Autor ou Réu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border focus:border-cyan-500 rounded-md pl-9 pr-4 py-2 text-xs text-card-foreground outline-0 focus:ring-0"
          />{" "}
        </div>{" "}
        {/* Filters */}{" "}
        <div className="flex gap-2 shrink-0">
          {" "}
          {/* Area */}{" "}
          <div className="flex items-center gap-1 bg-background border border-border rounded-md px-2 text-xs text-muted-foreground">
            {" "}
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />{" "}
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="bg-transparent border-0 outline-0 focus:ring-0 text-xs py-1.5 cursor-pointer text-muted-foreground"
            >
              {" "}
              <option value="All">Todas Áreas</option>{" "}
              <option value="Civil">Civil</option>{" "}
              <option value="Trabalhista">Trabalhista</option>{" "}
              <option value="Tributário">Tributário</option>{" "}
              <option value="Penal">Penal</option>{" "}
              <option value="Família">Família</option>{" "}
            </select>{" "}
          </div>{" "}
          {/* Status */}{" "}
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
              <option value="suspended">Suspenso</option>{" "}
              <option value="completed">Encerrado</option>{" "}
              <option value="archived">Arquivado</option>{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Grid: Process Cards */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {" "}
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-cyan-500/40 transition-all group relative"
          >
            {" "}
            <div>
              {" "}
              {/* Card Header: Area & Risk */}{" "}
              <div className="flex justify-between items-center mb-3">
                {" "}
                <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {" "}
                  {p.area}{" "}
                </span>{" "}
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${getRiskStyle(p.risk)}`}
                >
                  {" "}
                  Risco {p.risk}{" "}
                </span>{" "}
              </div>{" "}
              {/* Title & CNJ */}{" "}
              <div className="text-left space-y-1">
                {" "}
                <h4 className="text-sm font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {" "}
                  {p.title}{" "}
                </h4>{" "}
                <p className="text-[11px] font-mono text-muted-foreground select-all">
                  {" "}
                  CNJ: {p.cnj}{" "}
                </p>{" "}
              </div>{" "}
              {/* Client & Parties */}{" "}
              <div className="mt-4 border-t border-border/80 pt-3 text-left space-y-1.5">
                {" "}
                <div className="flex justify-between text-[11px]">
                  {" "}
                  <span className="text-muted-foreground">Cliente:</span>{" "}
                  <span className="font-semibold text-foreground truncate max-w-[160px]">
                    {p.clientName}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-between text-[11px]">
                  {" "}
                  <span className="text-muted-foreground">Autor:</span>{" "}
                  <span className="font-medium text-foreground truncate max-w-[160px]">
                    {p.plaintiff}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-between text-[11px]">
                  {" "}
                  <span className="text-muted-foreground">Réu:</span>{" "}
                  <span className="font-medium text-foreground truncate max-w-[160px]">
                    {p.defendant}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-between text-[11px]">
                  {" "}
                  <span className="text-muted-foreground">
                    Tribunal/Vara:
                  </span>{" "}
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 truncate max-w-[160px]">
                    {p.court} - {p.division}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Actions Footer */}{" "}
            <div className="mt-5 border-t border-border/80 pt-4 flex gap-2">
              {" "}
              <button
                onClick={() => {
                  setSelectedProcessId(p.id);
                  setActiveTab("operacao.processo_detalhe");
                }}
                className="flex-1 py-1.5 bg-muted hover:bg-cyan-50 dark:hover:bg-cyan-950/20 text-muted-foreground hover:text-cyan-600 dark:hover:text-cyan-400 text-[10px] font-bold rounded-md border border-border hover:border-cyan-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                {" "}
                <Eye className="w-3.5 h-3.5" /> Detalhes & Linha do Tempo{" "}
              </button>{" "}
              <button
                onClick={() => {
                  setSelectedProcessId(p.id);
                  setActiveTab("operacao.datajud");
                }}
                title="Consultar DataJud"
                className="p-1.5 bg-muted hover:bg-amber-50 dark:hover:bg-amber-950/20 text-muted-foreground hover:text-amber-500 dark:hover:text-amber-400 border border-border rounded-md hover:border-amber-500/30 transition-all cursor-pointer shrink-0"
              >
                {" "}
                <Landmark className="w-3.5 h-3.5" />{" "}
              </button>{" "}
              <button
                onClick={() => deleteProcess(p.id)}
                title="Excluir Processo"
                className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-muted-foreground hover:text-rose-500 border border-transparent hover:border-rose-500/20 rounded-md transition-all cursor-pointer shrink-0"
              >
                {" "}
                <Trash2 className="w-3.5 h-3.5" />{" "}
              </button>{" "}
            </div>{" "}
          </div>
        ))}{" "}
        {filtered.length === 0 && (
          <div className="col-span-full p-12 bg-card border border-border rounded-xl text-center text-xs text-muted-foreground">
            {" "}
            Nenhum processo localizado para os critérios informados.{" "}
          </div>
        )}{" "}
      </div>{" "}
      {/* Registry Form Modal */}{" "}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {" "}
          <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
            {" "}
            <div className="flex justify-between items-center mb-4 text-left">
              {" "}
              <div>
                {" "}
                <h3 className="text-sm font-bold text-foreground">
                  Cadastrar Novo Processo Judicial
                </h3>{" "}
                <p className="text-[11px] text-muted-foreground">
                  Crie a vinculação à OAB, clientes e configure os tribunais.
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
              onSubmit={handleCreateProcess}
              className="space-y-4 text-left"
            >
              {" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                {/* Process CNJ */}{" "}
                <div className="space-y-1.5 col-span-full">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Número CNJ do Processo (20 dígitos)
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Ex: 5001234-56.2025.8.26.0100"
                    value={cnj}
                    onChange={(e) => handleCnjChange(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Title */}{" "}
                <div className="space-y-1.5 col-span-full">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Título de Acompanhamento
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Ex: Revisional de Alimentos / Cobrança Indevida"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Client Link Dropdown */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Cliente Vinculado
                  </label>{" "}
                  <select
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  >
                    {" "}
                    <option value="">Selecione do CRM...</option>{" "}
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type.toUpperCase()})
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                {/* Legal Area */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Área do Direito
                  </label>{" "}
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  >
                    {" "}
                    <option value="Civil">Civil</option>{" "}
                    <option value="Trabalhista">Trabalhista</option>{" "}
                    <option value="Tributário">Tributário</option>{" "}
                    <option value="Penal">Penal</option>{" "}
                    <option value="Família">Família</option>{" "}
                  </select>{" "}
                </div>{" "}
                {/* Risk */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Análise de Risco
                  </label>{" "}
                  <select
                    value={risk}
                    onChange={(e) => setRisk(e.target.value as ProcessRisk)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  >
                    {" "}
                    <option value="low">
                      Baixo (Alta probabilidade de êxito)
                    </option>{" "}
                    <option value="medium">
                      Médio (Pretendido controverso)
                    </option>{" "}
                    <option value="high">
                      Alto (Risco substancial de sucumbência)
                    </option>{" "}
                  </select>{" "}
                </div>{" "}
                {/* Value */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Valor da Causa (R$)
                  </label>{" "}
                  <input
                    type="number"
                    placeholder="Ex: 50000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Tribunal */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Tribunal (Sigla)
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Ex: TJSP / TRT2 / TRF3"
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Vara */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Vara de Distribuição
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Ex: 12ª Vara Cível Federal"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Classe */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Classe Processual
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Ex: Monitória / Mandado de Segurança"
                    value={classType}
                    onChange={(e) => setClassType(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Assunto */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Assunto do Litígio
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Ex: Repetição de Indébito / ISS"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Plaintiff */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Polo Ativo (Autor)
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Nome completo do Autor"
                    value={plaintiff}
                    onChange={(e) => setPlaintiff(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                {/* Defendant */}{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-muted-foreground font-semibold">
                    Polo Passivo (Réu)
                  </label>{" "}
                  <input
                    type="text"
                    required
                    placeholder="Nome completo do Réu"
                    value={defendant}
                    onChange={(e) => setDefendant(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* Notes */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-xs text-muted-foreground font-semibold">
                  Observações Internas (Segredo Profissional)
                </label>{" "}
                <textarea
                  placeholder="Instruções adicionais e estratégias de defesa..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                />{" "}
              </div>{" "}
              {/* Submit Buttons */}{" "}
              <div className="pt-3 border-t border-border flex justify-end gap-2">
                {" "}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 hover:bg-accent hover:text-accent-foreground text-xs font-bold text-muted-foreground rounded-md transition-colors cursor-pointer"
                >
                  {" "}
                  Cancelar{" "}
                </button>{" "}
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md transition-colors shadow-md cursor-pointer"
                >
                  {" "}
                  Registrar Processo{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
