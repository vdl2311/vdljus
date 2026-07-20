import React, { useState, useEffect, useRef } from "react";
import { useJusFlow } from "../store/JusFlowContext";
import {
  Search,
  Scale,
  Users,
  Kanban,
  AlarmClock,
  FileText,
  Library,
  CornerDownLeft,
  X,
} from "lucide-react";
export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    clients,
    processes,
    tasks,
    deadlines,
    documents,
    articles,
    setActiveTab,
    setSelectedProcessId,
  } = useJusFlow();
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch("");
    }
  }, [isCommandPaletteOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsCommandPaletteOpen(false);
      }
    };
    if (isCommandPaletteOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter Data
  const cleanSearch = search.toLowerCase().trim();
  const filteredClients = cleanSearch
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanSearch) ||
          c.document.includes(cleanSearch),
      )
    : [];
  const filteredProcesses = cleanSearch
    ? processes.filter(
        (p) =>
          p.title.toLowerCase().includes(cleanSearch) ||
          p.cnj.includes(cleanSearch) ||
          p.clientName.toLowerCase().includes(cleanSearch),
      )
    : [];
  const filteredTasks = cleanSearch
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(cleanSearch) ||
          (t.assigneeName &&
            t.assigneeName.toLowerCase().includes(cleanSearch)),
      )
    : [];
  const filteredDeadlines = cleanSearch
    ? deadlines.filter((d) => d.title.toLowerCase().includes(cleanSearch))
    : [];
  const filteredDocuments = cleanSearch
    ? documents.filter((d) => d.title.toLowerCase().includes(cleanSearch))
    : [];
  const filteredArticles = cleanSearch
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(cleanSearch) ||
          a.tags.some((t) => t.toLowerCase().includes(cleanSearch)),
      )
    : [];
  const totalResults =
    filteredClients.length +
    filteredProcesses.length +
    filteredTasks.length +
    filteredDeadlines.length +
    filteredDocuments.length +
    filteredArticles.length;
  const handleSelect = (tab: string, processId: string | null = null) => {
    if (processId) {
      setSelectedProcessId(processId);
    }
    setActiveTab(tab);
    setIsCommandPaletteOpen(false);
  };
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center sm:pt-[10vh] sm:px-4">
      {" "}
      <div
        ref={containerRef}
        className="w-full h-full sm:h-auto max-w-2xl bg-card rounded-none sm:rounded-xl border-0 sm:border border-border shadow-2xl flex flex-col overflow-hidden max-h-screen sm:max-h-[75vh]"
      >
        {" "}
        {/* Search Input Bar */}{" "}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          {" "}
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />{" "}
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar (CNJ, clientes, prazos...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-0 focus:ring-0 text-sm text-foreground min-w-0 truncate"
          />{" "}
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"
          >
            {" "}
            <X className="w-4 h-4" />{" "}
          </button>{" "}
        </div>{" "}
        {/* Results Stream */}{" "}
        <div className="flex-1 overflow-y-auto p-2 min-h-[200px] no-scrollbar">
          {" "}
          {!search ? (
            <div className="p-8 text-center text-muted-foreground">
              {" "}
              <p className="text-xs font-semibold uppercase tracking-wider mb-2">
                Busca Inteligente JusFlow
              </p>{" "}
              <p className="text-xs">
                Digite o nome de uma parte, número CNJ de processo, uma tarefa
                ou termo jurídico para pesquisar em toda a plataforma.
              </p>{" "}
              <div className="hidden sm:flex justify-center gap-3 mt-4 text-[10px] text-muted-foreground">
                {" "}
                <span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">Ctrl+K</kbd>{" "}
                  Abrir
                </span>{" "}
                <span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd>{" "}
                  Fechar
                </span>{" "}
              </div>{" "}
            </div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              {" "}
              Nenhum resultado encontrado para "{search}".{" "}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {" "}
              {/* Processes */}{" "}
              {filteredProcesses.length > 0 && (
                <div>
                  {" "}
                  <h3 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Processos
                  </h3>{" "}
                  {filteredProcesses.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        handleSelect("operacao.processo_detalhe", p.id)
                      }
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/40 text-xs text-foreground gap-4"
                    >
                      {" "}
                      <div className="flex items-center gap-3 min-w-0">
                        {" "}
                        <Scale className="w-4 h-4 text-cyan-500 shrink-0" />{" "}
                        <div className="truncate">
                          {" "}
                          <p className="font-bold truncate text-foreground">
                            {p.title}
                          </p>{" "}
                          <p className="text-[10px] text-muted-foreground truncate">
                            CNJ: {p.cnj} • {p.clientName}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <span className="text-[10px] bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        {" "}
                        Abrir Processo{" "}
                      </span>{" "}
                    </button>
                  ))}{" "}
                </div>
              )}{" "}
              {/* Clients */}{" "}
              {filteredClients.length > 0 && (
                <div>
                  {" "}
                  <h3 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Clientes
                  </h3>{" "}
                  {filteredClients.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect("gestao.clientes")}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/40 text-xs text-foreground gap-4"
                    >
                      {" "}
                      <div className="flex items-center gap-3 min-w-0">
                        {" "}
                        <Users className="w-4 h-4 text-emerald-500 shrink-0" />{" "}
                        <div className="truncate">
                          {" "}
                          <p className="font-bold truncate text-foreground">
                            {c.name}
                          </p>{" "}
                          <p className="text-[10px] text-muted-foreground truncate">
                            {c.document} • {c.email}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        {" "}
                        Ver CRM{" "}
                      </span>{" "}
                    </button>
                  ))}{" "}
                </div>
              )}{" "}
              {/* Tasks */}{" "}
              {filteredTasks.length > 0 && (
                <div>
                  {" "}
                  <h3 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Tarefas
                  </h3>{" "}
                  {filteredTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelect("operacao.tarefas")}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/40 text-xs text-foreground gap-4"
                    >
                      {" "}
                      <div className="flex items-center gap-3 min-w-0">
                        {" "}
                        <Kanban className="w-4 h-4 text-purple-500 shrink-0" />{" "}
                        <div className="truncate">
                          {" "}
                          <p className="font-bold truncate text-foreground">
                            {t.title}
                          </p>{" "}
                          <p className="text-[10px] text-muted-foreground truncate">
                            Fila: {t.column.toUpperCase()} • Resp:{" "}
                            {t.assigneeName || "Sem atribuição"}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <span className="text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        {" "}
                        Ver Kanban{" "}
                      </span>{" "}
                    </button>
                  ))}{" "}
                </div>
              )}{" "}
              {/* Deadlines */}{" "}
              {filteredDeadlines.length > 0 && (
                <div>
                  {" "}
                  <h3 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Prazos
                  </h3>{" "}
                  {filteredDeadlines.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleSelect("operacao.prazos")}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/40 text-xs text-foreground gap-4"
                    >
                      {" "}
                      <div className="flex items-center gap-3 min-w-0">
                        {" "}
                        <AlarmClock className="w-4 h-4 text-rose-500 shrink-0" />{" "}
                        <div className="truncate">
                          {" "}
                          <p className="font-bold truncate text-foreground">
                            {d.title}
                          </p>{" "}
                          <p className="text-[10px] text-muted-foreground truncate">
                            Vence em:{" "}
                            {new Date(d.date).toLocaleDateString("pt-BR")}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <span className="text-[10px] bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        {" "}
                        Ir para Prazos{" "}
                      </span>{" "}
                    </button>
                  ))}{" "}
                </div>
              )}{" "}
              {/* Documents */}{" "}
              {filteredDocuments.length > 0 && (
                <div>
                  {" "}
                  <h3 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Documentos
                  </h3>{" "}
                  {filteredDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleSelect("documentos.contratos")}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/40 text-xs text-foreground gap-4"
                    >
                      {" "}
                      <div className="flex items-center gap-3 min-w-0">
                        {" "}
                        <FileText className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                        <div className="truncate">
                          {" "}
                          <p className="font-bold truncate text-foreground">
                            {doc.title}
                          </p>{" "}
                          <p className="text-[10px] text-muted-foreground truncate">
                            Status: {doc.status.toUpperCase()}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        {" "}
                        Ver Documento{" "}
                      </span>{" "}
                    </button>
                  ))}{" "}
                </div>
              )}{" "}
              {/* Articles / Base de Conhecimento */}{" "}
              {filteredArticles.length > 0 && (
                <div>
                  {" "}
                  <h3 className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Base de Conhecimento
                  </h3>{" "}
                  {filteredArticles.map((art) => (
                    <button
                      key={art.id}
                      onClick={() => handleSelect("documentos.conhecimento")}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/40 text-xs text-foreground gap-4"
                    >
                      {" "}
                      <div className="flex items-center gap-3 min-w-0">
                        {" "}
                        <Library className="w-4 h-4 text-teal-500 shrink-0" />{" "}
                        <div className="truncate">
                          {" "}
                          <p className="font-bold truncate text-foreground">
                            {art.title}
                          </p>{" "}
                          <p className="text-[10px] text-muted-foreground truncate">
                            Categoria: {art.category.toUpperCase()} • Tags:{" "}
                            {art.tags.join(", ")}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <span className="text-[10px] bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        {" "}
                        Ver Biblioteca{" "}
                      </span>{" "}
                    </button>
                  ))}{" "}
                </div>
              )}{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* Footer help */}{" "}
        <div className="px-4 py-2 border-t border-border flex items-center justify-center sm:justify-between text-[10px] text-muted-foreground bg-background/20 shrink-0">
          {" "}
          <span className="hidden sm:flex items-center gap-1">
            {" "}
            <CornerDownLeft className="w-3 h-3" /> para selecionar{" "}
          </span>{" "}
          <span>Pesquisa Global JusFlow</span>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
