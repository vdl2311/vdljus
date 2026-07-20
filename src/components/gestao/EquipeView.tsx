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
  X,
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
        return "bg-emerald-950 text-emerald-300";
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
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Controle de Equipe
          </h2>{" "}
          <p className="text-xs text-muted-foreground">
            Gerencie permissões de acesso, credenciais da OAB e status de
            segurança multifator (2FA).
          </p>{" "}
        </div>{" "}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 self-start shadow-md shadow-emerald-600/10 cursor-pointer"
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
            className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between hover:border-emerald-500/20 transition-all group relative animate-fade-in"
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
                <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-indigo-600 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                  {" "}
                  {member.name.charAt(0)}{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h3 className="text-xs font-bold text-foreground">
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
                    <Award className="w-3.5 h-3.5 text-emerald-500" /> Registro
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
                  <Lock className="w-3.5 h-3.5 text-emerald-500" /> Autenticação
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
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-start mb-6 text-center relative">
              <div className="w-full">
                <h3 className="text-lg font-bold text-foreground">
                  Convidar membro da equipe
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto leading-relaxed">
                  Um convite será enviado por e-mail. A senha padrão é "demo123".
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-0 top-0 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground block">
                  Nome completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2.5 text-sm text-foreground outline-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground block">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2.5 text-sm text-foreground outline-0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground block">
                    Cargo
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2.5 text-sm text-foreground outline-0 appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    <option value="associate">Advogado</option>
                    <option value="partner">Sócio</option>
                    <option value="intern">Estagiário</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground block">
                  OAB (se aplicável)
                </label>
                <input
                  type="text"
                  placeholder="OAB/SP 123.456"
                  value={oab}
                  onChange={(e) => setOab(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2.5 text-sm text-foreground outline-0"
                />
              </div>

              <div className="space-y-3 pt-1">
                <label className="text-sm font-medium text-foreground block">
                  Permissões de acesso
                </label>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Processos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Clientes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Prazos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Tarefas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Financeiro</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Documentos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Contratos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Administração</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Relatórios</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                    <span className="text-sm text-foreground">Equipe</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                  <span className="text-sm text-foreground">Exigir autenticação 2FA</span>
                </label>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#8fcbaf] hover:bg-[#7dbd9f] text-white text-sm font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Convidar
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 bg-background hover:bg-accent border border-border text-foreground text-sm font-semibold rounded-md transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}{" "}
    </div>
  );
};
