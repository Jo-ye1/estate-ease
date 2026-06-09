import api from "@/lib/api";

/**
 * Fetch all properties available in the system with optional query search filters
 * @route GET /api/properties
 */
export const getProperties = async (queryParams = {}) => {
  const { data } = await api.get("/properties", { params: queryParams });
  return data;
};

/**
 * Fetch a single property document by its MongoDB hex _id
 * @route GET /api/properties/:id
 */
export const getPropertyById = async (id) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

/**
 * Create a new property listing document in MongoDB
 * @route POST /api/properties
 */
export const createProperty = async (propertyData) => {
  const { data } = await api.post("/properties", propertyData);
  return data;
};

/**
 * Upload property image locally via multi-part FormData payloads
 * @route POST /api/properties/:id/upload
 */
export const uploadPropertyImage = async (propertyId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const token = localStorage.getItem("token"); 

  const { data } = await api.post(
    `/properties/${propertyId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, 
      },
    }
  );

  return data;
};

/**
 * Fetch properties owned or created by the currently authenticated user
 * @route GET /api/properties/my-properties
 */
export const getMyProperties = async () => {
  const { data } = await api.get("/properties/my-properties");
  return data;
};

/**
 * Fetch up to 3 related listings matching current type or location context
 * @route GET /api/properties/:id/related
 */
export const getRelatedProperties = async (id) => {
  const { data } = await api.get(`/properties/${id}/related`);
  return data;
};

/**
 * Deletes a specific property document out of MongoDB and cleans up storage
 * @route DELETE /api/properties/:id
 */
export const deleteProperty = async (id) => {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
};

/**
 * Modifies an existing listing's textual parameters
 * @route PUT /api/properties/:id
 */
export const updateProperty = async (id, updatedData) => {
  const { data } = await api.put(`/properties/${id}`, updatedData);
  return data;
};
