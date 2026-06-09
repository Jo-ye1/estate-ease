import api from "@/lib/api";

/**
 * Fetch all properties available in the system
 * @route GET /api/properties
 */
export const getProperties = async () => {
  const { data } = await api.get("/properties");
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
 * Upload property image to Cloudinary via multi-part FormData payloads
 * @route POST /api/properties/:id/upload
 */
export const uploadPropertyImage = async (propertyId, imageFile) => {
  const formData = new FormData();
  
  // Appends the raw binary file blob directly to the form data body
  formData.append("image", imageFile);

  // Retrieve the auth token directly from your frontend storage setup
  const token = localStorage.getItem("token"); // 👈 Adjust this if you store your token in cookies or state

  const { data } = await api.post(
    `/properties/${propertyId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        // Enforce authorization header presence explicitly for multi-part requests
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
