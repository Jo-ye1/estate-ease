import api from "@/lib/api";

export const getAnalytics = async () => {
  const { data } = await api.get("/analytics/dashboard");
  return data;
};