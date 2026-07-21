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
  UserPlus,
} from "lucide-react";
export const EquipeView: React.FC = () => {
  const { teamMembers, addTeamMember, deleteTeamMember } = useJusFlow();
  const [isModalOpen, setIsModalOpen] = useState(false); // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("partner");
  const [oab, setOab] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    processos: true,
    clientes: true,
    prazos: true,
    tarefas: true,
    financeiro: false,
    documentos: false,
    contratos: false,
    administracao: false,
    relatorios: false,
    equipe: false,
  });

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
        twoFAEnabled: twoFAEnabled,
        permissions: Object.keys(permissions).filter((k) => permissions[k]),
      });
      setName("");
      setEmail("");
      setRole("partner");
      setOab("");
      setPermissions({
        processos: true,
        clientes: true,
        prazos: true,
        tarefas: true,
        financeiro: false,
        documentos: false,
        contratos: false,
        administracao: false,
        relatorios: false,
        equipe: false,
      });
      setTwoFAEnabled(false);
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
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors text-left flex flex-col">
      {/* Header Panel matching example */}
      <div className="flex items-center justify-end gap-4 shrink-0">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#027a48] hover:bg-[#02663c] text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Convidar membro
        </button>
      </div>

      {teamMembers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <p className="text-sm font-semibold text-muted-foreground/60">
            0 membros na equipe
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between hover:border-emerald-500/20 transition-all group relative animate-fade-in"
            >
              <div className="space-y-4">
                {/* Header card info */}
                <div className="flex justify-between items-center">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getRoleBadge(member.role)}`}
                  >
                    {getRoleName(member.role)}
                  </span>
                  {member.role !== "admin" && (
                    <button
                      onClick={() => deleteTeamMember(member.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-muted-foreground hover:text-rose-500 rounded transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {/* Name and avatar node */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-indigo-600 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">
                      {member.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground font-normal flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      {member.email}
                    </span>
                  </div>
                </div>
                {/* OAB Credentials */}
                {member.oab && (
                  <div className="p-2.5 bg-background rounded-md border border-border/80 text-[10px] flex items-center justify-between">
                    <span className="text-muted-foreground font-bold uppercase flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-500" /> Registro
                      Profissional
                    </span>
                    <span className="font-mono font-bold text-card-foreground">
                      {member.oab}
                    </span>
                  </div>
                )}
                {/* 2FA Telemetry Security status */}
                <div className="border-t border-slate-50 pt-3 flex justify-between items-center text-[10px]">
                  <span className="text-muted-foreground font-bold uppercase flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" /> Autenticação
                    2FA
                  </span>
                  {member.twoFAEnabled ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" /> Ativo
                    </span>
                  ) : (
                    <span className="text-amber-500 font-bold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded uppercase">
                      <ShieldAlert className="w-3.5 h-3.5" /> Desativado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}{" "}
      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-hidden">
          <style dangerouslySetInnerHTML={{__html: `
            .modal-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .modal-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .modal-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(156, 163, 175, 0.35);
              border-radius: 9999px;
            }
            .modal-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(156, 163, 175, 0.5);
            }
          `}} />
          <div role="dialog" aria-modal="true" className="w-full max-w-[540px] bg-card border-2 border-emerald-600/20 dark:border-emerald-500/10 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header (Non-scrollable, exact copy of style) */}
            <div className="p-6 pb-2.5 relative flex justify-between items-start shrink-0">
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Convidar membro da equipe
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  Um convite será enviado por e-mail. A senha padrão é "demo123".
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form with inside scrolling */}
            <form onSubmit={handleAddMember} className="flex-1 overflow-y-auto px-6 pb-6 pt-1 space-y-4 text-left modal-scrollbar">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground block">
                  Nome completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ana Souza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/45 transition-all"
                />
              </div>

              {/* Email and Role row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground block">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/45 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground block">
                    Cargo
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-background border border-border focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 rounded-lg px-3.5 py-2.5 text-sm text-foreground flex items-center justify-between cursor-pointer focus:outline-none transition-all"
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
                              className={`w-full flex items-center justify-between px-3.5 py-2 text-sm cursor-pointer transition-colors text-left font-medium ${
                                isSelected
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* OAB */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground block">
                  OAB (se aplicável)
                </label>
                <input
                  type="text"
                  placeholder="OAB/SP 123.456"
                  value={oab}
                  onChange={(e) => setOab(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/45 transition-all"
                />
              </div>

              {/* Permissions */}
              <div className="space-y-3 pt-1">
                <label className="text-sm font-semibold text-foreground block">
                  Permissões de acesso
                </label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                  {/* Left Column */}
                  <div className="space-y-3.5">
                    {[
                      { key: "processos", label: "Processos" },
                      { key: "prazos", label: "Prazos" },
                      { key: "financeiro", label: "Financeiro" },
                      { key: "contratos", label: "Contratos" },
                      { key: "relatorios", label: "Relatórios" }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPermissions(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="flex items-center gap-3 cursor-pointer text-left focus:outline-none group select-none"
                      >
                        <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                          permissions[key]
                            ? "bg-[#027a48] border-[#027a48] text-white"
                            : "bg-background border-border hover:border-emerald-500/50"
                        }`}>
                          {permissions[key] && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                        </div>
                        <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground transition-colors">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3.5">
                    {[
                      { key: "clientes", label: "Clientes" },
                      { key: "tarefas", label: "Tarefas" },
                      { key: "documentos", label: "Documentos" },
                      { key: "administracao", label: "Administração" },
                      { key: "equipe", label: "Equipe" }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPermissions(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="flex items-center gap-3 cursor-pointer text-left focus:outline-none group select-none"
                      >
                        <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                          permissions[key]
                            ? "bg-[#027a48] border-[#027a48] text-white"
                            : "bg-background border-border hover:border-emerald-500/50"
                        }`}>
                          {permissions[key] && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                        </div>
                        <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground transition-colors">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2FA Toggle Switch */}
              <div className="pt-2.5 pb-1">
                <button
                  type="button"
                  onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                  className="flex items-center gap-3 cursor-pointer text-left focus:outline-none group select-none"
                >
                  <div className={`w-11 h-6 rounded-full p-[2px] transition-colors duration-200 shrink-0 ${
                    twoFAEnabled ? "bg-emerald-600" : "bg-muted border border-border/50"
                  }`}>
                    <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      twoFAEnabled ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </div>
                  <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground transition-colors">
                    Exigir autenticação 2FA
                  </span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#027a48] hover:bg-[#02663c] text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Convidando..." : "Convidar membro"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 bg-background hover:bg-accent border border-border text-foreground text-sm font-semibold rounded-lg transition-colors cursor-pointer"
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
