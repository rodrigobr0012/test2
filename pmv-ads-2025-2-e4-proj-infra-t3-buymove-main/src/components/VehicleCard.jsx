import { useState } from "react";
import { Link } from "react-router-dom";
import ContactSellerButton from "@/components/ContactSellerButton";
import { useFavorites } from "@/context/favorites-context";

export default function VehicleCard({ v, quick = false }) {
  const { favorites, toggleFavorite } = useFavorites();
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const isFav = favorites.some((f) => String(f.id) === String(v.id));

  const containerClass = quick
    ? "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:grid-cols-3"
    : "space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg";

  const imageClass = quick
    ? "h-32 w-full rounded-xl object-cover sm:col-span-1 sm:h-40"
    : "h-48 w-full rounded-xl object-cover";

  const bodyClass = quick ? "sm:col-span-2 flex flex-col gap-3" : "flex flex-col gap-3";

  const handleToggleFavorite = async () => {
    if (isUpdatingFavorite) return;
    setIsUpdatingFavorite(true);
    try {
      await toggleFavorite(v);
    } catch (error) {
      console.error("Não foi possível atualizar o favorito", error);
      if (typeof window !== "undefined") {
        window.alert?.("Não foi possível atualizar seus favoritos. Tente novamente.");
      }
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  return (
    <div className={containerClass}>
      <img src={v.imageUrl} alt={v.title} className={imageClass} />
      <div className={bodyClass}>
        <Link
          to={`/vehicle/${v.id}`}
          className="text-base font-semibold text-blue-900 transition hover:text-blue-700"
        >
          {v.title}
        </Link>
        <div className="text-sm text-slate-500">
          {v.brand} - {v.year}
        </div>
        <div className="text-lg font-semibold text-blue-900">
          R$ {Number(v.price).toLocaleString("pt-BR")}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={isUpdatingFavorite}
            className={`rounded-full bg-blue-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {isFav ? "Remover favorito" : "Favoritar"}
          </button>
          <Link
            to={`/vehicle/${v.id}`}
            className="rounded-full border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:text-blue-800"
          >
            Detalhes
          </Link>
          <ContactSellerButton vehicle={v} variant="compact" />
        </div>
      </div>
    </div>
  );
}
