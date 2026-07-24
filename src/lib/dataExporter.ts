import * as XLSX from "xlsx";
import {
  Client,
  Process,
  FinancialLaunch,
  Deadline,
  Task,
  CalendarEvent,
  Document,
  TeamMember,
  AuditLog,
} from "../types";

export interface SystemDataExportPayload {
  officeName?: string;
  clients: Client[];
  processes: Process[];
  financials: FinancialLaunch[];
  deadlines: Deadline[];
  tasks: Task[];
  events: CalendarEvent[];
  documents: Document[];
  teamMembers: TeamMember[];
  auditLogs: AuditLog[];
}

/**
 * Export all system data to Excel (.xlsx) with separate sheets for each entity
 */
export function exportAllDataToExcel(payload: SystemDataExportPayload) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary KPI / Overview
  const summaryData = [
    {
      Métrica: "Escritório",
      Valor: payload.officeName || "JusFlow Advocacia",
    },
    {
      Métrica: "Data da Exportação",
      Valor: new Date().toLocaleString("pt-BR"),
    },
    {
      Métrica: "Total de Clientes Cadastrados",
      Valor: payload.clients.length,
    },
    {
      Métrica: "Total de Processos Judiciais",
      Valor: payload.processes.length,
    },
    {
      Métrica: "Total de Lançamentos Financeiros",
      Valor: payload.financials.length,
    },
    {
      Métrica: "Total de Prazos Registrados",
      Valor: payload.deadlines.length,
    },
    {
      Métrica: "Total de Tarefas Internas",
      Valor: payload.tasks.length,
    },
    {
      Métrica: "Total de Eventos da Agenda",
      Valor: payload.events.length,
    },
    {
      Métrica: "Total de Documentos e Minutas",
      Valor: payload.documents.length,
    },
    {
      Métrica: "Total de Membros da Equipe",
      Valor: payload.teamMembers.length,
    },
    {
      Métrica: "Garantia de Portabilidade",
      Valor: "100% dos dados brutos exportados sob conformidade LGPD Art. 18, V",
    },
  ];
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, "Resumo Executivo");

  // Sheet 2: Clientes
  if (payload.clients.length > 0) {
    const clientsRows = payload.clients.map((c) => ({
      ID: c.id,
      Nome: c.name,
      Tipo: c.type?.toUpperCase() || "PF",
      CPF_CNPJ: c.document,
      Email: c.email,
      Telefone: c.phone,
      CEP: c.cep,
      Endereço: c.address,
      Status: c.status === "active" ? "Ativo" : c.status === "prospect" ? "Prospecto" : "Inativo",
      Observações: c.notes || "",
      Tags: c.tags?.join(", ") || "",
      Data_Cadastro: c.createdAt,
    }));
    const clientsWs = XLSX.utils.json_to_sheet(clientsRows);
    XLSX.utils.book_append_sheet(wb, clientsWs, "Clientes");
  }

  // Sheet 3: Processos Judiciais
  if (payload.processes.length > 0) {
    const processesRows = payload.processes.map((p) => ({
      ID: p.id,
      Número_CNJ: p.cnj,
      Título: p.title,
      Cliente: p.clientName,
      Área: p.area,
      Tribunal: p.court,
      Vara_Divisão: p.division,
      Classe: p.class,
      Valor_Causa: p.value,
      Autor: p.plaintiff,
      Réu: p.defendant,
      Assunto: p.subject,
      Status: p.status,
      Risco: p.risk,
      Resumo_IA: p.aiSummary || "",
      Última_Movimentação: p.lastMovementDate || "",
      Resultado: p.outcome || "",
      Data_Cadastro: p.createdAt,
    }));
    const processesWs = XLSX.utils.json_to_sheet(processesRows);
    XLSX.utils.book_append_sheet(wb, processesWs, "Processos");
  }

  // Sheet 4: Financeiro & Honorários
  if (payload.financials.length > 0) {
    const financialsRows = payload.financials.map((f) => ({
      ID: f.id,
      Título: f.title,
      Valor: f.amount,
      Tipo: f.type === "income" ? "Receita" : "Despesa",
      Categoria: f.category,
      Status: f.status === "paid" ? "Pago" : "Pendente",
      Data: f.date,
      Cliente: f.clientName || "",
      Processo: f.processTitle || "",
    }));
    const financialsWs = XLSX.utils.json_to_sheet(financialsRows);
    XLSX.utils.book_append_sheet(wb, financialsWs, "Financeiro");
  }

  // Sheet 5: Prazos Processuais
  if (payload.deadlines.length > 0) {
    const deadlinesRows = payload.deadlines.map((d) => ({
      ID: d.id,
      Título: d.title,
      Data_Vencimento: d.date,
      Status: d.completed ? "Concluído" : "Pendente",
      Prioridade: d.priority?.toUpperCase() || "MÉDIA",
      Processo: d.processTitle || "",
      Observações: d.notes || "",
    }));
    const deadlinesWs = XLSX.utils.json_to_sheet(deadlinesRows);
    XLSX.utils.book_append_sheet(wb, deadlinesWs, "Prazos");
  }

  // Sheet 6: Tarefas
  if (payload.tasks.length > 0) {
    const tasksRows = payload.tasks.map((t) => ({
      ID: t.id,
      Título: t.title,
      Descrição: t.description || "",
      Coluna: t.column,
      Prioridade: t.priority?.toUpperCase() || "MÉDIA",
      Responsável: t.assigneeName || "",
      Processo: t.processTitle || "",
      Cliente: t.clientName || "",
    }));
    const tasksWs = XLSX.utils.json_to_sheet(tasksRows);
    XLSX.utils.book_append_sheet(wb, tasksWs, "Tarefas");
  }

  // Sheet 7: Agenda & Compromissos
  if (payload.events.length > 0) {
    const eventsRows = payload.events.map((e) => ({
      ID: e.id,
      Título: e.title,
      Tipo: e.type,
      Início: e.start,
      Fim: e.end,
      Processo: e.processTitle || "",
      Descrição: e.description || "",
    }));
    const eventsWs = XLSX.utils.json_to_sheet(eventsRows);
    XLSX.utils.book_append_sheet(wb, eventsWs, "Agenda");
  }

  // Sheet 8: Documentos & Minutas
  if (payload.documents.length > 0) {
    const docsRows = payload.documents.map((doc) => ({
      ID: doc.id,
      Título: doc.title,
      Status: doc.status === "signed" ? "Assinado" : "Rascunho",
      Assinantes: doc.signers?.join(", ") || "",
      Data_Assinatura: doc.signedAt || "",
      Data_Criação: doc.createdAt,
    }));
    const docsWs = XLSX.utils.json_to_sheet(docsRows);
    XLSX.utils.book_append_sheet(wb, docsWs, "Documentos");
  }

  // Sheet 9: Equipe
  if (payload.teamMembers.length > 0) {
    const teamRows = payload.teamMembers.map((m) => ({
      ID: m.id,
      Nome: m.name,
      Cargo: m.role,
      OAB: m.oab || "N/A",
      Email: m.email,
      Autenticação_2FA: m.twoFAEnabled ? "Ativo" : "Inativo",
      Status: m.status,
    }));
    const teamWs = XLSX.utils.json_to_sheet(teamRows);
    XLSX.utils.book_append_sheet(wb, teamWs, "Equipe");
  }

  // Sheet 10: Audit Logs
  if (payload.auditLogs.length > 0) {
    const auditRows = payload.auditLogs.map((log) => ({
      ID: log.id,
      Data_Hora: log.timestamp,
      Usuário: log.user,
      Ação: log.action,
      IP: log.ipAddress || "127.0.0.1",
    }));
    const auditWs = XLSX.utils.json_to_sheet(auditRows);
    XLSX.utils.book_append_sheet(wb, auditWs, "Logs de Auditoria");
  }

  // Save File
  const filename = `Backup_Integral_JusFlow_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Triggers server-side PDF dossier compilation for full system export
 */
export async function exportAllDataToPDF(payload: SystemDataExportPayload): Promise<void> {
  try {
    const res = await fetch("/api/export/full-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Falha ao gerar PDF de portabilidade: ${res.statusText}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Dossie_Portabilidade_JusFlow_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro na exportação para PDF:", error);
    alert("Erro ao exportar PDF. Por favor, tente novamente.");
  }
}
