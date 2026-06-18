import axios from "axios";

const API =
  "http://localhost:5000/api";

export const getPropertyAnalytics =
  async (propertyId) => {
    const token =
      localStorage.getItem("token");

    const response = await axios.get(
      `${API}/property-analytics/${propertyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

export const getPropertySLA =
  async (propertyId) => {
    const token =
      localStorage.getItem("token");

    const response = await axios.get(
      `${API}/property-sla/${propertyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };