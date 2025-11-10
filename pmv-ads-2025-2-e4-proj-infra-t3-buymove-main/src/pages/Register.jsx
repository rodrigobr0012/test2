import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BackToHome from "@/components/BackToHome";
import { useAuth } from "@/context/auth-context";
import { registerUser } from "@/services/auth";

export default function Register() {
  const { login, logout, user, isAuthenticating, initializing } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userName = useMemo(() => user?.full_name || user?.email || "Usuário", [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage("");

    if (password.length < 8) {
      setFormError("A senha deve conter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("As senhas informadas não são iguais.");
      return;
    }

    const payload = {
      email: email.trim().toLowerCase(),
      password,
      ...(fullName.trim() ? { full_name: fullName.trim() } : {}),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      ...(document.trim() ? { document: document.trim() } : {}),
    };

    setIsSubmitting(true);
    try {
      await registerUser(payload);
      setSuccessMessage("Cadastro concluído com sucesso! Estamos entrando na sua nova conta.");
      await login({ email: payload.email, password });
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível concluir seu cadastro.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold sm:text-4xl">Conta pronta para uso</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            {successMessage
              ? successMessage
              : "Você já concluiu o cadastro e pode aproveitar todos os recursos da buyMove."}
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
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Criar conta</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Cadastre-se na buyMove em poucos passos</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Salve veículos favoritos, receba alertas personalizados e gerencie seu histórico em um só lugar.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        noValidate
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="fullName">
            Nome completo
          </label>
          <input
            id="fullName"
            type="text"
            className={fieldClass}
            placeholder="Como devemos te chamar?"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            className={fieldClass}
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="phone">
            Telefone (opcional)
          </label>
          <input
            id="phone"
            type="tel"
            className={fieldClass}
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="document">
            CPF ou CNPJ (opcional)
          </label>
          <input
            id="document"
            type="text"
            className={fieldClass}
            placeholder="000.000.000-00"
            value={document}
            onChange={(event) => setDocument(event.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            className={fieldClass}
            placeholder="Crie uma senha forte"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="confirmPassword">
            Confirme a senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            className={fieldClass}
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
          />
        </div>

        {(formError || successMessage) && (
          <p
            className={`rounded-xl px-4 py-3 text-sm ${
              formError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
            }`}
            role="alert"
          >
            {formError || successMessage}
          </p>
        )}

        <button
          className={buttonClass}
          disabled={isSubmitting || isAuthenticating}
        >
          {isSubmitting || isAuthenticating ? "Processando cadastro..." : "Criar conta"}
        </button>

        <p className="text-sm text-slate-500">
          Já possui uma conta?
          <Link to="/login" className="ml-2 font-semibold text-blue-700 transition hover:text-blue-600">
            Fazer login
          </Link>
        </p>
      </form>
    </section>
  );
}
