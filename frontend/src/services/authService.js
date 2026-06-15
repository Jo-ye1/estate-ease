import api from "@/lib/api";

export const registerUserAPI = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const loginUserAPI = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const subscribeToNewsletter = async (email) => {
  const { data } = await api.post("/newsletter/subscribe", {
    email,
  });

  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put("/auth/profile", profileData);
  return data;
};

export const updatePassword = async (passwordData) => {
  const { data } = await api.put(
    "/auth/update-password",
    passwordData
  );

  return data;
};

export const uploadAvatar = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await api.post(
    "/auth/upload-avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};