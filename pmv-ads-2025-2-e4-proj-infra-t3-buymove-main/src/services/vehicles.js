import { api, useMocks } from "./api";
import vehiclesMock from "@/mocks/vehicles.json";

const LOCAL_VEHICLES_KEY = "bm_vehicle_list";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readLocalVehiclesRaw() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_VEHICLES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Não foi possível ler veículos salvos localmente.", error);
    return [];
  }
}

function writeLocalVehiclesRaw(vehicles) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_VEHICLES_KEY, JSON.stringify(vehicles));
  } catch (error) {
    console.warn("Não foi possível salvar veículos localmente.", error);
  }
}

function generateLocalId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `vehicle-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : fallback;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function buildImageGallery(data) {
  if (Array.isArray(data.images) && data.images.length) {
    return data.images.filter(Boolean);
  }
  if (Array.isArray(data.gallery) && data.gallery.length) {
    return data.gallery.filter(Boolean);
  }
  if (typeof data.imageUrl === "string" && data.imageUrl.trim()) {
    return [data.imageUrl.trim()];
  }
  return [];
}

export function mapVehicleFromApi(vehicle) {
  if (!vehicle || typeof vehicle !== "object") {
    return null;
  }

  const idValue =
    vehicle.id ?? vehicle._id ?? vehicle.vehicle_id ?? vehicle.slug ?? vehicle.code;
  if (idValue === undefined || idValue === null) {
    return null;
  }
  const id = String(idValue);

  const gallery = buildImageGallery(vehicle);
  const imageUrl =
    vehicle.imageUrl || vehicle.image_url || (gallery.length > 0 ? gallery[0] : "");

  const mileageValue =
    vehicle.mileage ?? vehicle.km ?? vehicle.kilometers ?? vehicle.odometer ?? 0;
  const mileage = toNumber(mileageValue, 0);

  const yearValue = vehicle.year ?? vehicle.modelYear ?? vehicle.fabricationYear;
  const year = toNumber(yearValue, 0);

  const priceValue = vehicle.price ?? vehicle.value ?? vehicle.amount;
  const price = toNumber(priceValue, 0);

  const doorsValue = vehicle.doors ?? vehicle.doorCount;
  const doors = toNumber(doorsValue, null);

  const transmission =
    vehicle.transmission ?? vehicle.gearbox ?? vehicle.transmissionType ?? "";
  const fuelType = vehicle.fuel_type ?? vehicle.fuel ?? "";

  const features = Array.isArray(vehicle.features) ? vehicle.features : [];

  const sellerIdValue = vehicle.seller_id ?? vehicle.sellerId;
  const sellerId =
    sellerIdValue !== undefined && sellerIdValue !== null
      ? String(sellerIdValue)
      : null;

  return {
    id,
    title: vehicle.title ?? vehicle.name ?? "",
    brand: vehicle.brand ?? "",
    model: vehicle.model ?? "",
    version: vehicle.version ?? "",
    year,
    price,
    mileage,
    km: mileage,
    color: vehicle.color ?? vehicle.paint ?? "",
    fuel: vehicle.fuel ?? vehicle.fuel_type ?? "",
    fuel_type: fuelType,
    transmission,
    gearbox: transmission,
    doors,
    location: vehicle.location ?? vehicle.city ?? vehicle.region ?? "",
    description: vehicle.description ?? "",
    imageUrl,
    gallery,
    images: gallery,
    features,
    sellerId,
    createdAt: vehicle.created_at ?? vehicle.createdAt ?? null,
    updatedAt: vehicle.updated_at ?? vehicle.updatedAt ?? null,
  };
}

function mapVehicleList(list) {
  return list.map(mapVehicleFromApi).filter(Boolean);
}

function combineVehicles() {
  const locals = mapVehicleList(readLocalVehiclesRaw());
  const mocks = mapVehicleList(vehiclesMock);
  return [...locals, ...mocks];
}

function buildVehicleRequestPayload(vehicle) {
  const payload = {
    title: vehicle.title,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    description: vehicle.description,
    images: vehicle.gallery,
    features: vehicle.features ?? [],
  };

  if (vehicle.version) payload.version = vehicle.version;
  if (vehicle.color) payload.color = vehicle.color;
  if (vehicle.transmission) payload.transmission = vehicle.transmission;
  if (vehicle.fuel_type || vehicle.fuel) {
    payload.fuel_type = vehicle.fuel_type || vehicle.fuel;
  }
  if (vehicle.doors) payload.doors = vehicle.doors;
  if (vehicle.location) payload.location = vehicle.location;

  return payload;
}

function normalizeVehicleInput(data) {
  const gallery = buildImageGallery(data);
  const mileage = toNumber(data.mileage ?? data.km ?? 0, 0);
  const doors =
    data.doors === undefined || data.doors === null || data.doors === ""
      ? null
      : toNumber(data.doors, null);
  const transmission = data.transmission ?? data.gearbox ?? "";
  const fuelType = data.fuel_type ?? data.fuel ?? "";

  return {
    title: (data.title ?? "").trim(),
    brand: (data.brand ?? "").trim(),
    model: (data.model ?? "").trim(),
    version: (data.version ?? "").trim(),
    year: toNumber(data.year, 0),
    price: toNumber(data.price, 0),
    mileage,
    km: mileage,
    color: data.color ?? "",
    fuel: data.fuel ?? data.fuel_type ?? "",
    fuel_type: fuelType,
    transmission,
    gearbox: transmission,
    doors,
    location: data.location ?? "",
    description: data.description ?? "",
    imageUrl: gallery[0] ?? "",
    gallery,
    images: gallery,
    features: Array.isArray(data.features) ? data.features : [],
  };
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

    const search = q.toLowerCase();
    const brandFilter = brand.toLowerCase();
    const colorFilter = color.toLowerCase();
    const locationFilter = location.toLowerCase();

    const items = combineVehicles()
      .filter((vehicle) => vehicle.price >= minPrice && vehicle.price <= maxPrice)
      .filter((vehicle) =>
        !brandFilter || vehicle.brand.toLowerCase().includes(brandFilter)
      )
      .filter((vehicle) => {
        if (!search) return true;
        const haystack = `${vehicle.title} ${vehicle.description}`.toLowerCase();
        return haystack.includes(search);
      })
      .filter((vehicle) =>
        !colorFilter || vehicle.color.toLowerCase().includes(colorFilter)
      )
      .filter((vehicle) =>
        !doors || String(vehicle.doors ?? "") === String(doors)
      )
      .filter((vehicle) =>
        !locationFilter || vehicle.location.toLowerCase().includes(locationFilter)
      );

    const total = items.length;
    const start = Math.max(page - 1, 0) * pageSize;
    const pageItems = items.slice(start, start + pageSize);
    return { items: pageItems, total };
  }

  const query = {
    q: params.q,
    brand: params.brand,
    color: params.color,
    doors: params.doors,
    location: params.location,
    min_price: params.minPrice,
    max_price: params.maxPrice,
    page: params.page,
    page_size: params.pageSize,
  };

  const sanitized = Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  const response = await api.get("/vehicles", { params: sanitized });
  const payload = response.data ?? {};
  const items = Array.isArray(payload.items) ? payload.items : [];
  const total = typeof payload.total === "number" ? payload.total : items.length;

  return {
    items: mapVehicleList(items),
    total,
  };
}

export async function getVehicleById(id) {
  if (useMocks) {
    await delay(200);
    return combineVehicles().find((vehicle) => String(vehicle.id) === String(id)) ?? null;
  }

  try {
    const response = await api.get(`/vehicles/${id}`);
    return mapVehicleFromApi(response.data);
  } catch (error) {
    console.error("Falha ao carregar veículo", error);
    const message =
      error?.response?.data?.detail ?? error?.message ?? "Não foi possível carregar o veículo.";
    throw new Error(message);
  }
}

export async function getRecommendations(baseId) {
  if (useMocks) {
    await delay(200);
    const all = combineVehicles();
    const base = all.find((vehicle) => String(vehicle.id) === String(baseId));
    if (!base) return [];

    return all
      .filter((vehicle) => vehicle.id !== base.id)
      .sort(
        (a, b) =>
          Math.abs(a.price - base.price) - Math.abs(b.price - base.price)
      )
      .slice(0, 6);
  }

  try {
    const response = await api.get(`/vehicles/${baseId}/recommendations`);
    const items = Array.isArray(response.data) ? response.data : [];
    return mapVehicleList(items);
  } catch (error) {
    console.error("Falha ao carregar recomendações", error);
    const message =
      error?.response?.data?.detail ?? error?.message ?? "Não foi possível carregar recomendações.";
    throw new Error(message);
  }
}

export async function createVehicle(data) {
  const normalized = normalizeVehicleInput(data);

  if (useMocks) {
    const now = new Date().toISOString();
    const storedVehicle = {
      ...normalized,
      id: generateLocalId(),
      createdAt: now,
      updatedAt: now,
    };

    const current = readLocalVehiclesRaw();
    writeLocalVehiclesRaw([storedVehicle, ...current]);

    return mapVehicleFromApi(storedVehicle);
  }

  const payload = buildVehicleRequestPayload(normalized);

  try {
    const response = await api.post("/vehicles", payload);
    return mapVehicleFromApi(response.data);
  } catch (error) {
    console.error("Falha ao cadastrar veículo", error);
    const message =
      error?.response?.data?.detail ?? error?.message ?? "Não foi possível cadastrar o veículo.";
    throw new Error(message);
  }
}
