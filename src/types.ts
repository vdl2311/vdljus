export type ClientStatus = 'prospect' | 'active' | 'inactive';
export type ClientType = 'pf' | 'pj';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  document: string; // CPF or CNPJ
  email: string;
  phone: string;
  cep: string;
  address: string;
  status: ClientStatus;
  tags: string[];
  notes?: string;
  createdAt: string;
  processCount?: number;
  taskCount?: number;
  financialBalance?: number;
}

export type ProcessStatus = 'active' | 'suspended' | 'completed' | 'archived';
export type ProcessRisk = 'low' | 'medium' | 'high';

export interface Process {
  id: string;
  cnj: string; // CNJ format XX.XXXX.X.XX.XXXX
  title: string;
  clientId: string;
  clientName: string;
  area: string; // Civil, Trabalhista, Tributário, Penal, Família, Administrativo, Previdenciário
  risk: ProcessRisk;
  court: string; // e.g., TJSP, TRT2, TRF3
  division: string; // e.g., 2ª Vara Cível
  class: string; // e.g., Procedimento Comum Cível
  value: number; // Valor da causa
  plaintiff: string; // Autor
  defendant: string; // Réu
  subject: string; // Assunto
  status: ProcessStatus;
  notes?: string;
  aiSummary?: string;
  lastMovementDate?: string;
  outcome?: string;
  createdAt: string;
}

export interface Movement {
  id: string;
  processId: string;
  date: string;
  description: string;
  details?: string;
}

export interface Deadline {
  id: string;
  title: string;
  date: string; // ISO String
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  processId?: string;
  processTitle?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  column: 'backlog' | 'todo' | 'doing' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  processId?: string;
  processTitle?: string;
  clientId?: string;
  clientName?: string;
  assigneeId?: string;
  assigneeName?: string;
}

export interface FinancialLaunch {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  status: 'paid' | 'pending';
  processId?: string;
  processTitle?: string;
  clientId?: string;
  clientName?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date-time
  end: string; // ISO date-time
  type: 'hearing' | 'deadline' | 'task' | 'dispatch' | 'pericia';
  processId?: string;
  processTitle?: string;
  description?: string;
}

export interface Workflow {
  id: string;
  title: string;
  trigger: 'new_process' | 'hearing_scheduled' | 'fee_overdue' | 'new_movement';
  actions: string[]; // e.g. ['email', 'whatsapp', 'task', 'notify_advocate']
  active: boolean;
}

export interface ComplianceRule {
  id: string;
  category: 'lgpd' | 'oab' | 'conflict' | 'confidentiality' | 'fees' | 'deadlines' | 'security';
  ruleName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  verified: boolean;
  message: string;
}

export interface ConflictCheck {
  id: string;
  name: string;
  document: string;
  status: 'clear' | 'conflict';
  matches: string[];
  recommendation: string;
  date: string;
}

export type MemberRole = 'admin' | 'partner' | 'lawyer' | 'intern' | 'secretary';

export interface TeamMember {
  id: string;
  name: string;
  role: MemberRole;
  oab?: string;
  email: string;
  permissions: string[]; // Modules they can access
  twoFAEnabled: boolean;
  status: 'active' | 'invited';
  password?: string;
  isTemporaryPassword?: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: 'jurisprudence' | 'doctrine' | 'thesis' | 'case' | 'template';
  content: string;
  area: string;
  confidence: number; // percentage
  verified: boolean;
  url?: string;
  tags: string[];
  summary?: string;
  referenceCode?: string;
}

export interface ModelTemplate {
  id: string;
  title: string;
  category: string; // e.g., Procuração, Contrato de Honorários, Petição Inicial
  content: string;
  variables: string[];
}

export interface Document {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'signed';
  signers: string[];
  signedAt?: string;
  createdAt: string;
}

export interface AgentExecution {
  id: string;
  agentName: string;
  status: 'approved' | 'rejected' | 'running';
  result: string;
  supervisorComment?: string;
  date: string;
  tokens: number;
}

export interface AppNotification {
  id: string;
  type: 'deadline' | 'financial' | 'task' | 'hearing' | 'general';
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface SyncLog {
  id: string;
  date: string;
  tribunal: string;
  status: 'success' | 'failed';
  cnj: string;
  movementsCount: number;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  ipAddress: string;
  timestamp: string;
}

