import api from "@/lib/api";

export const getOwnerLeads = async () =>
  (await api.get("/leads/owner")).data;

export const getAllLeads = async () =>
  (await api.get("/leads")).data;

export const updateLeadStatus = async (id, status) =>
  (await api.put(`/leads/${id}/pipeline`, { status })).data;
