import { useId } from "react";

export default function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Buscar por modelo, versão...",
  buttonLabel = "Buscar",
  id,
  className = "",
}) {
  const inputId = id ?? useId();

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(value);
  }

  function handleChange(event) {
    onChange?.(event.target.value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 sm:flex-row ${className}`.trim()}
      role="search"
    >
      <div className="flex-1">
        <label htmlFor={inputId} className="sr-only">
          Buscar veículos
        </label>
        <input
          id={inputId}
          type="search"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
