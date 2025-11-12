import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { addFavorite, listFavorites, removeFavorite } from "@/services/favorites";
import { useMocks } from "@/services/api";
import { mapVehicleFromApi } from "@/services/vehicles";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "bm_favorites";

function readStoredFavorites() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(mapVehicleFromApi).filter(Boolean);
  } catch (error) {
    console.warn("Não foi possível carregar favoritos armazenados.", error);
    return [];
  }
}

function writeStoredFavorites(favorites) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn("Não foi possível salvar favoritos localmente.", error);
  }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const mocksEnabled = useMocks;
  const userId = user?.id ?? null;
  const isRemote = Boolean(userId) && !mocksEnabled;

  const [favorites, setFavorites] = useState(() => (isRemote ? [] : readStoredFavorites()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshFavorites = useCallback(async () => {
    if (isRemote) {
      setLoading(true);
      setError(null);
      try {
        const items = await listFavorites();
        setFavorites(items);
        return items;
      } catch (err) {
        console.error("Falha ao carregar favoritos", err);
        const normalized =
          err instanceof Error
            ? err
            : new Error("Não foi possível carregar seus favoritos.");
        setError(normalized);
        throw normalized;
      } finally {
        setLoading(false);
      }
    }

    setError(null);
    setLoading(false);
    const stored = readStoredFavorites();
    setFavorites(stored);
    return stored;
  }, [isRemote, userId]);

  useEffect(() => {
    refreshFavorites().catch(() => {
      /* erro já tratado em refreshFavorites */
    });
  }, [refreshFavorites]);

  useEffect(() => {
    if (isRemote) return;
    writeStoredFavorites(favorites);
  }, [favorites, isRemote]);

  const toggleFavorite = useCallback(
    async (vehicle) => {
      if (!vehicle || !vehicle.id) return;
      const vehicleId = String(vehicle.id);
      setError(null);

      if (isRemote) {
        try {
          const currentFavorites = favorites.map((item) => String(item.id));
          const alreadyFavorite = currentFavorites.includes(vehicleId);

          if (alreadyFavorite) {
            await removeFavorite(vehicleId);
            setFavorites((prev) => prev.filter((item) => String(item.id) !== vehicleId));
          } else {
            const created = await addFavorite(vehicleId);
            setFavorites((prev) => [created, ...prev.filter((item) => String(item.id) !== vehicleId)]);
          }
        } catch (err) {
          console.error("Falha ao atualizar favoritos", err);
          const normalized =
            err instanceof Error
              ? err
              : new Error("Não foi possível atualizar favoritos.");
          setError(normalized);
          throw normalized;
        }
        return;
      }

      setFavorites((prev) => {
        const exists = prev.some((item) => String(item.id) === vehicleId);
        if (exists) {
          return prev.filter((item) => String(item.id) !== vehicleId);
        }
        const normalizedVehicle = mapVehicleFromApi(vehicle);
        if (!normalizedVehicle) return prev;
        return [...prev, normalizedVehicle];
      });
    },
    [favorites, isRemote]
  );

  const removeFavoriteItem = useCallback(
    async (id) => {
      if (!id) return;
      const vehicleId = String(id);
      setError(null);

      if (isRemote) {
        try {
          await removeFavorite(vehicleId);
          setFavorites((prev) => prev.filter((item) => String(item.id) !== vehicleId));
        } catch (err) {
          console.error("Falha ao remover favorito", err);
          const normalized =
            err instanceof Error
              ? err
              : new Error("Não foi possível remover o favorito.");
          setError(normalized);
          throw normalized;
        }
        return;
      }

      setFavorites((prev) => prev.filter((item) => String(item.id) !== vehicleId));
    },
    [isRemote]
  );

  const updateFavorite = useCallback((id, patch) => {
    if (!id) return;
    setFavorites((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, ...patch } : item))
    );
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      removeFavorite: removeFavoriteItem,
      updateFavorite,
      loading,
      error,
      refreshFavorites,
      isRemote,
    }),
    [
      favorites,
      toggleFavorite,
      removeFavoriteItem,
      updateFavorite,
      loading,
      error,
      refreshFavorites,
      isRemote,
    ]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites deve ser utilizado dentro de FavoritesProvider");
  }

  return context;
}
