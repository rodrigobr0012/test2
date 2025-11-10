import { useEffect, useId, useMemo, useRef, useState } from "react";

const BASE_EMAIL = "contato@buymove.com";

function formatPhone(phone) {
  return phone.replace(/[^+\d]/g, "");
}

function getWhatsAppLink(phone, title) {
  if (!phone) return null;
  const digits = formatPhone(phone);
  if (!digits) return null;
  const message = encodeURIComponent(`Olá! Tenho interesse no ${title} anunciado na buyMove.`);
  return `https://wa.me/${digits}?text=${message}`;
}

export default function ContactSellerButton({ vehicle, variant = "default", className = "" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const menuId = useId();

  const contact = useMemo(() => {
    const email = (vehicle?.contactEmail || BASE_EMAIL).trim();
    const phone = (vehicle?.contactPhone || "").trim();
    const whatsappAllowed = Boolean(vehicle?.contactWhatsapp && phone);
    const title = vehicle?.title || "veículo";

    const subject = encodeURIComponent(`Interesse no ${title}`);
    const body = encodeURIComponent(
      `Olá, tenho interesse no ${title} anunciado na buyMove. Podemos conversar?`
    );

    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    const telLink = phone ? `tel:${formatPhone(phone)}` : null;
    const whatsappLink = whatsappAllowed ? getWhatsAppLink(phone, title) : null;

    return { email, phone, mailto, telLink, whatsappLink };
  }, [vehicle]);

  useEffect(() => {
    if (!open) return undefined;

    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const styles =
    variant === "compact"
      ? "bg-red-600 px-4 py-2 text-xs text-white shadow-sm hover:bg-red-500 focus-visible:outline-red-600"
      : "bg-red-600 px-6 py-3 text-sm text-white shadow-md hover:bg-red-500 focus-visible:outline-red-600";

  function handleOptionClick() {
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        className={`${baseClasses} ${styles}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((prev) => !prev)}
      >
        Comprar agora
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Opções de contato"
          className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-lg"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Como deseja prosseguir?
          </p>
          <div className="space-y-2">
            <a
              href={contact.mailto}
              role="menuitem"
              onClick={handleOptionClick}
              className="block rounded-lg border border-blue-100 px-3 py-2 font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
            >
              Enviar e-mail
            </a>
            {contact.telLink ? (
              <a
                href={contact.telLink}
                role="menuitem"
                onClick={handleOptionClick}
                className="block rounded-lg border border-blue-100 px-3 py-2 font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                Ligar por telefone
              </a>
            ) : (
              <span className="block rounded-lg border border-slate-200 px-3 py-2 text-slate-400">
                Telefone indisponível
              </span>
            )}
            {contact.whatsappLink ? (
              <a
                href={contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={handleOptionClick}
                className="block rounded-lg border border-green-200 px-3 py-2 font-semibold text-green-700 transition hover:border-green-300 hover:bg-green-50"
              >
                Conversar no WhatsApp
              </a>
            ) : (
              <span className="block rounded-lg border border-slate-200 px-3 py-2 text-slate-400">
                WhatsApp indisponível
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
