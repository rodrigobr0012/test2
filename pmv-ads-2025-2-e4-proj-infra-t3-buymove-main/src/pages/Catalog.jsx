import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import BackToHome from "@/components/BackToHome";
import SearchBar from "@/components/SearchBar";
import FiltersPanel from "@/components/FiltersPanel";
import VehicleCard from "@/components/VehicleCard";
import { listVehicles } from "@/services/vehicles";
import { useFetch } from "@/hooks/useFetch";

export default function Catalog() {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200000);
  const [color, setColor] = useState("");
  const [doors, setDoors] = useState("");
  const [location, setLocation] = useState("");
  const [quickView, setQuickView] = useState(false);

  const fetcher = useMemo(
    () => () =>
      listVehicles({
        q,
        brand,
        minPrice: priceMin,
        maxPrice: priceMax,
        color,
        doors,
        location,
        page: 1,
        pageSize: 12,
      }),
    [q, brand, priceMin, priceMax, color, doors, location]
  );

  const { data, loading, error } = useFetch(fetcher, [fetcher]);
  const items = data?.items ?? [];
  const hasResults = !loading && !error && items.length > 0;

  
  return (
    <section className="space-y-10">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              Catálogo buyMove
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">Compare modelos em segundos</h1>
            <p className="max-w-2xl text-lg text-blue-100">
              Use a busca inteligente e os filtros detalhados para chegar rapidamente aos veículos que combinam com o seu perfil.
            </p>
          </div>
          <Link
            to="/vehicle/new"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
          >
            Anunciar um veículo
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Preferências de visualização
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Altere para o modo rápido e veja cards compactos, ideais para comparar vários modelos de uma vez.
            </p>
            <label className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <span>Modo rápido</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-blue-700"
                checked={quickView}
                onChange={(e) => setQuickView(e.target.checked)}
              />
            </label>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm text-slate-700">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Dica
            </h3>
            <p className="mt-2 text-sm">
              Combine filtros de preço com cor e localização para descobrir ofertas exclusivas perto de você.
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SearchBar value={q} onChange={setQ} onSubmit={() => {}} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-900">Filtros rápidos</h2>
              <span className="text-xs font-medium text-slate-400">Atualiza em tempo real</span>
            </div>
            <FiltersPanel
              brand={brand}
              setBrand={setBrand}
              priceMin={priceMin}
              setPriceMin={setPriceMin}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              color={color}
              setColor={setColor}
              doors={doors}
              setDoors={setDoors}
              location={location}
              setLocation={setLocation}
            />
          </div>

          {loading && <p className="text-sm text-slate-500">Carregando resultados...</p>}
          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Erro ao carregar: {String(error.message || error)}
            </p>
          )}

          {hasResults && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                <span>
                  {items.length} {items.length === 1 ? "modelo" : "modelos"} encontrados
                </span>
                <span>Ordenados por relevância</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((v) => (
                  <VehicleCard key={v.id} v={v} quick={quickView} />
                ))}
              </div>
            </div>
          )}

          {!loading && !error && !items.length && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-blue-900">Nada por aqui ainda</h3>
              <p className="mt-2 text-sm text-slate-600">
                Ajuste a busca ou limpe alguns filtros para ver mais opções.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

