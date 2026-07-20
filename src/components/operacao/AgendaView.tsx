import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import { CalendarEvent } from "../../types";
import {
  Calendar,
  Plus,
  Clock,
  Video,
  MapPin,
  Scale,
  List,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";
type AppointmentType = "hearing" | "deadline" | "task" | "dispatch" | "pericia";
export const AgendaView: React.FC = () => {
  const { events, processes, addEvent } = useJusFlow();
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [isModalOpen, setIsModalOpen] = useState(false); // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<AppointmentType>("task");
  const [location, setLocation] = useState("");
  const [virtualLink, setVirtualLink] = useState("");
  const [processId, setProcessId] = useState("");
  const appointments = events.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.start.split("T")[0],
    time: e.start.split("T")[1]?.slice(0, 5) || "12:00",
    type: e.type as AppointmentType,
    location: e.type === "hearing" ? "Tribunal Virtual" : "Escritório Sede",
    virtualLink:
      e.type === "hearing" ? "https://meet.google.com/abc-defg-hij" : undefined,
    processId: e.processId,
    processTitle: e.processTitle,
  }));
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;
    const selectedProcess = processes.find((p) => p.id === processId);
    addEvent({
      title,
      start: `${date}T${time}:00Z`,
      end: `${date}T${time}:59Z`,
      type: type,
      processId: processId || undefined,
      processTitle: selectedProcess ? selectedProcess.title : undefined,
      description: location || undefined,
    });
    setTitle("");
    setDate("");
    setTime("");
    setType("task");
    setLocation("");
    setVirtualLink("");
    setProcessId("");
    setIsModalOpen(false);
  };
  const getBadgeStyle = (t: AppointmentType) => {
    switch (t) {
      case "hearing":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40";
      case "dispatch":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40";
      case "pericia":
        return "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40";
      default:
        return "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/40";
    }
  };
  const getTypeName = (t: AppointmentType) => {
    switch (t) {
      case "hearing":
        return "Audiência";
      case "dispatch":
        return "Despacho";
      case "pericia":
        return "Perícia";
      default:
        return "Reunião";
    }
  }; // Calendar rendering helper: simplified current month grid (July 2026)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header and Add button */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div className="text-left">
          {" "}
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Agenda Forense
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Acompanhe audiências judiciais, perícias e reuniões corporativas.
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-2 self-start">
          {" "}
          {/* Switch View Buttons */}{" "}
          <div className="bg-card border border-border p-0.5 rounded-md flex">
            {" "}
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"}`}
            >
              {" "}
              <List className="w-3.5 h-3.5" />{" "}
            </button>{" "}
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "calendar" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"}`}
            >
              {" "}
              <LayoutGrid className="w-3.5 h-3.5" />{" "}
            </button>{" "}
          </div>{" "}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-600/10 cursor-pointer"
          >
            {" "}
            <Plus className="w-4 h-4" /> Marcar Compromisso{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* View Rendering */}{" "}
      {viewMode === "list" ? (
        /* List View */ <div className="space-y-4 max-w-4xl text-left mx-auto">
          {" "}
          {(appointments || [])
            .sort(
              (a, b) => {
                const dateA = new Date(`${a.date || "2000-01-01"}T${a.time || "00:00"}`).getTime();
                const dateB = new Date(`${b.date || "2000-01-01"}T${b.time || "00:00"}`).getTime();
                return (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
              }
            )
            .map((app) => (
              <div
                key={app.id}
                className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {" "}
                <div className="flex items-start gap-4">
                  {" "}
                  {/* Calendar Node Date */}{" "}
                  <div className="w-12 h-12 bg-background/80 border border-border rounded-xl flex flex-col items-center justify-center shrink-0">
                    {" "}
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      Jul
                    </span>{" "}
                    <span className="text-sm font-black text-foreground leading-none">
                      {" "}
                      {app.date.split("-")[2] ||
                        app.date.split("/")[0] ||
                        "15"}{" "}
                    </span>{" "}
                  </div>{" "}
                  <div className="space-y-1">
                    {" "}
                    <div className="flex flex-wrap items-center gap-2">
                      {" "}
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${getBadgeStyle(app.type)}`}
                      >
                        {" "}
                        {getTypeName(app.type)}{" "}
                      </span>{" "}
                      <span className="text-xs font-bold text-foreground">
                        {app.title}
                      </span>{" "}
                    </div>{" "}
                    {app.processTitle && (
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        {" "}
                        <Scale className="w-3.5 h-3.5 text-muted-foreground shrink-0" />{" "}
                        Proc:{" "}
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                          {app.processTitle}
                        </span>{" "}
                      </p>
                    )}{" "}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground pt-1.5">
                      {" "}
                      <span className="flex items-center gap-1">
                        {" "}
                        <Clock className="w-3.5 h-3.5" /> às {app.time}{" "}
                      </span>{" "}
                      {app.location && (
                        <span className="flex items-center gap-1">
                          {" "}
                          <MapPin className="w-3.5 h-3.5" /> {app.location}{" "}
                        </span>
                      )}{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Meet integration button */}{" "}
                {app.virtualLink && (
                  <a
                    href={app.virtualLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 self-start md:self-auto shadow-sm"
                  >
                    {" "}
                    <Video className="w-4 h-4 shrink-0" /> Entrar no Google
                    Meet{" "}
                  </a>
                )}{" "}
              </div>
            ))}{" "}
          {appointments.length === 0 && (
            <div className="p-12 bg-card border border-border rounded-xl text-center text-xs text-muted-foreground">
              {" "}
              Nenhum compromisso marcado para este período.{" "}
            </div>
          )}{" "}
        </div>
      ) : (
        /* Calendar View Monthly Grid */ <div className="bg-card border border-border rounded-xl p-5 shadow-sm max-w-4xl mx-auto">
          {" "}
          <div className="flex justify-between items-center mb-4">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
              Julho de 2026
            </h3>{" "}
            <span className="text-[10px] text-muted-foreground">
              Escritório Central (UTC)
            </span>{" "}
          </div>{" "}
          {/* Calendar Header Week */}{" "}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-muted-foreground uppercase border-b border-border pb-2">
            {" "}
            <span>Dom</span> <span>Seg</span> <span>Ter</span> <span>Qua</span>{" "}
            <span>Qui</span> <span>Sex</span> <span>Sáb</span>{" "}
          </div>{" "}
          {/* Calendar Grid Days */}{" "}
          <div className="grid grid-cols-7 gap-2 mt-2 h-72">
            {" "}
            {/* Padding offset */}{" "}
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="p-2 border border-border/20 bg-muted/20 rounded-md text-muted-foreground text-xs text-left"
              />
            ))}{" "}
            {daysInMonth.map((day) => {
              const fullDateStr = `2026-07-${day.toString().padStart(2, "0")}`;
              const dayApps = appointments.filter(
                (a) => a.date === fullDateStr,
              );
              return (
                <div
                  key={day}
                  className="p-2 border border-border/80 hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/30 rounded-md text-left flex flex-col justify-between"
                >
                  {" "}
                  <span className="text-xs font-bold text-foreground ">
                    {day}
                  </span>{" "}
                  <div className="space-y-1 mt-1 overflow-y-auto max-h-12 no-scrollbar">
                    {" "}
                    {dayApps.map((a) => (
                      <span
                        key={a.id}
                        title={`${a.title} às ${a.time}`}
                        className={`block text-[8px] font-bold uppercase py-0.2 px-1 rounded truncate ${a.type === "hearing" ? "bg-rose-950 text-rose-300" : "bg-cyan-950 text-cyan-300"}`}
                      >
                        {" "}
                        {a.time} - {a.title}{" "}
                      </span>
                    ))}{" "}
                  </div>{" "}
                </div>
              );
            })}{" "}
          </div>{" "}
        </div>
      )}{" "}
      {/* Appointment Booking Modal */}{" "}
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
                  Agendar Compromisso Forense
                </h3>{" "}
                <p className="text-[11px] text-muted-foreground">
                  Insira audiências ou reuniões vinculadas.
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
              onSubmit={handleCreateAppointment}
              className="space-y-4 text-left"
            >
              {" "}
              {/* Title */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Título do Evento
                </label>{" "}
                <input
                  type="text"
                  required
                  placeholder="Ex: Audiência de Instrução e Julgamento"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                />{" "}
              </div>{" "}
              {/* Date & Time */}{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Data
                  </label>{" "}
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Horário
                  </label>{" "}
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* Appointment Type */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Tipo de Agenda
                </label>{" "}
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                >
                  {" "}
                  <option value="hearing">Audiência Judicial</option>{" "}
                  <option value="deadline">Prazo Processual</option>{" "}
                  <option value="task">Compromisso / Reunião</option>{" "}
                </select>{" "}
              </div>{" "}
              {/* Google Meet virtual link */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Link Virtual (Ex: Google Meet)
                </label>{" "}
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={virtualLink}
                  onChange={(e) => setVirtualLink(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                />{" "}
              </div>{" "}
              {/* Location physical */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Local Físico (Sala/Vara)
                </label>{" "}
                <input
                  type="text"
                  placeholder="Ex: Sala de Audiências da 2ª Vara Cível de SP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                />{" "}
              </div>{" "}
              {/* Linked Process */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Processo Vinculado
                </label>{" "}
                <select
                  value={processId}
                  onChange={(e) => setProcessId(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                >
                  {" "}
                  <option value="">
                    Nenhum (Compromisso Corporativo)
                  </option>{" "}
                  {processes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.cnj})
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
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md shadow-md cursor-pointer"
                >
                  {" "}
                  Confirmar Agendamento{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
