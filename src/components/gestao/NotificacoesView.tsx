import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Bell,
  CheckCheck,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  Trash2,
  CheckCircle2,
} from "lucide-react";

export const NotificacoesView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
  } = useJusFlow();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case "financial":
        return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case "hearing":
        return <Calendar className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-cyan-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded">
            Alta Prioridade
          </span>
        );
      case "medium":
        return (
          <span className="bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
            Média
          </span>
        );
      default:
        return (
          <span className="bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded">
            Baixa
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Gestão / Central de Notificações
          </h2>
          <p className="text-xs text-muted-foreground">
            Acompanhe alertas importantes de prazos judiciais, fluxo de caixa e agendamentos.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer w-max"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar Todas como Lidas
          </button>
        )}
      </div>

      {/* Stats and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Não Lidas
            </span>
            <span className="text-2xl font-black text-foreground">{unreadCount}</span>
          </div>
          <div className="p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg text-rose-500">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Total de Alertas
            </span>
            <span className="text-2xl font-black text-foreground">{notifications.length}</span>
          </div>
          <div className="p-2 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg text-cyan-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-4 flex items-center gap-2 shadow-sm">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border border-cyan-500/30"
                : "hover:bg-accent text-muted-foreground border border-transparent"
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === "unread"
                ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border border-cyan-500/30"
                : "hover:bg-accent text-muted-foreground border border-transparent"
            }`}
          >
            Não Lidas ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === "read"
                ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border border-cyan-500/30"
                : "hover:bg-accent text-muted-foreground border border-transparent"
            }`}
          >
            Lidas ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-bold">Nenhuma notificação encontrada</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filter === "unread"
                ? "Parabéns! Você leu todas as suas notificações."
                : "Sua caixa de alertas está vazia."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 transition-all flex items-start justify-between gap-4 hover:bg-muted/50 ${
                !notif.read ? "bg-cyan-500/[0.02]" : ""
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 bg-muted rounded-lg shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-xs font-bold text-foreground truncate ${!notif.read ? "font-semibold" : ""}`}>
                      {notif.title}
                    </p>
                    {getPriorityBadge(notif.priority)}
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(notif.date).toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!notif.read ? (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="px-2.5 py-1 text-[10px] font-bold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/50 rounded-md bg-transparent transition-all cursor-pointer"
                  >
                    Marcar lida
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Lida
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
