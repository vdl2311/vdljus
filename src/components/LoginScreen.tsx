import React, { useState } from "react";
import { useJusFlow } from "../store/JusFlowContext";
import { TeamMember } from "../types";
import {
  ShieldAlert,
  Sparkle,
  Lock,
  Mail,
  ArrowRight,
  RefreshCw,
  Key,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const LoginScreen: React.FC<{
  onLoginSuccess: (user: TeamMember) => void;
}> = ({ onLoginSuccess }) => {
  const { teamMembers } = useJusFlow();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show2fa, setShow2fa] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successRecovery, setSuccessRecovery] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const user = teamMembers.find(
      (m) => m.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      setErrorMessage("E-mail não cadastrado na plataforma.");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("Senha incorreta ou muito curta.");
      return;
    }

    triggerUserLogin(user);
  };

  const triggerUserLogin = (user: TeamMember) => {
    setSelectedUser(user);
    if (user.twoFAEnabled) {
      setShow2fa(true);
    } else {
      onLoginSuccess(user);
    }
  };

  const handleTwoFaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFaCode.length === 6) {
      if (selectedUser) {
        onLoginSuccess(selectedUser);
      }
    } else {
      setErrorMessage("Código de 2FA inválido. Digite um código de 6 dígitos.");
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessRecovery(
      "Instruções de redefinição de senha enviadas para seu e-mail.",
    );
    setTimeout(() => {
      setShowRecovery(false);
      setSuccessRecovery("");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex w-full bg-background font-sans">
      {/* Painel Esquerdo */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background flex-col justify-center items-center p-12 border-r border-border">
        <div className="w-24 h-24 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-8">
          <Sparkle className="w-12 h-12 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground text-center mb-4">
          Bem-vindo ao JusFlow
        </h1>
        <p className="text-muted-foreground text-center max-w-md text-lg">
          Plataforma Jurídica Inteligente com Copiloto IA, OAB-Compliance e
          Gestão Completa.
        </p>
      </div>

      {/* Painel Direito */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div role="dialog" aria-modal="true" className="w-full max-w-sm space-y-8">
          <div className="flex flex-col space-y-2 lg:hidden items-center mb-8">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg mb-2">
              <Sparkle className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">JusFlow</h2>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {show2fa
                ? "Autenticação em 2 Fatores"
                : showRecovery
                  ? "Recuperar Senha"
                  : "Entrar na plataforma"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {show2fa
                ? "Insira o token do seu aplicativo autenticador."
                : showRecovery
                  ? "Enviaremos um link de recuperação para seu e-mail."
                  : "Insira suas credenciais para acessar sua conta."}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-xs text-destructive">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successRecovery && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>{successRecovery}</span>
            </div>
          )}

          {/* Forms */}
          {show2fa ? (
            <form onSubmit={handleTwoFaSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Token 2FA
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={twoFaCode}
                    onChange={(e) =>
                      setTwoFaCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="000000"
                    className="font-mono tracking-[0.3em] text-center text-lg h-12"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-10 text-sm font-semibold"
              >
                Validar Token <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs"
                onClick={() => setShow2fa(false)}
              >
                Voltar ao login
              </Button>
            </form>
          ) : showRecovery ? (
            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  E-mail corporativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="advogado@escritorio.com.br"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-10 text-sm font-semibold"
              >
                Enviar link de recuperação
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs"
                onClick={() => setShowRecovery(false)}
              >
                Voltar ao login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  E-mail corporativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="advogado@escritorio.com.br"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none">
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRecovery(true)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-10 text-sm font-semibold"
              >
                Entrar <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="mt-8">
                <p className="text-xs text-muted-foreground text-center">
                  Acesso restrito a usuários autorizados.
                  <br />
                  Monitoramento OAB/LGPD ativo.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
