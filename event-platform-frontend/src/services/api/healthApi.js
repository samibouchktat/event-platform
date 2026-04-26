import axiosClient from "./axiosClient";

export const checkApiHealth = async () => {
  const response = await axiosClient.get("/health");
  return response.data;
};