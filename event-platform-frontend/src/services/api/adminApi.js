import axiosClient from "./axiosClient";

export const getAdminDashboardStats = async () => {
  const response = await axiosClient.get("/admin/dashboard/stats");
  return response.data;
};

export const getAdminProviders = async () => {
  const response = await axiosClient.get("/admin/providers");
  return response.data;
};

export const getAdminProviderById = async (providerProfileId) => {
  const response = await axiosClient.get(
    `/admin/providers/${providerProfileId}`
  );
  return response.data;
};

export const validateAdminProvider = async (providerProfileId) => {
  const response = await axiosClient.patch(
    `/admin/providers/${providerProfileId}/validate`
  );
  return response.data;
};

export const rejectAdminProvider = async (providerProfileId) => {
  const response = await axiosClient.patch(
    `/admin/providers/${providerProfileId}/reject`
  );
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await axiosClient.get("/admin/users");
  return response.data;
};

export const getAdminUserById = async (userId) => {
  const response = await axiosClient.get(`/admin/users/${userId}`);
  return response.data;
};

export const enableAdminUser = async (userId) => {
  const response = await axiosClient.patch(`/admin/users/${userId}/enable`);
  return response.data;
};

export const disableAdminUser = async (userId) => {
  const response = await axiosClient.patch(`/admin/users/${userId}/disable`);
  return response.data;
};

export const getAdminReportOverview = async () => {
  const response = await axiosClient.get("/admin/reports/overview");
  return response.data;
};