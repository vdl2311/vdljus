import React, { useState } from "react";
import { useJusFlow } from "../store/JusFlowContext";
import {
  Bell,
  Search,
  MessageSquareShare,
  Sun,
  Moon,
  LogOut,
  User,
  Key,
  ShieldCheck,
  CheckCheck,
  Menu,
  Sparkles,
} from "lucide-react";
export const Topbar: React.FC<{
  onLogout: () => void;
  onToggleMobileSidebar?: () => void;
}> = ({ onLogout, onToggleMobileSidebar }) => {
  const {
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    firebaseConnected,
  } = useJusFlow();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Derive title from activeTab
  
  const getTabTitle = () => {
    switch (activeTab) {
      case "principal.dashboard":
        return "Dashboard";
      case "principal.copiloto":
        return "Copiloto IA";
      case "operacao.processos":
        return "Processos";
      case "operacao.processo_detalhe":
        return "Processo Detalhe";
      case "operacao.datajud":
        return "DataJud (CNJ)";
      case "operacao.prazos":
        return "Prazos";
      case "operacao.agenda":
        return "Agenda";
      case "operacao.tarefas":
        return "Tarefas";
      case "documentos.ia":
        return "IA Jurídica";
      case "documentos.agentes":
        return "Agentes IA";
      case "documentos.contratos":
        return "Contratos";
      case "documentos.conhecimento":
        return "Conhecimento";
      case "gestao.clientes":
        return "Clientes";
      case "gestao.financeiro":
        return "Financeiro";
      case "gestao.automacoes":
        return "Automações";
      case "gestao.compliance":
        return "Conformidade";
      case "gestao.notificacoes":
        return "Notificações";
      case "gestao.conflitos":
        return "Conflitos";
      case "gestao.relatorios":
        return "Relatórios";
      case "gestao.equipe":
        return "Equipe";
      case "gestao.admin":
        return "Administração";
      case "cliente.portal":
        return "Portal do Cliente";
      default:
        return "JusFlow";
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case "principal.dashboard":
        return "Visão acionável do seu escritório";
      case "principal.copiloto":
        return "Fale com o copiloto inteligente";
      case "operacao.processos":
        return "Registre e acompanhe as ações judiciais integradas ao DataJud.";
      case "operacao.processo_detalhe":
        return "Visualize andamentos, histórico e linha do tempo do processo.";
      case "operacao.datajud":
        return "Consulte andamentos processuais diretamente no CNJ.";
      case "operacao.prazos":
        return "Monitore e controle prazos fatais e audiências.";
      case "operacao.agenda":
        return "Visualize compromissos e audiências do seu escritório.";
      case "operacao.tarefas":
        return "Gerencie fluxos de trabalho e tarefas da equipe.";
      case "documentos.ia":
        return "Gere petições, contratos e pareceres com inteligência artificial.";
      case "documentos.agentes":
        return "Acompanhe a execução dos agentes de IA.";
      case "documentos.contratos":
        return "Organize os contratos e modelos do escritório.";
      case "documentos.conhecimento":
        return "Consulte jurisprudências, doutrinas e teses salvas.";
      case "gestao.clientes":
        return "Gerencie a carteira de clientes e leads.";
      case "gestao.financeiro":
        return "Controle de lançamentos, honorários e fluxo de caixa.";
      case "gestao.automacoes":
        return "Configure regras automáticas de fluxos e notificações.";
      case "gestao.compliance":
        return "Audite riscos de conformidade OAB e segurança LGPD.";
      case "gestao.conflitos":
        return "Evite impedimentos e conflito de interesse antes de contratar.";
      case "gestao.relatorios":
        return "Consolide métricas de produtividade e faturamento.";
      case "gestao.equipe":
        return "Gerencie os membros do seu escritório e suas credenciais.";
      case "gestao.admin":
        return "Configure preferências gerais e dados da sociedade.";
      case "gestao.notificacoes":
        return "Veja todos os alertas e notificações do sistema.";
      case "cliente.portal":
        return "Área exclusiva para acompanhamento do cliente final.";
      default:
        return "Plataforma Jurídica Inteligente";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getInitials = (name: string) => {
    const cleanName = name.replace(/[()]/g, "");
    const parts = cleanName.split(" ").filter(Boolean);
    if (parts.length === 0) return "A";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  const initials = currentUser ? getInitials(currentUser.name) : "AV";

  return (
    <div className="h-16 border-b flex items-center justify-between px-3 sm:px-6 bg-background/80 backdrop-blur-md border-border transition-colors z-20 shrink-0 sticky top-0">
      
      {/* Title / Context Indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground shrink-0"
            title="Abrir Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex flex-col text-left">
          <h1 className="text-sm sm:text-lg font-bold text-foreground font-sans tracking-tight leading-tight">
            {getTabTitle()}
          </h1>
          <p className="hidden xs:block text-[10px] sm:text-xs text-muted-foreground font-medium leading-none mt-0.5">
            {getTabSubtitle()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-4">
        
        {/* Global Search trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 h-9 px-3 text-sm text-muted-foreground bg-transparent dark:bg-input/30 border border-input rounded-md hover:bg-muted/50 transition-all w-36 sm:w-64 text-left cursor-pointer focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none"
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-muted-foreground hidden xxs:inline">Buscar em tudo...</span>
          <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 bg-muted rounded-[4px] text-[10px] font-mono text-muted-foreground font-medium">
            ⌘K
          </kbd>
        </button>

        {/* Quick Copiloto Button */}
        <button
          onClick={() => setActiveTab("principal.copiloto")}
          className="flex items-center justify-center gap-2 h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-all shadow-xs cursor-pointer shrink-0 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="hidden xs:inline">Copiloto</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          title="Alternar Tema"
          className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
        </button>

        {/* Notification Center Center */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsUserMenuOpen(false);
            }}
            className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-border flex justify-between items-center bg-muted/50">
                <span className="text-xs font-bold text-card-foreground">
                  Central de Alertas
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllNotificationsRead();
                      setIsNotifOpen(false);
                    }}
                    className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <CheckCheck className="w-3 h-3" /> Limpar tudo
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    Nenhuma notificação encontrada.
                  </div>
                ) : (
                  notifications.map((n) => {
                    let color = "bg-muted text-muted-foreground";
                    if (n.type === "deadline")
                      color =
                        "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400";
                    if (n.type === "financial")
                      color =
                        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400";
                    if (n.type === "hearing")
                      color =
                        "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400";
                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.type === "deadline")
                            setActiveTab("operacao.prazos");
                          if (n.type === "financial")
                            setActiveTab("gestao.financeiro");
                          if (n.type === "hearing")
                            setActiveTab("operacao.agenda");
                          setIsNotifOpen(false);
                        }}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/50 ${!n.read ? "bg-muted/80 font-medium" : ""}`}
                      >
                        <div className="flex gap-2 items-start">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 mt-0.5 ${color}`}
                          >
                            {n.type}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-card-foreground truncate">
                              {n.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                              {n.message}
                            </p>
                          </div>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0 mt-1.5" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-sm text-xs">
              {initials}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-card-foreground leading-none">
                {currentUser?.name || "Administrador (Vidal)"}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium mt-0.5 leading-none">
                {currentUser?.role === "admin" ? "Admin" : currentUser?.role || "Usuário"}
              </span>
            </div>
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {" "}
              <div className="p-3 text-left">
                {" "}
                <span className="text-xs block text-muted-foreground font-semibold">
                  Logado como:
                </span>{" "}
                <span className="text-xs font-bold text-card-foreground">
                  {currentUser?.email}
                </span>{" "}
                <span className="text-[10px] block mt-1 px-1.5 py-0.5 rounded font-bold uppercase bg-muted text-muted-foreground w-max">
                  {" "}
                  {currentUser?.role.toUpperCase()}{" "}
                </span>{" "}
              </div>{" "}
              <div className="py-1">
                {" "}
                <button
                  onClick={() => {
                    setActiveTab("gestao.equipe");
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/50 flex items-center gap-2"
                >
                  {" "}
                  <User className="w-4 h-4" /> Minha Conta{" "}
                </button>{" "}
                <button
                  onClick={() => {
                    setActiveTab("gestao.compliance");
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/50 flex items-center gap-2"
                >
                  {" "}
                  <ShieldCheck className="w-4 h-4" /> Security Rules{" "}
                </button>{" "}
              </div>{" "}
              <div className="py-1">
                {" "}
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 font-semibold"
                >
                  {" "}
                  <LogOut className="w-4 h-4" /> Sair da Plataforma{" "}
                </button>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
