import api from "@/lib/api";

export const getProperties = async (queryParams = {}) => {
  const { data } = await api.get("/properties", {
    params: queryParams,
  });
  return data;
};

export const getPropertyById = async (id) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export const createProperty = async (propertyData) => {
  const { data } = await api.post("/properties", propertyData);
  return data;
};

export const updateProperty = async (id, updatedData) => {
  const { data } = await api.put(
    `/properties/${id}`,
    updatedData
  );
  return data;
};

export const deleteProperty = async (id) => {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
};

export const getMyProperties = async () => {
  const { data } = await api.get("/properties/my-properties");
  return data;
};

export const getRelatedProperties = async (id) => {
  const { data } = await api.get(`/properties/${id}/related`);
  return data;
};

export const getPropertyStats = async () => {
  const { data } = await api.get("/properties/stats");
  return data;
};

export const updatePropertyStatus = async (id, listingStatus) => {
  const { data } = await api.put(
    `/properties/${id}/status`,
    { listingStatus }
  );

  return data;
};

export const uploadPropertyImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

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

export const contactPropertyOwner = async (
  propertyId,
  leadData
) => {
  const { data } = await api.post(
    `/properties/${propertyId}/contact`,
    leadData
  );

  return data;
};