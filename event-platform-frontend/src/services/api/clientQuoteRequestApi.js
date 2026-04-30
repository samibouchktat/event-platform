import axiosClient from "./axiosClient";

export const getClientQuoteRequests = async () => {
  const response = await axiosClient.get("/client/quote-requests");
  return response.data;
};

export const getClientQuoteRequestById = async (quoteRequestId) => {
  const response = await axiosClient.get(
    `/client/quote-requests/${quoteRequestId}`
  );
  return response.data;
};