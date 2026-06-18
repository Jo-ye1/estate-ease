import api from "@/lib/api";

export const getDashboardData = async () =>
  (await api.get("/dashboard")).data;