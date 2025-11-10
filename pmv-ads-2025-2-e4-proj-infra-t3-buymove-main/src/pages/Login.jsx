import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BackToHome from "@/components/BackToHome";
import { useAuth } from "@/context/auth-context";

export default function Login() {
  const { login, logout, user, authError, isAuthenticating, initializing } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const userName = useMemo(() => user?.full_name || user?.email || "Usuário", [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    try {
      await login({ email, password });
      setPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível fazer login.";
      setFormError(message);
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200";
  const buttonClass =
    "inline-flex w-full items-center justify-center rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300";

  if (initializing) {
    return (
      <section className="space-y-8" aria-busy="true" aria-live="polite">
        <BackToHome className="justify-start" />
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Preparando ambiente seguro...
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <section className="space-y-8">
        <BackToHome className="justify-start" />

        <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Você já está conectado</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Continue explorando o catálogo e acompanhe as novidades da sua garagem inteligente.
          </p>
        </header>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-600">
            Logado como <span className="font-semibold text-blue-900">{userName}</span>.
          </p>
          <button onClick={logout} className={`mt-6 ${buttonClass}`}>
            Sair
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Entrar</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Acesse sua conta buyMove</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Salve favoritos, sincronize preferências e acompanhe notícias exclusivas sobre novos modelos.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-sm space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        noValidate
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">E-mail</label>
          <input
            type="email"
            required
            className={fieldClass}
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Senha</label>
          <input
            type="password"
            required
            className={fieldClass}
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {(formError || authError) && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {formError || authError}
          </p>
        )}
        <button className={buttonClass} disabled={isAuthenticating}>
          {isAuthenticating ? "Entrando..." : "Entrar"}
        </button>
        <p className="text-sm text-slate-500">
          Ainda não tem conta?
          <Link to="/register" className="ml-2 font-semibold text-blue-700 transition hover:text-blue-600">
            Cadastre-se
          </Link>
        </p>
      </form>
    </section>
  );
}
