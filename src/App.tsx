import React from "react";
import { Toaster } from "sonner";
import { JusFlowProvider, useJusFlow } from "./store/JusFlowContext";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { LoginScreen } from "./components/LoginScreen";
import { CommandPalette } from "./components/CommandPalette";

// Import all 22 modules
import { DashboardView } from "./components/dashboard/DashboardView";
import { CopilotoView } from "./components/principal/CopilotoView";
import { ProcessosView } from "./components/operacao/ProcessosView";
import { ProcessoDetalheView } from "./components/operacao/ProcessoDetalheView";
import { DataJudView } from "./components/operacao/DataJudView";
import { PrazosView } from "./components/operacao/PrazosView";
import { AgendaView } from "./components/operacao/AgendaView";
import { TarefasView } from "./components/operacao/TarefasView";
import { IaDocumentosView } from "./components/documentos/IaDocumentosView";
import { AgentesView } from "./components/documentos/AgentesView";
import { ContratosView } from "./components/documentos/ContratosView";
import { ConhecimentoView } from "./components/documentos/ConhecimentoView";
import { ClientesCRMView } from "./components/gestao/ClientesCRMView";
import { FinanceiroView } from "./components/gestao/FinanceiroView";
import { AutomacoesView } from "./components/gestao/AutomacoesView";
import { ComplianceView } from "./components/gestao/ComplianceView";
import { ConflitoInteresseView } from "./components/gestao/ConflitoInteresseView";
import { RelatoriosAnalyticsView } from "./components/gestao/RelatoriosAnalyticsView";
import { EquipeView } from "./components/gestao/EquipeView";
import { AdminOfficeView } from "./components/gestao/AdminOfficeView";
import { NotificacoesView } from "./components/gestao/NotificacoesView";
import { PortalClienteView } from "./components/cliente/PortalClienteView";
import { SuporteView } from "./components/cliente/SuporteView";

const AppContent: React.FC = () => {
  const { activeTab, currentUser, setCurrentUser } = useJusFlow();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Render the matching module based on activeTab
  const renderActiveView = () => {
    switch (activeTab) {
      case "principal.dashboard":
        return <DashboardView />;
      case "principal.copiloto":
        return <CopilotoView />;
      case "operacao.processos":
        return <ProcessosView />;
      case "operacao.processo_detalhe":
        return <ProcessoDetalheView />;
      case "operacao.datajud":
        return <DataJudView />;
      case "operacao.prazos":
        return <PrazosView />;
      case "operacao.agenda":
        return <AgendaView />;
      case "operacao.tarefas":
        return <TarefasView />;
      case "documentos.ia":
        return <IaDocumentosView />;
      case "documentos.agentes":
        return <AgentesView />;
      case "documentos.contratos":
        return <ContratosView />;
      case "documentos.conhecimento":
        return <ConhecimentoView />;
      case "gestao.clientes":
        return <ClientesCRMView />;
      case "gestao.financeiro":
        return <FinanceiroView />;
      case "gestao.automacoes":
        return <AutomacoesView />;
      case "gestao.compliance":
        return <ComplianceView />;
      case "gestao.conflitos":
        return <ConflitoInteresseView />;
      case "gestao.relatorios":
        return <RelatoriosAnalyticsView />;
      case "gestao.equipe":
        return <EquipeView />;
      case "gestao.admin":
        return <AdminOfficeView />;
      case "gestao.notificacoes":
        return <NotificacoesView />;
      case "cliente.portal":
        return <PortalClienteView />;
      case "cliente.suporte":
        return <SuporteView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors">
      {/* Skip Navigation Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
        Pular para o conteúdo principal
      </a>

      {/* Sidebar Navigation */}
      <Sidebar isOpenOnMobile={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Topbar Header */}
        <Topbar onLogout={() => setCurrentUser(null)} onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Dynamic View Panel */}
        <main id="main-content" className="flex-1 overflow-hidden relative w-full max-w-[1600px] mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Ctrl+K Search Palette */}
      <CommandPalette />
      
      {/* Toast Notifications */}
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
};

export default function App() {
  return (
    <JusFlowProvider>
      <AppContent />
    </JusFlowProvider>
  );
}
