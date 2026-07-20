import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Plus,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Award,
  Lock,
  Trash2,
} from "lucide-react";
export const EquipeView: React.FC = () => {
  const { teamMembers, addTeamMember, deleteTeamMember } = useJusFlow();
  const [isModalOpen, setIsModalOpen] = useState(false); // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("partner");
  const [oab, setOab] = useState("");
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    addTeamMember({
      name,
      email,
      role: role as any,
      oab: oab || undefined,
      twoFactorEnabled: true,
    });
    setName("");
    setEmail("");
    setRole("partner");
    setOab("");
    setIsModalOpen(false);
  };
  const getRoleBadge = (r: string) => {
    switch (r) {
      case "admin":
        return "bg-rose-950 text-rose-300";
      case "partner":
        return "bg-cyan-950 text-cyan-300";
      case "associate":
        return "bg-indigo-950 text-indigo-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const getRoleName = (r: string) => {
    switch (r) {
      case "admin":
        return "Sócio Diretor";
      case "partner":
        return "Sócio";
      case "associate":
        return "Advogado Associado";
      default:
        return "Estagiário / Paralegal";
    }
  };
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div className="text-left">
          {" "}
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Controle de Equipe
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Gerencie permissões de acesso, credenciais da OAB e status de
            segurança multifator (2FA).
          </p>{" "}
        </div>{" "}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 self-start shadow-md shadow-cyan-600/10 cursor-pointer"
        >
          {" "}
          <Plus className="w-4 h-4" /> Convidar Membro{" "}
        </button>{" "}
      </div>{" "}
      {/* Grid of members cards */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {" "}
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between hover:border-cyan-500/20 transition-all group relative animate-fade-in"
          >
            {" "}
            <div className="space-y-4">
              {" "}
              {/* Header card info */}{" "}
              <div className="flex justify-between items-center">
                {" "}
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${getRoleBadge(member.role)}`}
                >
                  {" "}
                  {getRoleName(member.role)}{" "}
                </span>{" "}
                {member.role !== "admin" && (
                  <button
                    onClick={() => deleteTeamMember(member.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-muted-foreground hover:text-rose-500 rounded transition-all cursor-pointer shrink-0"
                  >
                    {" "}
                    <Trash2 className="w-3.5 h-3.5" />{" "}
                  </button>
                )}{" "}
              </div>{" "}
              {/* Name and avatar node */}{" "}
              <div className="flex items-center gap-3">
                {" "}
                <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                  {" "}
                  {member.name.charAt(0)}{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h3 className="text-xs font-extrabold text-foreground">
                    {member.name}
                  </h3>{" "}
                  <span className="text-[10px] text-muted-foreground font-normal flex items-center gap-1 mt-0.5">
                    {" "}
                    <Mail className="w-3 h-3 text-muted-foreground" />{" "}
                    {member.email}{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              {/* OAB Credentials */}{" "}
              {member.oab && (
                <div className="p-2.5 bg-background rounded-md border border-border/80 text-[10px] flex items-center justify-between">
                  {" "}
                  <span className="text-muted-foreground font-bold uppercase flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-cyan-500" /> Registro
                    Profissional
                  </span>{" "}
                  <span className="font-mono font-bold text-card-foreground">
                    {member.oab}
                  </span>{" "}
                </div>
              )}{" "}
              {/* 2FA Telemetry Security status */}{" "}
              <div className="border-t border-slate-50 pt-3 flex justify-between items-center text-[10px]">
                {" "}
                <span className="text-muted-foreground font-bold uppercase flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-cyan-500" /> Autenticação
                  2FA
                </span>{" "}
                {member.twoFactorEnabled ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded uppercase">
                    {" "}
                    <ShieldCheck className="w-3.5 h-3.5" /> Ativo{" "}
                  </span>
                ) : (
                  <span className="text-amber-500 font-bold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded uppercase">
                    {" "}
                    <ShieldAlert className="w-3.5 h-3.5" /> Desativado{" "}
                  </span>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {/* Creation Modal */}{" "}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {" "}
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6">
            {" "}
            <div className="flex justify-between items-center mb-4 text-left">
              {" "}
              <div>
                {" "}
                <h3 className="text-sm font-bold text-foreground">
                  Convidar Novo Advogado
                </h3>{" "}
                <p className="text-[11px] text-muted-foreground">
                  Insira credenciais profissionais e atribua permissões de
                  acesso.
                </p>{" "}
              </div>{" "}
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-muted-foreground dark:hover:text-card-foreground font-bold"
              >
                {" "}
                Fechar{" "}
              </button>{" "}
            </div>{" "}
            <form onSubmit={handleAddMember} className="space-y-4 text-left">
              {" "}
              {/* Name */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  Nome Completo
                </label>{" "}
                <input
                  type="text"
                  required
                  placeholder="Nome do profissional por extenso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                />{" "}
              </div>{" "}
              {/* Email */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                  E-mail Corporativo
                </label>{" "}
                <input
                  type="email"
                  required
                  placeholder="advogado@jusflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                />{" "}
              </div>{" "}
              {/* Role & OAB Registration */}{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Cargo / Hierarquia
                  </label>{" "}
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  >
                    {" "}
                    <option value="partner">Sócio de Capital</option>{" "}
                    <option value="associate">Advogado Associado</option>{" "}
                    <option value="intern">Estagiário / Paralegal</option>{" "}
                  </select>{" "}
                </div>{" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Registro OAB (Opcional)
                  </label>{" "}
                  <input
                    type="text"
                    placeholder="Ex: OAB/SP 431982"
                    value={oab}
                    onChange={(e) => setOab(e.target.value)}
                    className="w-full bg-background border border-border focus:border-cyan-500 rounded-md px-3 py-2 text-xs text-card-foreground outline-0"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* 2FA reminder banner */}{" "}
              <div className="p-3 bg-background/40 rounded-md border border-border/80 text-[10px] text-muted-foreground leading-relaxed">
                {" "}
                Por padrão de conformidade e integridade de dados OAB-SaaS,
                todos os convidados receberão um e-mail com QR-Code para ativar
                a autenticação multifator (2FA) no primeiro login.{" "}
              </div>{" "}
              {/* Buttons */}{" "}
              <div className="pt-3 border-t border-border flex justify-end gap-2">
                {" "}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 hover:bg-accent hover:text-accent-foreground text-xs font-bold text-muted-foreground rounded-md cursor-pointer"
                >
                  {" "}
                  Cancelar{" "}
                </button>{" "}
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md shadow-md cursor-pointer"
                >
                  {" "}
                  Convidar Profissional{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
