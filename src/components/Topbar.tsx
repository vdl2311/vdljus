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
  const getTabTitle = (): { title: string; subtitle?: string } => {
    switch (activeTab) {
      case "principal.dashboard":
        return { title: "Painel de Controle Inteligente", subtitle: "Visão geral e métricas" };
      case "principal.copiloto":
        return { title: "Copiloto Jurídico IA", subtitle: "Assistência em tempo real" };
      case "operacao.processos":
        return { title: "Gestão de Processos Judiciais", subtitle: "Processos ativos e históricos" };
      case "operacao.processo_detalhe":
        return { title: "Detalhes do Processo & Timeline", subtitle: "Histórico completo" };
      case "operacao.datajud":
        return { title: "Consulta DataJud (CNJ)", subtitle: "Integração e busca" };
      case "operacao.prazos":
        return { title: "Central de Prazos e Vencimentos", subtitle: "Controle de prazos" };
      case "operacao.agenda":
        return { title: "Agenda de Compromissos e Audiências", subtitle: "Audiências e reuniões" };
      case "operacao.tarefas":
        return { title: "Tarefas", subtitle: "Kanban da equipe" };
      case "documentos.ia":
        return { title: "IA Jurídica: Redação e Revisão", subtitle: "Redação e revisão" };
      case "documentos.agentes":
        return { title: "Agentes Autônomos IA", subtitle: "Automação cognitiva" };
      case "documentos.contratos":
        return { title: "Contratos & Modelos Dinâmicos", subtitle: "Gestão de minutas" };
      case "documentos.conhecimento":
        return { title: "Base de Conhecimento Compartilhada", subtitle: "Artigos e jurisprudência" };
      case "gestao.clientes":
        return { title: "CRM Jurídico - Clientes PF e PJ", subtitle: "Clientes PF e PJ" };
      case "gestao.financeiro":
        return { title: "Gestão Financeira & Honorários", subtitle: "Honorários e faturamento" };
      case "gestao.automacoes":
        return { title: "Automações e Gatilhos de Workflows", subtitle: "Gatilhos de Workflows" };
      case "gestao.compliance":
        return { title: "Compliance & Auditoria OAB/LGPD", subtitle: "Auditoria OAB/LGPD" };
      case "gestao.conflitos":
        return { title: "Pesquisa de Conflito de Interesse", subtitle: "Pesquisa preventiva" };
      case "gestao.relatorios":
        return { title: "Relatórios de Performance & Analytics", subtitle: "Métricas e analytics" };
      case "gestao.equipe":
        return { title: "Equipe", subtitle: "Usuários, cargos e permissões" };
      case "gestao.admin":
        return { title: "Painel Administrativo do Escritório", subtitle: "Configurações do escritório" };
      case "gestao.notificacoes":
        return { title: "Notificações", subtitle: "Alertas do sistema" };
      case "cliente.portal":
        return { title: "Portal Externo do Cliente", subtitle: "Área do cliente" };
      default:
        return { title: "JusFlow" };
    }
  };
  const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <div className="h-16 border-b flex items-center justify-between px-3 sm:px-6 bg-background/80 backdrop-blur-md border-border transition-colors z-20 shrink-0 sticky top-0">
      {" "}
      {/* Title / Context Indicator */}{" "}
      <div className="flex items-center gap-2 sm:gap-3">
        {" "}
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground shrink-0"
            title="Abrir Menu"
          >
            {" "}
            <Menu className="w-5 h-5" />{" "}
          </button>
        )}{" "}
        <div className="flex flex-col text-left">
          <h1 className="text-xs sm:text-base font-bold text-foreground font-sans tracking-tight truncate max-w-[110px] xxs:max-w-[140px] xs:max-w-[180px] sm:max-w-none leading-tight">
            {getTabTitle().title}
          </h1>
          {getTabTitle().subtitle && (
            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-none mt-0.5">
              {getTabTitle().subtitle}
            </span>
          )}
        </div>{" "}
        <div className="hidden sm:inline-flex items-center bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md">
          {" "}
          v2.4.0 Live{" "}
        </div>{" "}
        {firebaseConnected ? (
          <div
            className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-md"
            title="Firebase Firestore conectado em tempo real"
          >
            {" "}
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
            Sincronizado{" "}
          </div>
        ) : (
          <div
            className="hidden sm:inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-md"
            title="Conectando ao Firebase..."
          >
            {" "}
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />{" "}
            Conectando...{" "}
          </div>
        )}{" "}
      </div>{" "}
      {/* Actions */}{" "}
      <div className="flex items-center gap-1.5 sm:gap-4">
        {" "}
        {/* Global Search trigger */}{" "}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 p-2 xs:px-3 xs:py-1.5 text-xs text-muted-foreground hover:text-foreground border border-input rounded-md bg-transparent hover:bg-accent hover:text-accent-foreground transition-all shadow-xs w-9 xs:w-36 sm:w-48 text-left justify-center xs:justify-start shrink-0"
        >
          {" "}
          <Search className="w-4 h-4 xs:w-3.5 xs:h-3.5" />{" "}
          <span className="hidden xs:inline flex-1">Pesquisar...</span>{" "}
          <kbd className="hidden sm:inline-block px-1 bg-muted rounded text-[10px] font-mono">
            {" "}
            ⌘K{" "}
          </kbd>{" "}
        </button>{" "}
        {/* Quick Copiloto Floating Switch */}{" "}
        <button
          onClick={() => setActiveTab("principal.copiloto")}
          title="Falar com Copiloto"
          className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors relative"
        >
          {" "}
          <MessageSquareShare className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />{" "}
          <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full animate-ping" />{" "}
        </button>{" "}
        {/* Theme Switcher */}{" "}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          title="Alternar Tema"
          className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
        >
          {" "}
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}{" "}
        </button>{" "}
        {/* Notification Center Center */}{" "}
        <div className="relative">
          {" "}
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsUserMenuOpen(false);
            }}
            className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors relative"
          >
            {" "}
            <Bell className="w-5 h-5" />{" "}
            {unreadCount > 0 && (
              <span aria-label={`${unreadCount} notificações não lidas`} className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {" "}
                {unreadCount}{" "}
              </span>
            )}{" "}
          </button>{" "}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              {" "}
              <div className="p-3 border-b border-border flex justify-between items-center bg-muted/50 /20">
                {" "}
                <span className="text-xs font-bold text-card-foreground">
                  Central de Alertas
                </span>{" "}
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllNotificationsRead();
                      setIsNotifOpen(false);
                    }}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    {" "}
                    <CheckCheck className="w-3 h-3" /> Limpar tudo{" "}
                  </button>
                )}{" "}
              </div>{" "}
              <div className="max-h-64 overflow-y-auto divide-y divide-border/50 dark:divide-border">
                {" "}
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    {" "}
                    Nenhuma notificação encontrada.{" "}
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
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-muted dark:hover:bg-accent hover:text-accent-foreground/50 ${!n.read ? "bg-muted/80 /10 font-medium" : ""}`}
                      >
                        {" "}
                        <div className="flex gap-2 items-start">
                          {" "}
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${color}`}
                          >
                            {" "}
                            {n.type}{" "}
                          </span>{" "}
                          <div className="flex-1 min-w-0">
                            {" "}
                            <p className="text-xs text-card-foreground truncate">
                              {n.title}
                            </p>{" "}
                            <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                              {n.message}
                            </p>{" "}
                          </div>{" "}
                          {!n.read && (
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                          )}{" "}
                        </div>{" "}
                      </div>
                    );
                  })
                )}{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* User Account / Profile Menu */}{" "}
        <div className="relative">
          {" "}
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {" "}
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shadow-md">
              {" "}
              {currentUser?.name.charAt(3) || "A"}{" "}
            </div>{" "}
            <div className="hidden md:flex flex-col text-left">
              {" "}
              <span className="text-xs font-semibold text-card-foreground leading-tight">
                {" "}
                {currentUser?.name || "Dr. André JusFlow"}{" "}
              </span>{" "}
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                {" "}
                OAB: {currentUser?.oab || "SP123456"}{" "}
              </span>{" "}
            </div>{" "}
          </button>{" "}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-border/50 dark:divide-border">
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
