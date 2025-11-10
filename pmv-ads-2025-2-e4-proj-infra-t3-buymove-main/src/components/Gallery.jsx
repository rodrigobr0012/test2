import { useState } from "react";

export default function Gallery({ images = [] }) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return null;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
        <img
          src={images[idx]}
          alt={`Imagem ${idx + 1}`}
          className="h-72 w-full object-cover"
        />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button
            key={i}
            className={`h-20 w-28 shrink-0 overflow-hidden rounded-2xl border transition ${i === idx ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200"}`}
            onClick={() => setIdx(i)}
            type="button"
          >
            <img src={src} alt={`thumb ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
