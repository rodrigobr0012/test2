import { api, useMocks } from "./api";
import vehiclesMock from "@/mocks/vehicles.json";

const LOCAL_VEHICLES_KEY = "bm_vehicle_list";

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function loadLocalVehicles() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOCAL_VEHICLES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Erro ao ler lista de veículos salvos", err);
    return [];
  }
}

function combineVehicles() {
  const locals = loadLocalVehicles();
  return [...locals, ...vehiclesMock];
}

function normalizeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export async function listVehicles(params = {}) {
  if (useMocks) {
    await delay(300);
    const {
      q = "",
      brand = "",
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      page = 1,
      pageSize = 12,
      color = "",
      doors = "",
      location = "",
    } = params;

    const items = combineVehicles()
      .filter((v) => {
        const price = normalizeNumber(v.price, 0);
        return price >= minPrice && price <= maxPrice;
      })
      .filter((v) => !brand || v.brand?.toLowerCase().includes(brand.toLowerCase()))
      .filter((v) => !q || `${v.title} ${v.description}`.toLowerCase().includes(q.toLowerCase()))
      .filter((v) => !color || v.color?.toLowerCase().includes(color.toLowerCase()))
      .filter((v) => !doors || String(v.doors) === String(doors))
      .filter((v) => !location || v.location?.toLowerCase().includes(location.toLowerCase()));

    const total = items.length;
    const start = (page - 1) * pageSize;
    const pageItems = items.slice(start, start + pageSize);
    return { items: pageItems, total };
  }

  const res = await api.get("/vehicles", { params });
  return res.data;
}

export async function getVehicleById(id) {
  if (useMocks) {
    await delay(200);
    const localMatch = loadLocalVehicles().find((v) => String(v.id) === String(id));
    if (localMatch) return localMatch;
    return vehiclesMock.find((v) => String(v.id) === String(id));
  }

  const res = await api.get(`/vehicles/${id}`);
  return res.data;
}

export async function getRecommendations(baseId) {
  if (useMocks) {
    await delay(200);
    const all = combineVehicles();
    const base = all.find((v) => String(v.id) === String(baseId));
    if (!base) return [];
    return all
      .filter((v) => v.id !== base.id)
      .sort(
        (a, b) =>
          Math.abs(normalizeNumber(a.price) - normalizeNumber(base.price)) -
          Math.abs(normalizeNumber(b.price) - normalizeNumber(base.price))
      )
      .slice(0, 6);
  }

  const res = await api.get(`/vehicles/${baseId}/recommendations`);
  return res.data;
}

