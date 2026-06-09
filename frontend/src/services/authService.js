import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Sends payload data to the backend registration collection
export const registerUserAPI = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data; // Contains user info object and a signed JWT token
};

// Validates credentials against your hashed database keys
export const loginUserAPI = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data; // Contains user info object and a signed JWT token
};
