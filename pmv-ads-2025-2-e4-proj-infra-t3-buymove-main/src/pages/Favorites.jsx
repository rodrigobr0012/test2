import { useState } from "react";
import BackToHome from "@/components/BackToHome";
import VehicleCard from "@/components/VehicleCard";
import { useFavorites } from "@/context/favorites-context";
import vehicles from "@/mocks/vehicles.json";

export default function Favorites() {
  const { favorites, removeFavorite, loading, error, refreshFavorites, isRemote } = useFavorites();
  const [removingId, setRemovingId] = useState(null);
  const hasFavorites = favorites.length > 0;
  const suggestions = vehicles.slice(0, 3);

  const handleRemove = async (vehicleId) => {
    setRemovingId(vehicleId);
    try {
      await removeFavorite(vehicleId);
    } catch (err) {
      console.error("Não foi possível remover o favorito", err);
      if (typeof window !== "undefined") {
        window.alert?.("Não foi possível remover este favorito. Tente novamente.");
      }
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="space-y-8">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Garagem inteligente</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Seus veículos favoritos em um só lugar</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Compare ofertas, organize test-drives e receba alertas de variação de preço para não perder nenhuma oportunidade.
        </p>
      </header>

      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Carregando seus favoritos...</p>
        ) : error ? (
          <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>Não foi possível carregar seus favoritos.</p>
            <button
              type="button"
              onClick={() => refreshFavorites()}
              className="inline-flex w-full items-center justify-center rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
            >
              Tentar novamente
            </button>
          </div>
        ) : hasFavorites ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-900">Lista de desejos</h2>
                <p className="text-sm text-slate-500">
                  Você pode favoritar quantos veículos quiser e receber recomendações personalizadas.
                </p>
              </div>
              <p className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                {favorites.length} veículo{favorites.length > 1 ? "s" : ""} salvo{favorites.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {favorites.map((vehicle) => (
                <div key={vehicle.id} className="space-y-4 rounded-3xl border border-slate-200 p-5 shadow-sm">
                  <VehicleCard v={vehicle} quick />
                  <button
                    type="button"
                    onClick={() => handleRemove(vehicle.id)}
                    disabled={removingId === vehicle.id}
                    className="w-full rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remover da lista
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-5 text-center text-slate-500">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-50/80 text-blue-600 shadow-inner">
              <div className="flex h-full items-center justify-center text-2xl">★</div>
            </div>
            <h2 className="text-xl font-semibold text-blue-900">Nenhum favorito por aqui ainda</h2>
            <p className="mx-auto max-w-lg text-sm">
              {isRemote
                ? "Ao navegar pelo catálogo, toque no botão 'Favoritar' para guardar os modelos que mais gostar. Eles ficam salvos na sua conta."
                : "Explore o catálogo, filtre por suas preferências e toque no botão 'Favoritar' para organizar os modelos que mais gosta."}
            </p>
            <a
              href="/catalog"
              className="inline-flex items-center justify-center rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Explorar catálogo
            </a>
          </div>
        )}
      </div>

      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Sugestões personalizadas</h2>
            <p className="text-sm text-slate-500">
              Selecionamos modelos que combinam com seu histórico de buscas recentes.
            </p>
          </div>
          <a
            href="/catalog"
            className="inline-flex items-center justify-center rounded-full border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:text-blue-800"
          >
            Ver todos
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {suggestions.map((vehicle) => (
            <VehicleCard key={vehicle.id} v={vehicle} quick />
          ))}
        </div>
      </section>
    </section>
  );
}
