import api from "../lib/api";

// GET /api/favorites -> Retrieves a populated array of favorited property objects
export const getFavorites = async () => {
  const response = await api.get("/favorites");
  return response.data;
};

// POST /api/favorites/:propertyId -> Adds a property item to favorites list
export const addFavorite = async (propertyId) => {
  const response = await api.post(`/favorites/${propertyId}`, {});
  return response.data;
};

// DELETE /api/favorites/:propertyId -> Removes a property item from favorites list
export const removeFavorite = async (propertyId) => {
  const response = await api.delete(`/favorites/${propertyId}`);
  return response.data;
};
