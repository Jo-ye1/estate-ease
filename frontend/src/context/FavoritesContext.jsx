import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getFavorites, addFavorite, removeFavorite } from "../services/favoriteServices"; // 👈 Added 's' here


const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load backend favorites automatically on boot if a token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadFavorites();
    }
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      // Ensure we handle array payloads fallback cleanly
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load database favorites:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId) => {
    // Check if the user is authenticated first
    const token = localStorage.getItem("token");
    if (!token) {
      return alert("Please login to save favorite properties.");
    }

    // Check if the item already exists in the local state list array
    const isFavorited = favorites.some(
      (fav) => (fav._id === propertyId || fav.property?._id === propertyId)
    );

    try {
      if (isFavorited) {
        // Optimistic UI Update: remove from local state immediately for instant feedback
        setFavorites((prev) => prev.filter((fav) => (fav._id !== propertyId && fav.property?._id !== propertyId)));
        await removeFavorite(propertyId);
      } else {
        await addFavorite(propertyId);
      }
    } catch (error) {
      console.error("Favorite toggle synchronization failed:", error.message);
    } finally {
      // Refresh list to make sure state is exactly mirrors MongoDB
      loadFavorites();
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        toggleFavorite,
        loadFavorites // Expose this so you can recall it on manual login actions
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
