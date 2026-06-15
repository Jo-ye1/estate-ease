import api from "./api";

export const getAnalytics = async () => {
  const { data } = await api.get("/analytics/dashboard");
  return data;
};