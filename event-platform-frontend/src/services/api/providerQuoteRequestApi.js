import axiosClient from "./axiosClient";

export const getProviderQuoteRequests = async () => {
  const response = await axiosClient.get("/provider/quote-requests");
  return response.data;
};

export const getProviderQuoteRequestById = async (quoteRequestId) => {
  const response = await axiosClient.get(
    `/provider/quote-requests/${quoteRequestId}`
  );
  return response.data;
};

export const updateProviderQuoteRequestStatus = async (
  quoteRequestId,
  payload
) => {
  const response = await axiosClient.patch(
    `/provider/quote-requests/${quoteRequestId}/status`,
    payload
  );

  return response.data;
};