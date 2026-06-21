import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getPipeline = async (token) => {
  const { data } = await axios.get(
    `${API}/api/agency/leads/pipeline`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const moveLead = async (id, stage, token) => {
  const { data } = await axios.put(
    `${API}/api/agency/leads/pipeline/${id}/stage`,
    { stage },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
