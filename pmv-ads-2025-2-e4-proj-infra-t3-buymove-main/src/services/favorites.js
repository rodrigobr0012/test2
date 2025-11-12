import { api } from "./api";
import { mapVehicleFromApi } from "./vehicles";

function normalizeFavoriteResponse(favorite) {
  if (!favorite || typeof favorite !== "object") {
    return null;
  }

  const vehicleData = favorite.vehicle ?? favorite;
  const vehicle = mapVehicleFromApi(vehicleData);
  if (!vehicle) return null;

  return {
    id: String(favorite.id ?? favorite._id ?? favorite.vehicle_id ?? vehicle.id),
    vehicle,
    createdAt: favorite.created_at ?? favorite.createdAt ?? null,
  };
}

export async function listFavorites() {
  const response = await api.get("/favorites");
  const payload = Array.isArray(response.data) ? response.data : [];
  return payload
    .map(normalizeFavoriteResponse)
    .filter((item) => item && item.vehicle)
    .map((item) => item.vehicle);
}

export async function addFavorite(vehicleId) {
  const response = await api.post("/favorites", { vehicle_id: vehicleId });
  const favorite = normalizeFavoriteResponse(response.data);
  if (!favorite) {
    throw new Error("Resposta de favorito inválida.");
  }
  return favorite.vehicle;
}

export async function removeFavorite(vehicleId) {
  await api.delete(`/favorites/${vehicleId}`);
}
