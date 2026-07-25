import { toast } from "sonner";
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { onSnapshot, collection, doc, setDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
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
  resetToProductionMode: () => Promise<void>;
  
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

// PRODUCTION INITIAL DATA (Clean arrays for real user operations)
const INITIAL_CLIENTS: Client[] = [];
const INITIAL_PROCESSES: Process[] = [];
const INITIAL_MOVEMENTS: Record<string, Movement[]> = {};
const INITIAL_DEADLINES: Deadline[] = [];
const INITIAL_TASKS: Task[] = [];
const INITIAL_FINANCIALS: FinancialLaunch[] = [];
const INITIAL_EVENTS: CalendarEvent[] = [];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "u1",
    name: "Advogado Administrador",
    role: "admin",
    oab: "UF000000",
    email: "admin@escritorio.adv.br",
    permissions: [
      "dashboard", "copiloto", "processos", "prazos", "agenda", "tarefas",
      "ia_juridica", "agentes", "contratos", "conhecimento", "clientes",
      "financeiro", "automacoes", "compliance", "conflitos", "relatorios",
      "equipe", "admin", "notificações"
    ],
    twoFAEnabled: true,
    status: "active"
  }
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
  { id: "comp_4", category: "deadlines", ruleName: "Duplo Controle de Prazos Fatais", severity: "high", verified: true, message: "Controle duplo de prazos ativos e sincronizados com a agenda institucional." }
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
    summary: "Modelo padrão de memorando para análise preventiva de enquadramento de gerentes em exceções de jornada.",
    content: "O empregado bancário enquadrado no Art. 224, § 2º da CLT necessita comprovar fidúcia especial, não bastando a mera nomenclatura do cargo de chefia. A falta de poderes de admissão/demissão mitiga a aplicação de jornada especial."
  }
];

const INITIAL_TEMPLATES: ModelTemplate[] = [
  {
    id: "temp1",
    title: "Procuração Ad Judicia Et Extra",
    category: "Procuração",
    content: "OUTORGANTE: {{nome_outorgante}}, brasileiro(a), estado civil {{estado_civil}}, portador(a) do CPF nº {{cpf_outorgante}}, residente e domiciliado em {{endereco_outorgante}}.\n\nOUTORGADO: JUSFLOW ADVOCACIA, sociedade de advogados com endereço comercial em {{endereco_escritorio}}.\n\nPODERES: Pelo presente instrumento, o outorgante confere ao outorgado amplos poderes para o foro em geral, com a cláusula AD JUDICIA ET EXTRA, em qualquer Juízo, Instância ou Tribunal, bem como poderes especiais para confessar, transigir, desistir, receber e dar quitação.",
    variables: ["nome_outorgante", "estado_civil", "cpf_outorgante", "endereco_outorgante", "endereco_escritorio"]
  },
  {
    id: "temp2",
    title: "Contrato de Honorários Ad Exitum",
    category: "Contrato de Honorários",
    content: "CONTRATANTE: {{nome_cliente}}, portador do CPF nº {{cpf_cliente}}.\n\nCONTRATADO: JUSFLOW ADVOCACIA.\n\nOBJETO: Prestação de serviços jurídicos para ajuizamento e acompanhamento de {{objeto_acao}}.\n\nHONORÁRIOS: Fica pactuado o valor fixo de {{valor_fixo}} a título de pro labore mais o percentual de {{percentual_exito}}% incidentes sobre o benefício econômico obtido em caso de êxito na presente demanda judicial.",
    variables: ["nome_cliente", "cpf_cliente", "objeto_acao", "valor_fixo", "percentual_exito"]
  }
];

const INITIAL_DOCUMENTS: Document[] = [];
const INITIAL_NOTIFICATIONS: AppNotification[] = [];
const INITIAL_AGENTS: AgentExecution[] = [];
const INITIAL_CONFLICTS: ConflictCheck[] = [];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud_init",
    action: "Sistema JusFlow ativado em Modo Produção",
    user: "Advogado Administrador",
    ipAddress: "127.0.0.1",
    timestamp: new Date().toISOString()
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
        setClients([]);
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
        setProcesses([]);
      } else {
        const list: Process[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as Process);
        });
        setProcesses(list);
      }
    }, (error) => {
      console.warn("Firebase processes sync notice:", error?.message || error);
    });

    // 3. Movements
    const unsubMovements = onSnapshot(collection(db, "movements"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        setMovements({});
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
    }, (error) => {
      console.warn("Firebase movements sync notice:", error?.message || error);
    });

    // 4. Deadlines
    const unsubDeadlines = onSnapshot(collection(db, "deadlines"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        setDeadlines([]);
      } else {
        const list: Deadline[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as Deadline);
        });
        setDeadlines(list);
      }
    }, (error) => {
      console.warn("Firebase deadlines sync notice:", error?.message || error);
    });

    // 5. Tasks
    const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        setTasks([]);
      } else {
        const list: Task[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as Task);
        });
        setTasks(list);
      }
    }, (error) => {
      console.warn("Firebase tasks sync notice:", error?.message || error);
    });

    // 6. Financials
    const unsubFinancials = onSnapshot(collection(db, "financials"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        setFinancials([]);
      } else {
        const list: FinancialLaunch[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as FinancialLaunch);
        });
        setFinancials(list);
      }
    }, (error) => {
      console.warn("Firebase financials sync notice:", error?.message || error);
    });

    // 7. Events
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        setEvents([]);
      } else {
        const list: CalendarEvent[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as CalendarEvent);
        });
        setEvents(list);
      }
    }, (error) => {
      console.warn("Firebase events sync notice:", error?.message || error);
    });

    // 8. Documents
    const unsubDocuments = onSnapshot(collection(db, "documents"), (snapshot) => {
      if (!active) return;
      if (snapshot.empty) {
        setDocuments([]);
      } else {
        const list: Document[] = [];
        snapshot.forEach(d => {
          list.push(d.data() as Document);
        });
        setDocuments(list);
      }
    }, (error) => {
      console.warn("Firebase documents sync notice:", error?.message || error);
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

        // Keep current user updated in real-time if their details change
        const storedUserJson = localStorage.getItem("jusflow_current_user");
        if (storedUserJson) {
          try {
            const parsedStored = JSON.parse(storedUserJson) as TeamMember;
            const updatedUser = list.find(u => u.id === parsedStored.id);
            if (updatedUser) {
              setCurrentUser(updatedUser);
              localStorage.setItem("jusflow_current_user", JSON.stringify(updatedUser));
            }
          } catch (e) {
            console.error("Error syncing current user from Firestore update:", e);
          }
        }
      }
    }, (error) => {
      console.warn("Firebase teamMembers sync notice:", error?.message || error);
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
    const local = localStorage.getItem("jusflow_current_user");
    return local ? JSON.parse(local) : INITIAL_TEAM[0]; // Admin André logado por padrão se não houver no localStorage
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
      localStorage.setItem("jusflow_current_user", JSON.stringify(user));
    } else {
      if (currentUser) {
        logAction(`Logout efetuado para o usuário: ${currentUser.name} (${currentUser.oab || "Sem OAB"})`, `${currentUser.name} (${currentUser.oab || "Sem OAB"})`);
      }
      localStorage.removeItem("jusflow_current_user");
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
      status: m.email.endsWith("@jusflow.adv.br") ? "active" : "invited",
      password: "demo123",
      isTemporaryPassword: true
    };
    setTeamMembers(prev => [...prev, newM]);
    setDoc(doc(db, "teamMembers", newM.id), newM)
      .then(() => {
        toast.success(`Membro convidado! Ele pode acessar com a senha padrão "demo123".`);
      })
      .catch(e => {
        console.error(e);
        toast.error("Erro ao convidar membro da equipe");
      });
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
    updateDoc(doc(db, "teamMembers", id), updates as any).catch(console.error);
  };

  const deleteTeamMember = (id: string) => {
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

  const resetToProductionMode = async () => {
    const keysToClear = [
      "jusflow_clients",
      "jusflow_processes",
      "jusflow_movements",
      "jusflow_deadlines",
      "jusflow_tasks",
      "jusflow_financials",
      "jusflow_events",
      "jusflow_documents",
      "jusflow_agents",
      "jusflow_notif",
      "jusflow_conflict",
      "jusflow_audit"
    ];
    keysToClear.forEach(k => localStorage.removeItem(k));

    setClients([]);
    setProcesses([]);
    setMovements({});
    setDeadlines([]);
    setTasks([]);
    setFinancials([]);
    setEvents([]);
    setDocuments([]);
    setAgentsHistory([]);
    setNotifications([]);
    setConflictHistory([]);

    try {
      const collectionsToDelete = [
        "clients",
        "processes",
        "movements",
        "deadlines",
        "tasks",
        "financials",
        "events",
        "documents",
        "agents",
        "notifications",
        "conflicts"
      ];
      for (const colName of collectionsToDelete) {
        const snap = await getDocs(collection(db, colName));
        const deletes = snap.docs.map(d => deleteDoc(doc(db, colName, d.id)));
        await Promise.all(deletes);
      }
    } catch (e) {
      console.error("Erro ao limpar coleções no Firestore:", e);
    }

    const cleanLog: AuditLog = {
      id: `aud_prod_${Date.now()}`,
      action: "Base de dados totalmente redefinida para o Modo Produção (Sem Dados Fictícios)",
      user: currentUser ? currentUser.name : "Advogado Administrador",
      ipAddress: "127.0.0.1",
      timestamp: new Date().toISOString()
    };
    setAuditLogs([cleanLog]);
    setDoc(doc(db, "auditLogs", cleanLog.id), cleanLog).catch(console.error);

    toast.success("Base de dados redefinida para Produção com sucesso!");
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
        resetToProductionMode,
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
