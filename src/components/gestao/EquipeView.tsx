import React, { useState, useRef, useEffect } from "react";
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
  ChevronDown,
  Check,
} from "lucide-react";
export const EquipeView: React.FC = () => {
  const { teamMembers, addTeamMember, deleteTeamMember } = useJusFlow();
  const [isModalOpen, setIsModalOpen] = useState(false); // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("partner");
  const [oab, setOab] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleOptions = [
    { id: "admin", label: "Administrador" },
    { id: "partner", label: "Sócio" },
    { id: "lawyer", label: "Advogado" },
    { id: "intern", label: "Estagiário" },
    { id: "secretary", label: "Secretária" },
  ];

  const selectedRoleOption = roleOptions.find((opt) => opt.id === role) || roleOptions[1];

  const handleSelectRole = (roleId: string) => {
    setRole(roleId);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSubmitting(true);
    
    // Simulate network latency for better UX feedback
    setTimeout(() => {
      addTeamMember({
        name,
        email,
        role: role as any,
        oab: oab || undefined,
        twoFAEnabled: true,
        permissions: [],
      });
      setName("");
      setEmail("");
      setRole("partner");
      setOab("");
      setIsSubmitting(false);
      setIsModalOpen(false);
    }, 600);
  };
  const getRoleBadge = (r: string) => {
    switch (r) {
      case "admin":
        return "bg-rose-950 text-rose-300";
      case "partner":
        return "bg-emerald-950 text-emerald-300";
      case "associate":
      case "lawyer":
        return "bg-indigo-950 text-indigo-300";
      case "secretary":
        return "bg-amber-950 text-amber-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const getRoleName = (r: string) => {
    switch (r) {
      case "admin":
        return "Administrador";
      case "partner":
        return "Sócio";
      case "associate":
      case "lawyer":
        return "Advogado";
      case "secretary":
        return "Secretária";
      default:
        return "Estagiário";
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
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getRoleBadge(member.role)}`}
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
                {member.twoFAEnabled ? (
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
          <div role="dialog" aria-modal="true" className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6">
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
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
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
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground block">
                    Cargo
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2.5 text-sm text-foreground flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                    >
                      <span>{selectedRoleOption.label}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-card border border-border rounded-lg shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                        {roleOptions.map((opt) => {
                          const isSelected = role === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectRole(opt.id)}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm cursor-pointer transition-colors text-left font-medium ${
                                isSelected
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && (
                                <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-md px-3 py-2.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-3 pt-1">
                <label className="text-sm font-medium text-foreground block">
                  Permissões de acesso
                </label>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                      <span className="text-sm text-foreground">Processos</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                      <span className="text-sm text-foreground">Prazos</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                      <span className="text-sm text-foreground">Financeiro</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                      <span className="text-sm text-foreground">Contratos</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                      <span className="text-sm text-foreground">Relatórios</span>
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                      <span className="text-sm text-foreground">Documentos</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                      <span className="text-sm text-foreground">Administração</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-emerald-500 bg-background border-border focus:ring-emerald-500 focus:ring-offset-background" />
                      <span className="text-sm text-foreground">Equipe</span>
                    </label>
                  </div>
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
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#8fcbaf] hover:bg-[#7dbd9f] text-white text-sm font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Convidando..." : "Convidar"}
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
