import axios from "axios";

const API_URL = "http://localhost:5000/api/favorites";

// Helper function to dynamically grab the user token from local storage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET /api/favorites -> Retrieves a populated array of favorited property objects
export const getFavorites = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// POST /api/favorites/:propertyId -> Adds a property item to favorites list
export const addFavoriteAPI = async (propertyId) => {
  const response = await axios.post(`${API_URL}/${propertyId}`, {}, getAuthHeaders());
  return response.data;
};

// DELETE /api/favorites/:propertyId -> Removes a property item from favorites list
export const removeFavoriteAPI = async (propertyId) => {
  const response = await axios.delete(`${API_URL}/${propertyId}`, getAuthHeaders());
  return response.data;
};
