import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Star,
  FileSpreadsheet,
  Lock,
} from "lucide-react";
export const AdminOfficeView: React.FC = () => {
  const { auditLogs } = useJusFlow();
  const [officeName, setOfficeName] = useState("JusFlow Advocacia Associados");
  const [cnpj, setCnpj] = useState("12.345.678/0001-99");
  const [phone, setPhone] = useState("(11) 4003-8822");
  const [primaryBranch, setPrimaryBranch] = useState(
    "São Paulo / SP - Av. Paulista, 1000",
  );
  const branches = [
    {
      city: "São Paulo (Sede Principal)",
      address: "Av. Paulista, 1000 - Bela Vista",
      casesCount: 10,
      phone: "(11) 4003-8822",
    },
    {
      city: "Rio de Janeiro (Filial)",
      address: "Av. Rio Branco, 450 - Centro",
      casesCount: 2,
      phone: "(21) 3344-9988",
    },
    {
      city: "Brasília (Filial Federal)",
      address: "Setor de Autarquias Sul, Quadra 4",
      casesCount: 1,
      phone: "(61) 3223-1122",
    },
  ];
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="text-left">
        {" "}
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Painel Administrativo
        </h2>{" "}
        <p className="text-xs text-muted-foreground">
          Configure os parâmetros societários, filiais corporativas e audite a
          trilha de segurança do escritório.
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {" "}
        {/* Left: General configuration form (1 column) */}{" "}
        <div className="space-y-6 lg:col-span-1">
          {" "}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              {" "}
              <Building2 className="w-4.5 h-4.5 text-cyan-500" /> Parâmetros da
              Sociedade{" "}
            </h3>{" "}
            <div className="space-y-4 text-xs">
              {" "}
              <div className="space-y-1">
                {" "}
                <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                  Razão Social
                </label>{" "}
                <input
                  type="text"
                  value={officeName}
                  onChange={(e) => setOfficeName(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-1.5 text-card-foreground outline-0 font-medium"
                />{" "}
              </div>{" "}
              <div className="space-y-1">
                {" "}
                <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                  CNPJ Societário
                </label>{" "}
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-1.5 text-card-foreground outline-0 font-medium"
                />{" "}
              </div>{" "}
              <div className="space-y-1">
                {" "}
                <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                  Telefone Geral
                </label>{" "}
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-1.5 text-card-foreground outline-0 font-medium"
                />{" "}
              </div>{" "}
              <div className="space-y-1">
                {" "}
                <label className="text-[10px] text-muted-foreground font-bold uppercase block">
                  Sede Matriz
                </label>{" "}
                <input
                  type="text"
                  value={primaryBranch}
                  onChange={(e) => setPrimaryBranch(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-1.5 text-card-foreground outline-0 font-medium"
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Branches list */}{" "}
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-3">
            {" "}
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Filiais Ativas
            </h3>{" "}
            <div className="space-y-2.5">
              {" "}
              {branches.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-background rounded-md border border-border/80 text-[11px] space-y-1"
                >
                  {" "}
                  <span className="font-bold text-foreground dark:text-card-foreground block">
                    {b.city}
                  </span>{" "}
                  <span className="text-muted-foreground block">
                    {b.address}
                  </span>{" "}
                  <div className="flex justify-between text-[10px] text-cyan-600 dark:text-cyan-400 pt-1 border-t border-border/40 mt-1 font-semibold">
                    {" "}
                    <span>{b.phone}</span>{" "}
                    <span>{b.casesCount} causas vinculadas</span>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right: Security Audit log trail (2 columns) */}{" "}
        <div className="lg:col-span-2 p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[520px]">
          {" "}
          <div className="flex justify-between items-center mb-3 shrink-0">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <Lock className="w-4.5 h-4.5 text-muted-foreground" />{" "}
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Trilha de Auditoria OAB-Segura
              </h3>{" "}
            </div>{" "}
            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">
              {" "}
              Compliance LGPD Ativo{" "}
            </span>{" "}
          </div>{" "}
          <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
            {" "}
            Logs criptográficos de segurança registrando acessos judiciais,
            assinaturas eletrônicas, logins autenticados por multifator (2FA), e
            scraping da base pública do DataJud:{" "}
          </p>{" "}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar text-xs">
            {" "}
            {(auditLogs || [])
              .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
              .map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-background border border-border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px]"
                >
                  {" "}
                  <div className="space-y-0.5 flex-1 text-left">
                    {" "}
                    <span className="font-semibold text-card-foreground leading-normal">
                      {log.action}
                    </span>{" "}
                    <div className="flex gap-4 text-[9px] text-muted-foreground pt-1">
                      {" "}
                      <span>
                        Usuário:{" "}
                        <span className="font-bold text-muted-foreground">
                          {log.user}
                        </span>
                      </span>{" "}
                      <span>
                        IP: <span className="font-mono">{log.ipAddress}</span>
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="text-[9px] font-mono text-muted-foreground bg-card px-2 py-0.5 rounded border border-border shrink-0 self-start sm:self-auto">
                    {" "}
                    {new Date(log.timestamp).toLocaleString("pt-BR")}{" "}
                  </span>{" "}
                </div>
              ))}{" "}
            {auditLogs.length === 0 && (
              <div className="text-center text-muted-foreground py-16">
                Nenhum log de auditoria disponível.
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
