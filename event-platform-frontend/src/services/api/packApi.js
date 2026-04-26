import axiosClient from "./axiosClient";

export const createPack = async (payload) => {
  const response = await axiosClient.post("/provider/packs", payload);
  return response.data;
};

export const getMyPacks = async () => {
  const response = await axiosClient.get("/provider/packs");
  return response.data;
};

export const getPackById = async (packId) => {
  const response = await axiosClient.get(`/provider/packs/${packId}`);
  return response.data;
};

export const updatePack = async (packId, payload) => {
  const response = await axiosClient.put(`/provider/packs/${packId}`, payload);
  return response.data;
};

export const deletePack = async (packId) => {
  await axiosClient.delete(`/provider/packs/${packId}`);
};

export const togglePackStatus = async (packId) => {
  const response = await axiosClient.patch(
    `/provider/packs/${packId}/toggle-status`
  );
  return response.data;
};