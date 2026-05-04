import axiosClient from "./axiosClient";

export const getProviderDashboardStats = async () => {
  const response = await axiosClient.get("/provider/dashboard/stats");
  return response.data;
};