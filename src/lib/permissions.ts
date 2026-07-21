import { TeamMember } from "../types";

export const hasPermission = (tabId: string, user: TeamMember | null): boolean => {
  if (!user) return false;
  // Admin role has access to everything
  if (user.role === "admin") return true;

  // Map the tabId to the permission name
  let permissionKey = "";
  if (tabId.startsWith("principal.dashboard")) permissionKey = "dashboard";
  else if (tabId.startsWith("principal.copiloto")) permissionKey = "copiloto";
  else if (tabId.startsWith("documentos.ia")) permissionKey = "ia_juridica";
  else if (tabId.startsWith("documentos.agentes")) permissionKey = "agentes";
  else if (tabId.startsWith("operacao.processos") || tabId.startsWith("operacao.processo_detalhe")) permissionKey = "processos";
  else if (tabId.startsWith("operacao.datajud")) permissionKey = "datajud";
  else if (tabId.startsWith("operacao.agenda")) permissionKey = "agenda";
  else if (tabId.startsWith("operacao.prazos")) permissionKey = "prazos";
  else if (tabId.startsWith("operacao.tarefas")) permissionKey = "tarefas";
  else if (tabId.startsWith("documentos.contratos")) permissionKey = "contratos";
  else if (tabId.startsWith("gestao.clientes")) permissionKey = "clientes";
  else if (tabId.startsWith("gestao.financeiro")) permissionKey = "financeiro";
  else if (tabId.startsWith("gestao.automacoes")) permissionKey = "automacoes";
  else if (tabId.startsWith("documentos.conhecimento")) permissionKey = "conhecimento";
  else if (tabId.startsWith("gestao.compliance")) permissionKey = "compliance";
  else if (tabId.startsWith("gestao.notificacoes")) permissionKey = "notificacoes";
  else if (tabId.startsWith("gestao.conflitos")) permissionKey = "conflitos";
  else if (tabId.startsWith("gestao.relatorios")) permissionKey = "relatorios";
  else if (tabId.startsWith("gestao.equipe")) permissionKey = "equipe";
  else if (tabId.startsWith("gestao.admin")) permissionKey = "admin";
  else if (tabId.startsWith("cliente.portal")) permissionKey = "portal";
  else if (tabId.startsWith("cliente.suporte")) return true; // Support is always allowed

  if (!permissionKey) return true; // Default fallback if unknown tabId

  const userPermissions = user.permissions || [];
  
  // Normalize strings to ignore accents (like "notificações" vs "notificacoes") and case
  const normalize = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const normalizedKey = normalize(permissionKey);

  // Special aliases: e.g., if we checked "administracao" but in initial data it's "admin"
  const aliases: Record<string, string[]> = {
    "admin": ["admin", "administracao", "gestao.admin"],
    "ia_juridica": ["ia_juridica", "documentos", "ia"],
    "agentes": ["agentes", "documentos"],
  };

  return userPermissions.some(p => {
    const normalizedP = normalize(p);
    if (normalizedP === normalizedKey) return true;
    
    // Check aliases
    const keyAliases = aliases[normalizedKey] || [];
    const pAliases = aliases[normalizedP] || [];
    
    if (keyAliases.includes(normalizedP) || pAliases.includes(normalizedKey)) {
      return true;
    }
    
    return false;
  });
};
