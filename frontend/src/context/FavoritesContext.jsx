import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // Persistence Requirement: Initialize state from localStorage
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  // Persistence Requirement: Sync favorites data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (property) => {
    const exists = favorites.find(
      (item) => item.id === property.id
    );

    if (exists) return;

    setFavorites([
      ...favorites,
      property,
    ]);
  };

  const removeFavorite = (id) => {
    setFavorites(
      favorites.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
