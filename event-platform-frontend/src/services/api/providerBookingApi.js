import axiosClient from "./axiosClient";

export const getProviderBookings = async () => {
  const response = await axiosClient.get("/provider/bookings");
  return response.data;
};

export const getProviderBookingById = async (bookingId) => {
  const response = await axiosClient.get(`/provider/bookings/${bookingId}`);
  return response.data;
};

export const createBookingFromQuoteRequest = async (quoteRequestId, payload) => {
  const response = await axiosClient.post(
    `/provider/bookings/from-quote/${quoteRequestId}`,
    payload
  );

  return response.data;
};

export const updateProviderBookingStatus = async (bookingId, payload) => {
  const response = await axiosClient.patch(
    `/provider/bookings/${bookingId}/status`,
    payload
  );

  return response.data;
};

export const markProviderBookingDepositAsPaid = async (bookingId) => {
  const response = await axiosClient.patch(
    `/provider/bookings/${bookingId}/deposit/mark-paid`
  );

  return response.data;
};