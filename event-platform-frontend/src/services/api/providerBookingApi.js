import axiosClient from "./axiosClient";

export const createBookingFromQuoteRequest = async (quoteRequestId, payload) => {
  const response = await axiosClient.post(
    `/provider/bookings/from-quote/${quoteRequestId}`,
    payload
  );

  return response.data;
};

export const getProviderBookings = async () => {
  const response = await axiosClient.get("/provider/bookings");
  return response.data;
};

export const getProviderBookingById = async (bookingId) => {
  const response = await axiosClient.get(`/provider/bookings/${bookingId}`);
  return response.data;
};

export const updateBookingStatus = async (bookingId, payload) => {
  const response = await axiosClient.patch(
    `/provider/bookings/${bookingId}/status`,
    payload
  );

  return response.data;
};