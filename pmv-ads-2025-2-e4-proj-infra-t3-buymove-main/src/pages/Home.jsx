import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Comparação transparente",
    description:
      "Acesse preços oficiais e ofertas atualizadas de concessionárias e lojas parceiras.",
  },
  {
    title: "Filtro inteligente",
    description:
      "Refine por categoria, faixa de preço, consumo, tecnologia embarcada e muito mais.",
  },
  {
    title: "Favoritos sincronizados",
    description:
      "Salve modelos para revisar depois e compartilhe com quem decide junto com você.",
  },
];

const steps = [
  {
    number: "1",
    title: "Explore o catálogo",
    description:
      "Pesquise por marca, modelo ou palavra-chave e encontre detalhes completos em segundos.",
  },
  {
    number: "2",
    title: "Compare o que importa",
    description:
      "Analise preços, versões, consumo e itens de série lado a lado antes de escolher.",
  },
  {
    number: "3",
    title: "Salve seus favoritos",
    description:
      "Monte uma lista personalizada, organize próximos passos e retome quando quiser.",
  },
];

export default function Home() {
  return (
    <section className="space-y-12">
      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-xl lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
          Seu guia de compra inteligente
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Bem-vindo ao buyMove</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Descubra o veículo ideal comparando preços, características e avaliações em poucos cliques. Quando estiver pronto, avance para a compra com um clique.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            Explorar catálogo
          </Link>
          <Link
            to="/favorites"
            className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ver favoritos
          </Link>
          <Link
            to="/vehicle/new"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
          >
            Anunciar veículo
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-blue-900">Por que escolher o buyMove?</h2>
        <p className="max-w-3xl text-slate-600">
          Reunimos dados confiáveis e ferramentas simples para que você tome decisões com segurança e economia.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ title, description }, index) => (
            <article
              key={title}
              className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
              <p className="text-sm text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-blue-900">Como funciona</h2>
        <p className="mt-2 text-slate-600">
          Em poucos passos você encontra, compara e salva os veículos que combinam com a sua realidade.
        </p>
        <ol className="mt-6 space-y-4">
          {steps.map(({ number, title, description }) => (
            <li
              key={title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-semibold text-blue-800 shadow-sm">
                {number}
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-blue-900">{title}</h3>
                <p className="text-sm text-slate-600">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}

