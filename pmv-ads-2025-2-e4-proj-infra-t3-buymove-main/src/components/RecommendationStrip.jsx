import { Link } from "react-router-dom";
import ContactSellerButton from "@/components/ContactSellerButton";

export default function RecommendationStrip({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="mt-10 space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">Semelhantes recomendados</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((v) => (
          <div
            key={v.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Link to={`/vehicle/${v.id}`} className="space-y-3">
              <img
                src={v.imageUrl}
                alt={v.title}
                className="h-32 w-full rounded-xl object-cover"
              />
              <div className="space-y-1">
                <div className="text-sm font-semibold text-blue-900">{v.title}</div>
                <div className="text-xs text-slate-500">
                  {v.brand} - {v.year}
                </div>
                <div className="text-sm font-semibold text-blue-900">
                  R$ {Number(v.price).toLocaleString("pt-BR")}
                </div>
              </div>
            </Link>
            <ContactSellerButton vehicle={v} variant="compact" className="self-start" />
          </div>
        ))}
      </div>
    </div>
  );
}

