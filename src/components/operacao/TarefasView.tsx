import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import { Task } from "../../types";
import {
  Kanban,
  Plus,
  ArrowLeft,
  ArrowRight,
  User,
  Scale,
  Trash2,
  ShieldCheck,
} from "lucide-react";
type TaskColumn =
  "backlog" | "todo" | "doing" | "in_progress" | "review" | "done";
type TaskPriority = "low" | "medium" | "high" | "critical";
export const TarefasView: React.FC = () => {
  const { tasks, teamMembers, processes, addTask, updateTask, deleteTask } =
    useJusFlow();
  const [isModalOpen, setIsModalOpen] = useState(false); // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [processId, setProcessId] = useState("");
  const [column, setColumn] = useState<TaskColumn>("todo");
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
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssigneeId("");
    setProcessId("");
    setColumn("todo");
    setIsModalOpen(false);
  };
  const shiftTask = (task: Task, direction: "left" | "right") => {
    const columns: TaskColumn[] = [
      "backlog",
      "todo",
      "doing",
      "review",
      "done",
    ];
    const currIdx = columns.indexOf(task.column);
    let targetIdx = currIdx;
    if (direction === "left" && currIdx > 0) targetIdx--;
    if (direction === "right" && currIdx < columns.length - 1) targetIdx++;
    if (targetIdx !== currIdx) {
      updateTask(task.id, { column: columns[targetIdx] });
    }
  };
  const getPriorityStyle = (p: TaskPriority) => {
    switch (p) {
      case "critical":
        return "bg-rose-950 text-rose-300";
      case "high":
        return "bg-amber-950 text-amber-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const renderColumn = (colId: TaskColumn, title: string) => {
    const colTasks = tasks.filter((t) => t.column === colId);
    return (
      <div
        key={colId}
        className="flex-1 min-w-[240px] bg-background/40 p-3 rounded-xl border border-border/80 flex flex-col h-[520px]"
      >
        {" "}
        {/* Column Header */}{" "}
        <div className="flex justify-between items-center mb-3 shrink-0">
          {" "}
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">
            {title}
          </span>{" "}
          <span className="text-[10px] font-bold bg-slate-200 dark:bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {" "}
            {colTasks.length}{" "}
          </span>{" "}
        </div>{" "}
        {/* Task Cards Container */}{" "}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
          {" "}
          {colTasks.map((task) => (
            <div
              key={task.id}
              className="p-3.5 bg-card border border-border rounded-md shadow-sm text-left space-y-2 relative group"
            >
              {" "}
              {/* Card Meta */}{" "}
              <div className="flex justify-between items-center">
                {" "}
                <span
                  className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded ${getPriorityStyle(task.priority)}`}
                >
                  {" "}
                  {task.priority}{" "}
                </span>{" "}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-muted-foreground hover:text-rose-500 rounded transition-all cursor-pointer shrink-0"
                >
                  {" "}
                  <Trash2 className="w-3 h-3" />{" "}
                </button>{" "}
              </div>{" "}
              {/* Title & Desc */}{" "}
              <div className="space-y-1">
                {" "}
                <h4 className="text-xs font-bold text-card-foreground leading-snug">
                  {task.title}
                </h4>{" "}
                {task.description && (
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                    {task.description}
                  </p>
                )}{" "}
              </div>{" "}
              {/* Process Link */}{" "}
              {task.processTitle && (
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground pt-1 border-t border-slate-50 /60 truncate">
                  {" "}
                  <Scale className="w-3 h-3 text-muted-foreground" />{" "}
                  <span className="truncate">
                    Proc: {task.processTitle}
                  </span>{" "}
                </div>
              )}{" "}
              {/* Assignee & Shift Actions */}{" "}
              <div className="flex justify-between items-center pt-2 border-t border-slate-50 /60">
                {" "}
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground truncate max-w-[120px]">
                  {" "}
                  <div className="w-4 h-4 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-[8px] shrink-0">
                    {" "}
                    {task.assigneeName ? task.assigneeName.charAt(0) : "S"}{" "}
                  </div>{" "}
                  <span className="truncate">
                    {task.assigneeName || "Sem atribuição"}
                  </span>{" "}
                </div>{" "}
                {/* Shift triggers */}{" "}
                <div className="flex gap-1 shrink-0">
                  {" "}
                  <button
                    onClick={() => shiftTask(task, "left")}
                    disabled={colId === "backlog"}
                    className="p-1 hover:bg-accent hover:text-accent-foreground disabled:opacity-30 rounded text-muted-foreground cursor-pointer"
                  >
                    {" "}
                    <ArrowLeft className="w-3 h-3" />{" "}
                  </button>{" "}
                  <button
                    onClick={() => shiftTask(task, "right")}
                    disabled={colId === "done"}
                    className="p-1 hover:bg-accent hover:text-accent-foreground disabled:opacity-30 rounded text-muted-foreground cursor-pointer"
                  >
                    {" "}
                    <ArrowRight className="w-3 h-3" />{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          ))}{" "}
          {colTasks.length === 0 && (
            <div className="py-12 text-center text-[11px] text-muted-foreground">
              {" "}
              Arraste ou crie uma tarefa nesta fila.{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>
    );
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
            Fluxo de Trabalho
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Acompanhe tarefas delegadas e fluxos processuais internos no padrão
            OAB-SaaS.
          </p>{" "}
        </div>{" "}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 self-start shadow-md shadow-cyan-600/10 cursor-pointer"
        >
          {" "}
          <Plus className="w-4 h-4" /> Criar Nova Tarefa{" "}
        </button>{" "}
      </div>{" "}
      {/* Board Scroll wrapper */}{" "}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {" "}
        {renderColumn("backlog", "Backlog")} {renderColumn("todo", "A Fazer")}{" "}
        {renderColumn("doing", "Em Andamento")}{" "}
        {renderColumn("review", "Revisão Sócia")}{" "}
        {renderColumn("done", "Concluído")}{" "}
      </div>{" "}
      {/* Task Creation Modal */}{" "}
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
                  Criar Nova Tarefa Kanban
                </h3>{" "}
                <p className="text-[11px] text-muted-foreground">
                  Atribua obrigações e anexe a processos.
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
            <form onSubmit={handleCreateTask} className="space-y-4 text-left">
              {" "}
              {/* Title */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Título da Tarefa
                </label>{" "}
                <input
                  type="text"
                  required
                  placeholder="Ex: Minutar Memorial de Sustentação Oral"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                />{" "}
              </div>{" "}
              {/* Description */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Instruções / Descrição
                </label>{" "}
                <textarea
                  placeholder="Instruções claras e referências para a execução desta tarefa..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                />{" "}
              </div>{" "}
              {/* Priority & Column */}{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Prioridade
                  </label>{" "}
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  >
                    {" "}
                    <option value="low">Baixa</option>{" "}
                    <option value="medium">Média</option>{" "}
                    <option value="high">Alta</option>{" "}
                    <option value="critical">Crítica</option>{" "}
                  </select>{" "}
                </div>{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Fila Inicial
                  </label>{" "}
                  <select
                    value={column}
                    onChange={(e) => setColumn(e.target.value as any)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  >
                    {" "}
                    <option value="backlog">Backlog</option>{" "}
                    <option value="todo">A Fazer</option>{" "}
                    <option value="doing">Em Andamento</option>{" "}
                    <option value="review">Revisão Sócia</option>{" "}
                    <option value="done">Concluído</option>{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
              {/* Assignee */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Atribuir a (Membro da Equipe)
                </label>{" "}
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                >
                  {" "}
                  <option value="">
                    Não atribuir (Disponível na Fila)
                  </option>{" "}
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role.toUpperCase()})
                    </option>
                  ))}{" "}
                </select>{" "}
              </div>{" "}
              {/* Linked Process */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Vincular a Processo Judicial (Opcional)
                </label>{" "}
                <select
                  value={processId}
                  onChange={(e) => setProcessId(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                >
                  {" "}
                  <option value="">Nenhum</option>{" "}
                  {processes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.cnj})
                    </option>
                  ))}{" "}
                </select>{" "}
              </div>{" "}
              {/* Submit Buttons */}{" "}
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
                  Confirmar Tarefa{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
