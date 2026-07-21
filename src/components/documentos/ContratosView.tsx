import React, { useState } from "react";

import { useJusFlow } from "../../store/JusFlowContext";

import {
  Sparkles,
  FileText,
  Check,
  ShieldCheck,
  PenTool,
  User,
  AlertCircle,
  Clock,
} from "lucide-react";
export const ContratosView: React.FC = () => {
  const { clients, documents, addDocument } = useJusFlow();
  const [selectedTemplate, setSelectedTemplate] = useState("procuracao");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [showSignatureAudit, setShowSignatureAudit] = useState(false);
  const [signedDocId, setSignedDocId] = useState("");
  const templates = [
    {
      id: "procuracao",
      title: "Procuração Ad Judicia et Extra",
      content: `OUTORGANTE: {{CLIENT_NAME}}, inscrito(a) no CPF/CNPJ sob o nº {{CLIENT_DOC}}, residente e domiciliado(a) no endereço {{CLIENT_ADDRESS}}. OUTORGADO: JUSFLOW ADVOCACIA ASSOCIADOS, sociedade de advogados regularmente registrada na OAB sob o nº 12345/SP, com sede funcional corporativa. PODERES: Pelo presente instrumento, o outorgante confere aos outorgados amplos poderes da cláusula 'ad judicia et extra' para representar em qualquer juízo, tribunal ou repartição pública, praticando todos os atos necessários ao fiel cumprimento deste mandato.`,
    },
    {
      id: "honorarios",
      title: "Contrato de Honorários Advocatícios Quota Litis",
      content: `CONTRATANTE: {{CLIENT_NAME}}, inscrito(a) no CPF/CNPJ sob o nº {{CLIENT_DOC}}. CONTRATADO: JUSFLOW ADVOCACIA ASSOCIADOS, OAB/SP 12345. CLÁUSULA PRIMEIRA: O objeto deste instrumento é a prestação de serviços jurídicos para patrocínio de ação judicial de interesse do contratante. CLÁUSULA SEGUNDA: Em contraprestação aos serviços, o Contratante pagará a título de honorários advocatícios quota-litis o percentual de 20% (vinte por cento) sobre o êxito financeiro obtido ao final da demanda.`,
    },
    {
      id: "nda",
      title: "Acordo de Confidencialidade e Sigilo (NDA)",
      content: `REVELADORA: {{CLIENT_NAME}}, CNPJ/CPF nº {{CLIENT_DOC}}. RECEPTORA: JUSFLOW ADVOCACIA ASSOCIADOS. CLÁUSULA PRIMEIRA: As partes concordam em compartilhar informações confidenciais relativas a segredos industriais, processos internos e dados processuais confidenciais. CLÁUSULA SEGUNDA: A receptora compromete-se a manter absoluto sigilo sobre quaisquer dados revelados, sob pena de incorrer em multa compensatória de 50 (cinquenta) salários mínimos, sem prejuízo de perdas e danos.`,
    },
  ];
  const client = clients.find((c) => c.id === selectedClientId);
  const template =
    templates.find((t) => t.id === selectedTemplate) || templates[0];
  const getPrefilledContent = () => {
    let text = template.content;
    if (client) {
      text = text
        .replace(/{{CLIENT_NAME}}/g, client.name)
        .replace(/{{CLIENT_DOC}}/g, client.document)
        .replace(
          /{{CLIENT_ADDRESS}}/g,
          client.address || "Não informado no cadastro",
        );
    } else {
      text = text
        .replace(/{{CLIENT_NAME}}/g, "[Selecione o Cliente no CRM]")
        .replace(/{{CLIENT_DOC}}/g, "[Documento do Cliente]")
        .replace(/{{CLIENT_ADDRESS}}/g, "[Endereço do Cliente]");
    }
    return text;
  };
  const handleSignDocument = () => {
    if (!client) return;
    setIsSigning(true);
    setTimeout(() => {
      // Create and save signed document
      const docTitle = `${template.title} - ${client.name.split(" ")[0]}`;
      const docContent = getPrefilledContent();
      const newDoc = addDocument({
        title: docTitle,
        content: docContent,
        status: "signed",
        signers: [client.name],
      });
      setIsSigning(false);
      setSignedDocId(newDoc.id);
      setShowSignatureAudit(true);
    }, 2000);
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="text-left">
        {" "}
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Modelos & Contratos
        </h2>{" "}
        <p className="text-xs text-muted-foreground">
          Repositório inteligente de contratos pré-formatados com preenchimento
          dinâmico de variáveis.
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {" "}
        {/* Left Form: Selectors (1 column) */}{" "}
        <div className="space-y-6">
          {" "}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              {" "}
              <FileText className="w-4.5 h-4.5 text-emerald-500" /> Escolha o
              Modelo{" "}
            </h3>{" "}
            <div className="space-y-2">
              {" "}
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    setShowSignatureAudit(false);
                  }}
                  className={`w-full text-left p-3 border rounded-xl transition-all cursor-pointer ${selectedTemplate === t.id ? "bg-emerald-50 border-emerald-500 dark:bg-emerald-950/40 dark:border-emerald-500/80" : "bg-background/10 border-border hover:border-border dark:hover:border-border"}`}
                >
                  {" "}
                  <span
                    className={`text-xs font-bold block ${selectedTemplate === t.id ? "text-emerald-600 dark:text-emerald-400" : "text-foreground "}`}
                  >
                    {" "}
                    {t.title}{" "}
                  </span>{" "}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              {" "}
              <User className="w-4.5 h-4.5 text-emerald-500" /> Vincular
              Cliente{" "}
            </h3>{" "}
            <div className="space-y-1.5">
              {" "}
              <label className="text-xs text-muted-foreground font-bold uppercase block">
                Selecionar Parte Outorgante
              </label>{" "}
              <select
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  setShowSignatureAudit(false);
                }}
                className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2 text-xs text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                {" "}
                <option value="">Selecione no CRM...</option>{" "}
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type.toUpperCase()})
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            {client && (
              <div className="p-3 bg-background rounded-md border border-border text-xs space-y-1">
                {" "}
                <span className="font-bold text-foreground block">
                  {client.name}
                </span>{" "}
                <span className="text-muted-foreground block">
                  CPF/CNPJ: {client.document}
                </span>{" "}
                <span className="text-muted-foreground block">
                  Endereço: {client.address || "Não preenchido"}
                </span>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        {/* Right Preview and Signature (2 columns) */}{" "}
        <div className="lg:col-span-2 space-y-6">
          {" "}
          {/* Preview box */}{" "}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[340px]">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              {" "}
              <FileText className="w-4.5 h-4.5 text-muted-foreground" />{" "}
              Visualizador do Instrumento{" "}
            </h3>{" "}
            <div className="flex-1 border border-border bg-muted/40 rounded-md p-4 font-serif text-xs text-foreground overflow-y-auto leading-relaxed whitespace-pre-wrap no-scrollbar">
              {" "}
              {getPrefilledContent()}{" "}
            </div>{" "}
            {client && !showSignatureAudit && (
              <button
                onClick={handleSignDocument}
                disabled={isSigning}
                className="w-full mt-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-md transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                {" "}
                <PenTool className="w-3.5 h-3.5" />{" "}
                {isSigning
                  ? "Colhendo carimbo de IP e carimbo de data/hora..."
                  : "Assinar com Validade OAB / ICP-Brasil"}{" "}
              </button>
            )}{" "}
          </div>{" "}
          {/* Signature Audit Trail log */}{" "}
          {showSignatureAudit && (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl shadow-md space-y-3">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />{" "}
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {" "}
                  Carimbo de Assinatura Registrado{" "}
                </h4>{" "}
              </div>{" "}
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-snug">
                {" "}
                Este instrumento foi assinado e certificado eletronicamente. O
                log de conformidade jurídica foi atrelado aos metadados do
                documento:{" "}
              </p>{" "}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-emerald-800 dark:text-emerald-400 bg-card p-3 rounded-md border border-emerald-100 dark:border-emerald-950">
                {" "}
                <div>
                  {" "}
                  <span className="block text-xs text-muted-foreground uppercase font-sans">
                    Endereço de IP
                  </span>{" "}
                  <span className="font-bold">
                    186.234.82.91 (Local Host IPv4)
                  </span>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="block text-xs text-muted-foreground uppercase font-sans">
                    Certificado Criptográfico
                  </span>{" "}
                  <span className="font-bold truncate block">
                    SHA-256: 8a4b2c1d3f9e2b17a5c78...
                  </span>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="block text-xs text-muted-foreground uppercase font-sans">
                    Carimbo de Data/Hora
                  </span>{" "}
                  <span className="font-bold">
                    {new Date().toLocaleString("pt-BR")}
                  </span>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="block text-xs text-muted-foreground uppercase font-sans">
                    Validade Legal
                  </span>{" "}
                  <span className="font-bold text-emerald-500 uppercase">
                    VÁLIDO (ICP-BRASIL)
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
