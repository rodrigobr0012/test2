import { useState } from "react";

const VEHICLE_KEY = "bm_vehicle_list";

function loadVehicles() {
  const raw = localStorage.getItem(VEHICLE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Erro ao ler veículos do localStorage", err);
    return [];
  }
}

function persistVehicle(vehicle) {
  const current = loadVehicles();
  const next = [vehicle, ...current];
  localStorage.setItem(VEHICLE_KEY, JSON.stringify(next));
  return next;
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `veículo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useVehicleDraft() {
  const [draft, setDraft] = useState(() => ({
    id: generateId(),
    title: "",
    brand: "",
    price: "",
    year: "",
    km: "",
    fuel: "",
    gearbox: "",
    color: "",
    doors: "",
    location: "",
    imageUrl: "",
    gallery: "",
    contactEmail: "",
    contactPhone: "",
    contactWhatsapp: false,
    description: "",
  }));

  function update(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function reset() {
    setDraft({
      id: generateId(),
      title: "",
      brand: "",
      price: "",
      year: "",
      km: "",
      fuel: "",
      gearbox: "",
      color: "",
      doors: "",
      location: "",
      imageUrl: "",
      gallery: "",
      contactEmail: "",
      contactPhone: "",
      contactWhatsapp: false,
      description: "",
    });
  }

  function toVehiclePayload() {
    const galleryImages = draft.gallery
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      ...draft,
      price: Number(draft.price || 0),
      year: Number(draft.year || 0),
      km: Number(draft.km || 0),
      doors: Number(draft.doors || 0),
      contactWhatsapp: Boolean(draft.contactWhatsapp),
      gallery: galleryImages.length ? galleryImages : [draft.imageUrl].filter(Boolean),
    };
  }

  return { draft, update, reset, toVehiclePayload, persistVehicle };
}

