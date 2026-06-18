import api from "@/lib/api";

// 🚀 CRITICAL FIX: Targets the isolated owner endpoint
export const getOwnerLeads = async () =>
  (await api.get("/leads/owner")).data;

export const getAllLeads = async () =>
  (await api.get("/leads")).data;

// Updated to match your backend's exact route signature
export const updateLeadStatus = async (id, status) =>
  (await api.put(`/leads/${id}`, { status })).data;
