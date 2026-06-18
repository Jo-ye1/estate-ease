import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/lib/api";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({
  children,
}) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const { data } =
        await api.get("/favorites");

      setFavorites(
        Array.isArray(data)
          ? data
          : data?.favorites || []
      );
    } catch (error) {
      console.error(error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    loadFavorites();
  }, []);

  const toggleFavorite = async (
    propertyId
  ) => {
    try {
      const { data } = await api.post(
        `/favorites/toggle/${propertyId}`
      );

      setFavorites(
        data?.favorites || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const isFavorited = (
    propertyId
  ) => {
    return favorites.some(
      (fav) =>
        (
          fav?.property?._id ||
          fav?._id ||
          fav
        ) === propertyId
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        loadFavorites,
        toggleFavorite,
        isFavorited,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () =>
  useContext(FavoritesContext);