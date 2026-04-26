import axiosClient from "./axiosClient";

export const createProviderProfile = async (payload) => {
  const response = await axiosClient.post("/provider/profile", payload);
  return response.data;
};

export const getProviderProfile = async () => {
  const response = await axiosClient.get("/provider/profile");
  return response.data;
};

export const updateProviderProfile = async (payload) => {
  const response = await axiosClient.put("/provider/profile", payload);
  return response.data;
};

export const hasProviderProfile = async () => {
  try {
    await getProviderProfile();
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }

    throw error;
  }
};