import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import { exportAllDataToExcel, exportAllDataToPDF } from "../../lib/dataExporter";
import {
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Download,
  Database,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Info,
  Trash2,
  RefreshCw,
  AlertTriangle,
  X,
} from "lucide-react";

export const DataPortabilitySection: React.FC<{
  title?: string;
  description?: string;
  compact?: boolean;
}> = ({
  title = "Portabilidade Integral & Exportação de Dados (Lock-in Zero)",
  description = "Exportação irrestrita de todos os cadastros, processos, movimentações, honorários e logs de auditoria nos formatos universais Excel (.xlsx) e PDF.",
  compact = false,
}) => {
  const {
    clients,
    processes,
    financials,
    deadlines,
    tasks,
    events,
    documents,
    teamMembers,
    auditLogs,
    resetToProductionMode,
  } = useJusFlow();

  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      exportAllDataToExcel({
        officeName: "JusFlow Advocacia Associados",
        clients,
        processes,
        financials,
        deadlines,
        tasks,
        events,
        documents,
        teamMembers,
        auditLogs,
      });
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportAllDataToPDF({
        officeName: "JusFlow Advocacia Associados",
        clients,
        processes,
        financials,
        deadlines,
        tasks,
        events,
        documents,
        teamMembers,
        auditLogs,
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await resetToProductionMode();
      setShowResetModal(false);
    } finally {
      setIsResetting(false);
    }
  };

  if (compact) {
    return (
      <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-foreground">
              Exportação do Banco de Dados
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
            Lock-in Zero
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Garantia de custódia total: Baixe todo o acervo do escritório em Excel e PDF com 1 clique.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel (.xlsx)
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex-1 py-1.5 px-3 bg-card border border-border hover:bg-accent text-foreground rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            Dossiê PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl shadow-sm text-left space-y-5">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> LGPD Art. 18, V Compliant
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-background border border-border rounded-lg space-y-1">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
            Clientes Cadastrados
          </span>
          <span className="text-base font-extrabold text-foreground">
            {clients.length}
          </span>
          <span className="text-[10px] text-emerald-600 block">PF & PJ Exportáveis</span>
        </div>
        <div className="p-3 bg-background border border-border rounded-lg space-y-1">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
            Processos Judiciais
          </span>
          <span className="text-base font-extrabold text-foreground">
            {processes.length}
          </span>
          <span className="text-[10px] text-blue-600 block">Acervo com CNJ</span>
        </div>
        <div className="p-3 bg-background border border-border rounded-lg space-y-1">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
            Lançamentos Financeiros
          </span>
          <span className="text-base font-extrabold text-foreground">
            {financials.length}
          </span>
          <span className="text-[10px] text-emerald-600 block">Honorários e Custas</span>
        </div>
        <div className="p-3 bg-background border border-border rounded-lg space-y-1">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
            Prazos & Agenda
          </span>
          <span className="text-base font-extrabold text-foreground">
            {deadlines.length + events.length}
          </span>
          <span className="text-[10px] text-amber-600 block">Compromissos OAB</span>
        </div>
      </div>

      {/* Security Statement for Prospective Buyers */}
      <div className="p-4 bg-muted/50 border border-border rounded-lg flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-foreground block">
            Segurança de Investimento para o Novo Proprietário
          </span>
          <p className="text-[11px]">
            Caso o comprador decida não dar continuidade ao contrato do sistema no futuro, a plataforma assegura por termo formal de contrato que <strong>todos os dados do escritório podem ser baixados a qualquer momento</strong> sem retenção, garantindo 100% da propriedade intelectual dos registros jurídicos e financeiros.
          </p>
        </div>
      </div>

      {/* Actions buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleExportExcel}
          disabled={isExportingExcel}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 cursor-pointer disabled:opacity-50"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {isExportingExcel ? "Exportando Excel..." : "Exportar Tudo para Excel (.xlsx)"}
        </button>

        <button
          type="button"
          onClick={handleExportPDF}
          disabled={isExportingPDF}
          className="w-full sm:w-auto px-5 py-2.5 bg-card border border-border hover:bg-accent text-card-foreground font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <FileText className="w-4 h-4 text-rose-500" />
          {isExportingPDF ? "Gerando Dossiê PDF..." : "Exportar Dossiê Completo (PDF)"}
        </button>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          disabled={isResetting}
          title="Apaga quaisquer dados de teste para deixar a base pronta para o uso real do cliente"
          className="w-full sm:w-auto px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          {isResetting ? "Redefinindo..." : "Iniciar Base Limpa (Produção)"}
        </button>

        <span className="text-[11px] text-muted-foreground flex items-center gap-1 sm:ml-auto">
          <Lock className="w-3.5 h-3.5 text-emerald-500" /> Criptografia de Ponta a Ponta Ativa
        </span>
      </div>

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-base">
                <div className="p-2 bg-rose-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <h3>Redefinir Base para Produção</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="p-1 hover:bg-accent rounded-md text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Deseja realmente redefinir a base de dados para o <strong>Modo Produção Limpo</strong>?
              Todos os cadastros, processos, prazos, tarefas e lançamentos financeiros de teste serão permanently apagados para que o usuário final possa iniciar o sistema totalmente zerado.
            </p>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-700 dark:text-amber-300 font-medium leading-normal">
              Esta ação limpa o cache local e synchronized collections para inicialização imediata.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Limpando Base...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Sim, Zerar Base de Dados
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
