import { useMemo, useState } from "react";
import BackToHome from "@/components/BackToHome";
import { useAuth } from "@/context/auth-context";

const INITIAL_STATE = {
  title: "",
  brand: "",
  model: "",
  year: "",
  price: "",
  mileage: "",
  color: "",
  transmission: "",
  fuel: "",
  imageUrl: "",
  description: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};

export default function VehicleCreate() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(() => ({
    ...INITIAL_STATE,
    contactName: user?.full_name || "",
    contactEmail: user?.email || "",
    contactPhone: user?.phone || "",
  }));
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [submittedVehicle, setSubmittedVehicle] = useState(null);

  const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200";

  const labelClass = "text-sm font-medium text-slate-600";

  const buttonClass =
    "inline-flex w-full items-center justify-center rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300";

  const formattedPrice = useMemo(() => {
    const numericPrice = Number(formData.price.replace(/[^0-9,.-]/g, "").replace(",", "."));
    if (Number.isNaN(numericPrice) || !numericPrice) return "";
    return numericPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }, [formData.price]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!formData.title.trim()) {
      return "Informe um título para destacar seu veículo.";
    }
    if (!formData.brand.trim()) {
      return "Informe a marca do veículo.";
    }
    if (!formData.model.trim()) {
      return "Informe o modelo do veículo.";
    }
    if (!formData.year.trim()) {
      return "Informe o ano de fabricação.";
    }

    const parsedYear = Number(formData.year);
    const currentYear = new Date().getFullYear() + 1;
    if (Number.isNaN(parsedYear) || parsedYear < 1980 || parsedYear > currentYear) {
      return "Informe um ano válido para o veículo.";
    }

    if (!formData.price.trim()) {
      return "Informe o valor desejado de venda.";
    }

    const parsedPrice = Number(formData.price.replace(/[^0-9,.-]/g, "").replace(",", "."));
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return "Informe um valor de venda válido.";
    }

    if (!formData.description.trim()) {
      return "Descreva os principais destaques do veículo.";
    }

    if (!formData.contactEmail.trim() && !formData.contactPhone.trim()) {
      return "Adicione pelo menos uma forma de contato.";
    }

    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const normalizedPrice = Number(formData.price.replace(/[^0-9,.-]/g, "").replace(",", "."));

    const vehicle = {
      ...formData,
      price: normalizedPrice,
      submittedAt: new Date().toISOString(),
    };

    setSubmittedVehicle(vehicle);
    setSuccessMessage("Anúncio pronto! Revise as informações antes de publicar.");
  }

  function handleReset() {
    setFormData({
      ...INITIAL_STATE,
      contactName: user?.full_name || "",
      contactEmail: user?.email || "",
      contactPhone: user?.phone || "",
    });
    setSubmittedVehicle(null);
    setSuccessMessage("");
    setFormError(null);
  }

  return (
    <section className="space-y-8">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
          Anunciar veículo
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Crie seu anúncio em poucos minutos</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Preencha as informações principais do seu veículo e gere uma pré-visualização profissional antes de publicar no marketplace.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className={labelClass} htmlFor="title">
                Título do anúncio
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={fieldClass}
                placeholder="Ex.: SUV premium impecável"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass} htmlFor="brand">
                Marca
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                className={fieldClass}
                placeholder="Ex.: Volvo"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass} htmlFor="model">
                Modelo
              </label>
              <input
                id="model"
                name="model"
                type="text"
                className={fieldClass}
                placeholder="Ex.: XC60 R-Design"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass} htmlFor="year">
                Ano
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min="1980"
                max={new Date().getFullYear() + 1}
                className={fieldClass}
                placeholder="2022"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass} htmlFor="price">
                Preço desejado
              </label>
              <input
                id="price"
                name="price"
                type="text"
                className={fieldClass}
                placeholder="R$ 250.000,00"
                value={formData.price}
                onChange={handleChange}
                inputMode="decimal"
                required
              />
              {formattedPrice && (
                <p className="text-xs text-slate-500">Valor formatado: {formattedPrice}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className={labelClass} htmlFor="mileage">
                Quilometragem
              </label>
              <input
                id="mileage"
                name="mileage"
                type="number"
                min="0"
                className={fieldClass}
                placeholder="35000"
                value={formData.mileage}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass} htmlFor="color">
                Cor
              </label>
              <input
                id="color"
                name="color"
                type="text"
                className={fieldClass}
                placeholder="Ex.: Branco Pérola"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass} htmlFor="transmission">
                Câmbio
              </label>
              <select
                id="transmission"
                name="transmission"
                className={fieldClass}
                value={formData.transmission}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Automático">Automático</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
                <option value="Automatizado">Automatizado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className={labelClass} htmlFor="fuel">
                Combustível
              </label>
              <select
                id="fuel"
                name="fuel"
                className={fieldClass}
                value={formData.fuel}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Etanol">Etanol</option>
                <option value="Diesel">Diesel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Elétrico">Elétrico</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className={labelClass} htmlFor="imageUrl">
                URL da imagem principal (opcional)
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                className={fieldClass}
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass} htmlFor="description">
              Descrição detalhada
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className={`${fieldClass} resize-y`}
              placeholder="Conte sobre o histórico, revisões, acessórios e destaques do veículo."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <fieldset className="space-y-4 rounded-2xl border border-slate-200 p-4">
            <legend className="px-2 text-sm font-semibold text-blue-900">Como os interessados podem falar com você?</legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={labelClass} htmlFor="contactName">
                  Nome do anunciante
                </label>
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  className={fieldClass}
                  placeholder="Seu nome"
                  value={formData.contactName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass} htmlFor="contactEmail">
                  E-mail de contato
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  className={fieldClass}
                  placeholder="voce@email.com"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass} htmlFor="contactPhone">
                  Telefone ou WhatsApp
                </label>
                <input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  className={fieldClass}
                  placeholder="(11) 99999-0000"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Esses dados ficam visíveis para compradores interessados após a publicação do anúncio.
            </p>
          </fieldset>

          {formError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {formError}
            </p>
          )}

          {successMessage && (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700" role="status">
              {successMessage}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" className={`${buttonClass} sm:flex-1`}>
              Gerar pré-visualização
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-700"
            >
              Limpar campos
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900">Pré-visualização inteligente</h2>
            <p className="mt-3">
              Aqui você confere como os compradores verão o anúncio. Ajuste as informações ao lado e gere quantas pré-visualizações quiser antes de publicar.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Destaque fotos de alta qualidade.</li>
              <li>Inclua histórico de revisões e acessórios extras.</li>
              <li>Use um título objetivo para ser encontrado com facilidade.</li>
            </ul>
          </div>

          {submittedVehicle ? (
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">{submittedVehicle.title}</h3>
                  <p className="text-sm text-slate-500">
                    {submittedVehicle.brand} • {submittedVehicle.model} • {submittedVehicle.year}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Rascunho
                </span>
              </div>

              {submittedVehicle.imageUrl ? (
                <img
                  src={submittedVehicle.imageUrl}
                  alt={`Foto do veículo ${submittedVehicle.model}`}
                  className="h-48 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                  Adicione uma URL de imagem para compor o card do anúncio.
                </div>
              )}

              <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-500">Preço sugerido</dt>
                  <dd className="text-base font-semibold text-blue-900">
                    {submittedVehicle.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </dd>
                </div>
                {submittedVehicle.mileage && (
                  <div>
                    <dt className="font-semibold text-slate-500">Quilometragem</dt>
                    <dd>{Number(submittedVehicle.mileage).toLocaleString("pt-BR")} km</dd>
                  </div>
                )}
                {submittedVehicle.transmission && (
                  <div>
                    <dt className="font-semibold text-slate-500">Câmbio</dt>
                    <dd>{submittedVehicle.transmission}</dd>
                  </div>
                )}
                {submittedVehicle.fuel && (
                  <div>
                    <dt className="font-semibold text-slate-500">Combustível</dt>
                    <dd>{submittedVehicle.fuel}</dd>
                  </div>
                )}
                {submittedVehicle.color && (
                  <div>
                    <dt className="font-semibold text-slate-500">Cor</dt>
                    <dd>{submittedVehicle.color}</dd>
                  </div>
                )}
              </dl>

              <div>
                <h4 className="text-sm font-semibold text-slate-500">Descrição</h4>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                  {submittedVehicle.description}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <h4 className="text-sm font-semibold text-slate-500">Contato do anunciante</h4>
                <ul className="mt-2 space-y-1">
                  {submittedVehicle.contactName && <li>{submittedVehicle.contactName}</li>}
                  {submittedVehicle.contactEmail && <li>{submittedVehicle.contactEmail}</li>}
                  {submittedVehicle.contactPhone && <li>{submittedVehicle.contactPhone}</li>}
                </ul>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              Gere uma pré-visualização para ver o resultado final do anúncio.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
