import React, { useState, useMemo, useRef } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import { Task } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  User,
  Scale,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  Move,
  AlertCircle
} from "lucide-react";

type TaskColumn = "backlog" | "todo" | "doing" | "review" | "done";
type TaskPriority = "low" | "medium" | "high" | "critical";

export const TarefasView: React.FC = () => {
  const { 
    tasks, 
    teamMembers, 
    processes, 
    addTask, 
    updateTask, 
    deleteTask,
    logAction 
  } = useJusFlow();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");

  // Kanban board scrolling
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContainer = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 330; // Approx column width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [processId, setProcessId] = useState("");
  const [column, setColumn] = useState<TaskColumn>("todo");

  // Drag & Drop state
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [activeDropCol, setActiveDropCol] = useState<TaskColumn | null>(null);

  // Column config
  const columnsList: { id: TaskColumn; label: string; bgClass: string; borderClass: string; accentColor: string }[] = [
    { 
      id: "todo", 
      label: "A Fazer", 
      bgClass: "bg-zinc-500/10", 
      borderClass: "border-t-zinc-400 dark:border-t-zinc-500",
      accentColor: "text-zinc-500 dark:text-zinc-400"
    },
    { 
      id: "doing", 
      label: "Em Andamento", 
      bgClass: "bg-amber-500/10", 
      borderClass: "border-t-amber-400 dark:border-t-amber-500",
      accentColor: "text-amber-500 dark:text-amber-400"
    },
    { 
      id: "review", 
      label: "Em Revisão", 
      bgClass: "bg-purple-500/10", 
      borderClass: "border-t-purple-400 dark:border-t-purple-500",
      accentColor: "text-purple-500 dark:text-purple-400"
    },
    { 
      id: "done", 
      label: "Concluída", 
      bgClass: "bg-emerald-500/10", 
      borderClass: "border-t-emerald-400 dark:border-t-emerald-500",
      accentColor: "text-emerald-500 dark:text-emerald-400"
    }
  ];

  // Filter tasks based on selected criteria
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        selectedPriority === "all" || t.priority === selectedPriority;

      const matchesAssignee =
        selectedAssignee === "all" || t.assigneeId === selectedAssignee;

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchQuery, selectedPriority, selectedAssignee]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedAssignee = teamMembers.find((m) => m.id === assigneeId);
    const selectedProcess = processes.find((p) => p.id === processId);

    addTask({
      title,
      description: description || undefined,
      column,
      priority,
      assigneeId: assigneeId || undefined,
      assigneeName: selectedAssignee ? selectedAssignee.name : undefined,
      processId: processId || undefined,
      processTitle: selectedProcess ? selectedProcess.title : undefined,
    });

    logAction(`Tarefa criada: "${title}" na coluna ${column.toUpperCase()}`);
    toast.success("Tarefa criada com sucesso!");

    // Reset states
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssigneeId("");
    setProcessId("");
    setColumn("todo");
    setIsModalOpen(false);
  };

  const shiftTask = (task: Task, direction: "left" | "right") => {
    const columns: TaskColumn[] = ["todo", "doing", "review", "done"];
    // Map "in_progress" to "doing" for index calculation, and "backlog" to "todo"
    let currentColumn = task.column === "in_progress" ? "doing" : task.column;
    if (currentColumn === "backlog") currentColumn = "todo";
    
    const currIdx = columns.indexOf(currentColumn as TaskColumn);
    let targetIdx = currIdx;

    if (direction === "left" && currIdx > 0) targetIdx--;
    if (direction === "right" && currIdx < columns.length - 1) targetIdx++;

    if (targetIdx !== currIdx) {
      const newColumn = columns[targetIdx];
      updateTask(task.id, { column: newColumn });
      logAction(`Tarefa "${task.title}" movida para: ${newColumn.toUpperCase()}`);
      toast.info(`Tarefa movida para ${columnsList.find(c => c.id === newColumn)?.label}`);
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setActiveDropCol(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskColumn) => {
    e.preventDefault();
    if (activeDropCol !== colId) {
      setActiveDropCol(colId);
    }
  };

  const handleDrop = (e: React.DragEvent, colId: TaskColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggingTaskId;
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        // Map current column
        const currentColumn = task.column === "in_progress" ? "doing" : task.column;
        if (currentColumn !== colId) {
          updateTask(taskId, { column: colId });
          logAction(`Tarefa "${task.title}" movida via drag & drop para: ${colId.toUpperCase()}`);
          toast.success(`Tarefa movida para ${columnsList.find(c => c.id === colId)?.label}`);
        }
      }
    }
    setActiveDropCol(null);
    setDraggingTaskId(null);
  };

  const getPriorityStyle = (p: TaskPriority) => {
    switch (p) {
      case "critical":
        return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40";
      case "high":
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40";
      case "medium":
        return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/40";
      case "low":
        return "bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPriority("all");
    setSelectedAssignee("all");
    toast.info("Filtros limpos");
  };

  const hasActiveFilters = searchQuery !== "" || selectedPriority !== "all" || selectedAssignee !== "all";

  const renderColumn = (colId: TaskColumn, title: string) => {
    // Unify "in_progress" and "doing" under "doing" column
    const colTasks = filteredTasks.filter(
      (t) => t.column === colId || (colId === "doing" && t.column === "in_progress")
    );
    const colConfig = columnsList.find(c => c.id === colId);
    const isOver = activeDropCol === colId;

    return (
      <div
        key={colId}
        onDragOver={(e) => handleDragOver(e, colId)}
        onDrop={(e) => handleDrop(e, colId)}
        className={`flex flex-col flex-1 min-w-[285px] md:min-w-[310px] max-w-[325px] rounded-2xl border transition-all duration-200 snap-center h-full select-none ${
          isOver 
            ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/5" 
            : "border-border/80 bg-slate-50/40 dark:bg-zinc-900/30 hover:border-border"
        }`}
      >
        {/* Column Header */}
        <div className={`p-4 border-b border-border/60 flex justify-between items-center shrink-0 border-t-4 rounded-t-2xl ${colConfig?.borderClass}`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${colConfig?.accentColor ? 'bg-current ' + colConfig.accentColor : 'bg-muted-foreground'}`} />
            <span className="text-xs font-bold text-foreground/95 uppercase tracking-wide">
              {title}
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            colTasks.length > 0 
              ? "bg-slate-200 dark:bg-zinc-800 text-foreground" 
              : "bg-slate-100 dark:bg-zinc-900 text-muted-foreground/75"
          }`}>
            {colTasks.length}
          </span>
        </div>

        {/* Task Cards Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-border">
          <AnimatePresence initial={false}>
            {colTasks.map((task) => {
              const isCurrentlyDragging = draggingTaskId === task.id;
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: isCurrentlyDragging ? 0.4 : 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="w-full"
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    tabIndex={0}
                    role="article"
                    className={`p-3.5 bg-card border rounded-xl shadow-xs text-left space-y-2.5 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md hover:border-border-hover ${
                      isCurrentlyDragging ? "border-dashed border-emerald-500" : "border-border/85"
                    }`}
                  >
                  {/* Card Meta */}
                  <div className="flex justify-between items-start gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority === "critical" ? "Crítico" : 
                       task.priority === "high" ? "Alta" : 
                       task.priority === "medium" ? "Média" : "Baixa"}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm("Excluir esta tarefa?")) {
                          deleteTask(task.id);
                          logAction(`Tarefa deletada: "${task.title}"`);
                          toast.error("Tarefa excluída");
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-muted-foreground hover:text-rose-500 rounded-md transition-all cursor-pointer shrink-0"
                      title="Excluir tarefa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-card-foreground leading-snug">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-[10px] text-muted-foreground/90 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Process Link */}
                  {task.processTitle && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-slate-50 dark:bg-zinc-900/60 p-1.5 rounded-lg border border-border/40 truncate">
                      <Scale className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate font-medium">
                        Proc: {task.processTitle}
                      </span>
                    </div>
                  )}

                  {/* Assignee & Shift Actions */}
                  <div className="flex justify-between items-center pt-2.5 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground truncate max-w-[140px]">
                      <div className="w-5 h-5 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {task.assigneeName ? task.assigneeName.charAt(0) : "S"}
                      </div>
                      <span className="truncate font-medium">
                        {task.assigneeName || "Sem atribuição"}
                      </span>
                    </div>

                    {/* Shift trigger controls (for interactive fallback) */}
                    <div className="flex gap-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => shiftTask(task, "left")}
                        disabled={colId === "todo"}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-20 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Mover para esquerda"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => shiftTask(task, "right")}
                        disabled={colId === "done"}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-20 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Mover para direita"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>

          {colTasks.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`py-16 px-4 text-center rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-200 h-[380px] bg-slate-50/10 dark:bg-zinc-900/10 ${
                isOver 
                  ? "border-emerald-400 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" 
                  : "border-border/50 text-muted-foreground/60"
              }`}
            >
              <p className="text-xs text-muted-foreground/70">Arraste tarefas para esta coluna</p>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  const activeCount = tasks.filter((t) => t.column !== "done").length;

  return (
    <div className="p-6 bg-background transition-colors text-left flex flex-col h-full overflow-hidden">
      {/* Board Controls row matching example exactly */}
      <div className="flex items-center justify-between gap-4 shrink-0 mb-6">
        <div className="text-left">
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground/90">
            {activeCount} {activeCount === 1 ? "tarefa ativa" : "tarefas ativas"} &bull; Arraste entre colunas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollContainer("left")}
              className="p-1.5 border border-border/70 hover:border-border rounded-lg bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer active:scale-95 shadow-2xs hover:bg-slate-50 dark:hover:bg-zinc-800"
              title="Rolar para esquerda"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scrollContainer("right")}
              className="p-1.5 border border-border/70 hover:border-border rounded-lg bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer active:scale-95 shadow-2xs hover:bg-slate-50 dark:hover:bg-zinc-800"
              title="Rolar para direita"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Nova tarefa
          </button>
        </div>
      </div>

      {/* Board Scroll wrapper */}
      <div 
        ref={scrollRef}
        className="flex-1 min-h-0 flex gap-4 overflow-x-auto px-6 pb-5 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-border scroll-smooth -mx-6"
      >
        {renderColumn("todo", "A Fazer")}
        {renderColumn("doing", "Em Andamento")}
        {renderColumn("review", "Em Revisão")}
        {renderColumn("done", "Concluída")}
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              role="dialog" 
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4 text-left">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Criar Nova Tarefa Kanban
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Atribua obrigações e anexe a processos.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4 text-left">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Título da Tarefa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Minutar Memorial de Sustentação Oral"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Instruções / Descrição
                  </label>
                  <textarea
                    placeholder="Instruções claras e referências para a execução desta tarefa..."
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  />
                </div>

                {/* Priority & Column */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                      Prioridade
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="critical">Crítica</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                      Fila Inicial
                    </label>
                    <select
                      value={column}
                      onChange={(e) => setColumn(e.target.value as any)}
                      className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                    >
                      <option value="todo">A Fazer</option>
                      <option value="doing">Em Andamento</option>
                      <option value="review">Em Revisão</option>
                      <option value="done">Concluída</option>
                    </select>
                  </div>
                </div>

                {/* Assignee */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Atribuir a (Membro da Equipe)
                  </label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  >
                    <option value="">
                      Não atribuir (Disponível na Fila)
                    </option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Linked Process */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Vincular a Processo Judicial (Opcional)
                  </label>
                  <select
                    value={processId}
                    onChange={(e) => setProcessId(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  >
                    <option value="">Nenhum</option>
                    {processes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.cnj})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold text-muted-foreground rounded-lg cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    Confirmar Tarefa
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
