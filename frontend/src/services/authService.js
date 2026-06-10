import axios from "axios";
import api from "@/lib/api";

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

/**
 * Register a user's contact email parameters into the marketing leads collection
 * @route POST /api/newsletter/subscribe
 */
export const subscribeToNewsletter = async (emailString) => {
  const { data } = await api.post("/newsletter/subscribe", { email: emailString });
  return data;
};