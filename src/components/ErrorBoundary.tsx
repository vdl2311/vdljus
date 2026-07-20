import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary captured an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md p-8 bg-card border border-border rounded-2xl shadow-xl space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Ops! Algo deu errado
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ocorreu um erro inesperado na interface do JusFlow.
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 dark:bg-muted/30 border border-border rounded-xl">
              <p className="text-[11px] font-mono text-muted-foreground break-all leading-relaxed whitespace-pre-wrap">
                {this.state.error?.toString() || "Erro desconhecido"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-600/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Recarregar Sistema
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = "";
                  window.location.reload();
                }}
                className="px-4 py-2 border border-border hover:bg-accent text-muted-foreground hover:text-foreground text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
