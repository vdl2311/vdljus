import React, { useState } from "react";
import { useJusFlow } from "../store/JusFlowContext";
import { hasPermission } from "../lib/permissions";
import {
  LayoutDashboard,
  MessageSquare,
  Scale,
  Landmark,
  AlarmClock,
  Calendar,
  Kanban,
  Sparkles,
  Bot,
  FileText,
  Library,
  Users,
  DollarSign,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  UserCheck,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkle,
  HelpCircle,
  BookOpen,
  Folder,
  Cloud,
  CheckSquare,
  Zap,
  Book,
  Bell,
  ShieldAlert,
  UserPlus,
  Globe,
  X,
} from "lucide-react";
export const Sidebar: React.FC<{
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}> = ({ isOpenOnMobile, onCloseMobile }) => {
  const { activeTab, setActiveTab, theme, currentUser } = useJusFlow();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    principal: true,
    operacao: true,
    documentos: true,
    gestao: true,
    cliente: true,
  });
  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };
  const groups = [
    {
      id: "principal",
      label: "PRINCIPAL",
      items: [
        {
          id: "principal.dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          id: "principal.copiloto",
          label: "Copiloto IA",
          icon: Sparkles,
        },
        {
          id: "documentos.ia",
          label: "IA Jurídica",
          icon: BookOpen,
        },
        {
          id: "documentos.agentes",
          label: "Agentes IA",
          icon: Bot,
        },
      ],
    },
    {
      id: "operacao",
      label: "OPERAÇÃO",
      items: [
        { id: "operacao.processos", label: "Processos", icon: Folder },
        { id: "operacao.datajud", label: "DataJud (CNJ)", icon: Cloud },
        { id: "operacao.agenda", label: "Agenda", icon: Calendar },
        { id: "operacao.prazos", label: "Prazos", icon: AlarmClock },
        { id: "operacao.tarefas", label: "Tarefas", icon: CheckSquare },
      ],
    },
    {
      id: "documentos",
      label: "DOCUMENTOS",
      items: [
        { id: "documentos.contratos", label: "Contratos", icon: FileText },
      ],
    },
    {
      id: "gestao",
      label: "GESTÃO",
      items: [
        { id: "gestao.clientes", label: "Clientes", icon: Users },
        { id: "gestao.financeiro", label: "Financeiro", icon: DollarSign },
        { id: "gestao.automacoes", label: "Automações", icon: Zap },
        { id: "documentos.conhecimento", label: "Conhecimento", icon: Book },
        { id: "gestao.compliance", label: "Conformidade", icon: ShieldCheck },
        { id: "gestao.notificacoes", label: "Notificações", icon: Bell },
        { id: "gestao.conflitos", label: "Conflitos", icon: ShieldAlert },
        { id: "gestao.relatorios", label: "Relatórios", icon: BarChart3 },
        { id: "gestao.equipe", label: "Equipe", icon: UserPlus },
        { id: "gestao.admin", label: "Administração", icon: Settings },
      ],
    },
    {
      id: "cliente",
      label: "CLIENTE",
      items: [
        { id: "cliente.portal", label: "Portal do Cliente", icon: Globe },
      ],
    },
  ];
  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}
      <aside
        role="navigation"
        className={`fixed inset-y-0 left-0 z-50 md:relative flex flex-col border-r h-screen transition-all duration-300 select-none bg-card border-border text-muted-foreground ${isCollapsed ? "w-16" : "w-64"} ${isOpenOnMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
          <button 
            onClick={() => handleTabClick("principal.dashboard")}
            className="flex items-center gap-2.5 overflow-hidden text-left cursor-pointer hover:opacity-80 transition-opacity"
            title="Ir para a página inicial"
          >
            <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-emerald-600 dark:bg-emerald-700 text-white shrink-0 shadow-md">
              <Scale className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-sans text-sm font-bold tracking-tight text-foreground leading-tight">
                  JusFlow
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Plataforma Jurídica
                </span>
              </div>
            )}
          </button>
          {/* Close / Collapse toggler */}
          <div className="flex items-center gap-1">
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 hover:bg-accent hover:text-accent-foreground rounded-lg text-muted-foreground transition-colors"
                title="Fechar Menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center w-6 h-6 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4 no-scrollbar">
          {groups.map((group) => {
            const allowedItems = group.items.filter((item) =>
              hasPermission(item.id, currentUser)
            );
            if (allowedItems.length === 0) return null;

            const isOpen = openGroups[group.id];
            const hasActiveChild = allowedItems.some((item) =>
              activeTab === item.id || (item.id === "documentos.ia_alternativo" && activeTab === "documentos.ia")
            );
            if (isCollapsed) {
              return (
                <div
                  key={group.id}
                  className="flex flex-col gap-1 items-center"
                >
                  {allowedItems.map((item) => {
                    const isActive =
                      activeTab === item.id ||
                      (item.id === "documentos.ia_alternativo" && activeTab === "documentos.ia") ||
                      (item.id === "operacao.processos" &&
                        activeTab === "operacao.processo_detalhe");
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => handleTabClick(item.id === "documentos.ia_alternativo" ? "documentos.ia" : item.id)}
                        title={item.label}
                        className={`p-2.5 rounded-md transition-all relative group ${isActive ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold" : "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"}`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`} /> {/* Tooltip */}
                        <span className="absolute left-14 scale-0 group-hover:scale-100 transition-all rounded-md bg-foreground text-background text-xs py-1 px-2 z-50 whitespace-nowrap shadow-xl">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            }
            return (
              <div key={group.id} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`flex items-center justify-between w-full px-2 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors rounded-md ${hasActiveChild ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground hover:text-muted-foreground"}`}
                >
                  <span>{group.label}</span>
                  <span className="text-xs opacity-75">
                    {isOpen ? "▼" : "▶"}
                  </span>
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-0.5 pl-1.5 mt-1">
                    {allowedItems.map((item) => {
                      const isActive =
                        activeTab === item.id ||
                        (item.id === "documentos.ia_alternativo" && activeTab === "documentos.ia") ||
                        (item.id === "operacao.processos" &&
                          activeTab === "operacao.processo_detalhe");
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => handleTabClick(item.id === "documentos.ia_alternativo" ? "documentos.ia" : item.id)}
                          className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${isActive ? "bg-[#eaf6f0] dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold" : "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"}`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                          />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Footer / Account Status */}
        <div className="p-3 border-t border-border bg-background/40 shrink-0">
          {!isCollapsed ? (
            <div className="space-y-3">
              {/* Green Promo Card */}
              <div className="bg-[#f0fdf4] dark:bg-emerald-950/25 border border-emerald-100/50 dark:border-emerald-900/40 rounded-xl p-3 text-left">
                <div className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                  Plano Pro • Trial
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  14 dias restantes • SaaS multi-escritório
                </div>
              </div>

              {/* Collapse button */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Recolher</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {/* Small status dot/badge for collapsed */}
              <div
                className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400"
                title="Pro Trial - 14 dias"
              >
                <Sparkle className="w-4 h-4 animate-pulse" />
              </div>

              {/* Expand button */}
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg transition-all cursor-pointer"
                title="Expandir Menu"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
