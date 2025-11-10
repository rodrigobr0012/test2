export default function FiltersPanel({
  brand,
  setBrand,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  color,
  setColor,
  doors,
  setDoors,
  location,
  setLocation,
}) {
  const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <input
        className={fieldClass}
        placeholder="Marca"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <div className="flex gap-2">
        <input
          type="number"
          className={fieldClass}
          placeholder="Preço mín."
          value={priceMin}
          onChange={(e) => setPriceMin(Number(e.target.value || 0))}
        />
        <input
          type="number"
          className={fieldClass}
          placeholder="Preço máx."
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value || 0))}
        />
      </div>
      <input
        className={fieldClass}
        placeholder="Cor"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <input
        className={fieldClass}
        placeholder="Portas (ex.: 4)"
        value={doors}
        onChange={(e) => setDoors(e.target.value)}
      />
      <input
        className={fieldClass}
        placeholder="Localização"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>
  );
}

