import React, { useState, useEffect } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import { toast } from "sonner";
import {
  Mail,
  Send,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  Zap,
  Sparkles,
  FileText,
  Key,
  Info,
  RefreshCw,
} from "lucide-react";

export const EmailDispatchesView: React.FC = () => {
  const { clients, processes } = useJusFlow();

  const [activeTab, setActiveTab] = useState<"send" | "campaign" | "history">("send");

  // Brevo status
  const [brevoStatus, setBrevoStatus] = useState<{
    configured: boolean;
    senderEmail: string;
    senderName: string;
    provider: string;
  } | null>(null);
  const [customApiKey, setCustomApiKey] = useState("");

  // Transactional email form
  const [selectedClientId, setSelectedClientId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailTemplate, setEmailTemplate] = useState("custom");
  const [htmlBody, setHtmlBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Campaign form
  const [campaignName, setCampaignName] = useState("");
  const [campaignSubject, setCampaignSubject] = useState("");
  const [senderName, setSenderName] = useState("JusFlow Advocacia");
  const [senderEmail, setSenderEmail] = useState("contato@jusflow.com.br");
  const [listIdsStr, setListIdsStr] = useState("2, 7");
  const [scheduledAt, setScheduledAt] = useState("");
  const [campaignHtml, setCampaignHtml] = useState("");
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

  // History log
  const [historyLogs, setHistoryLogs] = useState<
    Array<{
      id: string;
      type: "transactional" | "campaign";
      recipient: string;
      subject: string;
      status: string;
      timestamp: string;
      messageIdOrCampaignId: string;
      simulated: boolean;
    }>
  >([
    {
      id: "log-1",
      type: "transactional",
      recipient: "maria.silva@exemplo.com.br",
      subject: "Notificação de Atualização Processual - CNJ 0012345-67.2025.8.26.0100",
      status: "Entregue",
      timestamp: new Date(Date.now() - 3600000).toLocaleString("pt-BR"),
      messageIdOrCampaignId: "<msg-892341@brevo.com>",
      simulated: true,
    },
  ]);

  // Load status
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/email/status");
      if (res.ok) {
        const data = await res.json();
        setBrevoStatus(data);
        if (data.senderName) setSenderName(data.senderName);
        if (data.senderEmail) setSenderEmail(data.senderEmail);
      }
    } catch (err) {
      console.warn("Não foi possível carregar status da API Brevo:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Sync client email
  useEffect(() => {
    if (selectedClientId) {
      const c = clients.find((client) => client.id === selectedClientId);
      if (c) {
        setRecipientEmail(c.email || "");
        setRecipientName(c.name || "");
      }
    }
  }, [selectedClientId, clients]);

  // Apply quick templates
  const applyTemplate = (templateKey: string) => {
    setEmailTemplate(templateKey);
    const clientName = recipientName || "Prezado(a) Cliente";

    switch (templateKey) {
      case "process_update":
        setEmailSubject("Notificação de Atualização Processual - JusFlow Advocacia");
        setHtmlBody(`
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h2 style="color: #047857; margin-top: 0;">JusFlow Advocacia — Notificação Processual</h2>
  <p>Olá, <strong>${clientName}</strong>,</p>
  <p>Gostaríamos de informar que houve uma nova movimentação relevante cadastrada em seu processo judicial sob nossos cuidados.</p>
  <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #047857; margin: 15px 0;">
    <p style="margin: 0; font-weight: bold;">Status Atualizado: Processo em Andamento Regular</p>
    <p style="margin: 5px 0 0 0; font-size: 14px; color: #475569;">Sua causa está sendo acompanhada ativamente por nossa equipe de advogados especialistas.</p>
  </div>
  <p>Para dúvidas ou consulta completa aos documentos, responda a este e-mail ou contate nosso atendimento.</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
  <p style="font-size: 12px; color: #94a3b8;">JusFlow Advocacia & Consulting • Este é um e-mail automático do sistema jurídico.</p>
</div>
        `.trim());
        break;

      case "financial_notice":
        setEmailSubject("Lembrete de Vencimento de Honorários - JusFlow");
        setHtmlBody(`
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h2 style="color: #047857; margin-top: 0;">Lembrete de Pagamento de Honorários</h2>
  <p>Prezado(a) <strong>${clientName}</strong>,</p>
  <p>Lembramos que o lançamento referente à prestação de serviços jurídicos contratuais está próximo do vencimento.</p>
  <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0; border-radius: 4px;">
    <p style="margin: 0; font-weight: bold; color: #15803d;">Solicitamos a gentileza de verificar a fatia correspondente.</p>
  </div>
  <p>Se o pagamento já foi realizado, desconsidere esta mensagem.</p>
  <p>Atenciosamente,<br /><strong>Departamento Financeiro — JusFlow</strong></p>
</div>
        `.trim());
        break;

      case "hearing_reminder":
        setEmailSubject("Aviso de Audiência Forense Agendada - JusFlow Advocacia");
        setHtmlBody(`
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h2 style="color: #b45309; margin-top: 0;">Aviso Importante de Audiência Forense</h2>
  <p>Prezado(a) <strong>${clientName}</strong>,</p>
  <p>Confirmamos o agendamento de audiência referente ao seu processo judicial.</p>
  <p>Recomendamos que compareça munido de documento de identificação original com foto com antecedência mínima de 30 minutos.</p>
  <p>Nosso advogado estará presente no local/link para acompanhá-lo(a).</p>
</div>
        `.trim());
        break;

      default:
        break;
    }
  };

  // Send transactional email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !emailSubject || !htmlBody) {
      toast.error("Preencha todos os campos obrigatórios (E-mail, Assunto e Mensagem).");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: [{ email: recipientEmail, name: recipientName }],
          subject: emailSubject,
          htmlContent: htmlBody,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao enviar e-mail via API Brevo.");
      }

      toast.success(
        data.simulated
          ? "E-mail enviado em modo de homologação Brevo com sucesso!"
          : "E-mail entregue com sucesso via Brevo API v3!"
      );

      setHistoryLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          type: "transactional",
          recipient: recipientEmail,
          subject: emailSubject,
          status: "Sucesso",
          timestamp: new Date().toLocaleString("pt-BR"),
          messageIdOrCampaignId: data.messageId || "Brevo-v3",
          simulated: Boolean(data.simulated),
        },
        ...prev,
      ]);

      // Reset form
      setEmailSubject("");
      setHtmlBody("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro de conexão ao enviar e-mail.");
    } finally {
      setIsSending(false);
    }
  };

  // Create Campaign
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName || !campaignSubject || !campaignHtml) {
      toast.error("Preencha o Nome da Campanha, Assunto e Conteúdo HTML.");
      return;
    }

    setIsCreatingCampaign(true);
    try {
      const listIds = listIdsStr
        .split(",")
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n));

      const res = await fetch("/api/email/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaignName,
          subject: campaignSubject,
          sender: { name: senderName, email: senderEmail },
          type: "classic",
          htmlContent: campaignHtml,
          recipients: { listIds: listIds.length > 0 ? listIds : [2, 7] },
          scheduledAt: scheduledAt || undefined,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao criar campanha via API Brevo.");
      }

      toast.success(
        data.simulated
          ? `Campanha "${campaignName}" criada em modo de teste Brevo!`
          : `Campanha #${data.campaignId} criada e agendada na Brevo API v3!`
      );

      setHistoryLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          type: "campaign",
          recipient: `Listas Brevo: [${listIds.join(", ")}]`,
          subject: campaignSubject,
          status: "Campanha Agendada",
          timestamp: new Date().toLocaleString("pt-BR"),
          messageIdOrCampaignId: `Campanha #${data.campaignId}`,
          simulated: Boolean(data.simulated),
        },
        ...prev,
      ]);

      // Reset form
      setCampaignName("");
      setCampaignSubject("");
      setCampaignHtml("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro de conexão ao criar campanha.");
    } finally {
      setIsCreatingCampaign(false);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Módulo de Disparos e Campanhas de E-mail (Brevo API v3)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Envie e-mails transacionais instantâneos para clientes ou crie campanhas em massa usando a infraestrutura Brevo.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {brevoStatus?.configured ? (
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Brevo API Conectada
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Modo de Homologação / Simulação
            </span>
          )}
        </div>
      </div>

      {/* Optional Brevo Key configuration banner */}
      <div className="p-4 bg-card border border-border rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-foreground">
              Configuração de Chave API Brevo (v3)
            </span>
          </div>
          <button
            onClick={fetchStatus}
            className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Atualizar
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Para disparar e-mails reais em produção, insira sua chave <code>BREVO_API_KEY</code> no arquivo <code>.env.example</code> ou informe abaixo para testar instantaneamente nesta sessão.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="password"
            placeholder="Cole sua API Key da Brevo (xkeysib-...)"
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-background border border-input rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold self-center">
            {customApiKey ? "Chave temporária inserida!" : "Chave padrão do ambiente ativa"}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab("send")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "send"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Send className="w-3.5 h-3.5" /> E-mail Transacional
        </button>
        <button
          onClick={() => setActiveTab("campaign")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "campaign"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Criar Campanha Brevo
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "history"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Histórico ({historyLogs.length})
        </button>
      </div>

      {/* TAB 1: Transactional Email */}
      {activeTab === "send" && (
        <form onSubmit={handleSendEmail} className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" /> Disparo Transacional Rápido
            </h3>
            <span className="text-[11px] text-muted-foreground">Endpoint: /v3/smtp/email</span>
          </div>

          {/* Quick Select Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Selecionar Cliente Cadastrado (Opcional)
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">-- Escolher Cliente --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email || "Sem e-mail"})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                E-mail do Destinatário <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="cliente@exemplo.com.br"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Preset templates */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-500" /> Modelo Pré-formatado Pronto
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate("process_update")}
                className="px-3 py-1.5 bg-muted hover:bg-emerald-500/10 text-xs font-medium rounded-md border border-border hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                Atualização Processual
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("financial_notice")}
                className="px-3 py-1.5 bg-muted hover:bg-emerald-500/10 text-xs font-medium rounded-md border border-border hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                Cobrança / Honorários
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("hearing_reminder")}
                className="px-3 py-1.5 bg-muted hover:bg-emerald-500/10 text-xs font-medium rounded-md border border-border hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                Aviso de Audiência
              </button>
            </div>
          </div>

          {/* Subject & Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Assunto do E-mail <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Notificação do Processo CNJ 0012345-67..."
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Conteúdo HTML / Mensagem do E-mail <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={8}
              required
              placeholder="<h1>Aviso Jurídico</h1><p>Digite o corpo da mensagem...</p>"
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              className="w-full p-3 bg-background border border-input rounded-md text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSending ? "Enviando e-mail..." : "Disparar E-mail via Brevo API"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Create Campaign (POST /v3/emailCampaigns) */}
      {activeTab === "campaign" && (
        <form onSubmit={handleCreateCampaign} className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" /> Criar e Agendar Campanha Brevo
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">POST /v3/emailCampaigns</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nome Interno da Campanha <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Boletim Informativo de Julho - JusFlow"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Assunto do E-mail da Campanha <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Principais Alterações Jurídicas para o seu Negócio"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nome do Remetente</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">E-mail do Remetente</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Listas de Destinatários (listIds)</label>
              <input
                type="text"
                placeholder="2, 7"
                value={listIdsStr}
                onChange={(e) => setListIdsStr(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Data e Hora de Agendamento (Opcional)
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 bg-background border border-input rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-muted-foreground">Deixe em branco para disparar imediatamente após a aprovação.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Template HTML da Campanha <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={8}
              required
              placeholder="<h1>Boletim Jurídico JusFlow</h1><p>Parabéns por acompanhar nosso informativo...</p>"
              value={campaignHtml}
              onChange={(e) => setCampaignHtml(e.target.value)}
              className="w-full p-3 bg-background border border-input rounded-md text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isCreatingCampaign}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Layers className="w-4 h-4" />
              {isCreatingCampaign ? "Criando Campanha..." : "Criar Campanha na API Brevo"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: History & Logs */}
      {activeTab === "history" && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Histórico Recente de Disparos Brevo
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Destinatário / Lista</th>
                  <th className="py-2.5 px-3">Assunto</th>
                  <th className="py-2.5 px-3">ID Brevo</th>
                  <th className="py-2.5 px-3">Data / Hora</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historyLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.type === "campaign"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                        }`}
                      >
                        {log.type === "campaign" ? "Campanha Brevo" : "Transacional"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-foreground">{log.recipient}</td>
                    <td className="py-2.5 px-3 text-muted-foreground truncate max-w-xs">{log.subject}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">
                      {log.messageIdOrCampaignId}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">{log.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded">
                        {log.simulated ? "Homologado" : "Enviado"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
