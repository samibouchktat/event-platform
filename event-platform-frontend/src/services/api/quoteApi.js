import axiosClient from "./axiosClient";

export const createQuoteRequest = async (payload) => {
  const response = await axiosClient.post("/public/quote-requests", payload);
  return response.data;
};