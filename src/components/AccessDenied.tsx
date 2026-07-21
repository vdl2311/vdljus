import React from "react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useJusFlow } from "../store/JusFlowContext";

interface AccessDeniedProps {
  moduleName?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ moduleName }) => {
  const { setActiveTab } = useJusFlow();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 mb-6 animate-bounce">
        <ShieldAlert className="w-8 h-8" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Acesso Restrito
      </h1>
      
      <p className="mt-3 text-sm text-muted-foreground max-w-md">
        Desculpe, sua conta não possui as permissões necessárias para acessar o módulo 
        {moduleName ? <span className="font-semibold text-foreground"> "{moduleName}"</span> : " solicitado"}. 
        Entre em contato com o administrador do escritório para solicitar o acesso.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar Página
        </button>
        <button
          onClick={() => setActiveTab("principal.dashboard")}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          Ir para o Dashboard
        </button>
      </div>
    </div>
  );
};
