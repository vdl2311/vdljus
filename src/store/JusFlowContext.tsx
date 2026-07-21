import { toast } from "sonner";
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { onSnapshot, collection, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Client,
  Process,
  Deadline,
  Task,
  FinancialLaunch,
  CalendarEvent,
  Workflow,
  ComplianceRule,
  ConflictCheck,
  TeamMember,
  Article,
  ModelTemplate,
  Document,
  AgentExecution,
  AppNotification,
  SyncLog,
  Movement,
  AuditLog
} from "../types";

interface JusFlowState {
  clients: Client[];
  processes: Process[];
  movements: Record<string, Movement[]>;
  deadlines: Deadline[];
  tasks: Task[];
  financials: FinancialLaunch[];
  events: CalendarEvent[];
  workflows: Workflow[];
  complianceRules: ComplianceRule[];
  conflictHistory: ConflictCheck[];
  teamMembers: TeamMember[];
  articles: Article[];
  templates: ModelTemplate[];
  documents: Document[];
  agentsHistory: AgentExecution[];
  notifications: AppNotification[];
  syncLogs: SyncLog[];
  auditLogs: AuditLog[];
  
  // Firebase status
  firebaseConnected: boolean;
  
  // Navigation & Active states
  activeTab: string; // Group.Module identifier
  selectedProcessId: string | null;
  currentUser: TeamMember | null;
  theme: "light" | "dark";
  isCommandPaletteOpen: boolean;
  
  // Actions
  setTheme: (theme: "light" | "dark") => void;
  setActiveTab: (tab: string) => void;
  setSelectedProcessId: (id: string | null) => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setCurrentUser: (user: TeamMember | null) => void;
  
  // Mutation Actions
  addClient: (client: Omit<Client, "id" | "createdAt" | "processCount" | "taskCount" | "financialBalance">) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  addProcess: (process: Omit<Process, "id" | "createdAt" | "aiSummary">) => void;
  updateProcess: (id: string, updates: Partial<Process>) => void;
  deleteProcess: (id: string) => void;
  addMovement: (processId: string, desc: string, details?: string) => void;
  
  addDeadline: (deadline: Omit<Deadline, "id">) => void;
  toggleDeadlineCompleted: (id: string) => void;
  deleteDeadline: (id: string) => void;
  
  addTask: (task: Omit<Task, "id">) => void;
  updateTaskColumn: (id: string, column: Task["column"]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addFinancial: (launch: Omit<FinancialLaunch, "id">) => void;
  toggleFinancialPaid: (id: string) => void;
  deleteFinancial: (id: string) => void;
  
  addEvent: (ev: Omit<CalendarEvent, "id">) => void;
  deleteEvent: (id: string) => void;
  
  addWorkflow: (wf: Omit<Workflow, "id">) => void;
  toggleWorkflowActive: (id: string) => void;
  deleteWorkflow: (id: string) => void;
  
  addConflictCheck: (check: Omit<ConflictCheck, "id" | "date">) => void;
  addComplianceCheck: (score: number, rules: ComplianceRule[]) => void;
  
  addTeamMember: (member: Omit<TeamMember, "id" | "status">) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  
  addArticle: (art: Omit<Article, "id" | "confidence" | "verified">) => void;
  addTemplate: (temp: Omit<ModelTemplate, "id">) => void;
  
  addDocument: (doc: Omit<Document, "id" | "createdAt">) => Document;
  signDocument: (id: string, signers: string[]) => void;
  deleteDocument: (id: string) => void;
  
  addAgentExecution: (exec: Omit<AgentExecution, "id" | "date">) => void;
  addNotification: (notif: Omit<AppNotification, "id" | "date" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addSyncLog: (log: Omit<SyncLog, "id" | "date">) => void;
  logAction: (action: string, userOverride?: string) => Promise<void>;
}

const JusFlowContext = createContext<JusFlowState | undefined>(undefined);

// INITIAL DEMO DATA
const INITIAL_CLIENTS: Client[] = [
  {
    id: "c1",
    name: "Aliança Transportes e Logística Ltda",
    type: "pj",
    document: "12.345.678/0001-90",
    email: "juridico@alianca.com.br",
    phone: "(11) 98765-4321",
    cep: "01311-200",
    address: "Avenida Paulista, 1500 - Bela Vista - São Paulo/SP",
    status: "active",
    tags: ["Contrato Mensal", "Societário", "Logística"],
    notes: "Cliente corporativo premium. Faturamento via boleto com vencimento dia 10.",
    createdAt: "2025-01-10T10:00:00Z",
    processCount: 3,
    taskCount: 2,
    financialBalance: 4500.00
  },
  {
    id: "c2",
    name: "Carlos Eduardo da Silva",
    type: "pf",
    document: "123.456.789-00",
    email: "carlosedu@gmail.com",
    phone: "(21) 99888-7766",
    cep: "20040-002",
    address: "Avenida Rio Branco, 120 - Centro - Rio de Janeiro/RJ",
    status: "active",
    tags: ["Trabalhista", "Reclamante"],
    notes: "Ação de rescisão indireta contra antiga empregadora. Ex-gerente de banco.",
    createdAt: "2025-02-15T14:30:00Z",
    processCount: 1,
    taskCount: 1,
    financialBalance: 0.00
  },
  {
    id: "c3",
    name: "Mariana Costa Neves",
    type: "pf",
    document: "987.654.321-11",
    email: "mari_neves@uol.com.br",
    phone: "(31) 99111-2233",
    cep: "30140-010",
    address: "Rua da Bahia, 1000 - Lourdes - Belo Horizonte/MG",
    status: "prospect",
    tags: ["Divórcio", "Família", "Consulta"],
    notes: "Aguardando assinatura do contrato de honorários ad exitum.",
    createdAt: "2026-07-01T09:15:00Z",
    processCount: 0,
    taskCount: 1,
    financialBalance: -350.00
  }
];

const INITIAL_PROCESSES: Process[] = [
  {
    id: "p1",
    cnj: "5001234-56.2025.8.26.0100",
    title: "Cobrança Indevida c/c Danos Morais",
    clientId: "c1",
    clientName: "Aliança Transportes e Logística Ltda",
    area: "Civil",
    risk: "low",
    court: "TJSP",
    division: "15ª Vara Cível da Capital",
    class: "Procedimento Comum Cível",
    value: 45000.00,
    plaintiff: "Aliança Transportes e Logística Ltda",
    defendant: "Telecomunicações do Brasil S.A.",
    subject: "Indenização por Dano Moral - Cobrança Indevida de Banda Larga",
    status: "active",
    notes: "Tutela antecipada deferida para retirar o nome dos órgãos de restrição de crédito.",
    aiSummary: "Trata-se de ação indenizatória motivada por inclusão indevida no SERASA por faturas já quitadas. A tutela de urgência foi deferida para sustação dos efeitos do protesto. Réplica apresentada. Aguarda saneamento do processo e designação de provas.",
    lastMovementDate: "2026-07-15",
    createdAt: "2025-03-12T10:00:00Z"
  },
  {
    id: "p2",
    cnj: "1004321-88.2025.5.02.0002",
    title: "Reclamatória Trabalhista - Horas Extras",
    clientId: "c2",
    clientName: "Carlos Eduardo da Silva",
    area: "Trabalhista",
    risk: "medium",
    court: "TRT2",
    division: "2ª Vara do Trabalho de São Paulo",
    class: "Ação Trabalhista",
    value: 125000.00,
    plaintiff: "Carlos Eduardo da Silva",
    defendant: "Banco Global S.A.",
    subject: "Diferenças salariais, cargo de confiança inadequado e horas extras.",
    status: "active",
    notes: "Audiência de instrução designada para o segundo semestre de 2026.",
    aiSummary: "Ação pleiteia descaracterização de cargo de confiança (Art. 224, §2º da CLT), pagamento de 7ª e 8ª horas diárias como extras, reflexos e integração de PLR. Defesa do banco alega amplas atribuições de chefia. Perícia contábil deferida.",
    lastMovementDate: "2026-06-10",
    createdAt: "2025-05-18T16:20:00Z"
  },
  {
    id: "p3",
    cnj: "5087654-21.2024.4.03.6100",
    title: "Anulatória de Débito Fiscal - ICMS",
    clientId: "c1",
    clientName: "Aliança Transportes e Logística Ltda",
    area: "Tributário",
    risk: "high",
    court: "TRF3",
    division: "6ª Vara Federal de Execuções Fiscais",
    class: "Procedimento Comum Federal",
    value: 850000.00,
    plaintiff: "Aliança Transportes e Logística Ltda",
    defendant: "Fazenda Nacional",
    subject: "Discussão de alíquota de ICMS e substituição tributária sobre transporte intermunicipal.",
    status: "active",
    notes: "Processo estratégico de alto valor de contingência. Depósito judicial realizado em garantia.",
    aiSummary: "Ação visando declarar a inexistência de relação jurídico-tributária sobre fretes com destino de exportação direta. Liminar indeferida inicialmente. Agravo de instrumento pendente de julgamento no Tribunal. Perito contábil indicado pelas partes.",
    lastMovementDate: "2026-04-12",
    createdAt: "2024-11-05T11:45:00Z"
  }
];

const INITIAL_MOVEMENTS: Record<string, Movement[]> = {
  p1: [
    { id: "m1_1", processId: "p1", date: "2026-07-15", description: "Juntada de Réplica à Contestação", details: "Petição de réplica protocolada sob ID #987612." },
    { id: "m1_2", processId: "p1", date: "2026-07-02", description: "Certidão de Decurso de Prazo para Réu", details: "Decorrido prazo sem apresentação de novas provas pelo réu." },
    { id: "m1_3", processId: "p1", date: "2026-06-18", description: "Juntada de Contestação pelo Réu", details: "Réu apresenta contestação alegando culpa exclusiva de terceiro." }
  ],
  p2: [
    { id: "m2_1", processId: "p2", date: "2026-06-10", description: "Designada Audiência de Instrução e Julgamento", details: "Data: 10/11/2026 às 14:00 horas no Tribunal Trabalhista." },
    { id: "m2_2", processId: "p2", date: "2026-05-14", description: "Apresentação de Laudo Pericial Contábil", details: "Perito apresenta cálculos sugerindo débito incontroverso parcial." }
  ],
  p3: [
    { id: "m3_1", processId: "p3", date: "2026-04-12", description: "Remessa dos autos para o E. Tribunal Regional (TRF3)", details: "Devido à interposição de Agravo de Instrumento contra denegação de tutela provisória." }
  ]
};

const INITIAL_DEADLINES: Deadline[] = [
  { id: "d1", title: "Protocolar Réplica à Réplica do Banco", date: "2026-07-19T23:59:59Z", completed: false, priority: "critical", processId: "p2", processTitle: "Reclamatória Trabalhista - Horas Extras", notes: "Prazo final improrrogável. OAB do réu intimada em 10 dias úteis." },
  { id: "d2", title: "Apresentar quesitos do Assistente Técnico", date: "2026-07-24T18:00:00Z", completed: false, priority: "high", processId: "p3", processTitle: "Anulatória de Débito Fiscal - ICMS", notes: "Indicação de perito e formulação de quesitos contábeis de ICMS." },
  { id: "d3", title: "Manifestação sobre Provas no TJSP", date: "2026-08-05T23:59:59Z", completed: false, priority: "medium", processId: "p1", processTitle: "Cobrança Indevida c/c Danos Morais", notes: "Requerer julgamento antecipado da lide ou produção de prova oral." },
  { id: "d4", title: "Pagar guia de custas recursais", date: "2026-07-10T19:00:00Z", completed: true, priority: "high", processId: "p1", processTitle: "Cobrança Indevida c/c Danos Morais", notes: "Guia DARE emitida e quitada pelo cliente em tempo hábil." },
  { id: "d5", title: "Enviar minuta para validação da Aliança", date: "2026-07-18T18:00:00Z", completed: true, priority: "low", notes: "Minuta de parecer tributário preventivo." }
];

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Redigir Petição Inicial de Divórcio", description: "Minutar peça inicial consensual para Mariana Costa Neves, conferindo partilha de bens móveis.", column: "todo", priority: "medium", clientId: "c3", clientName: "Mariana Costa Neves", assigneeId: "u2", assigneeName: "Dra. Letícia Antunes" },
  { id: "t2", title: "Elaborar quesitos contábeis de ICMS", description: "Contatar assistente de contabilidade para validar as memórias de cálculo de frete de exportação.", column: "in_progress", priority: "high", processId: "p3", processTitle: "Anulatória de Débito Fiscal - ICMS", assigneeId: "u1", assigneeName: "Dr. André JusFlow" },
  { id: "t3", title: "Revisar contestação da Telecom", description: "Analisar preliminares de legitimidade passiva invocadas pela ré para subsidiar a réplica.", column: "review", priority: "critical", processId: "p1", processTitle: "Cobrança Indevida c/c Danos Morais", assigneeId: "u3", assigneeName: "Dr. Roberto Mendes" },
  { id: "t4", title: "Emitir guia de custas iniciais", description: "Preparar custas de distribuição de ação civil para aprovação no financeiro.", column: "done", priority: "low", assigneeId: "u4", assigneeName: "Bruna Estagiária" }
];

const INITIAL_FINANCIALS: FinancialLaunch[] = [
  { id: "f1", title: "Mensalidade Assessoria Jurídica - Aliança", amount: 4500.00, type: "income", category: "Honorários Mensais", date: "2026-07-10", status: "paid", clientId: "c1", clientName: "Aliança Transportes e Logística Ltda" },
  { id: "f2", title: "Adiantamento para Perito Técnico - ICMS", amount: 2500.00, type: "expense", category: "Custas de Terceiros", date: "2026-07-14", status: "paid", processId: "p3", processTitle: "Anulatória de Débito Fiscal - ICMS" },
  { id: "f3", title: "Honorários Iniciais - Divórcio Consensual", amount: 3500.00, type: "income", category: "Honorários Contratuais", date: "2026-07-28", status: "pending", clientId: "c3", clientName: "Mariana Costa Neves" },
  { id: "f4", title: "Assinatura Software de Recortes e Intimações", amount: 150.00, type: "expense", category: "Ferramentas", date: "2026-07-05", status: "paid" },
  { id: "f5", title: "Custas de Postagem de Notificação Extrajudicial", amount: 45.00, type: "expense", category: "Correios", date: "2026-07-16", status: "pending", processId: "p1", processTitle: "Cobrança Indevida c/c Danos Morais" },
  { id: "f6", title: "Acordo Homologado - Banco Global", amount: 18000.00, type: "income", category: "Sucumbência", date: "2026-06-20", status: "paid", processId: "p2", processTitle: "Reclamatória Trabalhista - Horas Extras" }
];

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Audiência de Tentativa de Conciliação (PJ)", start: "2026-07-22T14:00:00Z", end: "2026-07-22T15:00:00Z", type: "hearing", processId: "p1", processTitle: "Cobrança Indevida c/c Danos Morais", description: "Audiência virtual via Microsoft Teams. Link nos autos." },
  { id: "e2", title: "Prazo Fatal: Réplica Trabalhista do Banco", start: "2026-07-19T23:59:59Z", end: "2026-07-19T23:59:59Z", type: "deadline", processId: "p2", processTitle: "Reclamatória Trabalhista - Horas Extras", description: "Prazo judicial inadiável para contraditar a defesa." },
  { id: "e3", title: "Reunião de Alinhamento com Perito Assistente", start: "2026-07-21T10:00:00Z", end: "2026-07-21T11:30:00Z", type: "task", processId: "p3", processTitle: "Anulatória de Débito Fiscal - ICMS", description: "Discussão dos quesitos e cálculo do passivo de substituição tributária." }
];

const INITIAL_TEAM: TeamMember[] = [
  { id: "u1", name: "Dr. André JusFlow", role: "admin", oab: "SP123456", email: "andre@jusflow.adv.br", permissions: ["dashboard", "copiloto", "processos", "prazos", "agenda", "tarefas", "ia_juridica", "agentes", "contratos", "conhecimento", "clientes", "financeiro", "automacoes", "compliance", "conflitos", "relatorios", "equipe", "admin", "notificações"], twoFAEnabled: true, status: "active" },
  { id: "u2", name: "Dra. Letícia Antunes", role: "partner", oab: "MG345678", email: "leticia@jusflow.adv.br", permissions: ["dashboard", "copiloto", "processos", "prazos", "agenda", "tarefas", "ia_juridica", "contratos", "conhecimento", "clientes", "financeiro", "relatorios", "notificações"], twoFAEnabled: true, status: "active" },
  { id: "u3", name: "Dr. Roberto Mendes", role: "lawyer", oab: "RJ987654", email: "roberto@jusflow.adv.br", permissions: ["dashboard", "copiloto", "processos", "prazos", "agenda", "tarefas", "ia_juridica", "conhecimento", "notificações"], twoFAEnabled: false, status: "active" },
  { id: "u4", name: "Bruna Estagiária", role: "intern", oab: "SP999999-E", email: "bruna@jusflow.adv.br", permissions: ["dashboard", "processos", "prazos", "agenda", "tarefas", "conhecimento", "notificações"], twoFAEnabled: false, status: "active" },
  { id: "u5", name: "Sandra Secretária", role: "secretary", email: "sandra@jusflow.adv.br", permissions: ["dashboard", "agenda", "clientes", "financeiro", "notificações"], twoFAEnabled: false, status: "invited" }
];

const INITIAL_WORKFLOWS: Workflow[] = [
  { id: "w1", title: "Notificar Advogado no Novo Andamento", trigger: "new_movement", actions: ["notify_advocate", "whatsapp"], active: true },
  { id: "w2", title: "Emitir Cobrança de Honorários Vencidos", trigger: "fee_overdue", actions: ["email", "whatsapp", "generate_pix"], active: true },
  { id: "w3", title: "Resumir com IA no Novo Processo", trigger: "new_process", actions: ["summarize_ai", "create_task"], active: false },
  { id: "w4", title: "Alerta de Audiência para o Cliente", trigger: "hearing_scheduled", actions: ["whatsapp", "email"], active: true }
];

const INITIAL_COMPLIANCE: ComplianceRule[] = [
  { id: "comp_1", category: "lgpd", ruleName: "Minimização e Guarda de Prontuários Digitais", severity: "high", verified: true, message: "Todos os dados de contato e documentos de identificação estão armazenados com criptografia e retenção condicional legal." },
  { id: "comp_2", category: "oab", ruleName: "Limitação de Publicidade Digital (Provimento 205/2021)", severity: "critical", verified: true, message: "Material publicitário institucional restrito à divulgação científica de decisões jurídicas sem mercantilização." },
  { id: "comp_3", category: "fees", ruleName: "Vedação de Honorários Quota-Litis superiores a 30%", severity: "medium", verified: true, message: "Contratos de êxito ativos revisados. Nenhum ultrapassa o percentual de 30% das parcelas vencidas." },
  { id: "comp_4", category: "deadlines", ruleName: "Duplo Controle de Prazos Fatais", severity: "high", verified: false, message: "Pendência identificada: Prazo 'Protocolar Réplica' (Hoje) possui apenas 1 responsável associado. Recomenda-se co-responsável." }
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: "art_1",
    title: "Inversão do Ônus da Prova no Código de Defesa do Consumidor",
    category: "jurisprudence",
    area: "Civil",
    confidence: 96,
    verified: true,
    tags: ["Consumidor", "Súmula STJ", "Ônus da Prova"],
    summary: "Síntese dos critérios para concessão da inversão do ônus da prova com base na hipossuficiência técnica organizacional e verossimilhança das alegações (Art. 6º, VIII, CDC).",
    content: "O STJ consolidou entendimento de que a inversão do ônus da prova não é automática, cabendo ao juiz aferir a hipossuficiência técnica ou a verossimilhança da alegação. O momento adequado para tal inversão é na fase de saneamento do feito."
  },
  {
    id: "art_2",
    title: "Modelo de Parecer Prévio de Risco Trabalhista - Cargo de Confiança",
    category: "template",
    area: "Trabalhista",
    confidence: 88,
    verified: true,
    tags: ["Trabalhista", "Cargo de Confiança", "Art. 224 CLT"],
    summary: "Modelo padrão de memorando para análise preventiva de enquadramento de gerentes de agência em exceções de jornada.",
    content: "O empregado bancário enquadrado no Art. 224, § 2º da CLT necessita comprovar fidúcia especial, não bastando a mera nomenclatura do cargo de chefia. A falta de poderes de admissão/demissão mitiga a aplicação de jornada especial."
  }
];

const INITIAL_TEMPLATES: ModelTemplate[] = [
  {
    id: "temp1",
    title: "Procuração Ad Judicia Et Extra",
    category: "Procuração",
    content: "OUTORGANTE: {{nome_outorgante}}, brasileiro(a), estado civil {{estado_civil}}, portador(a) do CPF nº {{cpf_outorgante}}, residente e domiciliado em {{endereco_outorgante}}.\n\nOUTORGADO: JUSFLOW ADVOCACIA, sociedade de advogados inscrita na OAB/SP sob o nº 123.456, com endereço comercial em {{endereco_escritorio}}.\n\nPODERES: Pelo presente instrumento, o outorgante confere ao outorgado amplos poderes para o foro em geral, com a cláusula AD JUDICIA ET EXTRA, em qualquer Juízo, Instância ou Tribunal, bem como poderes especiais para confessar, transigir, desistir, receber e dar quitação.",
    variables: ["nome_outorgante", "estado_civil", "cpf_outorgante", "endereco_outorgante", "endereco_escritorio"]
  },
  {
    id: "temp2",
    title: "Contrato de Honorários Ad Exitum",
    category: "Contrato de Honorários",
    content: "CONTRATANTE: {{nome_cliente}}, portador do CPF nº {{cpf_cliente}}.\n\nCONTRATADO: JUSFLOW ADVOCACIA, OAB/SP 123.456.\n\nOBJETO: Prestação de serviços jurídicos para ajuizamento e acompanhamento de {{objeto_acao}}.\n\nHONORÁRIOS: Fica pactuado o valor fixo de {{valor_fixo}} a título de pro labore mais o percentual de {{percentual_exito}}% incidentes sobre o benefício econômico obtido em caso de êxito na presente demanda judicial.",
    variables: ["nome_cliente", "cpf_cliente", "objeto_acao", "valor_fixo", "percentual_exito"]
  }
];

const INITIAL_DOCUMENTS: Document[] = [
  { id: "doc1", title: "Minuta - Procuração - Carlos Eduardo", content: "OUTORGANTE: Carlos Eduardo da Silva, brasileiro, casado, portador do CPF nº 123.456.789-00...\nPODERES: Ad Judicia para representação perante o TRT2.", status: "draft", signers: ["Carlos Eduardo da Silva"], createdAt: "2026-07-14T10:00:00Z" },
  { id: "doc2", title: "Contrato de Honorários - Aliança S.A.", content: "Prestação de serviços contínuos tributários. Mensalidade de R$ 4.500,00.\nAssinado por outorgante e outorgado eletronicamente.", status: "signed", signers: ["Aliança Representante", "Dr. André JusFlow"], signedAt: "2026-07-10T12:00:00Z", createdAt: "2026-07-09T15:30:00Z" }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", type: "deadline", title: "Prazo Crítico Hoje", message: "Prazo final para protocolo de réplica no processo Trabalhista do sr. Carlos Eduardo.", date: "2026-07-19T08:00:00Z", read: false, priority: "high" },
  { id: "n2", type: "financial", title: "Honorário Mensal Recebido", message: "Mensalidade do cliente Aliança Transportes quitada com sucesso.", date: "2026-07-10T11:05:00Z", read: false, priority: "medium" },
  { id: "n3", type: "hearing", title: "Audiência de Conciliação Marcada", message: "Audiência marcada para 22/07/2026 no processo civil da Aliança.", date: "2026-07-15T10:00:00Z", read: true, priority: "high" }
];

const INITIAL_AGENTS: AgentExecution[] = [
  { id: "ag1", agentName: "Auditor Trabalhista IA", status: "approved", result: "Análise de reflexos de horas extras validada e compatível com a tese de exclusão de cargo de fidúcia.", supervisorComment: "Trabalho excelente. Verificação de OAB em conformidade.", date: "2026-07-12T14:30:00Z", tokens: 850 },
  { id: "ag2", agentName: "Analisador Tributário Federal", status: "approved", result: "Relatório de conformidade fiscal sobre isenção de ICMS concluído.", supervisorComment: "Aprovado. Citou jurisprudências recentes aplicáveis.", date: "2026-07-14T09:12:00Z", tokens: 1100 }
];

const INITIAL_CONFLICTS: ConflictCheck[] = [
  { id: "con_1", name: "Indústrias Metalúrgicas Alfa Ltda", document: "11.222.333/0001-44", status: "conflict", matches: ["Autor no processo 00123-2025: Indústrias Metalúrgicas Alfa Ltda", "Parte adversa em consulta comercial ativa"], recommendation: "CONFLITO DETECTADO: O escritório já representa um concorrente direto em causa idêntica. Recomenda-se recusar o patrocínio desta ação.", date: "2026-07-16" },
  { id: "con_2", name: "Renata de Souza Silva", document: "444.555.666-77", status: "clear", matches: [], recommendation: "Sem conflito detectado nos registros do escritório. Prosseguimento recomendado.", date: "2026-07-18" }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud1",
    action: "Login efetuado com sucesso via Autenticação de Dois Fatores (2FA)",
    user: "Dr. André Santos (OAB/SP 123456)",
    ipAddress: "191.185.12.94",
    timestamp: "2026-07-19T18:10:00Z"
  },
  {
    id: "aud2",
    action: "Assinatura eletrônica registrada: Contrato de Honorários - c1",
    user: "Dr. André Santos (OAB/SP 123456)",
    ipAddress: "191.185.12.94",
    timestamp: "2026-07-19T15:32:00Z"
  },
  {
    id: "aud3",
    action: "Scraping DataJud automatizado: Processo 5012345-67.2026.8.26.0100",
    user: "Sistema (JusFlow Agentic)",
    ipAddress: "10.128.0.45",
    timestamp: "2026-07-19T12:00:00Z"
  },
  {
    id: "aud4",
    action: "Download de Relatório Consolidado de Faturamento PDF",
    user: "Dra. Carolina Mendes (OAB/SP 187654)",
    ipAddress: "177.34.221.8",
    timestamp: "2026-07-18T16:45:00Z"
  },
  {
    id: "aud5",
    action: "Análise de Conflito de Interesses executada: Indústrias Metalúrgicas Alfa Ltda",
    user: "Dr. André Santos (OAB/SP 123456)",
    ipAddress: "191.185.12.94",
    timestamp: "2026-07-16T14:22:00Z"
  }
];

export const JusFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available, else load default lists
  const [clients, setClients] = useState<Client[]>(() => {
    const local = localStorage.getItem("jusflow_clients");
    return local ? JSON.parse(local) : INITIAL_CLIENTS;
  });

  const [processes, setProcesses] = useState<Process[]>(() => {
    const local = localStorage.getItem("jusflow_processes");
    return local ? JSON.parse(local) : INITIAL_PROCESSES;
  });

  const [movements, setMovements] = useState<Record<string, Movement[]>>(() => {
    const local = localStorage.getItem("jusflow_movements");
    return local ? JSON.parse(local) : INITIAL_MOVEMENTS;
  });

  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    const local = localStorage.getItem("jusflow_deadlines");
    return local ? JSON.parse(local) : INITIAL_DEADLINES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const local = localStorage.getItem("jusflow_tasks");
    return local ? JSON.parse(local) : INITIAL_TASKS;
  });

  const [financials, setFinancials] = useState<FinancialLaunch[]>(() => {
    const local = localStorage.getItem("jusflow_financials");
    return local ? JSON.parse(local) : INITIAL_FINANCIALS;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const local = localStorage.getItem("jusflow_events");
    return local ? JSON.parse(local) : INITIAL_EVENTS;
  });

  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    const local = localStorage.getItem("jusflow_workflows");
    return local ? JSON.parse(local) : INITIAL_WORKFLOWS;
  });

  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>(() => {
    const local = localStorage.getItem("jusflow_compliance");
    return local ? JSON.parse(local) : INITIAL_COMPLIANCE;
  });

  const [conflictHistory, setConflictHistory] = useState<ConflictCheck[]>(() => {
    const local = localStorage.getItem("jusflow_conflict");
    return local ? JSON.parse(local) : INITIAL_CONFLICTS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const local = localStorage.getItem("jusflow_team");
    return local ? JSON.parse(local) : INITIAL_TEAM;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const local = localStorage.getItem("jusflow_articles");
    return local ? JSON.parse(local) : INITIAL_ARTICLES;
  });

  const [templates, setTemplates] = useState<ModelTemplate[]>(() => {
    const local = localStorage.getItem("jusflow_templates");
    return local ? JSON.parse(local) : INITIAL_TEMPLATES;
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const local = localStorage.getItem("jusflow_documents");
    return local ? JSON.parse(local) : INITIAL_DOCUMENTS;
  });

  const [agentsHistory, setAgentsHistory] = useState<AgentExecution[]>(() => {
    const local = localStorage.getItem("jusflow_agents");
    return local ? JSON.parse(local) : INITIAL_AGENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const local = localStorage.getItem("jusflow_notif");
    return local ? JSON.parse(local) : INITIAL_NOTIFICATIONS;
  });

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // Synchronize Firestore collections in real-time
  useEffect(() => {
    let active = true;

    // 1. Clients
    const unsubClients = onSnapshot(collection(db, "clients"), (snapshot) => {
      if (!active) return;
      setFirebaseConnected(true);
      if (snapshot.empty) {
        INITIAL_CLIENTS.forEach(item => {
          setDoc(doc(db, "clients", item.id), item).catch(console.error);
        });
      } else {
        const list: Client[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as Client);
        });
        setClients(list);
      }
    }, (error) => {
      console.error("Firebase clients sync error:", error);
      if (active) setFirebaseConnected(false);
    });

    // 2. Processes
    const unsubProcesses = onSnapshot(collection(db, "processes"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        INITIAL_PROCESSES.forEach(item => {
          setDoc(doc(db, "processes", item.id), item).catch(console.error);
        });
      } else {
        const list: Process[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as Process);
        });
        setProcesses(list);
      }
    });

    // 3. Movements
    const unsubMovements = onSnapshot(collection(db, "movements"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        Object.values(INITIAL_MOVEMENTS).flat().forEach(item => {
          setDoc(doc(db, "movements", item.id), item).catch(console.error);
        });
      } else {
        const grouped: Record<string, Movement[]> = {};
        snapshot.forEach(d => {
          const item = d.data() as Movement;
          if (!grouped[item.processId]) {
            grouped[item.processId] = [];
          }
          grouped[item.processId].push(item);
        });
        for (const pid in grouped) {
          grouped[pid].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        }
        setMovements(grouped);
      }
    });

    // 4. Deadlines
    const unsubDeadlines = onSnapshot(collection(db, "deadlines"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        INITIAL_DEADLINES.forEach(item => {
          setDoc(doc(db, "deadlines", item.id), item).catch(console.error);
        });
      } else {
        const list: Deadline[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as Deadline);
        });
        setDeadlines(list);
      }
    });

    // 5. Tasks
    const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        INITIAL_TASKS.forEach(item => {
          setDoc(doc(db, "tasks", item.id), item).catch(console.error);
        });
      } else {
        const list: Task[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as Task);
        });
        setTasks(list);
      }
    });

    // 6. Financials
    const unsubFinancials = onSnapshot(collection(db, "financials"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        INITIAL_FINANCIALS.forEach(item => {
          setDoc(doc(db, "financials", item.id), item).catch(console.error);
        });
      } else {
        const list: FinancialLaunch[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as FinancialLaunch);
        });
        setFinancials(list);
      }
    });

    // 7. Events
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        INITIAL_EVENTS.forEach(item => {
          setDoc(doc(db, "events", item.id), item).catch(console.error);
        });
      } else {
        const list: CalendarEvent[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as CalendarEvent);
        });
        setEvents(list);
      }
    });

    // 8. Documents
    const unsubDocuments = onSnapshot(collection(db, "documents"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        INITIAL_DOCUMENTS.forEach(item => {
          setDoc(doc(db, "documents", item.id), item).catch(console.error);
        });
      } else {
        const list: Document[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as Document);
        });
        setDocuments(list);
      }
    });

    // 9. Team
    const unsubTeam = onSnapshot(collection(db, "teamMembers"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        INITIAL_TEAM.forEach(item => {
          setDoc(doc(db, "teamMembers", item.id), item).catch(console.error);
        });
      } else {
        const list: TeamMember[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as TeamMember);
        });
        setTeamMembers(list);
      }
    });

    // 10. Audit Logs
    const unsubAudit = onSnapshot(collection(db, "auditLogs"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        INITIAL_AUDIT_LOGS.forEach(item => {
          setDoc(doc(db, "auditLogs", item.id), item).catch(console.error);
        });
      } else {
        const list: AuditLog[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as AuditLog);
        });
        setAuditLogs(list);
      }
    }, (error) => {
      console.error("Firebase auditLogs sync error:", error);
    });

    return () => {
      active = false;
      unsubClients();
      unsubProcesses();
      unsubMovements();
      unsubDeadlines();
      unsubTasks();
      unsubFinancials();
      unsubEvents();
      unsubDocuments();
      unsubTeam();
      unsubAudit();
    };
  }, []);

  // Navigation states
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem("jusflow_active_tab") || "principal.dashboard";
  });
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(() => {
    return localStorage.getItem("jusflow_selected_proc");
  });
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(() => {
    return INITIAL_TEAM[0]; // Admin André logado por padrão
  });

  const logAction = async (action: string, userOverride?: string) => {
    try {
      const activeUser = userOverride !== undefined ? userOverride : (currentUser ? `${currentUser.name} (${currentUser.oab || "Sem OAB"})` : "Sistema / Deslogado");
      const logEntry: AuditLog = {
        id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action,
        user: activeUser,
        ipAddress: "191.185.12.94",
        timestamp: new Date().toISOString()
      };
      
      // Save directly to Firestore collection "auditLogs"
      const docRef = doc(db, "auditLogs", logEntry.id);
      await setDoc(docRef, logEntry);
    } catch (e) {
      console.error("Erro ao registrar log de auditoria no Firestore:", e);
    }
  };

  const handleSetCurrentUser = (user: TeamMember | null) => {
    if (user) {
      logAction(`Login efetuado com sucesso para o usuário: ${user.name} (${user.oab || "Sem OAB"})`, `${user.name} (${user.oab || "Sem OAB"})`);
    } else if (currentUser) {
      logAction(`Logout efetuado para o usuário: ${currentUser.name} (${currentUser.oab || "Sem OAB"})`, `${currentUser.name} (${currentUser.oab || "Sem OAB"})`);
    }
    setCurrentUser(user);
  };
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("jusflow_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("jusflow_processes", JSON.stringify(processes));
  }, [processes]);

  useEffect(() => {
    localStorage.setItem("jusflow_movements", JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem("jusflow_deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  useEffect(() => {
    localStorage.setItem("jusflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("jusflow_financials", JSON.stringify(financials));
  }, [financials]);

  useEffect(() => {
    localStorage.setItem("jusflow_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("jusflow_workflows", JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem("jusflow_compliance", JSON.stringify(complianceRules));
  }, [complianceRules]);

  useEffect(() => {
    localStorage.setItem("jusflow_conflict", JSON.stringify(conflictHistory));
  }, [conflictHistory]);

  useEffect(() => {
    localStorage.setItem("jusflow_team", JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem("jusflow_articles", JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem("jusflow_templates", JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem("jusflow_documents", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("jusflow_agents", JSON.stringify(agentsHistory));
  }, [agentsHistory]);

  useEffect(() => {
    localStorage.setItem("jusflow_notif", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("jusflow_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (selectedProcessId) {
      localStorage.setItem("jusflow_selected_proc", selectedProcessId);
    } else {
      localStorage.removeItem("jusflow_selected_proc");
    }
  }, [selectedProcessId]);

  // Handle Theme
  const setTheme = (t: "light" | "dark") => {
    setThemeState(t);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(t);
  };

  useEffect(() => {
    setTheme(theme);
  }, []);

  // Recalculate Client counts based on relations dynamically
  const getEnrichedClients = (): Client[] => {
    return clients.map(c => {
      const pCount = processes.filter(p => p.clientId === c.id).length;
      const tCount = tasks.filter(t => t.clientId === c.id).length;
      const launches = financials.filter(f => f.clientId === c.id);
      const balance = launches.reduce((acc, curr) => {
        return curr.type === "income" ? acc + curr.amount : acc - curr.amount;
      }, 0);

      return {
        ...c,
        processCount: pCount,
        taskCount: tCount,
        financialBalance: balance
      };
    });
  };

  // Actions
  const addClient = (c: Omit<Client, "id" | "createdAt" | "processCount" | "taskCount" | "financialBalance">) => {
    const newC: Client = {
      ...c,
      id: "c_" + Date.now(),
      createdAt: new Date().toISOString()
    };
    setClients(prev => [newC, ...prev]);
    setDoc(doc(db, "clients", newC.id), newC).then(() => toast.success("Cliente criado com sucesso")).catch(e => { console.error(e); toast.error("Erro ao criar cliente") });
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    updateDoc(doc(db, "clients", id), updates as any).catch(console.error);
  };

  const deleteClient = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    const target = clients.find(c => c.id === id);
    const clientName = target ? target.name : id;
    logAction(`Exclusão de cliente: ${clientName} (ID: ${id})`);
    setClients(prev => prev.filter(c => c.id !== id));
    deleteDoc(doc(db, "clients", id)).then(() => toast.success("Cliente excluído")).catch(e => { console.error(e); toast.error("Erro ao excluir cliente") });
  };

  const addProcess = (p: Omit<Process, "id" | "createdAt" | "aiSummary">) => {
    const newP: Process = {
      ...p,
      id: "p_" + Date.now(),
      createdAt: new Date().toISOString(),
      aiSummary: "Processo cadastrado no sistema. Aguardando sincronização de andamentos DataJud..."
    };
    setProcesses(prev => [newP, ...prev]);
    setDoc(doc(db, "processes", newP.id), newP).then(() => toast.success("Processo criado com sucesso")).catch(e => { console.error(e); toast.error("Erro ao criar processo") });

    const initMovement: Movement = {
      id: "m_init_" + Date.now(),
      processId: newP.id,
      date: new Date().toISOString().split("T")[0],
      description: "Distribuição e Cadastramento",
      details: "Processo inserido eletronicamente no sistema JusFlow."
    };
    setMovements(prev => ({
      ...prev,
      [newP.id]: [initMovement]
    }));
    setDoc(doc(db, "movements", initMovement.id), initMovement).catch(console.error);
  };

  const updateProcess = (id: string, updates: Partial<Process>) => {
    const target = processes.find(p => p.id === id);
    const processTitle = target ? `${target.title} - ${target.cnj}` : id;
    const fields = Object.keys(updates).join(", ");
    logAction(`Edição de processo: ${processTitle} (Campos alterados: ${fields})`);
    setProcesses(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    updateDoc(doc(db, "processes", id), updates as any).catch(console.error);
  };

  const deleteProcess = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    const target = processes.find(p => p.id === id);
    const processTitle = target ? `${target.title} - ${target.cnj}` : id;
    logAction(`Exclusão de processo: ${processTitle} (ID: ${id})`);
    setProcesses(prev => prev.filter(p => p.id !== id));
    deleteDoc(doc(db, "processes", id)).then(() => toast.success("Processo excluído")).catch(e => { console.error(e); toast.error("Erro ao excluir processo") });
  };

  const addMovement = (processId: string, desc: string, details?: string) => {
    const newM: Movement = {
      id: "m_" + Date.now(),
      processId,
      date: new Date().toISOString().split("T")[0],
      description: desc,
      details
    };
    setMovements(prev => ({
      ...prev,
      [processId]: [newM, ...(prev[processId] || [])]
    }));
    setDoc(doc(db, "movements", newM.id), newM).catch(console.error);
  };

  const addDeadline = (d: Omit<Deadline, "id">) => {
    const newD: Deadline = { ...d, id: "d_" + Date.now() };
    setDeadlines(prev => [newD, ...prev]);
    setDoc(doc(db, "deadlines", newD.id), newD).catch(console.error);
  };

  const toggleDeadlineCompleted = (id: string) => {
    setDeadlines(prev => prev.map(d => {
      if (d.id === id) {
        const updated = { ...d, completed: !d.completed };
        updateDoc(doc(db, "deadlines", id), { completed: updated.completed }).catch(console.error);
        return updated;
      }
      return d;
    }));
  };

  const deleteDeadline = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    const target = deadlines.find(d => d.id === id);
    const deadlineTitle = target ? target.title : id;
    logAction(`Exclusão de prazo: ${deadlineTitle} (ID: ${id})`);
    setDeadlines(prev => prev.filter(d => d.id !== id));
    deleteDoc(doc(db, "deadlines", id)).catch(console.error);
  };

  const addTask = (t: Omit<Task, "id">) => {
    const newT: Task = { ...t, id: "t_" + Date.now() };
    setTasks(prev => [newT, ...prev]);
    setDoc(doc(db, "tasks", newT.id), newT).then(() => toast.success("Tarefa criada")).catch(e => { console.error(e); toast.error("Erro ao criar tarefa") });
  };

  const updateTaskColumn = (id: string, column: Task["column"]) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, column };
        updateDoc(doc(db, "tasks", id), { column }).catch(console.error);
        return updated;
      }
      return t;
    }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        updateDoc(doc(db, "tasks", id), updates as any).catch(console.error);
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    const target = tasks.find(t => t.id === id);
    const taskTitle = target ? target.title : id;
    logAction(`Exclusão de tarefa: ${taskTitle} (ID: ${id})`);
    setTasks(prev => prev.filter(t => t.id !== id));
    deleteDoc(doc(db, "tasks", id)).then(() => toast.success("Tarefa excluída")).catch(e => { console.error(e); toast.error("Erro ao excluir") });
  };

  const addFinancial = (f: Omit<FinancialLaunch, "id">) => {
    const newF: FinancialLaunch = { ...f, id: "f_" + Date.now() };
    setFinancials(prev => [newF, ...prev]);
    setDoc(doc(db, "financials", newF.id), newF).catch(console.error);
  };

  const toggleFinancialPaid = (id: string) => {
    setFinancials(prev => prev.map(f => {
      if (f.id === id) {
        const newStatus = f.status === "paid" ? "pending" : "paid";
        const updated = { ...f, status: newStatus as "paid" | "pending" };
        updateDoc(doc(db, "financials", id), { status: newStatus }).catch(console.error);
        return updated;
      }
      return f;
    }));
  };

  const deleteFinancial = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    const target = financials.find(f => f.id === id);
    const financialTitle = target ? target.title : id;
    logAction(`Exclusão de lançamento financeiro: ${financialTitle} (ID: ${id})`);
    setFinancials(prev => prev.filter(f => f.id !== id));
    deleteDoc(doc(db, "financials", id)).catch(console.error);
  };

  const addEvent = (e: Omit<CalendarEvent, "id">) => {
    const newE: CalendarEvent = { ...e, id: "e_" + Date.now() };
    setEvents(prev => [newE, ...prev]);
    setDoc(doc(db, "events", newE.id), newE).catch(console.error);
  };

  const deleteEvent = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    const target = events.find(e => e.id === id);
    const eventTitle = target ? target.title : id;
    logAction(`Exclusão de evento: ${eventTitle} (ID: ${id})`);
    setEvents(prev => prev.filter(e => e.id !== id));
    deleteDoc(doc(db, "events", id)).catch(console.error);
  };

  const addWorkflow = (w: Omit<Workflow, "id">) => {
    const newW: Workflow = { ...w, id: "w_" + Date.now() };
    setWorkflows(prev => [newW, ...prev]);
  };

  const toggleWorkflowActive = (id: string) => {
    setWorkflows(prev => prev.map(w => (w.id === id ? { ...w, active: !w.active } : w)));
  };

  const deleteWorkflow = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    const target = workflows.find(w => w.id === id);
    const workflowTitle = target ? target.title : id;
    logAction(`Exclusão de fluxo de trabalho: ${workflowTitle} (ID: ${id})`);
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  const addConflictCheck = (c: Omit<ConflictCheck, "id" | "date">) => {
    const newC: ConflictCheck = {
      ...c,
      id: "con_" + Date.now(),
      date: new Date().toISOString().split("T")[0]
    };
    setConflictHistory(prev => [newC, ...prev]);
  };

  const addComplianceCheck = (score: number, rules: ComplianceRule[]) => {
    // Overwrite compliance state or enrich existing rules
    setComplianceRules(rules);
  };

  const addTeamMember = (m: Omit<TeamMember, "id" | "status">) => {
    const newM: TeamMember = {
      ...m,
      id: "u_" + Date.now(),
      status: m.email.endsWith("@jusflow.adv.br") ? "active" : "invited"
    };
    setTeamMembers(prev => [...prev, newM]);
    setDoc(doc(db, "teamMembers", newM.id), newM).catch(console.error);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
    updateDoc(doc(db, "teamMembers", id), updates as any).catch(console.error);
  };

  const deleteTeamMember = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    const target = teamMembers.find(m => m.id === id);
    const memberName = target ? target.name : id;
    logAction(`Exclusão de membro da equipe: ${memberName} (ID: ${id})`);
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    deleteDoc(doc(db, "teamMembers", id)).catch(console.error);
  };

  const addArticle = (a: Omit<Article, "id" | "confidence" | "verified">) => {
    const newA: Article = {
      ...a,
      id: "art_" + Date.now(),
      confidence: 90,
      verified: true
    };
    setArticles(prev => [newA, ...prev]);
  };

  const addTemplate = (t: Omit<ModelTemplate, "id">) => {
    const newT: ModelTemplate = { ...t, id: "temp_" + Date.now() };
    setTemplates(prev => [newT, ...prev]);
  };

  const addDocument = (d: Omit<Document, "id" | "createdAt">): Document => {
    const newD: Document = {
      ...d,
      id: "doc_" + Date.now(),
      createdAt: new Date().toISOString()
    };
    setDocuments(prev => [newD, ...prev]);
    setDoc(doc(db, "documents", newD.id), newD).catch(console.error);
    return newD;
  };

  const signDocument = (id: string, signers: string[]) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        const updated = { ...d, status: "signed" as const, signers, signedAt: new Date().toISOString() };
        updateDoc(doc(db, "documents", id), { status: "signed", signers, signedAt: updated.signedAt }).catch(console.error);
        return updated;
      }
      return d;
    }));
  };

  const deleteDocument = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    const target = documents.find(d => d.id === id);
    const docTitle = target ? target.title : id;
    logAction(`Exclusão de documento: ${docTitle} (ID: ${id})`);
    setDocuments(prev => prev.filter(d => d.id !== id));
    deleteDoc(doc(db, "documents", id)).catch(console.error);
  };

  const addAgentExecution = (e: Omit<AgentExecution, "id" | "date">) => {
    const newE: AgentExecution = {
      ...e,
      id: "ag_" + Date.now(),
      date: new Date().toISOString()
    };
    setAgentsHistory(prev => [newE, ...prev]);
  };

  const addNotification = (n: Omit<AppNotification, "id" | "date" | "read">) => {
    const newN: AppNotification = {
      ...n,
      id: "n_" + Date.now(),
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newN, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addSyncLog = (l: Omit<SyncLog, "id" | "date">) => {
    const newL: SyncLog = {
      ...l,
      id: "s_" + Date.now(),
      date: new Date().toISOString()
    };
    setSyncLogs(prev => [newL, ...prev]);
  };

  return (
    <JusFlowContext.Provider
      value={{
        clients: getEnrichedClients(),
        processes,
        movements,
        deadlines,
        tasks,
        financials,
        events,
        workflows,
        complianceRules,
        conflictHistory,
        teamMembers,
        articles,
        templates,
        documents,
        agentsHistory,
        notifications,
        syncLogs,
        auditLogs,
        
        activeTab,
        selectedProcessId,
        currentUser,
        theme,
        isCommandPaletteOpen,
        firebaseConnected,
        
        setTheme,
        setActiveTab,
        setSelectedProcessId,
        setIsCommandPaletteOpen,
        setCurrentUser: handleSetCurrentUser,
        logAction,
        
        addClient,
        updateClient,
        deleteClient,
        addProcess,
        updateProcess,
        deleteProcess,
        addMovement,
        addDeadline,
        toggleDeadlineCompleted,
        deleteDeadline,
        addTask,
        updateTaskColumn,
        updateTask,
        deleteTask,
        addFinancial,
        toggleFinancialPaid,
        deleteFinancial,
        addEvent,
        deleteEvent,
        addWorkflow,
        toggleWorkflowActive,
        deleteWorkflow,
        addConflictCheck,
        addComplianceCheck,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addArticle,
        addTemplate,
        addDocument,
        signDocument,
        deleteDocument,
        addAgentExecution,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        addSyncLog
      }}
    >
      {children}
    </JusFlowContext.Provider>
  );
};

export const useJusFlow = () => {
  const context = useContext(JusFlowContext);
  if (context === undefined) {
    throw new Error("useJusFlow must be used within a JusFlowProvider");
  }
  return context;
};
