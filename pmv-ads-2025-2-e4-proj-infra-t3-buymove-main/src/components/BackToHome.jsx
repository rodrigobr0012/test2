import { Link } from "react-router-dom";

export default function BackToHome({ className = "" }) {
  return (
    <div className={`flex ${className}`.trim()}>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-blue-800 transition hover:border-blue-500 hover:text-blue-600"
      >
        Voltar para início
      </Link>
    </div>
  );
}

