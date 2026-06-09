import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/services/favoriteService";

const FavoritesContext =
  createContext();

export const FavoritesProvider = ({
  children,
}) => {
  const [favorites, setFavorites] =
    useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = async (
    propertyId
  ) => {
    const exists = favorites.some(
      (fav) => fav._id === propertyId
    );

    if (exists) {
      await removeFavorite(propertyId);
    } else {
      await addFavorite(propertyId);
    }

    loadFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () =>
  useContext(FavoritesContext);