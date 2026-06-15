import api from "@/lib/api";

export const getProperties = async (params = {}) =>
  (await api.get("/properties", { params })).data;

export const getPropertyById = async (id) =>
  (await api.get(`/properties/${id}`)).data;

export const createProperty = async (payload) =>
  (await api.post("/properties", payload)).data;

export const updateProperty = async (id, payload) =>
  (await api.put(`/properties/${id}`, payload)).data;

export const deleteProperty = async (id) =>
  (await api.delete(`/properties/${id}`)).data;

export const getMyProperties = async () =>
  (await api.get("/properties/my-properties")).data;

export const getRelatedProperties = async (id) =>
  (await api.get(`/properties/${id}/related`)).data;

export const getPropertyStats = async () =>
  (await api.get("/properties/stats")).data;

export const updatePropertyStatus = async (
  id,
  listingStatus
) =>
  (
    await api.put(`/properties/${id}/status`, {
      listingStatus,
    })
  ).data;

export const uploadPropertyImage = async (id, imageFile) => {
  const formData = new FormData();

  if (Array.isArray(imageFile)) {
    imageFile.forEach((img) =>
      formData.append("images", img)
    );
  } else {
    formData.append("images", imageFile);
  }

  const { data } = await api.post(
    `/properties/${id}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};


export const contactPropertyAgent = async (
  propertyId,
  leadData
) =>
  (
    await api.post(
      `/properties/${propertyId}/contact`,
      leadData
    )
  ).data;
