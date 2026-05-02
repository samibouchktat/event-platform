import axiosClient from "./axiosClient";

export const createQuoteRequest = async (packId, payload) => {
  const response = await axiosClient.post(
    `/public/packs/${packId}/quote-requests`,
    payload
  );

  return response.data;
};