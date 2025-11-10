import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "bm_favorites";

function readStoredFavorites() {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return [];
    const parsed = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Não foi possível carregar favoritos do armazenamento local.", error);
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => readStoredFavorites());

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.warn("Não foi possível salvar favoritos no armazenamento local.", error);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((vehicle) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === vehicle.id);
      if (exists) {
        return prev.filter((item) => item.id !== vehicle.id);
      }

      return [...prev, vehicle];
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateFavorite = useCallback((id, patch) => {
    setFavorites((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, removeFavorite, updateFavorite }),
    [favorites, toggleFavorite, removeFavorite, updateFavorite]
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
