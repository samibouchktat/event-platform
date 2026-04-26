import axiosClient from "./axiosClient";

export const searchPacks = async (filters = {}) => {
  const params = {};

  if (filters.city?.trim()) {
    params.city = filters.city.trim();
  }

  if (filters.eventType?.trim()) {
    params.eventType = filters.eventType.trim();
  }

  if (filters.serviceType?.trim()) {
    params.serviceType = filters.serviceType.trim();
  }

  if (filters.guests) {
    params.guests = filters.guests;
  }

  if (filters.maxBudget) {
    params.maxBudget = filters.maxBudget;
  }

  const response = await axiosClient.get("/public/search/packs", {
    params,
  });

  return response.data;
};