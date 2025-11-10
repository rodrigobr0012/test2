import { Outlet, NavLink, Link } from "react-router-dom";

const NAV_LINKS = [
  { to: "/catalog", label: "Catálogo" },
  { to: "/favorites", label: "Favoritos" },
  { to: "/profile", label: "Perfil" },
  { to: "/login", label: "Entrar" },
];

const ACTION_LINKS = [
  {
    to: "/vehicle/new",
    label: "Anunciar veículo",
    style:
      "bg-red-600 text-white shadow-sm hover:bg-red-500 focus-visible:outline-red-600",
  },
  {
    to: "/register",
    label: "Cadastre-se",
    style:
      "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600",
  },
];

function Header() {
  const navClass = ({ isActive }) =>
    [
      "rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
      isActive
        ? "bg-blue-900 text-white shadow-sm"
        : "text-slate-500 hover:text-blue-700",
    ].join(" ");

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-lg font-bold text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          buyMove
        </Link>
        <nav className="flex items-center gap-2" aria-label="Navegação principal">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navClass}>
              {label}
            </NavLink>
          ))}
          {ACTION_LINKS.map(({ to, label, style }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${style}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
        &copy; {new Date().getFullYear()} buyMove. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-blue-900 focus-visible:px-5 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:shadow-lg"
      >
        Ir para o conteúdo principal
      </a>
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full flex-1 max-w-6xl px-4 py-6"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
