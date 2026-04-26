import axiosClient from "./axiosClient";

export const getReceivedQuoteRequests = async () => {
  const response = await axiosClient.get("/provider/quote-requests");
  return response.data;
};

export const getReceivedQuoteRequestById = async (quoteRequestId) => {
  const response = await axiosClient.get(
    `/provider/quote-requests/${quoteRequestId}`
  );
  return response.data;
};

export const updateQuoteRequestStatus = async (quoteRequestId, payload) => {
  const response = await axiosClient.patch(
    `/provider/quote-requests/${quoteRequestId}/status`,
    payload
  );
  return response.data;
};