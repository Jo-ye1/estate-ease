import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/lib/api";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const { data } = await api.get("/favorites");
      setFavorites(data.favorites || data || []);
    } catch (error) {
      console.error(error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const { data } = await api.post(`/favorites/toggle/${propertyId}`);
      setFavorites(data.favorites || data || []);
    } catch (error) {
      try {
        const currentList = Array.isArray(favorites) ? favorites : favorites?.favorites || [];
        const exists = currentList.some(
          (fav) => (fav?.property?._id || fav?._id || fav) === propertyId
        );

        if (exists) {
          const { data } = await api.delete(`/favorites/${propertyId}`);
          setFavorites(data.favorites || data || []);
        } else {
          const { data } = await api.post(`/favorites/${propertyId}`);
          if (data.favorites) {
            setFavorites(data.favorites);
          } else if (data.favorite) {
            setFavorites((prev) => [...prev, data.favorite]);
          } else {
            loadFavorites();
          }
        }
      } catch (innerError) {
        console.error(innerError);
      }
    }
  };

  const isFavorited = (propertyId) => {
    const currentList = Array.isArray(favorites) ? favorites : favorites?.favorites || [];
    return currentList.some(
      (fav) => (fav?.property?._id || fav?._id || fav) === propertyId
    );
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, []);

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

export const useFavorites = () => useContext(FavoritesContext);
